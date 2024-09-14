from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

app = Flask(__name__)
CORS(app)
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['enseignants']

@app.route('/')
def home():
    return 'Welcome to the website!'

collection1 = db['Exam']

@app.route('/Exam', methods=['GET'])
def get_examen():
    examens = list(collection1.find())
    # Convert ObjectId to string for JSON serialization
    for examen in examens:
        examen['_id'] = str(examen['_id'])
    # Return the list of examens as JSON
    return jsonify(examens)

@app.route('/enseignants', methods=['POST'])
def ajouter_enseignant():
    data = request.json
    dernier_case = collection.find_one(sort=[('id', -1)])
    if dernier_case:
        id = dernier_case['id'] + 1
    else:
        id = 1
    ens = collection.find_one({'nom': data['nom'], 'prenom': data['prenom'], 'email': data['email']})
    if ens:
        return jsonify({'message': 'Enseignant existe déjà'}), 409
    else:
        enseignant = {
            'id': id,
            'nom': data['nom'],
            'prenom': data['prenom'],
            'email': data['email'],
            'phone': data['phone'],
            'password': data['password'],
            'matiere': data['matiere'],
            'state': 'pending'  # Default state when a teacher is added
        }
        collection.insert_one(enseignant)
        return jsonify({'message': 'Enseignant ajouté avec succès'}), 201

@app.route('/enseignants/<int:id>', methods=['PUT'])
def update_enseignant(id):
    data = request.json
    
    # Supprimer les clés avec des valeurs vides du formulaire
    data = {k: v for k, v in data.items() if v}

    # Vérifier si des données sont spécifiées dans le formulaire
    if not data:
        return jsonify({'message': 'Aucune donnée spécifiée pour la mise à jour'}), 400

    # Mettre à jour les attributs spécifiés dans la base de données
    result = collection.update_one({'id': id}, {'$set': data})
    
    if result.modified_count > 0:
        return jsonify({'message': f'Enseignant {id} mis à jour avec succès'}), 200
    else:
        return jsonify({'message': 'Enseignant non trouvé ou aucune modification effectuée'}), 404

@app.route('/enseignants/<int:id>', methods=['DELETE'])
def supprimer_enseignant(id):
    result = collection.delete_one({'id': id})
    if result.deleted_count > 0:
        return jsonify({'message': 'Enseignant supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Enseignant non trouvé'}), 404

# Route pour la gestion des enseignants
@app.route('/enseignants/<int:id>', methods=['GET'])
def get_enseignant(id):
    enseignant = collection.find_one({'id': id})
    if enseignant:
        enseignant['_id'] = str(enseignant['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(enseignant)
    else:
        return jsonify({'message': 'Enseignant non trouvé pour l\'ID fourni'}), 404

@app.route('/enseignants', methods=['GET'])
def get_enseignants():
    enseignants = list(collection.find())
    # Convert ObjectId to string for JSON serialization
    for enseignant in enseignants:
        enseignant['_id'] = str(enseignant['_id'])

    # Return the list of enseignants as JSON
    return jsonify(enseignants)

@app.route('/Apprenants', methods=['GET'])
def get_apprenants():
    apprenants = list(collection.find())
    # Convert ObjectId to string for JSON serialization
    for apprenant in apprenants:
        apprenant['_id'] = str(apprenant['_id'])

    # Return the list of enseignants as JSON
    return jsonify(apprenants)

# Route pour accepter ou supprimer un enseignant
notifications = db['notifications']

def send_notification(operation, collection, document_id):
    # Create a notification document
    notification = {
        "operation": operation,
        "collection": collection,
        "document_id": document_id,
        "timestamp": datetime.now()
    }
    # Insert the notification document into the database
    notifications.insert_one(notification)
@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        # Access collections
        students_collection = db['Apprenants']
        courses_collection = db['Cours']
        
        # Get the count of students and courses
        student_count = students_collection.count_documents({})
        course_count = courses_collection.count_documents({})
        
        # Create response
        response = {
            'total_students': student_count,
            'total_courses': course_count
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/enseignants/action', methods=['PUT'])
def action_enseignant():
    data = request.json
    username = data.get('username')
    action = data.get('action')

    if not username or action not in ['accept', 'delete']:
        return jsonify({'message': 'Invalid request'}), 400

    enseignant = collection.find_one({'username': username})
    if not enseignant:
        return jsonify({'message': 'Enseignant non trouvé'}), 404

    if action == 'accept':
        # Update state to 'accepted'
        result = collection.update_one({'username': username}, {'$set': {'state': 'accepter'}})
        message = 'Enseignant accepté avec succès'
    elif action == 'delete':
        # Delete the enseignant document
        result = collection.delete_one({'username': username})
        message = 'Enseignant supprimé avec succès'

    if (action == 'accept' and result.modified_count > 0) or (action == 'delete' and result.deleted_count > 0):
        return jsonify({'message': message}), 200
    else:
        return jsonify({'message': 'Aucune modification effectuée'}), 400



@app.route('/enseignants/rechercher', methods=['GET'])
def rechercher_enseignant():
    # Get the search criteria from the request parameters
    identifiant = request.args.get('id')
    nom = request.args.get('nom')
    prenom = request.args.get('prenom')

    # Construct the query based on the provided search criteria
    query = {}
    if identifiant:
        query['id'] = int(identifiant)
    if nom:
        query['nom'] = nom
    if prenom:
        query['prenom'] = prenom

    # Execute the query to find enseignants matching the search criteria
    enseignants = list(collection.find(query))

    if enseignants:
        # Convert ObjectId to string for JSON serialization
        for enseignant in enseignants:
            enseignant['_id'] = str(enseignant['_id'])
        return jsonify(enseignants)
    else:
        return jsonify({'message': 'Aucun enseignant trouvé avec les critères spécifiés.'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=200)
