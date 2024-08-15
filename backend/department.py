from flask import Flask, jsonify, request, make_response
from backend import app, client


db = client["Users"]
collection = db["department"]


class Departement:
    def __init__(self, id, name, head, date, details):
        self.id = id
        self.name = name
        self.head = head
        self.date = date
        self.details = details
@app.route('/Departments', methods=['POST'])
def ajouter_department():
    data = request.get_json()
    dernier_case = collection.find_one(sort=[('id', -1)]) 
    if dernier_case:
        id = dernier_case['id'] + 1
    else:
        id = 1
    department = Departement(id, data['name'], data['head'], data['date'], data['details'])
    collection.insert_one(department.__dict__)
    return jsonify({'message': 'Département ajouté avec succès'}), 200


@app.route('/Departments/<int:id>', methods=['PUT'])
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
    collection.update_one({'id': id}, {'$set': update_data})
    return jsonify({'message': f'Données de department {id} mises à jour avec succès'}), 200

@app.route('/Departments/<int:id>', methods=['DELETE'])
def delete_department(id):
    result = collection.delete_one({'id': id})
    if result.deleted_count > 0:
        return jsonify({'message': 'Department supprimé avec succès'}), 200
    else:
        return jsonify({'message': 'Department non trouvé'}), 404

@app.route('/Departments', methods=['GET'])
def get_departments():
    departments = list(collection.find())
    # Convert ObjectId to string for JSON serialization
    for department in departments:
        department['_id'] = str(department['_id'])

    return jsonify(departments)
