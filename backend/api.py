from flask import Flask, jsonify, request, redirect, url_for, flash
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from bson import ObjectId



app = Flask(__name__)
CORS(app)  
# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['Admins']
collection1 = db['enseignants']
collection2 = db['Apprenants']

# Route to get all users
@app.route('/user', methods=['GET'])
def get_users():
    users = list(collection.find())
    # Convert ObjectId to string for JSON serialization
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

# Route to get a specific user by its id
'''@app.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    user = collection.find_one({'_id': id})
    if user:
        # Convert ObjectId to string for JSON serialization
        user['_id'] = str(user['_id'])
        return jsonify(user)
    else:
        return jsonify({"error": "user not found"}), 404'''
@app.route('/users/<string:id>', methods=['GET'])
def get_user(id):
    collections = [collection, collection1, collection2]
    user = None
    
    for col in collections:
        user = col.find_one({'_id': id})
        if user:
            # Convert ObjectId to string for JSON serialization
            user['_id'] = str(user['_id'])
            return jsonify(user)
    
    return jsonify({"error": "user not found"}), 404

# Route to add a new user
@app.route('/adduser', methods=['POST'])
def add_user():
    
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    PhoneNumber = data.get('PhoneNumber')
    Level = data.get('level')
    specialty = data.get('specialty')




    # Perform validation if necessary

    # Insert user data into MongoDB
    collection.insert_one({
        "username": username,
        "email": email,
        "password": password,
        "PhoneNumber": PhoneNumber,
        "level": Level,
        "specialty": specialty,



       
    })

    return jsonify({"message": "User added successfully! Please press on the login button to sign in"}), 200


