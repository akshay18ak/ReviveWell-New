from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()
socketio = SocketIO()
cors = CORS()
