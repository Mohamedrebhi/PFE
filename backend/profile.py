from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient



app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db["Apprenants"]
# Route to get all student information
#@app.route('/')
#def home():
#    return 'Welcome to the website!' 

@app.route('/students', methods=['GET'])
def get_students():
    students = list(collection.find())
    formatted_students = []
    for student in students:
        formatted_student = {
            'id': str(student['_id']),
            'firstName': student['firstName'],
            'lastName': student['lastName'],
            'birthday': student['birthday'],
            'gender': student['gender'],
            'email': student['email'],
            'phone': student['phone'],
            'address': student['address'],
            'streetNumber': student['streetNumber'],
            'city': student['city'],
            'state': student['state'],
            'zipCode': student['zipCode'],
        }
        formatted_students.append(formatted_student)
    return jsonify(formatted_students)


if __name__ == '__main__':
    app.run(debug=True, port=400)