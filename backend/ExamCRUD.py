from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_cors import CORS
import io
from PyPDF2 import PdfFileWriter, PdfFileReader

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/user1"
mongo = PyMongo(app)
exam_collection = mongo.db.Examens
chapter_collection = mongo.db.Chapters
quiz_collection = mongo.db.Quizzes
notifications = mongo.db.notifications

class Examen:
    def __init__(self, id, name, subject, duration, additionalQuestions, examenDate, maxScore, selectedQuizzes, content):
        self.id = id
        self.name = name
        self.subject = subject
        self.duration = duration
        self.additionalQuestions = additionalQuestions
        self.examenDate = examenDate
        self.maxScore = maxScore
        self.selectedQuizzes = selectedQuizzes
        self.content = content

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
            'name': exam['name'],
            'subject': exam['subject'],
            'duration': exam['duration'],
            'examenDate': exam['examenDate'],
            'maxScore': exam['maxScore'],
            'selectedQuizzes': exam['selectedQuizzes'],
            'additionalQuestions': exam['additionalQuestions'],
            'content': exam['content']
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

@app.route('/examens', methods=['POST'])
def add_examen():
    data = request.get_json()
    last_exam = exam_collection.find_one(sort=[('id', -1)])
    id = last_exam['id'] + 1 if last_exam else 1
    examen = Examen(
        id,
        data['name'],
        data['subject'],
        data['duration'],
        data.get('additionalQuestions', []),
        data.get('examenDate'),
        data.get('maxScore', 100),
        data.get('selectedQuizzes', []),
        data.get('content')
    )
    exam_collection.insert_one(examen.__dict__)
    send_notification('add', 'examen', id)
    return jsonify({"message": "Examen ajouté avec succès"}), 201

@app.route('/examens/<string:id>', methods=['PUT'])
def update_examen(id):
    data = request.get_json()
    update_data = {
        "name": data.get("name"),
        "subject": data.get("subject"),
        "duration": data.get("duration"),
        "additionalQuestions": data.get("additionalQuestions", []),
        "examenDate": data.get("examenDate"),
        "maxScore": data.get("maxScore", 100),
        "selectedQuizzes": data.get("selectedQuizzes", []),
        "content": data.get("content")
    }
    exam_collection.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    send_notification('update', 'examen', id)
    return jsonify({"message": f"Examen {id} mis à jour avec succès"}), 200

@app.route('/examens/<string:id>', methods=['DELETE'])
def delete_examen(id):
    result = exam_collection.delete_one({'_id': ObjectId(id)})
    send_notification('delete', 'examen', id)
    if result.deleted_count > 0:
        return jsonify({"message": "Examen supprimé avec succès"}), 200
    else:
        return jsonify({"message": "Examen non trouvé"}), 404

@app.route('/chapters/<string:name>', methods=['GET'])
def get_chapter_content(name):
    chapter = chapter_collection.find_one({'Name': name})
    if chapter and 'Content' in chapter:
        return jsonify({'content': chapter['Content']})
    else:
        return jsonify({'message': 'Chapter not found'}), 404

@app.route('/generate-quiz', methods=['GET'])
def generate_quiz():
    quizzes = list(quiz_collection.aggregate([{ '$sample': { 'size': 20 } }]))
    return jsonify(quizzes)

@app.route('/quizzes/random', methods=['POST'])
def get_random_quizzes_by_chapter():
    data = request.get_json()
    chapter_name = data.get('chapterName')
    if not chapter_name:
        return jsonify({'message': 'Chapter name is required'}), 400
    
    quizzes = list(quiz_collection.find({'chapters': chapter_name}))
    if len(quizzes) < 20:
        return jsonify({'message': 'Not enough quizzes available'}), 404

    # Select 20 random quizzes
    random_quizzes = list(quiz_collection.aggregate([
        {'$match': {'chapters': chapter_name}},
        {'$sample': {'size': 10}}
    ]))

    return jsonify(random_quizzes)

@app.route('/view-exam/<string:id>', methods=['GET'])
def view_exam(id):
    exam = exam_collection.find_one({'_id': ObjectId(id)})
    if exam:
        pdf_writer = PdfFileWriter()
        pdf_writer.add_page(PdfFileReader(io.BytesIO(exam['content'])).getPage(0))
        output = io.BytesIO()
        pdf_writer.write(output)
        output.seek(0)
        return send_file(io.BytesIO(output.getvalue()), attachment_filename="exam.pdf", as_attachment=True)
    else:
        return jsonify({'message': 'Exam not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=800)
