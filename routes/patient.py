from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from models import db, User, Assessment, Appointment
from .auth import token_required

patient_bp = Blueprint('patient', __name__)

@patient_bp.route('/appointments', methods=['GET'])
@token_required
def get_appointments(current_user):
    try:
        if current_user.role != 'patient':
            return jsonify({'message': 'Unauthorized'}), 403

        appointments = Appointment.query.filter_by(patient_id=current_user.id).all()
        
        appointments_data = [{
            'id': apt.id,
            'date': apt.date.isoformat(),
            'status': apt.status,
            'professionalName': f"{apt.professional.first_name} {apt.professional.last_name}",
            'notes': apt.notes
        } for apt in appointments]
        
        return jsonify(appointments_data)
    except Exception as e:
        print(f"Error fetching appointments: {str(e)}")
        return jsonify({'message': 'Failed to fetch appointments'}), 500

@patient_bp.route('/assessments', methods=['GET'])
@token_required
def get_assessments(current_user):
    try:
        if current_user.role != 'patient':
            return jsonify({'message': 'Unauthorized'}), 403

        assessments = Assessment.query.filter_by(patient_id=current_user.id)\
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
        print(f"Error fetching assessments: {str(e)}")
        return jsonify({'message': 'Failed to fetch assessments'}), 500

@patient_bp.route('/professionals', methods=['GET'])
@token_required
def get_professionals(current_user):
    try:
        if current_user.role != 'patient':
            return jsonify({'message': 'Unauthorized'}), 403

        professionals = User.query.filter(User.role.in_(['counselor', 'doctor'])).all()
        
        professionals_data = [{
            'id': prof.id,
            'name': f"{prof.first_name} {prof.last_name}",
            'role': prof.role,
            'email': prof.email
        } for prof in professionals]
        
        return jsonify(professionals_data)
    except Exception as e:
        print(f"Error fetching professionals: {str(e)}")
        return jsonify({'message': 'Failed to fetch professionals'}), 500

@patient_bp.route('/book-appointment', methods=['POST'])
@token_required
def book_appointment(current_user):
    try:
        if current_user.role != 'patient':
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()
        professional = User.query.get(data['professional_id'])
        
        if not professional or professional.role not in ['counselor', 'doctor']:
            return jsonify({'message': 'Invalid professional ID'}), 400

        appointment = Appointment(
            patient_id=current_user.id,
            professional_id=professional.id,
            date=data['date'],
            notes=data.get('notes', '')
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment booked successfully',
            'appointment': {
                'id': appointment.id,
                'date': appointment.date.isoformat(),
                'professional': f"{professional.first_name} {professional.last_name}"
            }
        })
    except Exception as e:
        print(f"Error booking appointment: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to book appointment'}), 500
