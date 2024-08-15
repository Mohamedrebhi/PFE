from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from datetime import datetime
from bson.objectid import ObjectId
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/Users"
mongo = PyMongo(app)
exam_collection = mongo.db.Examens
quiz_collection = mongo.db.Quiz
notifications = mongo.db.notifications

def send_notification(operation, collection, document_id):
    notification = {
        "operation": operation,
        "collection": collection,
        "document_id": document_id,
        "timestamp": datetime.now()
    }
    notifications.insert_one(notification)

@app.route('/examens', methods=['GET'])
def get_examens():
    examens = exam_collection.find({})
    examens_list = []
    for exam in examens:
        examens_list.append({
            '_id': str(exam['_id']),
            'Name': exam['name'],
            'examenDate': exam['examenDate'],
            'maxScore': exam['maxScore'],
            'subject': exam['subject'],
            'Duration': exam['duration'],
            'additionalQuestions': exam['additionalQuestions']
        })
    return jsonify(examens_list)

@app.route('/examens/<int:id>', methods=['GET'])
def get_examen(id):
    examen = exam_collection.find_one({'id': id})
    if examen:
        examen['_id'] = str(examen['_id'])
        return jsonify(examen)
    else:
        return jsonify({'message': 'Examen non trouvé'}), 404

@app.route('/chapters', methods=['GET'])
def get_chapters_by_name():
    course_id = request.args.get('CourseID')
    chapter_name = request.args.get('ChapterName')
    
    if not course_id or not chapter_name:
        return jsonify({"message": "Missing required parameters"}), 400
    
    chapters = mongo.db.Chapters.find({'CourseID': course_id, 'Name': chapter_name})
    chapters_list = []
    
    for chapter in chapters:
        chapter_data = {
            '_id': str(chapter['_id']),
            'ChapterID': chapter.get('ChapterID'),
            'Name': chapter.get('Name'),
            'CourseID': chapter.get('CourseID'),
            'Content': chapter.get('Content')  # Ensure the content is included
        }
        chapters_list.append(chapter_data)
    
    return jsonify(chapters_list)

@app.route('/examens', methods=['POST'])
def add_exam():
    data = request.json

    # Extract data from the request
    professor_id = data.get('ProfessorID')
    exam_name = data.get('name')
    subject = data.get('subject')
    duration = data.get('duration')

    selected_quizzes = data.get('selectedQuizzes', [])
    additional_questions = data.get('additionalQuestions', [])
    examen_date = datetime.strptime(data.get('examenDate'), '%Y-%m-%d')
    max_score = data.get('maxScore')

    # Validation could be added here

    # Create the exam document
    exam_document = {
        "ProfessorID": professor_id,
        "name": exam_name,
        "subject": subject,
        "duration": duration,
        "selectedQuizzes": selected_quizzes,
        "additionalQuestions": additional_questions,
        "examenDate": examen_date,
        "maxScore": max_score
    }

    # Insert the document into the database
    result = mongo.db.Examens.insert_one(exam_document)

    if result.inserted_id:
        print(exam_document)

        return jsonify({"message": "Exam added successfully."}), 201
    else:
        return jsonify({"message": "Failed to add exam."}), 500

@app.route('/examens/<string:id>', methods=['PUT'])
def update_examen(id):
    data = request.get_json()
    update_data = {
        "Name": data.get("Name"),
        "additionalQuestions": data.get("additionalQuestions", []),
        "examenDate": data.get("examenDate"),
        "maxScore": data.get("maxScore", 100),
        "selectedQuizzes": data.get("selectedQuizzes", [])
    }
    result = exam_collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    if result.modified_count > 0:
        send_notification('update', 'examens', id)
        return jsonify({"message": f"Examen {id} mis à jour avec succès"}), 200
    else:
        return jsonify({"message": "Examen non trouvé"}), 404

@app.route('/examens/<string:id>', methods=['DELETE'])
def delete_examen(id):
    result = exam_collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count > 0:
        send_notification('delete', 'examens', id)
        return jsonify({"message": "Examen supprimé avec succès"}), 200
    else:
        return jsonify({"message": "Examen non trouvé"}), 404

@app.route('/generate-exam', methods=['PUT'])
def generate_exam():
    data = request.get_json()
    chapter_names = data.get('chapterNames')

    if not chapter_names:
        return jsonify({'message': 'Chapter names are required'}), 400

    quizzes = list(quiz_collection.find({'Chapitre': {'$in': chapter_names}}))
    if len(quizzes) == 0:
        return jsonify({'message': 'Not enough quizzes available'}), 404

    # Select up to 10 random quizzes
    num_quizzes_to_select = min(10, len(quizzes))
    selected_quizzes = random.sample(quizzes, num_quizzes_to_select)

    # Create a new exam
    last_exam = exam_collection.find_one(sort=[('id', -1)])
    exam_id = last_exam['id'] + 1 if last_exam else 1
    examen = {
        'id': exam_id,
        'Name': f"Exam for {', '.join(chapter_names)}",
        'additionalQuestions': [],
        'examenDate': datetime.now(),
        'maxScore': 100,
        'selectedQuizzes': [str(quiz['_id']) for quiz in selected_quizzes],
    }

    result = exam_collection.insert_one(examen)
    send_notification('ajouter', 'examens', exam_id)
    return jsonify({"message": "Exam generated and saved successfully", "id": exam_id}), 201

if __name__ == '__main__':
    app.run(debug=True, port=800)
