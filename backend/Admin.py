from flask import Flask, jsonify, request, make_response
from flask_pymongo import PyMongo
from bson import ObjectId
import json
from datetime import datetime
from flask_cors import CORS
import logging

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)  # Convertir ObjectId en chaîne
        return super().default(obj)

web_app = Flask(__name__)
web_app.json_encoder = CustomJSONEncoder
CORS(web_app)
web_app.config['MONGO_URI'] = 'mongodb://localhost:27017/Users'
mongo = PyMongo(web_app)

@web_app.route('/')
def home():
    return 'Hello, world!'

class Admin:
    def __init__(self, id, Name, Email, Password):
        self.id = id
        self.Name = Name
        self.email = Email
        self.password = Password


# Routes pour la gestion des admins
@web_app.route('/Admins/<int:AdminID>', methods=['GET'])
def get_admin(AdminID):
    admin = mongo.db.Admins.find_one({'AdminID': AdminID})
    admin['_id'] = str(admin['_id'])
    if admin:
        return jsonify(admin)
    else:
        return jsonify({'message': 'Admin non trouvé'}), 404

@web_app.route('/Admins', methods=['GET'])
def get_admins():
    admins = list(mongo.db.Admins.find())
    # Convert ObjectId to string for JSON serialization
    for admin in admins:
            admin['_id'] = str(admin['_id'])
    # Return the list of admins as JSON
    return jsonify(admins)

@web_app.route('/Admins/<int:AdminID>', methods=['PUT'])
def update_admin(AdminID):
    data = request.get_json()
    update_data = {}
    if 'Name' in data:
        update_data['Name'] = data['Name']
    if 'Email' in data:
        update_data['Email'] = data['Email']
    if 'Password' in data:
        update_data['Password'] = data['Password']
    mongo.db.Admins.update_one({'AdminID': AdminID}, {'$set': update_data})
    return jsonify({'message': f'la mise à jour à été effectuer avec succès'}), 200

@web_app.route('/Admins/<int:id>', methods=['DELETE'])
def delete_admin(id):
   # Vérifiez si l'ID fourni correspond à un compte administrateur existant
    admin = mongo.db.Admins.find_one({'id': id})
    
    if admin:
        # Supprimez le compte administrateur de la base de données
        result = mongo.db.Admins.delete_one({'id': id})
        
        if result.deleted_count > 0:
            return jsonify({'message': 'Votre compte administrateur a été supprimé avec succès'}), 200
        else:
            return jsonify({'message': 'Une erreur s\'est produite lors de la suppression du compte'}), 500
    else:
        return jsonify({'message': 'Compte administrateur non trouvé'}), 404
    
