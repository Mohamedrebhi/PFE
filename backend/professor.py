from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from backend import app, client


db = client["Users"]
collection = db["enseignants"]

@app.route('/')
def home():
    return 'Welcome to the website!' 

@app.route('/enseignants', methods=['GET'])
def get_enseignants():
    enseignants = list(collection.find({}))
    # Convertir les ObjectId en chaînes de caractères
    for enseignant in enseignants:
        enseignant['_id'] = str(enseignant['_id'])
    return jsonify(enseignants), 200

@app.route('/enseignants/<int:id>', methods=['GET'])
def get_enseignant(enseignant_id):
    enseignant = collection.find_one({'id': enseignant_id})
    if enseignant:
        return jsonify(enseignant), 200
    else:
        return jsonify({'message': 'Enseignant non trouvé'}), 404

