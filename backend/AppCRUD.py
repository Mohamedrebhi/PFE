from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from datetime import datetime
from pymongo import MongoClient
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  
# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['Apprenants']


class Apprenant:
    def __init__(self, id, username,  email, password):
        self.id = id
        self.username = username
        self.email = email
        self.password = password

notifications = collection.notifications
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

# Routes pour la gestion des apprenants
    
@app.route('/Apprenants', methods=['GET'])
def get_apprenants():
    apprenants = list(collection.find())
    # Convert ObjectId to string for JSON serialization
    for apprenant in apprenants:
        apprenant['_id'] = str(apprenant['_id'])

    # Return the list of enseignants as JSON
    return jsonify(apprenants)

@app.route('/Apprenants/<int:StudentID>', methods=['DELETE'])
def delete_apprenant(StudentID):
    result = collection.delete_one({'StudentID': StudentID})
    # Send a notification
    send_notification('delete', 'Apprenant', StudentID)
    if result.deleted_count > 0:
        return jsonify({'message': 'Apprenant supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Apprenant non trouvé'}), 404

@app.route('/Apprenants/rechercher', methods=['GET'])
def rechercher_apprenant():
    # Get the search criteria from the request parameters
    identifiant = request.args.get('id')
    username = request.args.get('username')

    # Construct the query based on the provided search criteria
    query = {}
    if identifiant:
        query['id'] = int(identifiant)
    if username:
        query['username'] = username
    

    # Execute the query to find apprenants matching the search criteria
    apprenants = list(collection.find(query))

    if apprenants:
        # Convert ObjectId to string for JSON serialization
        for apprenant in apprenants:
            apprenant['_id'] = str(apprenant['_id'])
        return jsonify(apprenants)
    else:
        return jsonify({'message': 'Aucun apprenant trouvé avec les critères spécifiés.'}), 404


@app.route('/Apprenants/<int:id>', methods=['GET'])
def get_apprenant(id):
    apprenant = collection.find_one({'id': id})
    apprenant['_id'] = str(apprenant['_id'])
    if apprenant:
        return jsonify(apprenant)
    else:
        return jsonify({'message': 'Apprenant non trouvé'}), 404

@app.route('/Apprenants', methods=['POST'])
def ajouter_apprenant():
    data = request.get_json()
    dernier_case = collection.find_one(sort=[('id', -1)]) 
    if dernier_case:
        id = dernier_case['id'] + 1
    else:
        id = 1
    apprenant = Apprenant(id, data['nom'], data['email'], data['password'])
    collection.insert_one(apprenant.__dict__)
    # Send a notification
    send_notification('ajouter', 'apprenant', id)
    return jsonify({'message': 'Apprenant ajouté avec succès'}), 201

@app.route('/Apprenants/<int:id>', methods=['PUT'])
def update_apprenant(id):
    data = request.get_json()
    update_data = {}
    if 'username' in data:
        update_data['username'] = data['username']
    
    if 'email' in data:
        update_data['email'] = data['email']
    
    if 'password' in data:
        update_data['password'] = data['password']
    collection.update_one({'id': id}, {'$set': update_data})
    # Send a notification
    send_notification('update', 'apprenant', id)
    return jsonify({'message': f'Données de l\'apprenant {id} mises à jour avec succès'}), 200

@app.route('/Apprenants/<int:id>', methods=['DELETE'] , endpoint='delete_apprenant_app')
def delete_apprenant(id):
    result = collection.delete_one({'id': id})
    # Send a notification
    send_notification('delete', 'apprenant', id)
    if result.deleted_count > 0:
        return jsonify({'message': 'Apprenant supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Apprenant non trouvé'}), 404
    

if __name__ == '__main__':
    app.run(debug=True, port=600)