# ReviveWell - Addiction Recovery Platform

ReviveWell is a comprehensive web application designed to support individuals in their journey to recover from drug and alcohol addiction. The platform connects patients with healthcare professionals, counselors, and family members in a secure and supportive environment.

## Features

- Multi-user authentication system (Patients, Family members, Counselors, Doctors)
- Initial Assessment Module
- Patient Dashboard with progress tracking
- Professional Dashboards for healthcare providers
- AI/ML-powered features for personalized support
- Real-time chat and emergency support
- Local AA meeting finder

## Technical Stack

- Frontend: React
- Backend: Python/Flask
- Database: SQLite
- AI Integration: Groq API
- Real-time Communication: Flask-SocketIO

## Setup Instructions

1. Clone the repository
2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Set up environment variables:
   Create a .env file with:
   ```
   GROQ_API_KEY=your_api_key
   SECRET_KEY=your_secret_key
   ```
5. Run the application:
   - Backend: `python app.py`
   - Frontend: `npm start`

## Security and Privacy

This application is designed with HIPAA compliance in mind. All sensitive data is encrypted and stored securely.
