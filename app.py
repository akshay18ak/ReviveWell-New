from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from extensions import db, socketio
import os

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///revivewell.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production

# Initialize extensions
login_manager = LoginManager()
login_manager.init_app(app)
db.init_app(app)
socketio.init_app(app)

# Import routes after initializing extensions
from models import User
from routes.auth import auth_bp
from routes.patient import patient_bp
from routes.professional import professional_bp
from routes.assessment import assessment_bp

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register blueprints with URL prefixes
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(patient_bp, url_prefix='/patient')
app.register_blueprint(professional_bp, url_prefix='/professional')
app.register_blueprint(assessment_bp, url_prefix='/assessment')

@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True, port=5000)
