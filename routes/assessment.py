from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from models import db, Assessment, User
from .auth import token_required

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/submit', methods=['POST'])
@token_required
def submit_assessment(current_user):
    try:
        if current_user.role != 'patient':
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()
        assessment = Assessment(
            patient_id=current_user.id,
            stress_level=data['stress_level'],
            substance_urge=data['substance_urge'],
            sleep_quality=data['sleep_quality'],
            notes=data.get('notes', ''),
            overall_score=(data['stress_level'] + data['substance_urge'] + data['sleep_quality']) / 3.0
        )

        db.session.add(assessment)
        db.session.commit()

        return jsonify({
            'message': 'Assessment submitted successfully',
            'assessment': {
                'id': assessment.id,
                'date': assessment.date.isoformat(),
                'overall_score': assessment.overall_score
            }
        })
    except Exception as e:
        print(f"Error submitting assessment: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to submit assessment'}), 500

@assessment_bp.route('/history', methods=['GET'])
@token_required
def get_assessment_history(current_user):
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
        print(f"Error fetching assessment history: {str(e)}")
        return jsonify({'message': 'Failed to fetch assessment history'}), 500

@assessment_bp.route('/latest', methods=['GET'])
@token_required
def get_latest_assessment(current_user):
    try:
        if current_user.role != 'patient':
            return jsonify({'message': 'Unauthorized'}), 403

        assessment = Assessment.query.filter_by(patient_id=current_user.id)\
            .order_by(Assessment.date.desc()).first()

        if not assessment:
            return jsonify({'message': 'No assessments found'}), 404

        return jsonify({
            'id': assessment.id,
            'date': assessment.date.isoformat(),
            'stress_level': assessment.stress_level,
            'substance_urge': assessment.substance_urge,
            'sleep_quality': assessment.sleep_quality,
            'overall_score': assessment.overall_score,
            'notes': assessment.notes
        })
    except Exception as e:
        print(f"Error fetching latest assessment: {str(e)}")
        return jsonify({'message': 'Failed to fetch latest assessment'}), 500
