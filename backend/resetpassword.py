from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from pymongo import MongoClient
from flask_cors import CORS
import random
import string
import traceback

app = Flask(__name__)
CORS(app)

# Configuration for Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'mk55843798@gmail.com'  # Your Gmail address
app.config['MAIL_PASSWORD'] = 'kdyw kucz sfvl lhhb'  # Use the app password generated
mail = Mail(app)

# Configuration for MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.Users

def generate_random_password(length=10):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for i in range(length))

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = db.enseignants.find_one({'email': email}) or db.Apprenants.find_one({'email': email})

    if not user:
        return jsonify({'error': 'Email not found'}), 404

    new_password = generate_random_password()

    try:
        if 'enseignants' in user:
            db.enseignants.update_one({'email': email}, {'$set': {'password': new_password}})
        else:
            db.Apprenants.update_one({'email': email}, {'$set': {'password': new_password}})

        msg = Message("Password Reset Request",
                      sender="your_email@gmail.com",
                      recipients=[email])
        msg.body = f"Your new password is: {new_password}"
        mail.send(msg)
        return jsonify({'message': 'New password has been sent to your email!'}), 200
    except Exception as e:
        # Log the exception details for debugging
        print(f"Failed to send email or update password: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': 'Failed to send email or update password', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=900)