import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback
from pymongo import MongoClient
from bson import ObjectId
import io
import random

def fetch_pdfs_and_courses_from_mongodb(chapter_names):
    """Fetch PDF content and associated course names by chapter names from MongoDB."""
    mongo_uri = "mongodb://localhost:27017"
    client = MongoClient(mongo_uri)
    
    db = client["Users"]
    chapters_collection = db["chapitres"]
    courses_collection = db["Cours"]
    
    pdfs = []
    
    for pdf_name in chapter_names:
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
                    st.error(f"Error retrieving course: {e}")
            
            pdfs.append((pdf_content, course_name))
        else:
            st.error(f"No PDF found with the name {pdf_name}.")
    
    return pdfs

def generate_quiz(knowledge_base, question_limit=5):
    """Generate a specified number of questions with options based on the PDF content."""
    questions = []
    
    for _ in range(question_limit):
        docs = knowledge_base.similarity_search("Generate a question and four options based on the content.")
        if docs:
            llm = OpenAI()
            chain = load_qa_chain(llm, chain_type="stuff")
            with get_openai_callback() as cb:
                response = chain.run(input_documents=docs, question="Generate a question with one correct answer and three incorrect options.")
                
                question, options = parse_generated_response(response)
                
                questions.append({
                    "question": question,
                    "options": options,
                    "correct": options[0]  # Assuming the first option is the correct one
                })
                print(cb)
    
    return questions

def parse_generated_response(response):
    """Parse the response to extract question and options."""
    lines = response.strip().split('\n')
    question = lines[0]
    options = lines[1:]

    if len(options) < 4:
        options += ["Option " + str(i) for i in range(len(options) + 1, 5)]
    
    random.shuffle(options)  # Shuffle options to mix the correct answer
    
    return question, options

def fetch_additional_questions():
    """Fetch additional questions from MongoDB."""
    mongo_uri = "mongodb://localhost:27017"
    client = MongoClient(mongo_uri)
    db = client["Users"]
    questions_collection = db["Quiz"]
    
    additional_questions = list(questions_collection.find().limit(15))
    return additional_questions

def save_questions_to_mongodb(questions, chapter_name):
    """Save generated questions to the MongoDB 'Quiz' collection."""
    mongo_uri = "mongodb://localhost:27017"
    client = MongoClient(mongo_uri)
    db = client["Users"]
    quiz_collection = db["Quiz"]
    
    for q in questions:
        quiz_collection.insert_one({
            "question": q["question"],
            "responses": q["options"],
            "correct_response": q["correct"],
            "chaptername": chapter_name
        })

def main():
    load_dotenv()
    st.set_page_config(page_title="Quiz Generator from PDFs", page_icon="📄")
    
    st.markdown("""
        <style>
        .reportview-container {
            background-color: #ffffff; /* White background */
        }
        .sidebar .sidebar-content {
            background-color: #ffffff; /* White background for sidebar */
        }
        .stButton > button {
            background-color: #007bff; /* Blue background for buttons */
            color: white;
        }
        .stButton > button:hover {
            background-color: #0056b3; /* Darker blue on hover */
        }
        </style>
        """, unsafe_allow_html=True)
    
    st.header("Quiz Generator from PDFs 📄")

    # User input to search for the PDFs by names
    pdf_names = st.text_area("Enter the names of the PDFs (comma-separated):")
    
    if pdf_names:
        chapter_names = [name.strip() for name in pdf_names.split(",")]
        pdfs = fetch_pdfs_and_courses_from_mongodb(chapter_names)
        
        for pdf_content, course_name in pdfs:
            st.write(f"This chapter is from the course: {course_name}")
            
            # Read PDF content from binary
            pdf_reader = PdfReader(io.BytesIO(pdf_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            # Split into chunks
            text_splitter = CharacterTextSplitter(
                separator="\n",
                chunk_size=1000,
                chunk_overlap=50,
                length_function=len
            )
            chunks = text_splitter.split_text(text)
            
            # Create embeddings
            embeddings = OpenAIEmbeddings()
            knowledge_base = FAISS.from_texts(chunks, embeddings)
            
            # Generate quiz questions
            generated_questions = generate_quiz(knowledge_base, question_limit=5)
            
            # Fetch additional questions to make a total of 20
            additional_questions = fetch_additional_questions()
            for q in additional_questions:
                generated_questions.append({
                    "question": q.get("Question", "No question text"),
                    "options": q.get("Options", ["Option 1", "Option 2", "Option 3"]),
                    "correct": q.get("Correct", "No correct answer")
                })
            
            # Save questions to MongoDB
            save_questions_to_mongodb(generated_questions, pdf_names)
            
            # Display questions
            st.subheader("Generated Quiz Questions")
            for i, q in enumerate(generated_questions, 1):
                st.write(f"{i}. {q['question']}")
                for option in q['options']:
                    st.write(f" - {option}")
                st.write(f"   Correct Answer: {q['correct']}")

if __name__ == '__main__':
    main()