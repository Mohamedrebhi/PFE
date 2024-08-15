from backend import app, client
from datetime import datetime
from flask import Flask, jsonify, request, make_response
from bson import ObjectId


db = client["Users"]
collection = db["notifications"]


# Route pour la gestion des notifications
def send_notification(operation, collection, document_id):
    # Create a notification document
    notification = {
        "operation": operation,
        "collection": collection,
        "document_id": document_id,
        "timestamp": datetime.now()
    }
    # Insert the notification document into the database
    collection.insert_one(notification)

@app.route('/notifications', methods=['GET'])
def get_notifications():
    # Récupérer toutes les notifications depuis la collection MongoDB
    notifications = list(collection.find())
    
    # Convertir les ObjectId en chaînes de caractères
    for notification in notifications:
        notification['_id'] = str(notification['_id'])
    
    # Vérifier si des notifications ont été trouvées
    if notifications:
        # Retourner les notifications au format JSON
        return jsonify(notifications)
    else:
        # Retourner un message indiquant l'absence de notifications
        return jsonify({"message": "Aucune notification trouvée"}), 404
    

@app.route('/notifications/<string:id>', methods=['PUT'])
def marquer_comme_lue(id):
    # Récupérer la notification depuis la base de données
    notification = collection.find_one({'_id': ObjectId(id)})
    
    # Vérifier si la notification existe
    if notification:
        # Mettre à jour le champ "lu" de la notification
        collection.update_one({'_id': ObjectId(id)}, {'$set': {'lu': True}})
        return jsonify({"message": "Notification marquée comme lue avec succès"}), 200
    else:
        return jsonify({"message": "Notification non trouvée"}), 404
    

@app.route('/notifications/<string:id>', methods=['DELETE'])
def supprimer_notification(id):
    # Convertir l'identifiant en un objet ObjectId
    obj_id = ObjectId(id)

    # Vérifier d'abord si la notification existe
    notification = collection.find_one({'_id': obj_id})
    if notification:
        # Si la notification existe, supprimez-la de la base de données
        collection.delete_one({'_id': obj_id})
        return jsonify({"message": "Notification supprimée avec succès"}), 200
    else:
        # Si la notification n'existe pas, renvoyez un message d'erreur
        return jsonify({"message": "Notification non trouvée"}), 404
    