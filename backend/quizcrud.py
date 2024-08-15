from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId

app = Flask(__name__)
CORS(app)

class Quiz:
    def __init__(self, id, question, reponses, reponse_correcte, chapitre, subject, nb_reponses_fausses=0, nb_reponses_vraies=0):
        self.id = id
        self.question = question
        self.reponses = reponses
        self.reponse_correcte = reponse_correcte
        self.chapitre = chapitre
        self.subject = subject
        self.nb_reponses_fausses = nb_reponses_fausses
        self.nb_reponses_vraies = nb_reponses_vraies



class Examen:
    def __init__(self, listeDesQuizzes, examenDate, noteMax):
        self.listeDesQuizzes = listeDesQuizzes
        self.examenDate = examenDate
        self.noteMax = noteMax
    

client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['Quiz']
collections = db['Exam']

'''@app.route('/quizzes', methods=['GET'])
def afficher_tous_quizzes():
    quizzes = list(collection.find())
    return jsonify(quizzes), 200'''
@app.route('/quizzes', methods=['GET'])
def afficher_tous_quizzes():
    quizzes = list(collection.find())
    # Convertir les ObjectId en chaînes de caractères pour la sérialisation JSON
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return jsonify(quizzes), 200


@app.route('/quizzes/<Quiz_id>', methods=['GET'])
def get_quiz(Quiz_id):
    quiz = db.quizzes.find_one({'id': Quiz_id})
    if quiz:
        return jsonify(quiz), 200
    else:
        return jsonify({"message": "Quiz not found"}), 404

'''@app.route('/quiz', methods=['POST'])
def ajouter_quiz():
    data = request.json
    quiz = Quiz(data['id'], data['question'], data['reponses'], data['reponse_correcte'], data['chapitre'])
    result = collection.insert_one(quiz.__dict__)
    return jsonify({'message': 'Quiz ajouté avec succès', 'id': str(result.inserted_id)}), 201'''
@app.route('/quiz', methods=['POST'])
def ajouter_quiz():
    data = request.json
    
    # Ensure all required fields are present and correctly named
    required_fields = ['Question', 'Reponses', 'Reponse_correcte', 'Chapitre', 'Subject']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Missing required fields'}), 400

    # Create a quiz document with the correct fields
    quiz = Quiz(
        id=data.get('id', None),
        question=data['Question'],
        reponses=data['Reponses'],
        reponse_correcte=data['Reponse_correcte'],
        chapitre=data['Chapitre'],
        subject=data['Subject']
    )
    
    # Insert the quiz into the database
    result = collection.insert_one(quiz.__dict__)
    
    return jsonify({'message': 'Quiz ajouté avec succès', 'id': str(result.inserted_id)}), 201

@app.route('/quiz/<int:id>', methods=['GET'])
def afficher_quiz(id):
    quiz = collection.find_one({'ID': id})
    if quiz:
        return jsonify(quiz), 200
    else:
        return jsonify({'message': 'Quiz non trouvé'}), 404


@app.route('/quiz/<int:id>', methods=['PUT'])
def modifier_quiz(id):
    data = request.json
    
    # Supprimer les clés avec des valeurs vides du formulaire
    data = {k: v for k, v in data.items() if v != ''}  # Ne prend que les valeurs non vides

    # Vérifier si des données sont spécifiées dans le formulaire
    if not data:
        return jsonify({'message': 'Aucune donnée spécifiée pour la mise à jour'}), 400

    # Mettre à jour les attributs spécifiés dans la base de données
    result = collection.update_one({'id': id}, {'$set': data})
    
    if result.modified_count > 0:
        return jsonify({'message': f'Quiz {id} mis à jour avec succès'}), 200
    else:
        return jsonify({'message': 'Quiz non trouvé ou aucune modification effectuée'}), 404

@app.route('/quiz/<int:id>', methods=['DELETE'])
def supprimer_quiz(id):
    result = collection.delete_one({'id': id})
    if result.deleted_count > 0:
        return jsonify({'message': 'Quiz supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Aucun quiz trouvé avec cet ID'}), 404
    
    
from flask import jsonify

@app.route('/Examens', methods=['POST'])
def ajouter_examen():
    data = request.get_json()
    # Récupérer les données nécessaires à partir de la requête JSON
    listeDesQuizzes_ids = data.get('listeDesQuizzes', [])
    examenDate = data.get('examenDate', '')
    noteMax = data.get('noteMax', 0)  # Assurez-vous de remplacer 0 par la valeur par défaut appropriée
    
    # Créer une liste pour stocker les questions sélectionnées
    listDesQuizzes = []
    
    # Récupérer les détails des questions sélectionnées à partir de leur ID
    for Quiz_id in listeDesQuizzes_ids:
        quiz = db.Quiz.find_one({'id': Quiz_id})
        if quiz:
            listDesQuizzes.append(quiz)
    
    # Créer un objet Examen avec les données récupérées
    examen = Examen(listDesQuizzes, examenDate, noteMax)
    
    # Insérer l'examen dans la collection appropriée
    result = db.Exam.insert_one(examen.__dict__)
    
    if result.inserted_id:
        return jsonify({"message": "Examen ajouté avec succès"}), 201
    else:
        return jsonify({"message": "Erreur lors de l'ajout de l'examen"}), 500
