from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import logging

# Setup basic logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app, resources={r'/*': {"origins": "http://localhost:3000"}})

client = MongoClient('mongodb://localhost:27017/')
db = client["Users"]
collection = db["Cours"]

# Helper function to convert ObjectId to string
def convert_object_ids(data):
    if isinstance(data, list):
        for item in data:
            if '_id' in item:
                item['_id'] = str(item['_id'])  # Convert ObjectId to string
    elif isinstance(data, dict):
        if '_id' in data:
            data['_id'] = str(data['_id'])  # Convert single ObjectId
    return data

# Route to retrieve all courses
@app.route('/Cours', methods=['GET'])
def get_courses():
    try:
        courses = list(collection.find({}))
        formatted_courses = convert_object_ids(courses)
        return jsonify(formatted_courses), 200
    except Exception as e:
        logging.error(f"Error retrieving courses: {e}")
        return jsonify({"error": str(e)}), 500

# Route to retrieve a specific course by its ID
@app.route('/Cours/<course_id>', methods=['GET'])
def get_course(course_id):
    try:
        course = collection.find_one({"_id": ObjectId(course_id)})
        if course:
            formatted_course = convert_object_ids(course)
            return jsonify(formatted_course), 200
        else:
            return jsonify({"error": "Course not found"}), 404
    except Exception as e:
        logging.error(f"Error retrieving course {course_id}: {e}")
        return jsonify({"error": str(e)}), 500

# Route to retrieve courses by StudentID
@app.route('/Cours/student/<int:StudentID>', methods=['GET'])
def get_crs(StudentID):
    try:
        logging.info(f"Searching courses for StudentID: {StudentID}")
        crs = list(collection.find({"StudentID": StudentID}))
        if crs:
            crs = convert_object_ids(crs)
            return jsonify(crs), 200
        else:
            logging.warning(f"No courses found for StudentID: {StudentID}")
            return jsonify({'message': 'No courses found for this student.'}), 404
    except Exception as e:
        logging.error(f"Error retrieving courses for StudentID {StudentID}: {e}")
        return jsonify({"error": str(e)}), 500

# Route to retrieve courses by ProfessorID
@app.route('/Cours/professor/<int:ProfessorID>', methods=['GET'])
def get_cours_by_professor(ProfessorID):
    try:
        courses = list(collection.find({"ProfessorID": ProfessorID}))
        if courses:
            courses = convert_object_ids(courses)
            return jsonify(courses), 200
        else:
            return jsonify({'message': 'No courses found for this professor.'}), 404
    except Exception as e:
        logging.error(f"Error retrieving courses for ProfessorID {ProfessorID}: {e}")
        return jsonify({"error": str(e)}), 500

# Route to retrieve modules by CourseID
@app.route('/Modules/<int:CourseID>', methods=['GET'])
def get_module(CourseID):
    try:
        modules = list(collection.find({"CourseID": CourseID}))
        if modules:
            modules = convert_object_ids(modules)
            return jsonify(modules), 200
        else:
            return jsonify({'message': 'Module not found'}), 404
    except Exception as e:
        logging.error(f"Error retrieving modules for CourseID {CourseID}: {e}")
        return jsonify({"error": str(e)}), 500

# Route to add a new course
@app.route('/Cours', methods=['POST'])
def add_course():
    try:
        data = request.json
        collection.insert_one(data)
        return jsonify({"message": "Course added successfully"}), 201
    except Exception as e:
        logging.error(f"Error adding course: {e}")
        return jsonify({"error": str(e)}), 400
@app.route('/Cours/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        result = collection.delete_one({"_id": ObjectId(course_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Course deleted successfully"}), 200
        else:
            return jsonify({"error": "Course not found"}), 404
    except Exception as e:
        logging.error(f"Error deleting course {course_id}: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=400)
