from flask import Flask, jsonify, request
import os
import PyPDF2
import pymongo
import gemini
import gemini1
from flask_cors import CORS
import re
import json

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'resources'
CORS(app)
max_words_per_chunk = 1000
list = []
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["Users"]
quiz_collection = db["Quizz"]

@app.route('/recomand', methods=['POST'])
def recomendquiz():
    data = request.get_json()
    name = data.get("chapitre")
    list.append(name)
    if not name:
        return jsonify({"error": "No chapter name provided"}), 400

    print(f"Received chapter name: {name}")

    filepath = os.path.join(app.root_path, 'resources\\' + name + ".pdf")
    print(f"filepath: {filepath}")
    if not os.path.exists(filepath):
        return jsonify({"error": "File Not Found"}), 404

    file_data = pdf_to_text(filepath)
    max_words_per_chunk = 1000
    split_text = split_into_chunks(file_data, max_words_per_chunk)

    print(f"Text chunks: {split_text}")
    n = list.count(name)
    i = n
    while i > len(split_text) - 1:
        i -= 1
    recomendation = gemini.send_request(gemini.wassih + split_text[i])
    print(f"Recommendation: {recomendation}")

    return jsonify(parse_recommendation(recomendation)), 200

# @app.route('/reformtext', methods=['POST'])
# def reformtext():
#     data = request.get_json()
#     name = data.get("chapitre")
#     list.append(name)
#     if not name:
#         return jsonify({"error": "No chapter name provided"}), 400

#     print(f"Received chapter name: {name}")

#     filepath = os.path.join(app.root_path, 'resources\\' + name + ".pdf")
#     print(f"filepath: {filepath}")
#     if not os.path.exists(filepath):
#         return jsonify({"error": "File Not Found"}), 404

#     file_data = pdf_to_text(filepath)
#     split_text = split_into_chunks(file_data, max_words_per_chunk)

#     print(f"Text chunks: {split_text}")
#     n = list.count(name)
#     i = n
#     while i > len(split_text) - 1:
#         i -= 1
#     reformulated_text = gemini1.reform_text(split_text[i])
#     print(f"Reformulated Text: {reformulated_text}")

#     return jsonify({"reformulated_text": reformulated_text}), 200
reformulation_file = "reformulated_text.txt"
def get_quiz_statistics(chapter_id):
    # Récupère les statistiques des quiz à partir de MongoDB
    quiz_stats = quiz_collection.find_one({"chapter_id": chapter_id})
    return quiz_stats
def should_reformulate(quiz_stats):
    nb_reponses_ = quiz_stats.get("nb_reponses_", 0)
    nb_reponses_fausses = quiz_stats.get("nb_reponses_fausses", 0)

    if nb_reponses_ > 10 and (nb_reponses_fausses / nb_reponses_) > 0.7:
        return True
    return False
def reformulate_chapter(name):
    quiz_stats = get_quiz_statistics(name)
    if not quiz_stats:
        return {"error": "Quiz statistics not found"}, 404

    if not should_reformulate(quiz_stats):
        return {"error": "Conditions not met for reformulation"}, 400

    filepath = os.path.join(app.root_path, 'resources', f"{name}.pdf")
    if not os.path.exists(filepath):
        return {"error": "File Not Found"}, 404

    file_data = pdf_to_text(filepath)
    split_text = split_into_chunks(file_data, max_words_per_chunk)
    reformulated_text = gemini1.reform_text(split_text[0])  # Reformuler le premier chunk pour l'exemple

    # Stocker la reformulation dans un fichier
    with open(reformulation_file, 'w') as file:
        file.write(reformulated_text)

    return {"reformulated_text": reformulated_text}, 200


@app.route('/reformtext', methods=['POST'])
def reformtext():
    data = request.get_json()
    name = data.get("chapitre")
    if not name:
        return jsonify({"error": "No chapter name provided"}), 400

    response = reformulate_chapter(name)
    return jsonify(response)

@app.route('/get_reformulation', methods=['GET'])
def get_reformulation():
    if os.path.exists(reformulation_file):
        with open(reformulation_file, 'r') as file:
            reformulated_text = file.read()
        return jsonify({"reformulated_text": reformulated_text}), 200
    else:
        return jsonify({"error": "No reformulated text found"}), 404
    
@app.route('/check_conditions', methods=['POST'])
def check_conditions():
    data = request.get_json()
    name = data.get("chapitre")
    if not name:
        return jsonify({"error": "No chapter name provided"}), 400

    quiz_stats = get_quiz_statistics(name)
    if not quiz_stats:
        return jsonify({"error": "Quiz statistics not found"}), 404

    if should_reformulate(quiz_stats):
        return jsonify({"should_reformulate": True}), 200
    else:
        return jsonify({"should_reformulate": False}), 200
@app.route('/reformtext_default', methods=['GET'])
def reformtext_default():
    # Nom de chapitre par défaut
    default_chapter = "chap1"
    response = reformulate_chapter(default_chapter)
    return jsonify(response)
def parse_recommendation(text):
    # Extract question
    question_match = re.search(r"## Question:\n\n(.*)", text)
    question = question_match.group(1) if question_match else ''
    # Extract responses
    responses_match = re.findall(r"\n([A-D]): (.*)", text)
    responses = [resp[1] for resp in responses_match] if responses_match else ['', '', '', '']

    # Extract correct answer
    correct_answer_match = re.search(r"##Right answer: ([A-D])\*\*", text)
    correct_answer_index = ord(correct_answer_match.group(1)) - 65 if correct_answer_match else -1
    correct_answer = responses[correct_answer_index]

    # Construct the JSON object
    recommendation_data = {
        'question': question,
        'reponses': responses,
        'reponse_correcte': correct_answer,
        'chapitre': ''  # Assuming you will fill this from the formData.chapitre
    }
    print(recommendation_data)

    return recommendation_data

def split_into_chunks(text, max_words):
    words = text.split()
    chunks = []
    current_chunk = []
    for word in words:
        current_chunk.append(word)
        if len(current_chunk) == max_words:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    return chunks

def pdf_to_text(pdf_path):
    try:
        if pdf_path:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ''
                for page_number in range(len(reader.pages)):
                    page = reader.pages[page_number]
                    text += page.extract_text()
                return text
        else:
            return "NO INFO FOUND !"
    except Exception as e:
        print(f"Error reading Requirements: {e}")
        return ""

if __name__ == '__main__':
    # Exécutez la reformulation pour le chapitre "chap1" automatiquement
    default_chapter = "chap1"
    reformulate_chapter(default_chapter)

    # Démarrer l'application Flask
    app.run(port=200, debug=True)