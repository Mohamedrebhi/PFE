from flask import Flask, jsonify
from pymongo import MongoClient
import openai
import PyPDF2
import io
from bson.binary import Binary

app = Flask(__name__)

# MongoDB connection
mongo_uri = "mongodb://localhost:27017"  # Replace with your actual URI
client = MongoClient(mongo_uri)
db = client["Users"]  # Replace with your database name
chapters_collection = db["chapitres"]  # Collection for chapters

# Set OpenAI API key directly
openai.api_key = "your_openai_api_key"  # Replace with your actual OpenAI API key

def extract_text_from_pdf(pdf_binary):
    """Extract text from PDF binary data."""
    pdf_bytes = io.BytesIO(pdf_binary)
    pdf_reader = PyPDF2.PdfReader(pdf_bytes)
    text = []
    for page in pdf_reader.pages:
        text.append(page.extract_text())
    return "\n".join(text)

def generate_response(prompt):
    """Use OpenAI API to generate a response based on the prompt."""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Ensure you are using a model that supports this endpoint
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.5
    )
    return response['choices'][0]['message']['content'].strip()

@app.route('/get_reformulation/<string:chapitre>', methods=['GET'])
def get_reformulation(chapitre):
    """Get reformulation for the specified chapter using RAG."""
    chapter_data = chapters_collection.find_one({"Name": chapitre})
    
    if not chapter_data or 'Content' not in chapter_data:
        return jsonify({"error": "Chapter not found or no content available."}), 404
    
    # Access the binary content directly
    pdf_binary = chapter_data['Content']  # Direct access to binary data

    # Extract text from the PDF content
    text = extract_text_from_pdf(pdf_binary)

    # Prepare the prompt for OpenAI
    prompt = f"Reformulate the following text to make it easier to understand:\n\n{text}"

    # Generate the reformulated text using OpenAI
    reformulated_text = generate_response(prompt)

    return jsonify({"reformulated_text": reformulated_text})

if __name__ == '__main__':
    app.run(debug=True, port=4002)