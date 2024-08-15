from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from werkzeug.utils import secure_filename
import io

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['chapitres']

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/chapitre', methods=['POST'])
def add_chapitre():
    try:
        # Get form data
        course_id = request.form.get('Course')
        name_chapter = request.form.get('NameChapter')
        file = request.files.get('FileUpload')

        if not all([course_id, name_chapter, file]):
            return jsonify({'error': 'All fields are required.'}), 400

        # Save the uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        with open(file_path, 'rb') as f:
            file_data = f.read()

        # Generate unique ChapterID (you may use a different method if needed)
        chapter_id = collection.count_documents({}) + 1

        # Insert chapter data into MongoDB
        document = {
            'ChapterID': chapter_id,
            'Name': name_chapter,
            'CourseID': course_id,
            'Content': file_data  # Store binary data directly
        }
        result = collection.insert_one(document)

        # Update course with the new chapter ID
        course_collection = db['Cours']
        course_document = course_collection.find_one({'_id': ObjectId(course_id)})

        if course_document:
            # Update existing document
            chapter_ids = course_document.get('Reponses', [])
            chapter_ids.append(str(chapter_id))
            course_collection.update_one(
                {'_id': ObjectId(course_id)},
                {'$set': {'Reponses': chapter_ids}}
            )
        else:
            # Create new document if it doesn't exist
            course_collection.insert_one({
                '_id': ObjectId(course_id),
                'Reponses': [str(chapter_id)]
            })

        os.remove(file_path)  # Remove the file from the server after upload

        # Prepare response
        response = {
            'message': 'Chapter added successfully',
            'document_id': str(result.inserted_id)
        }
        return jsonify(response), 201

    except Exception as e:
        # Log error for debugging
        print(f"Error in add_chapitre: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/chapitres', methods=['GET'])
def get_chapitres():
    try:
        chapitres = list(collection.find({}, {'Content': 0}))  # Exclude the binary content
        for chap in chapitres:
            chap['_id'] = str(chap['_id'])  # Convert ObjectId to string
        return jsonify(chapitres), 200
    except Exception as e:
        # Log error for debugging
        print(f"Error in get_chapitres: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/chapitre/<id>', methods=['GET'])
def get_chapitre_file(id):
    try:
        chapitre = collection.find_one({'_id': ObjectId(id)})
        if chapitre:
            # Serve the binary content as a PDF
            return send_file(
                io.BytesIO(chapitre['Content']),
                download_name=f"{chapitre['Name']}.pdf",
                mimetype='application/pdf',
                as_attachment=False  # Set to False if you want to display in-browser
            )
        return jsonify({'error': 'Chapter not found.'}), 404
    except Exception as e:
        # Log error for debugging
        print(f"Error in get_chapitre_file: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/chapitre/<id>', methods=['DELETE'])
def delete_chapitre(id):
    try:
        result = collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({'message': 'Chapter deleted successfully'}), 200
        else:
            return jsonify({'error': 'Chapter not found'}), 404
    except Exception as e:
        # Log error for debugging
        print(f"Error in delete_chapitre: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=1000)
