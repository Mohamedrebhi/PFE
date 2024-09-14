from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
import openai
import io
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.llms import OpenAI
from langchain_community.callbacks.manager import get_openai_callback
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.vectorstores import FAISS  # Correct import
from langchain.chains.question_answering import load_qa_chain
from bson import ObjectId
from flask_cors import CORS
import fpdf

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB setup
mongo_uri = "mongodb://localhost:27017"
client = MongoClient(mongo_uri)
db = client['Users']
chapitre_collection = db['chapitres']
cours_collection = db['Cours']
quiz_collection = db['Quiz']

# OpenAI setup
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/search_chapter', methods=['POST'])
def search_chapter():
    data = request.json
    chapter_name = data.get('chapter_name')

    if not chapter_name:
        return jsonify({"error": "Chapter name is required"}), 400

    chapitre = chapitre_collection.find_one({"Name": chapter_name})

    if not chapitre:
        return jsonify({"error": "Chapter not found"}), 404

    course_id_str = chapitre.get('CourseID')
    course_name = 'Unknown Course'

    if course_id_str:
        try:
            course_id = ObjectId(course_id_str)
            course = cours_collection.find_one({"_id": course_id})
            course_name = course.get('Name', 'Unknown Course')
        except Exception as e:
            return jsonify({"error": f"Error retrieving course: {e}"}), 500

    return jsonify({
        "message": f"The chapter '{chapter_name}' is in the course '{course_name}'.",
        "chapter_id": str(chapitre['_id']),
        "content": str(chapitre['Content'])
    })

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    chapter_name = data.get('chapter_name')

    if not chapter_name:
        return jsonify({"error": "Chapter name is required"}), 400

    chapitre = chapitre_collection.find_one({"Name": chapter_name})

    if not chapitre:
        return jsonify({"error": "Chapter not found"}), 404

    pdf_content = chapitre['Content']
    course_id_str = chapitre.get('CourseID')
    course_name = 'Unknown Course'

    if course_id_str:
        try:
            course_id = ObjectId(course_id_str)
            course_doc = cours_collection.find_one({"_id": course_id})
            course_name = course_doc.get('Name') if course_doc else 'Unknown Course'
        except Exception as e:
            return jsonify({"error": f"Error retrieving course: {e}"}), 500

    pdf_reader = PdfReader(io.BytesIO(pdf_content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=2000,
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.split_text(text)

    embeddings = OpenAIEmbeddings()
    knowledge_base = FAISS.from_texts(chunks, embeddings)

    user_question = "Generate a quiz question from the provided text."
    docs = knowledge_base.similarity_search(user_question)
    llm = OpenAI()
    chain = load_qa_chain(llm, chain_type="stuff")
    
    quiz_items = []
    with get_openai_callback() as cb:
        for i in range(5):
            response = chain.run(input_documents=docs, question=f"Generate a question for quiz {i+1}")
            quiz_items.append({
                "question": response.strip(),
                "options": [
                    "Option 1",
                    "Option 2",
                    "Option 3"
                ],
                "correct_answer": "Option 1"
            })
    
    return jsonify({
        "course_name": course_name,
        "quiz_items": quiz_items
    })

def generate_pdf(quiz_data):
    pdf = fpdf.FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="Quiz", ln=True, align='C')
    for idx, item in enumerate(quiz_data):
        pdf.cell(200, 10, txt=f"Question {idx + 1}: {item['question']}", ln=True)
        for option_idx, option in enumerate(item['options']):
            pdf.cell(200, 10, txt=f"Option {chr(65 + option_idx)}: {option}", ln=True)
        pdf.cell(200, 10, txt=f"Correct Answer: {item['correct_answer']}", ln=True)
        pdf.cell(200, 10, txt="", ln=True)

    pdf_output = io.BytesIO()
    pdf.output(pdf_output)
    pdf_output.seek(0)
    return pdf_output

@app.route('/save_quiz', methods=['POST'])
def save_quiz():
    data = request.json
    chapter_name = data.get('chapter_name')
    quiz_items = data.get('quiz', [])

    if not chapter_name or not quiz_items:
        return jsonify({"error": "Chapter name and quiz data are required"}), 400

    try:
        for item in quiz_items:
            quiz_collection.insert_one({
                "Question": item['question'],
                "Reponses": item['options'],
                "Reponse_correcte": item['correct_answer'],
                "Chapitre": chapter_name,
            })

        pdf_output = generate_pdf(quiz_items)
        pdf_filename = f'{chapter_name}_quiz.pdf'
        pdf_path = os.path.join('pdfs', pdf_filename)
        with open(pdf_path, 'wb') as f:
            f.write(pdf_output.getvalue())

        return jsonify({"fileUrl": f'/pdfs/{pdf_filename}'})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pdfs/<path:filename>')
def serve_pdf(filename):
    return send_from_directory('pdfs', filename)

if __name__ == '__main__':
    if not os.path.exists('pdfs'):
        os.makedirs('pdfs')
    app.run(debug=True, port=1010)
