from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
import random

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['Quiz']
collection1 = db['Cours']
collection2 = db['Chapters']

@app.route('/')
def home():
    return 'Welcome to the website!'

@app.route('/quizzes', methods=['GET'])
def afficher_tous_quizzes():
    quizzes = list(collection.find())
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return jsonify(quizzes), 200

@app.route('/quizzes/<quiz_id>', methods=['GET'])
def get_quiz_by_id(quiz_id):
    print(f"Received quiz_id: {quiz_id}")  # Debugging line

    # Check if quiz_id is a 24-character hex string
    if len(quiz_id) != 24 or not all(c in '0123456789abcdefABCDEF' for c in quiz_id):
        print(f"Invalid quiz_id format: {quiz_id}")  # Debugging line
        return jsonify({"message": "Invalid quiz ID format"}), 400

    try:
        quiz_id = ObjectId(quiz_id)  # Convert to ObjectId
    except Exception as e:
        print(f"Error converting quiz_id: {e}")  # Debugging line
        return jsonify({"message": "Invalid quiz ID format"}), 400

    quiz = collection.find_one({'_id': quiz_id})
    if quiz:
        quiz['_id'] = str(quiz['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(quiz), 200
    else:
        return jsonify({"message": "Quiz not found"}), 404

@app.route('/quizzes/chapter/<chapter_name>', methods=['GET'])
def get_quizzes_by_chapter_name(chapter_name):
    quizzes = list(collection.find({'Chapitre': chapter_name}))
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return jsonify(quizzes), 200

@app.route('/quiz/<quiz_id>', methods=['PUT'])
def modifier_quiz(quiz_id):
    data = request.json
    data = {k: v for k, v in data.items() if v != ''}
    if not data:
        return jsonify({'message': 'Aucune donnée spécifiée pour la mise à jour'}), 400
    result = collection.update_one({'_id': ObjectId(quiz_id)}, {'$set': data})
    if result.modified_count > 0:
        return jsonify({'message': f'Quiz {quiz_id} mis à jour avec succès'}), 200
    else:
        return jsonify({'message': 'Quiz non trouvé ou aucune modification effectuée'}), 404

@app.route('/quizzes/<quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    try:
        result = collection.delete_one({'_id': ObjectId(quiz_id)})
        if result.deleted_count > 0:
            return jsonify({'message': 'Quiz deleted successfully'}), 200
        else:
            return jsonify({'message': 'Quiz not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/quiz/chapter/<int:id>/false_percentage', methods=['GET'])
def get_false_percentage(id):
    try:
        quiz = collection.find_one({'_id': ObjectId(id)})
        if quiz:
            nb_reponses_fausses = int(quiz.get('Nb_reponses_fausses', 0))
            nb_reponses_vraies = int(quiz.get('Nb_reponses_vraies', 0))
            total_reponses = nb_reponses_vraies + nb_reponses_fausses
            if total_reponses == 0:
                false_percentage = 0
            else:
                false_percentage = (nb_reponses_fausses / total_reponses) * 100
            return jsonify({"false_percentage": false_percentage})
        else:
            return jsonify({"error": "Quiz not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/quizzes/random/<int:number>', methods=['GET'])
def get_random_quizzes(number):
    quizzes = list(collection.find())
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    random_quizzes = random.sample(quizzes, min(number, len(quizzes)))
    return jsonify(random_quizzes)

@app.route('/quizzes/submit', methods=['POST'])
def submit_quiz():
    try:
        submitted_answers = request.json
        correct_answers_count = 0
        incorrect_answers = []

        for submitted_answer in submitted_answers:
            quiz_id = submitted_answer['id']
            submitted_response = submitted_answer['response']

            # Ensure quiz_id is in valid ObjectId format
            if len(quiz_id) != 24 or not all(c in '0123456789abcdefABCDEF' for c in quiz_id):
                return jsonify({"message": "Invalid quiz ID format"}), 400

            try:
                quiz = collection.find_one({'_id': ObjectId(quiz_id)})
            except Exception as e:
                return jsonify({"message": f"Error querying quiz: {str(e)}"}), 500

            if quiz:
                if submitted_response == quiz.get('Reponse_correcte'):
                    correct_answers_count += 1
                    collection.update_one({'_id': ObjectId(quiz_id)}, {'$inc': {'Nb_reponses_vraies': 1}})
                else:
                    collection.update_one({'_id': ObjectId(quiz_id)}, {'$inc': {'Nb_reponses_fausses': 1}})
                    incorrect_answers.append({
                        'id': quiz_id,
                        'question': quiz.get('Question'),
                        'submitted_response': submitted_response,
                    })
            else:
                return jsonify({"message": f"Quiz with ID {quiz_id} not found"}), 404

        return jsonify({
            'correct_answers_count': correct_answers_count,
            'incorrect_answers': incorrect_answers
        })
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500

def convert_object_ids(data):
    if isinstance(data, list):
        for item in data:
            if '_id' in item:
                item['_id'] = str(item['_id'])
    elif isinstance(data, dict):
        if '_id' in data:
            data['_id'] = str(data['_id'])
    return data

@app.route('/Cours/Professor/<int:ProfessorID>', methods=['GET'])
def get_cours_by_professor(ProfessorID):
    try:
        cours = list(collection1.find({"ProfessorID": ProfessorID}))
        cours = convert_object_ids(cours)
        if cours:
            return jsonify(cours)
        else:
            return jsonify({'message': 'Cours non trouvé'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/Modules/<int:CourseID>', methods=['GET'])
def get_module(CourseID):
    modules = list(collection2.find({"CourseID": CourseID}))
    if modules:
        for module in modules:
            module['_id'] = str(module['_id'])
        return jsonify(modules)
    else:
        return jsonify({'message': 'module non trouvé'}), 404

@app.route('/cours/<int:course_id>/chapitres', methods=['GET'])
def get_chapitres_by_course(course_id):
    chapitres = collection2.find({'CourseID': course_id})
    chapitres_list = [chapitre for chapitre in chapitres]
    for chapitre in chapitres_list:
        chapitre['_id'] = str(chapitre['_id'])
    return jsonify(chapitres_list)

@app.route('/cours', methods=['GET'])
def get_courses():
    courses = collection1.find()
    cours_list = []
    for course in courses:
        cours_list.append({
            'CourseID': course['CourseID'],
            'Name': course['Name'],
            'Description': course['Description'],
            'Price': course['Price']
        })
    return jsonify(cours_list)

@app.route('/chapitres', methods=['GET'])
def get_all_chapters():
    chapters = list(collection2.find())
    for chapter in chapters:
        chapter['_id'] = str(chapter['_id'])
    return jsonify(chapters)

if __name__ == '__main__':
    app.run(debug=True, port=1050)