'''@app.route('/quiz/chapter/<chapter_id>/false_percentage', methods=['GET'])
def get_false_percentage(chapter_id):
    # Récupérer les informations sur les quiz pour le chapitre spécifié
    quiz = collection.find_one({'chapter_id': chapter_id})
    if quiz:
        # Extraire le nombre de réponses fausses et vraies depuis le document du quiz
        nb_reponses_fausses = int(quiz.get('nb_reponses_fausses', 0))
        nb_reponses_vraies = int(quiz.get('nb_reponses_vraies', 0))
        
        # Calculer le pourcentage de réponses fausses
        total_reponses = nb_reponses_vraies + nb_reponses_fausses
        false_percentage = (nb_reponses_fausses / total_reponses) * 100

        # Retourner le pourcentage de réponses fausses sous forme de réponse JSON
        return jsonify({"false_percentage": false_percentage})
    else:
        return jsonify({"error": "Chapitre non trouvé"}), 404'''
@app.route('/quiz/chapter/<int:id>/false_percentage', methods=['GET'])
def get_false_percentage(id):
    # Récupérer les informations sur le quiz spécifié par son ID
    quiz = collection.find_one({'id': id})
    if quiz:
        # Extraire le nombre de réponses fausses et vraies depuis le document du quiz
        nb_reponses_fausses = int(quiz.get('nb_reponses_fausses', 0))
        nb_reponses_vraies = int(quiz.get('nb_reponses_vraies', 0))
        
        # Calculer le pourcentage de réponses fausses
        total_reponses = nb_reponses_vraies + nb_reponses_fausses
        false_percentage = (nb_reponses_fausses / total_reponses) * 100

        # Retourner le pourcentage de réponses fausses sous forme de réponse JSON
        return jsonify({"false_percentage": false_percentage})
    else:
        return jsonify({"error": "Quiz non trouvé"}), 404
import random

@app.route('/quizzes/random/<int:number>', methods=['GET'])
def get_random_quizzes(number):
    # Récupérer tous les quizzes depuis la base de données
    quizzes = list(collection.find())
    # Convertir les ObjectId en chaînes de caractères pour la sérialisation JSON
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    
    # Sélectionner un nombre aléatoire de quizzes
    random_quizzes = random.sample(list(quizzes), number)
    
    # Retourner les quizzes sélectionnés sous forme de liste JSON
    return jsonify(random_quizzes)
from flask import request

@app.route('/quizzes/submit', methods=['POST'])
def submit_quiz():
    # Récupérer les réponses soumises par l'utilisateur depuis le corps de la requête
    submitted_answers = request.json
    
    # Initialiser le compteur de réponses correctes
    correct_answers_count = 0
    incorrect_answers = []

    for submitted_answer in submitted_answers:
        Quiz_id = submitted_answer.get('id')
        submitted_response = submitted_answer.get('response')

        # Vérifier si l'ID du quiz est valide
        if not ObjectId.is_valid(Quiz_id):
            return jsonify({"error": f"Invalid Quiz_id: {Quiz_id}"}), 400

        # Récupérer le quiz depuis la base de données
        quiz = collection.find_one({'_id': ObjectId(Quiz_id)})
        if quiz:
            # Vérifier si la réponse soumise est correcte
            if submitted_response == quiz['Reponse_correcte']:
                correct_answers_count += 1
                collection.update_one({'_id': ObjectId(Quiz_id)}, {'$inc': {'nb_reponses_vraies': 1}})
            else:
                incorrect_answers.append({
                    'question': quiz['question'],
                    'submitted_response': submitted_response,
                    'correct_response': quiz['Reponse_correcte']
                })
                collection.update_one({'_id': ObjectId(Quiz_id)}, {'$inc': {'nb_reponses_fausses': 1}})
        else:
            incorrect_answers.append({
                'question': 'Unknown',
                'submitted_response': submitted_response,
                'correct_response': 'Unknown'
            })

    return jsonify({
        "correct_answers_count": correct_answers_count,
        "incorrect_answers": incorrect_answers
    })

    
    # Retourner le nombre de réponses correctes
    return jsonify({"correct_answers_count": correct_answers_count})






if __name__== '__main__':
    app.run(debug=True)