# Routes pour la gestion des apprenants
@web_app.route('/Apprenants/<int:id>', methods=['GET'])
def get_apprenant(id):
    apprenant = mongo.db.Apprenants.find_one({'id': id})
    if apprenant:
        apprenant['_id'] = str(apprenant['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(apprenant)
    else:
        return jsonify({'message': 'Apprenant non trouvé pour l\'ID fourni'}), 404
    
@web_app.route('/Apprenants', methods=['GET'])
def get_apprenants():
    apprenants = list(mongo.db.Apprenants.find())
    # Convert ObjectId to string for JSON serialization
    for apprenant in apprenants:
        apprenant['_id'] = str(apprenant['_id'])

    # Return the list of apprenants as JSON
    return jsonify(apprenants)

@web_app.route('/Cours/<int:StudentID>', methods=['GET'])
def get_crs(StudentID):
    logging.info(f"Recherche des cours pour StudentID: {StudentID}")
    crs = list(mongo.db.Cours.find({"StudentID": StudentID}))

    if crs:
        # Convertir les identifiants BSON en chaînes pour JSON
        for cr in crs:
            cr['_id'] = str(cr['_id'])
        # Retourner les cours trouvés
        return jsonify(crs)
    else:
        logging.warning(f"Aucun cours trouvé pour StudentID: {StudentID}")
        # Si aucun cours n'est trouvé
        return jsonify({'message': 'Aucun cours trouvé pour cet étudiant.'}), 404


@web_app.route('/Apprenants/<int:StudentID>', methods=['DELETE'])
def delete_apprenant(StudentID):
    result = mongo.db.Apprenants.delete_one({'StudentID': StudentID})
    # Send a notification
    send_notification('delete', 'Apprenant', StudentID)
    if result.deleted_count > 0:
        return jsonify({'message': 'Apprenant supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Apprenant non trouvé'}), 404

@web_app.route('/Apprenants/rechercher', methods=['GET'])
def rechercher_apprenant():
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

    # Execute the query to find apprenants matching the search criteria
    apprenants = list(mongo.db.Apprenants.find(query))

    if apprenants:
        # Convert ObjectId to string for JSON serialization
        for apprenant in apprenants:
            apprenant['_id'] = str(apprenant['_id'])
        return jsonify(apprenants)
    else:
        return jsonify({'message': 'Aucun apprenant trouvé avec les critères spécifiés.'}), 404

    
# Routes pour la gestion des enseignants
@web_app.route('/enseignants/<int:id>', methods=['GET'])
def get_enseignant(id):
    enseignant = mongo.db.enseignants.find_one({'id': id})
    if enseignant:
        enseignant['_id'] = str(enseignant['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(enseignant)
    else:
        return jsonify({'message': 'Enseignant non trouvé pour l\'ID fourni'}), 404

@web_app.route('/enseignants', methods=['GET'])
def get_enseignants():
    enseignants = list(mongo.db.enseignants.find())
    # Convert ObjectId to string for JSON serialization
    for enseignant in enseignants:
        enseignant['_id'] = str(enseignant['_id'])

    # Return the list of enseignants as JSON
    return jsonify(enseignants)


@web_app.route('/enseignants/<string:enseignant_id>', methods=['DELETE'])
def delete_enseignant(enseignant_id):
    result = mongo.db.enseignants.delete_one({'_id': ObjectId(enseignant_id)})
    if result.deleted_count > 0:
        # Send a notification
        send_notification('delete', 'enseignant', enseignant_id)
        return jsonify({'message': 'Enseignant supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Enseignant non trouvé'}), 404

@web_app.route('/enseignants/rechercher', methods=['GET'])
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
    enseignants = list(mongo.db.enseignants.find(query))

    if enseignants:
        # Convert ObjectId to string for JSON serialization
        for enseignant in enseignants:
            enseignant['_id'] = str(enseignant['_id'])
        return jsonify(enseignants)
    else:
        return jsonify({'message': 'Aucun enseignant trouvé avec les critères spécifiés.'}), 404

# Route pour examiner et mettre à jour le compte d'un utilisateur par l'administrateur
@web_app.route('/users/<string:user_id>', methods=['PUT'])
def examine_user_by_admin(user_id):
    user_id = ObjectId(user_id)
    # Vérifiez si l'utilisateur existe dans la collection des apprenants
    apprenant = mongo.db.Apprenants.find_one({'StudentID': user_id})
    if apprenant:
        # Mettez à jour l'état du compte de l'apprenant
        new_state = request.json.get('state')  # Récupérer le nouvel état du compte à partir du corps de la requête
        mongo.db.Apprenants.update_one({'_id': user_id}, {'$set': {'state': new_state}})
        return jsonify({'message': 'L\'état du compte de l\'apprenant a été mis à jour avec succès'}), 200
    
    # Vérifiez si l'utilisateur existe dans la collection des enseignants
    enseignant = mongo.db.enseignants.find_one({'StudentID': user_id})
    if enseignant:
        # Mettez à jour l'état du compte de l'enseignant
        new_state = request.json.get('state')  # Récupérer le nouvel état du compte à partir du corps de la requête
        mongo.db.enseignants.update_one({'_id': user_id}, {'$set': {'state': new_state}})
        return jsonify({'message': 'L\'état du compte de l\'enseignant a été mis à jour avec succès'}), 200
    
    # Si aucun utilisateur n'est trouvé avec l'ID fourni, retournez un message d'erreur
    return jsonify({'message': 'Utilisateur non trouvé'}), 404

# Routes pour la gestion des cours
def convert_object_ids(data):
    if isinstance(data, list):
        for item in data:
            if '_id' in item:
                item['_id'] = str(item['_id'])  # Convertir ObjectId en chaîne
    elif isinstance(data, dict):
        if '_id' in data:
            data['_id'] = str(data['_id'])  # Conversion unique
    return data

@web_app.route('/Cours/Professor/<int:ProfessorID>', methods=['GET'])
def get_cours_by_professor(ProfessorID):
    try:
        # Récupérer les cours par ProfessorID
        cours = list(mongo.db.Cours.find({"ProfessorID": ProfessorID}))
        
        # Convertir les ObjectId en chaînes avant de renvoyer
        cours = convert_object_ids(cours)
        
        # Retourner les cours si trouvés, sinon un message d'erreur
        if cours:
            return jsonify(cours)
        else:
            return jsonify({'message': 'Cours non trouvé'}), 404
        # return jsonify(cours) if cours else jsonify({'message': 'Cours non trouvé'}), 404
    except Exception as e:
        # Gérer les exceptions et renvoyer une réponse d'erreur
        return jsonify({'error': str(e)}), 500


@web_app.route('/Modules/<int:CourseID>', methods=['GET'])
def get_module(CourseID):
    modules = list(mongo.db.Modules.find({"CourseID": CourseID}))
    if modules:
        for module in modules:
            module['_id'] = str(module['_id'])
        return jsonify(modules)
    else:
        return jsonify({'message': 'module non trouvé'}), 404        
    

@web_app.route('/Cours', methods=['GET'])
def get_courses():
    courses = list(mongo.db.Cours.find())
    # Convert ObjectId to string for JSON serialization
    for cour in courses:
            cour['_id'] = str(cour['_id'])

    # Return the list of courses as JSON
    return jsonify(courses)


# Route pour la gestion des notifications
notifications = mongo.db.notifications
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

@web_app.route('/notifications', methods=['GET'])
def get_notifications():
    # Récupérer toutes les notifications depuis la collection MongoDB
    notifications = list(mongo.db.notifications.find())
    
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
    

@web_app.route('/notifications/<string:id>', methods=['PUT'])
def marquer_comme_lue(id):
    # Récupérer la notification depuis la base de données
    notification = mongo.db.notifications.find_one({'_id': ObjectId(id)})
    
    # Vérifier si la notification existe
    if notification:
        # Mettre à jour le champ "lu" de la notification
        mongo.db.notifications.update_one({'_id': ObjectId(id)}, {'$set': {'lu': True}})
        return jsonify({"message": "Notification marquée comme lue avec succès"}), 200
    else:
        return jsonify({"message": "Notification non trouvée"}), 404
    

@web_app.route('/notifications/<string:id>', methods=['DELETE'])
def supprimer_notification(id):
    # Convertir l'identifiant en un objet ObjectId
    obj_id = ObjectId(id)

    # Vérifier d'abord si la notification existe
    notification = mongo.db.notifications.find_one({'_id': obj_id})
    if notification:
        # Si la notification existe, supprimez-la de la base de données
        mongo.db.notifications.delete_one({'_id': obj_id})
        return jsonify({"message": "Notification supprimée avec succès"}), 200
    else:
        # Si la notification n'existe pas, renvoyez un message d'erreur
        return jsonify({"message": "Notification non trouvée"}), 404
    
class Departement:
    def __init__(self, id, name, head, date, details):
        self.id = id
        self.name = name
        self.head = head
        self.date = date
        self.details = details
@web_app.route('/Departments', methods=['POST'])
def ajouter_department():
    data = request.get_json()
    dernier_case = mongo.db.Departements.find_one(sort=[('id', -1)]) 
    if dernier_case:
        id = dernier_case['id'] + 1
    else:
        id = 1
    department = Departement(id, data['name'], data['head'], data['date'], data['details'])
    mongo.db.Departements.insert_one(department.__dict__)
    return jsonify({'message': 'Département ajouté avec succès'}), 200


@web_app.route('/Departments/<int:id>', methods=['PUT'])
def update_department(id):
    data = request.get_json()
    update_data = {}
    if 'name' in data:
        update_data['name'] = data['name']
    if 'head' in data:
        update_data['head'] = data['head']
    if 'date' in data:
        update_data['date'] = data['date']
    if 'details' in data:
        update_data['details'] = data['details']
    mongo.db.Departements.update_one({'id': id}, {'$set': update_data})
    return jsonify({'message': f'Données de department {id} mises à jour avec succès'}), 200

@web_app.route('/Departments/<int:id>', methods=['DELETE'])
def delete_department(id):
    result = mongo.db.Departements.delete_one({'id': id})
    if result.deleted_count > 0:
        return jsonify({'message': 'Department supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Department non trouvé'}), 404

@web_app.route('/Departments', methods=['GET'])
def get_departments():
    departments = list(mongo.db.Departements.find())
    # Convert ObjectId to string for JSON serialization
    for department in departments:
        department['_id'] = str(department['_id'])

    return jsonify(departments)


class Quiz:
    def __init__(self, id, question, reponses, reponse_correcte, chapitre):
        self.id = id
        self.question = question
        self.reponses = reponses
        self.reponse_correcte = reponse_correcte
        self.chapitre = chapitre

@web_app.route('/Quiz', methods=['GET'])
def get_quiz():
    # Récupérer les quizzes depuis la base de données
    quizzes = list(mongo.db.Quiz.find())

    # Formater les quizzes selon vos besoins
    formatted_quizzes = []
    for quiz in quizzes:
        formatted_quiz = {
            'id': quiz['id'],
            'question': quiz['question'],
            'reponses': quiz['reponses'],
            'reponse_correcte': quiz['reponse_correcte'],
            'chapitre': quiz['chapitre']
        }
        formatted_quizzes.append(formatted_quiz)

    # Retourner les données formatées en tant que réponse JSON
    return jsonify(formatted_quizzes)

@web_app.route('/Quiz/<int:ProfessorID>', methods=['GET'])
def get_quizz(ProfessorID):
    # Récupérer tous les cours pour le professeur donné
    quizz = list(mongo.db.Quiz.find({"ProfessorID": ProfessorID}))
    if quizz:
        # Convertir les objets BSON à des types JSON compatibles
        for quiz in quizz:
            quiz['_id'] = str(quiz['_id'])
        return jsonify(quizz)  # Retourner la liste des quizz trouvés
    else:
        return jsonify({'message': 'Quiz non trouvé'}), 404 


from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Setup MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['Quiz']  # Assuming 'Quiz' is the collection name
@web_app.route('/QuizAdd', methods=['POST'])
def ajouter_quiz():
    data = request.get_json()

    # Ensure 'reponses' is an array
    if not isinstance(data.get('reponses'), list):
        return jsonify({'error': "'reponses' must be an array"}), 400

    # Find the last entry and determine the new ID
    dernier_case = collection.find_one(sort=[('id', -1)])
    if dernier_case:
        new_id = dernier_case['id'] + 1
    else:
        new_id = 1

    # Create a new Quiz instance
    quiz = Quiz(new_id, data['question'], data['reponses'], data['reponse_correcte'], data['chapitre'])

    # Insert the new quiz into the collection
    collection.insert_one(quiz.__dict__)

    return jsonify({'message': 'Question ajouté avec succès'}), 200


class Examen:
    def __init__(self, id, nom, sujet, date, durée, questions, créateur):
        self.id = id
        self.nom = nom
        self.sujet = sujet
        self.date = date
        self.durée = durée
        self.questions = questions
        self.créateur = créateur

@web_app.route('/Examens', methods=['GET'])
def get_examens():
    examens = list(mongo.db.Examens.find())
    # Convert ObjectId to string for JSON serialization
    for examen in examens:
            examen['_id'] = str(examen['_id'])
    # Return the list of examens as JSON
    return jsonify(examens)



@web_app.route('/Examens/<int:ProfessorID>', methods=['GET'])
def get_Examens(ProfessorID):
    examens = list(mongo.db.Examens.find({"ProfessorID": ProfessorID}))
    if examens:
        # Convertir les objets BSON à des types JSON compatibles
        for examen in examens:
            examen['_id'] = str(examen['_id'])
        return jsonify(examens)  # Retourner la liste des quizz trouvés
    else:
        return jsonify({'message': 'Examen non trouvé'}), 404     
    
if __name__ == '__main__':
    web_app.run(debug=True, port=1600)
