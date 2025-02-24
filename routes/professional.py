from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from models import db, User, Assessment, Appointment
from .auth import token_required

professional_bp = Blueprint('professional', __name__)

@professional_bp.route('/patients', methods=['GET'])
@token_required
def get_patients(current_user):
    try:
        if current_user.role not in ['counselor', 'doctor']:
            return jsonify({'message': 'Unauthorized'}), 403

        # Get all patients who have appointments with this professional
        appointments = Appointment.query.filter_by(professional_id=current_user.id).all()
        patient_ids = set(apt.patient_id for apt in appointments)
        patients = User.query.filter(User.id.in_(patient_ids)).all()

        # Get latest assessment for each patient
        patients_data = []
        for patient in patients:
            latest_assessment = Assessment.query.filter_by(patient_id=patient.id)\
                .order_by(Assessment.date.desc()).first()
            
            patient_data = {
                'id': patient.id,
                'firstName': patient.first_name,
                'lastName': patient.last_name,
                'email': patient.email,
                'lastAssessmentDate': latest_assessment.date.isoformat() if latest_assessment else None,
                'lastAssessmentScore': latest_assessment.overall_score if latest_assessment else None
            }
            patients_data.append(patient_data)

        return jsonify(patients_data)
    except Exception as e:
        print(f"Error fetching patients: {str(e)}")
        return jsonify({'message': 'Failed to fetch patients'}), 500

@professional_bp.route('/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    try:
        if current_user.role not in ['counselor', 'doctor']:
            return jsonify({'message': 'Unauthorized'}), 403

        appointments = Appointment.query.filter_by(professional_id=current_user.id)\
            .order_by(Appointment.date).all()

        appointments_data = [{
            'id': apt.id,
            'patientId': apt.patient_id,
            'patientName': f"{apt.patient.first_name} {apt.patient.last_name}",
            'date': apt.date.isoformat(),
            'status': apt.status,
            'notes': apt.notes
        } for apt in appointments]

        return jsonify(appointments_data)
    except Exception as e:
        print(f"Error fetching appointments: {str(e)}")
        return jsonify({'message': 'Failed to fetch appointments'}), 500

@professional_bp.route('/patient/<int:patient_id>/assessments', methods=['GET'])
@token_required
def get_patient_assessments(current_user, patient_id):
    try:
        if current_user.role not in ['counselor', 'doctor']:
            return jsonify({'message': 'Unauthorized'}), 403

        # Verify that this patient has an appointment with the professional
        has_appointment = Appointment.query.filter_by(
            professional_id=current_user.id,
            patient_id=patient_id
        ).first()

        if not has_appointment:
            return jsonify({'message': 'Unauthorized to view this patient\'s data'}), 403

        assessments = Assessment.query.filter_by(patient_id=patient_id)\
            .order_by(Assessment.date.desc()).all()

        assessments_data = [{
            'id': assessment.id,
            'date': assessment.date.isoformat(),
            'stress_level': assessment.stress_level,
            'substance_urge': assessment.substance_urge,
            'sleep_quality': assessment.sleep_quality,
            'overall_score': assessment.overall_score,
            'notes': assessment.notes
        } for assessment in assessments]

        return jsonify(assessments_data)
    except Exception as e:
        print(f"Error fetching patient assessments: {str(e)}")
        return jsonify({'message': 'Failed to fetch patient assessments'}), 500

@professional_bp.route('/appointment/<int:appointment_id>', methods=['PUT'])
@token_required
def update_appointment(current_user, appointment_id):
    try:
        if current_user.role not in ['counselor', 'doctor']:
            return jsonify({'message': 'Unauthorized'}), 403

        appointment = Appointment.query.get(appointment_id)
        if not appointment or appointment.professional_id != current_user.id:
            return jsonify({'message': 'Appointment not found'}), 404

        data = request.get_json()
        if 'status' in data:
            appointment.status = data['status']
        if 'notes' in data:
            appointment.notes = data['notes']

        db.session.commit()

        return jsonify({
            'message': 'Appointment updated successfully',
            'appointment': {
                'id': appointment.id,
                'status': appointment.status,
                'notes': appointment.notes
            }
        })
    except Exception as e:
        print(f"Error updating appointment: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to update appointment'}), 500
