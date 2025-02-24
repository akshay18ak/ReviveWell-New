from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User
from functools import wraps
import jwt
from datetime import datetime, timedelta
import os

auth_bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, os.getenv('SECRET_KEY', 'your-secret-key'), algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400

        # Create new user
        user = User(
            email=data['email'],
            password=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role']
        )

        print(user)

        # Add user to database
        db.session.add(user)
        db.session.commit()

        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, os.getenv('SECRET_KEY', 'your-secret-key'))

        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }), 201

    except Exception as e:
        print(f"Registration error: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, os.getenv('SECRET_KEY', 'your-secret-key'))

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        })

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Login failed'}), 500

@auth_bp.route('/profile', methods=['GET', 'PUT', 'OPTIONS'])
@token_required
def profile(current_user):
    if request.method == 'OPTIONS':
        return '', 200
        
    if request.method == 'GET':
        try:
            return jsonify({
                'id': current_user.id,
                'email': current_user.email,
                'first_name': current_user.first_name,
                'last_name': current_user.last_name,
                'role': current_user.role
            })
        except Exception as e:
            print(f"Profile fetch error: {str(e)}")
            return jsonify({'message': 'Failed to fetch profile'}), 500
    else:  # PUT
        try:
            data = request.get_json()
            
            if 'first_name' in data:
                current_user.first_name = data['first_name']
            if 'last_name' in data:
                current_user.last_name = data['last_name']
            if 'password' in data:
                current_user.password = generate_password_hash(data['password'])

            db.session.commit()

            return jsonify({
                'message': 'Profile updated successfully',
                'user': {
                    'id': current_user.id,
                    'email': current_user.email,
                    'first_name': current_user.first_name,
                    'last_name': current_user.last_name,
                    'role': current_user.role
                }
            })
        except Exception as e:
            print(f"Profile update error: {str(e)}")
            db.session.rollback()
            return jsonify({'message': 'Failed to update profile'}), 500

@auth_bp.route('/logout', methods=['POST', 'OPTIONS'])
@login_required
def logout():
    if request.method == 'OPTIONS':
        return '', 200
        
    logout_user()
    return jsonify({'message': 'Logged out successfully'})
