
from pymongo import MongoClient
from bson import ObjectId
from flask import Flask, request, jsonify
from flask_cors import CORS





app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['Quiz']
collection1 = db['Cours']
collection2 = db['chapitres']

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
    try:
        quiz_id = ObjectId(quiz_id)
    except Exception as e:
        return jsonify({"message": "Invalid quiz ID format"}), 400

    quiz = collection.find_one({'_id': quiz_id})
    if quiz:
        quiz['_id'] = str(quiz['_id'])
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
@app.route('/quizzes/update/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    data = request.get_json()
    print(f"Received data: {data}")  # Log received data

    if not data:
        return jsonify({"message": "No data provided"}), 400

    # Ensure all required fields are present
    required_fields = ['question', 'responses', 'correct_response', 'chaptername']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Field {field} is required.'}), 400

    try:
        result = collection.update_one({'_id': ObjectId(quiz_id)}, {'$set': data})
        print(f"Update result: {result.modified_count}")  # Log update result
        if result.modified_count > 0:
            return jsonify({"message": "Quiz updated successfully"}), 200
        else:
            return jsonify({"message": "Quiz not found or no changes made"}), 404
    except Exception as e:
        print(f"Error updating quiz: {e}")
        return jsonify({"message": "An error occurred while updating the quiz"}), 500


@app.route('/quizzes/random/<int:number>', methods=['GET'])
def get_random_quizzes(number):
    quizzes = list(collection.aggregate([{'$sample': {'size': number}}]))
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return jsonify(quizzes), 200

@app.route('/search_quizzes', methods=['GET'])
def search_quizzes():
    chaptername = request.args.get('chaptername')
    if chaptername:
        quizzes = collection.find({'chaptername': {'$regex': chaptername, '$options': 'i'}})
    else:
        quizzes = collection.find({})

    quizzes_list = []
    for quiz in quizzes:
        quizzes_list.append({
            '_id': str(quiz['_id']),
            'question': quiz.get('question', ''),
            'responses': quiz.get('responses', []),
            'correct_response': quiz.get('correct_response', ''),
            'chaptername': quiz.get('chaptername', '')
        })
    return jsonify(quizzes_list)


@app.route('/save_quizzes', methods=['POST'])
def save_quiz():
    try:
        data = request.json
        
        # Ensure the required fields are present
        required_fields = ['question', 'responses', 'correct_response', 'chaptername']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'message': f'Field {field} is required.'}), 400
        
        # Create the quiz document to be saved
        quiz_document = {
            'question': data['question'],
            'responses': data['responses'],
            'correct_response': data['correct_response'],
            'chaptername': data['chaptername']
            
        }
        
        # Insert the quiz into the collection
        result = collection.insert_one(quiz_document)
        return jsonify({'message': 'Quiz saved successfully', 'quiz_id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True , port=1050)
