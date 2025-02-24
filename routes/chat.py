from flask import Blueprint, request, jsonify
from flask_cors import cross_origin, CORS
from models import db, ChatMessage, User
from .auth import token_required
from datetime import datetime
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

chat_bp = Blueprint('chat', __name__)
CORS(chat_bp)

# Get API key from environment
api_key = os.getenv('GROQ_API_KEY')
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

@chat_bp.route('/messages/<int:other_user_id>', methods=['GET', 'OPTIONS'])
@cross_origin()
@token_required
def get_chat_history(current_user, other_user_id):
    if request.method == 'OPTIONS':
        return '', 200

    messages = ChatMessage.query.filter(
        ((ChatMessage.sender_id == current_user.id) & (ChatMessage.receiver_id == other_user_id)) |
        ((ChatMessage.sender_id == other_user_id) & (ChatMessage.receiver_id == current_user.id))
    ).order_by(ChatMessage.timestamp).all()

    chat_history = [{
        'id': msg.id,
        'sender_id': msg.sender_id,
        'message': msg.message,
        'timestamp': msg.timestamp.isoformat()
    } for msg in messages]

    return jsonify(chat_history)

@chat_bp.route('/messages/ai', methods=['GET', 'OPTIONS'])
@cross_origin()
@token_required
def get_ai_chat_history(current_user):
    if request.method == 'OPTIONS':
        return '', 200

    try:
        messages = ChatMessage.query.filter(
            ((ChatMessage.sender_id == current_user.id) & (ChatMessage.receiver_id == None)) |
            ((ChatMessage.sender_id == None) & (ChatMessage.receiver_id == current_user.id))
        ).order_by(ChatMessage.timestamp).all()

        chat_history = [{
            'id': msg.id,
            'sender_id': msg.sender_id,
            'message': msg.message,
            'timestamp': msg.timestamp.isoformat()
        } for msg in messages]

        return jsonify(chat_history)
    except Exception as e:
        print(f"Error fetching AI chat history: {str(e)}")
        return jsonify({'error': 'Failed to fetch chat history'}), 500

@chat_bp.route('/ai-support', methods=['POST', 'OPTIONS'])
@cross_origin()
@token_required
def ai_support(current_user):
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({'error': 'Message is required'}), 400

        client = Groq(api_key=api_key)

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": user_message}
            ],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=500,
        )

        ai_response = chat_completion.choices[0].message.content

        # Save the conversation
        user_msg = ChatMessage(
            sender_id=current_user.id,
            receiver_id=None,  # AI response
            message=user_message,
            timestamp=datetime.utcnow()
        )

        ai_msg = ChatMessage(
            sender_id=None,
            receiver_id=current_user.id,
            message=ai_response,
            timestamp=datetime.utcnow()
        )

        db.session.add(user_msg)
        db.session.add(ai_msg)
        db.session.commit()

        return jsonify({'message': ai_response, 'timestamp': ai_msg.timestamp.isoformat()})

    except Exception as e:
        print(f"Error in AI support: {str(e)}")
        return jsonify({'error': 'Failed to process message'}), 500
