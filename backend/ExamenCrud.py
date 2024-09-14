from flask import Flask, jsonify, request, send_file, abort
from flask_pymongo import PyMongo
from datetime import datetime
from bson.objectid import ObjectId
from flask_cors import CORS
import random
import io
import base64

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
            'Name': exam.get('name', ''),
            'examenDate': exam.get('examenDate', ''),
            'maxScore': exam.get('maxScore', ''),
            'subject': exam.get('subject', ''),
            'duration': exam.get('duration', ''),
            'additionalQuestions': exam.get('additionalQuestions', [])
        })
    return jsonify(examens_list)

@app.route('/examens/<string:id>', methods=['GET'])
def get_examen(id):
    examen = exam_collection.find_one({'_id': ObjectId(id)})
    if examen:
        examen['_id'] = str(examen['_id'])
        return jsonify(examen)
    else:
        return jsonify({'message': 'Examen not found'}), 404

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
    result = exam_collection.insert_one(exam_document)

    if result.inserted_id:
        send_notification('add', 'examens', str(result.inserted_id))
        return jsonify({"message": "Exam added successfully."}), 201
    else:
        return jsonify({"message": "Failed to add exam."}), 500

@app.route('/examens/<string:id>', methods=['PUT'])
def update_examen(id):
    data = request.get_json()
    
    # Prepare the update data
    update_data = {}
    if 'Name' in data:
        update_data["name"] = data["Name"]
    if 'additionalQuestions' in data:
        update_data["additionalQuestions"] = data["additionalQuestions"]
    if 'examenDate' in data:
        try:
            update_data["examenDate"] = datetime.strptime(data["examenDate"], '%Y-%m-%d')
        except ValueError:
            return jsonify({"message": "Invalid date format"}), 400
    if 'maxScore' in data:
        update_data["maxScore"] = data["maxScore"]
    if 'subject' in data:
        update_data["subject"] = data["subject"]
    if 'duration' in data:
        update_data["duration"] = data["duration"]
    if 'content' in data:
        update_data["content"] = data["content"]

    # Validate and apply the update
    try:
        result = exam_collection.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        if result.matched_count:
            return jsonify({"message": "Exam updated successfully"})
        else:
            return jsonify({"message": "Exam not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred while updating the exam"}), 500


@app.route('/examens/<string:id>', methods=['DELETE'])
def delete_examen(id):
    result = exam_collection.delete_one({'_id': ObjectId(id)})
    if result.deleted_count > 0:
        send_notification('delete', 'examens', id)
        return jsonify({"message": "Examen deleted successfully"}), 200
    else:
        return jsonify({"message": "Examen not found"}), 404

@app.route('/search_examens', methods=['GET'])
def search_examens():
    name = request.args.get('name')
    if name:
        examens = exam_collection.find({'name': {'$regex': name, '$options': 'i'}})
    else:
        examens = exam_collection.find({})

    examens_list = []
    for exam in examens:
        examens_list.append({
            '_id': str(exam['_id']),
            'Name': exam.get('name', ''),
            'examenDate': exam.get('examenDate', ''),
            'maxScore': exam.get('maxScore', ''),
            'subject': exam.get('subject', ''),
            'duration': exam.get('duration', ''),
            'additionalQuestions': exam.get('additionalQuestions', [])
        })
    return jsonify(examens_list)

@app.route('/examens/content/<string:exam_name>', methods=['GET'])
def get_exam_content(exam_name):
    try:
        # Fetch the exam from MongoDB by name
        exam = mongo.db.Examens.find_one({"name": exam_name})
        
        if not exam:
            return "Exam not found", 404
        
        # Ensure 'content' field is present and correctly formatted
        content = exam.get('content')
        
        if not content:
            return "Content not found", 404
        
        # If 'content' is binary, use it directly
        if isinstance(content, dict) and '$binary' in content:
            # Decode the base64 content if stored in base64
            content_base64 = content.get('$binary', {}).get('base64', '')
            pdf_data = base64.b64decode(content_base64)
        elif isinstance(content, bytes):
            # If content is already in bytes, use it directly
            pdf_data = content
        else:
            return "Invalid content format", 400
        
        # Serve the PDF file using BytesIO
        pdf_stream = io.BytesIO(pdf_data)
        return send_file(pdf_stream, download_name=f"{exam_name}.pdf", mimetype='application/pdf')
    except Exception as e:
        return str(e), 500

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
    send_notification('add', 'examens', exam_id)
    return jsonify({"message": "Exam generated and saved successfully", "id": exam_id}), 201
@app.route('/view-Exams', methods=['GET'])
def get_exams():
    try:
        professor_id = request.args.get('username')  # Retrieve the professorId from query parameters
        if professor_id:
            # Filter exams by ProfessorID
            exams = list(exam_collection.find({'ProfessorID': professor_id}))
        else:
            # Fetch all exams if no professorId is provided
            exams = list(exam_collection.find())
        return jsonify(exams), 200
    except Exception as e:
        print(f"Error fetching exams: {e}")
        return jsonify({'message': 'Failed to fetch exams'}), 500




if __name__ == '__main__':
    app.run(debug=True, port=800)
