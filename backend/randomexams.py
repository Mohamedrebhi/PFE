from flask import Flask, jsonify
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)

# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
quiz_collection = db['Quizz']
examen_collection = db['Examens']

def convert_objectid(obj):
    """
    Convert MongoDB ObjectId to string in a document.
    """
    if isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    if isinstance(obj, dict):
        return {key: convert_objectid(value) for key, value in obj.items()}
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

@app.route('/generate-examen', methods=['GET'])
def generate_examen():
    # Get the total number of documents in the 'Quiz' collection
    total_documents = quiz_collection.count_documents({})
    
    # Check if there are at least 10 documents in the 'Quiz' collection
    if total_documents < 10:
        return jsonify({"error": "Not enough documents in the Quiz collection"}), 400

    # Get 10 random documents from the 'Quiz' collection
    random_docs = list(quiz_collection.aggregate([{ "$sample": { "size": 10 } }]))
    
    # Convert ObjectId to string
    random_docs = convert_objectid(random_docs)
    
    # Insert the random documents into the 'Examens' collection
    examen_collection.insert_many(random_docs)
    
    # Return the random documents in the response
    return jsonify(random_docs), 200

if __name__ == '__main__':
    app.run(debug=True, port=8000)