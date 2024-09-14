from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback
import io
import os

app = Flask(__name__)

# Load environment variables
load_dotenv()

def fetch_pdf_and_course_from_mongodb(pdf_name):
    """Fetch PDF content and associated course name by PDF name from MongoDB."""
    mongo_uri = "mongodb://localhost:27017"
    client = MongoClient(mongo_uri)
    
    db = client["Users"]
    chapters_collection = db["chapitres"]
    courses_collection = db["Cours"]
    
    # Fetch the PDF document by name
    pdf_doc = chapters_collection.find_one({"Name": pdf_name})
    
    if pdf_doc:
        pdf_content = pdf_doc["Content"]
        course_id_str = pdf_doc.get("CourseID")
        course_name = "Unknown Course"
        
        if course_id_str:
            try:
                course_id = ObjectId(course_id_str)
                course_doc = courses_collection.find_one({"_id": course_id})
                course_name = course_doc.get("Name") if course_doc else "Unknown Course"
            except Exception as e:
                return None, None, str(e)
        
        return pdf_content, course_name, None
    else:
        return None, None, f"No PDF found with the name {pdf_name}."

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    data = request.json
    pdf_name = data.get('pdf_name')
    
    if not pdf_name:
        return jsonify({"error": "PDF name is required"}), 400

    pdf_content, course_name, error = fetch_pdf_and_course_from_mongodb(pdf_name)
    
    if error:
        return jsonify({"error": error}), 500
    
    if not pdf_content:
        return jsonify({"error": "PDF content not found"}), 404
    
    # Read PDF content from binary
    pdf_reader = PdfReader(io.BytesIO(pdf_content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    
    # Split into chunks
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=2000,
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    
    # Create embeddings
    embeddings = OpenAIEmbeddings()
    knowledge_base = FAISS.from_texts(chunks, embeddings)
    
    user_question = "Generate a quiz question from the provided text."
    docs = knowledge_base.similarity_search(user_question)
    
    llm = OpenAI()
    chain = load_qa_chain(llm, chain_type="stuff")
    
    quiz = []
    with get_openai_callback() as cb:
        for i in range(5):
            response = chain.run(input_documents=docs, question=f"Generate a question for quiz {i+1}")
            quiz.append({
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
        "quiz_items": quiz
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