# Route to update an existing user
@app.route('/users/<string:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    result = collection.update_one({"_id": id}, {"$set": data})
    if result.modified_count == 1:
        updated_user = collection.find_one({"_id": id})
        updated_user['_id'] = str(updated_user['_id'])  # Convert ObjectId to string
        return jsonify(updated_user)
    else:
        return jsonify({"error": "user not found"}), 404

# Route to delete a user
@app.route('/users/<string:id>', methods=['DELETE'])
def delete_user(id):
    result = collection.delete_one({"_id": id})
    if result.deleted_count == 1:
        return jsonify({"message": "user deleted successfully"})
    else:
        return jsonify({"error": "user not found"}), 404

# Route for user login
'''@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = collection.find_one({'email': email})

    if user and user['password'] == password:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        del user['password']  # Remove password from user object before sending it back
        return jsonify({'success': True, 'message': 'Login successful', 'user': user})
    else:
        return jsonify({'success': False, 'message': 'Invalid email or password'})'''
# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     collections = [collection, collection1, collection2]
#     user = None

#     for col in collections:
#         user = col.find_one({'email': email})
#         if user:
#             break

#     if user and user['password'] == password:
#         user['_id'] = str(user['_id'])  # Convert ObjectId to string
#         del user['password']  # Remove password from user object before sending it back
#         return jsonify({'success': True, 'message': 'Login successful', 'user': user})
#     else:
#         return jsonify({'success': False, 'message': 'Invalid email or password'})
import json
def custom_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")


# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     collections = [collection, collection1, collection2]
#     user = None

#     for col in collections:
#         user = col.find_one({'email': email})
#         if user:
#             break

#     if user and user['password'] == password:
#         user['_id'] = str(user['_id'])  # Convert ObjectId to string
#         del user['password']  # Remove password from user object before sending it back
#         # user_type = 'admin' if col == collection else ('teacher' if col == collection1 else 'student')
#         if col == collection :
#             user_type = 'admin'
#         elif col == collection2:
#             user_type = 'student'
#         elif col == collection1:
#             user_type = 'teacher'
        
#         return json.dumps({'success': True, 'message': 'Login successful', 'user': user, 'user_type': user_type})
#     else:
#         return json.dumps({'success': False, 'message': 'Invalid email or password'})
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    collections = [collection, collection1, collection2]
    user = None

    for col in collections:
        user = col.find_one({'email': email})
        if user:
            break

    if user and user['password'] == password:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        del user['password']  # Remove password from user object before sending it back

        if col == collection:
            user_type = 'admin'
        elif col == collection2:
            user_type = 'student'
        elif col == collection1:
            user_type = 'teacher'

        response_data = {
            'success': True,
            'message': 'Login successful',
            'user': user,
            'user_type': user_type
        }

        return json.dumps(response_data, default=custom_serializer)
    else:
        return json.dumps({'success': False, 'message': 'Invalid email or password'}, default=custom_serializer)


# Set up Nodemailer transporter
smtp_server = 'MalaJaw'
smtp_port = 587  # Update with your SMTP port
smtp_username = 'Password_Reset_Service'
smtp_password = '123456'

def send_email(receiver_email, subject, body):
    # Create a MIME multipart message
    message = MIMEMultipart()
    message['From'] = smtp_username
    message['To'] = receiver_email
    message['Subject'] = subject

    # Attach body to the email
    message.attach(MIMEText(body, 'Enter your new password : '))

    # Create SMTP session
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    # Convert the message to a string and send it
    text = message.as_string()
    server.sendmail(smtp_username, receiver_email, text)

    # Close the SMTP session
    server.quit()

# Route for password reset
'''@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')

    print("Received email:", email)  # Print the received email for debugging

    # Check if email exists in the database
    user = collection.find_one({'email': email})

    print("User found:", user)  # Print the user found in the database for debugging

    if user:
        # Generate a new password
        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        hashed_password = generate_password_hash(new_password, method='sha256')
        
        # Update password in the database
        collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
        
        # Send email with new password
        subject = 'Password Reset'
        body = f'Your new password is: {new_password}'
        send_email(email, subject, body)

        return jsonify({'success': True, 'message': 'Your password has been reset. Check your email for the new password.'})
    else:
        # Return failure message if email is not found
        return jsonify({'success': False, 'message': 'Email not found in the database. Please enter a valid email address associated with an account.'})'''
@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')

    print("Received email:", email)  # Print the received email for debugging

    # Check if email exists in the database
    user = collection.find_one({'email': email})

    print("User found:", user)  # Print the user found in the database for debugging

    if user:
        # Generate a new password
        new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')
        
        # Update password in the database
        collection.update_one({'email': email}, {'$set': {'password': hashed_password}})
        
        # Send email with new password
        subject = 'Password Reset'
        body = f'Your new password is: {new_password}'
        send_email(email, subject, body)

        return jsonify({'success': True, 'message': 'Your password has been reset. Check your email for the new password.'})
    else:
        # Return failure message if email is not found
        return jsonify({'success': False, 'message': 'Email not found in the database. Please enter a valid email address associated with an account.'})


from datetime import datetime
'''@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data['username']
        email = data['email']
        password = data['password']
        user_type = data['userType']

        # Vérifier si l'utilisateur existe déjà
        if db.enseignants.find_one({'email': email}) or db.apprenants.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'User already exists'}), 400

        # Hasher le mot de passe
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'Dateinscri': datetime.now()
        }

        # Ajouter l'utilisateur à la collection appropriée
        if user_type == 'teacher':
            db.enseignants.insert_one(user_data)
        else:
            db.apprenants.insert_one(user_data)

        return jsonify({'success': True, 'message': 'User added successfully'}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500'''
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        username = data['username']
        email = data['email']
        password = data['password']
        user_type = data['userType']

        # Vérifier si l'utilisateur existe déjà
        if db.enseignants.find_one({'email': email}) or db.Apprenants.find_one({'email': email}):
            return jsonify({'success': False, 'message': 'User already exists'}), 400

        # Hasher le mot de passe
        #hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            'username': username,
            'email': email,
            'password': password,
            'Dateinscri': datetime.now()
        }

        # Ajouter l'utilisateur à la collection appropriée
        if user_type == 'teacher':
            db.enseignants.insert_one(user_data)
        else:
            db.Apprenants.insert_one(user_data)

        return jsonify({'success': True, 'message': 'User added successfully'}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=500)