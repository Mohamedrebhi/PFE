from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import base64
from io import BytesIO
from PyPDF2 import PdfReader
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['Users']
collection = db['chapitres']

def fetch_pdf_content(chapter_name):
    # Retrieve the document from the database
    chapitre = collection.find_one({'Name': chapter_name})
    if not chapitre:
        raise ValueError("Chapter not found in the database.")
    
    # Decode the PDF content from base64
    pdf_content = chapitre['Content']
    try:
        return base64.b64decode(pdf_content)
    except Exception as e:
        raise ValueError("Error decoding PDF content: " + str(e))

def extract_text_from_pdf(pdf_bytes):
    try:
        # Read the PDF content
        pdf_reader = PdfReader(BytesIO(pdf_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        raise ValueError("Error reading PDF content: " + str(e))

def generate_quiz(pdf_content):
    try:
        response = requests.post(
            'https://fumes-api.onrender.com/llama3',
            json={
                'prompt': f"""{{ 
                    'systemPrompt': 'You are an expert in creating educational content.', 
                    'user': 'Based on the following PDF content, generate a 20-question quiz with answers: {pdf_content}',
                    'Assistant': 'Certainly! Here is a 20-question quiz based on the PDF content:'
                }}""",
                "temperature": 0.75,
                "topP": 0.9,
                "maxTokens": 600
            },
            stream=True
        )
        
        quiz_content = ""
        for chunk in response.iter_content(chunk_size=1024):  
            if chunk:
                quiz_content += chunk.decode('utf-8')
        
        return quiz_content
    except Exception as e:
        raise ValueError("Error generating quiz: " + str(e))

def simplify_content(pdf_content):
    try:
        response = requests.post(
            'https://fumes-api.onrender.com/llama3',
            json={
                'prompt': f"""{{ 
                    'systemPrompt': 'You are a teacher with a talent for simplifying complex topics.', 
                    'user': 'Simplify the following PDF content so that it is easily understandable by any student: {pdf_content}',
                    'Assistant': 'Of course! Here is a simplified explanation of the content:'
                }}""",
                "temperature": 0.75,
                "topP": 0.9,
                "maxTokens": 600
            },
            stream=True
        )
        
        simplified_content = ""
        for chunk in response.iter_content(chunk_size=1024):  
            if chunk:
                simplified_content += chunk.decode('utf-8')
        
        return simplified_content
    except Exception as e:
        raise ValueError("Error simplifying content: " + str(e))

@app.route('/generate_quiz', methods=['POST'])
def api_generate_quiz():
    try:
        data = request.json
        chapter_name = data.get('chapterName')

        # Find the chapter by name
        chapitre = collection.find_one({'Name': chapter_name})
        if not chapitre:
            raise ValueError("Chapter not found in the database.")
        
        # Fetch and process the PDF
        pdf_bytes = fetch_pdf_content(chapter_name)
        pdf_text = extract_text_from_pdf(pdf_bytes)

        # Ensure the PDF text content is ASCII
        pdf_text = pdf_text.encode('ascii', 'ignore').decode('ascii')

        # Generate quiz and simplified content
        quiz = generate_quiz(pdf_text)
        simplified = simplify_content(pdf_text)

        return jsonify({
            'quiz': quiz,
            'simplified_content': simplified
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(port=4002, debug=True)
