from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)
client = MongoClient("mongodb://localhost:27017/")
db = client["Users"]
collection = db["Apprenants"]


@app.route('/new_students', methods=['GET'])
def get_new_students():
    try:
        # Récupérer la date d'aujourd'hui
        today = datetime.now()
        # Définir une date de début pour calculer les nouveaux étudiants (par exemple, 7 jours avant aujourd'hui)
        start_date = today - timedelta(days=7)
        # Compter le nombre d'étudiants inscrits après la date de début
        new_students = collection.count_documents({"date_inscription": {"$gte": start_date}})
        return jsonify({"new_students": new_students}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/new_students_list', methods=['GET'])
def get_new_students_list():
    try:
        # Récupérer la date d'aujourd'hui
        today = datetime.now()
        # Définir une date de début pour calculer les nouveaux étudiants (par exemple, 7 jours avant aujourd'hui)
        start_date = today - timedelta(days=7)
        # Récupérer la liste des nouveaux étudiants inscrits après la date de début
        new_students_list = list(collection.find({"date_inscription": {"$gte": start_date}}))
        # Supprimer le champ '_id' pour chaque étudiant (facultatif)
        for student in new_students_list:
            del student['_id']
        return jsonify({"new_students_list": new_students_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/total_students', methods=['GET'])
def get_total_students():
    try:
        total_students = collection.count_documents({})
        return jsonify({"total_students": total_students}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/Apprenants', methods=['GET'])
def get_etudiants():
    etudiants = list(collection.find())
    # Convertir ObjectId en str pour la sérialisation JSON
    for etudiant in etudiants:
        etudiant['_id'] = str(etudiant['_id'])
    # Retourner la liste des étudiants en tant que JSON
    return jsonify(etudiants)


@app.route('/Apprenants/signal/<string:student_id>', methods=['POST'])
def signal_etudiant(student_id):
    try:
        # Convertir l'ID de l'étudiant en ObjectId
        student_object_id = ObjectId(student_id)

        # Recherche de l'étudiant par son ID
        etudiant = collection.find_one({'_id': student_object_id})
        if etudiant:
            # Mettre à jour le statut de l'étudiant pour le signaler
            collection.update_one({'_id': student_object_id}, {'$set': {'signale': True}})
            return jsonify({'message': 'Étudiant signalé avec succès'}), 200
        else:
            return jsonify({'message': 'Étudiant non trouvé'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
@app.route('/Apprenants/<string:StudentID>', methods=['DELETE'])
def delete_etudiant(StudentID):
    try:
        result = collection.delete_one({'_id': ObjectId(StudentID)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Étudiant supprimé avec succès'}), 200
        else:
            return jsonify({'message': 'Étudiant non trouvé'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
