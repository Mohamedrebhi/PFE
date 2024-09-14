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
from fpdf import FPDF
import io
import random
from datetime import datetime
from htmlTemplate import css

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

def extract_text_from_pdf(pdf_content):
    """Extract text from a PDF using PyPDF2."""
    try:
        pdf_reader = PdfReader(io.BytesIO(pdf_content))
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            extracted_text = page.extract_text()
            if extracted_text:
                text += extracted_text
            else:
                st.warning(f"Failed to extract text from page {i + 1}. Page might be empty or contain non-text elements.")
        return text
    except Exception as e:
        st.error(f"Error while reading PDF: {e}")
        return None

def generate_quiz(knowledge_base, question_limit=5):
    """Generate a specified number of questions with options based on the PDF content."""
    questions = []
    
    for _ in range(question_limit):
        docs = knowledge_base.similarity_search("Extract relevant information for question generation.")
        if docs:
            llm = OpenAI()
            chain = load_qa_chain(llm, chain_type="stuff")
            with get_openai_callback() as cb:
                response = chain.run(
                    input_documents=docs,
                    question="Based on the provided content, generate a detailed question with one correct answer and three plausible incorrect options. The question should directly relate to the main ideas or facts discussed."
                )
                
                question, options = parse_generated_response(response)
                
                questions.append({
                    "question": question,
                    "responses": options,
                    "correct": options[0]  # Assuming the first option is the correct one
                })
                print(cb)
    
    return questions

def parse_generated_response(response):
    """Parse the response to extract question and options."""
    lines = response.strip().split('\n')
    question = lines[0]
    options = lines[1:]

    # Ensure there are 4 options; pad if necessary
    if len(options) < 4:
        options += ["Option " + str(i) for i in range(len(options) + 1, 5)]
    
    random.shuffle(options)  # Shuffle options to mix the correct answer
    
    return question, options

def save_exam_to_mongodb(exam_data):
    """Save the exam data to MongoDB."""
    mongo_uri = "mongodb://localhost:27017"
    client = MongoClient(mongo_uri)
    
    db = client["Users"]
    exams_collection = db["Examens"]
    
    # Insert the exam data into the MongoDB collection
    exams_collection.insert_one(exam_data)
    st.success("Exam saved successfully in the database.")

def generate_pdf(exam_data):
    """Generate a PDF file of the exam."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Add the exam details
    pdf.cell(200, 10, txt=f"Exam Name: {exam_data['name']}", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Subject: {exam_data['subject']}", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Professor: {exam_data['ProfessorID']}", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Duration: {exam_data['duration']} minutes", ln=True, align='C')
    pdf.cell(200, 10, txt=f"Max Score: {exam_data['maxScore']}", ln=True, align='C')
    pdf.ln(10)
    
    # Add each question
    for i, question_data in enumerate(exam_data['additionalQuestions'], 1):
        pdf.cell(200, 10, txt=f"Q{i}: {question_data['question']}", ln=True, align='L')
        for j, option in enumerate(question_data['responses']):
            pdf.cell(200, 10, txt=f"{chr(65+j)}. {option}", ln=True, align='L')
        pdf.cell(200, 10, txt=f"Correct Answer: {question_data['correct']}", ln=True, align='L')
        pdf.ln(5)
    
    # Save the PDF
    pdf_output = io.BytesIO()
    pdf.output(pdf_output, 'F')
    pdf_output.seek(0)
    
    # Return the PDF content as binary
    return pdf_output.read()

def main():
    load_dotenv()
    st.set_page_config(page_title="Exam Generator", page_icon="📄")
    
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
    
    st.header("Exam Generator  📄")

    # User input to search for the PDFs by names
    pdf_names = st.text_area("Enter the names of the Chapters (comma-separated):")
    professor_name = st.text_input("Enter the Professor's Name:")
    exam_name = st.text_input("Enter the Exam Name:")
    subject = st.text_input("Enter the Subject:")
    duration = st.number_input("Enter the Duration (in minutes):", min_value=1, max_value=300)
    max_score = st.number_input("Enter the Max Score:", min_value=1, max_value=100)

    if st.button("Generate Exam"):
        if pdf_names and professor_name and exam_name and subject:
            chapter_names = [name.strip() for name in pdf_names.split(",")]
            pdfs = fetch_pdfs_and_courses_from_mongodb(chapter_names)
            all_generated_questions = []
            selected_quizzes = []

            for pdf_content, course_name in pdfs:
                st.write(f"This chapter is from the course: {course_name}")
                
                # Extract text from PDF
                text = extract_text_from_pdf(pdf_content)
                
                if not text:
                    st.error("No text was extracted from the PDF. Please check the PDF content.")
                    return
                
                # Split into chunks
                text_splitter = CharacterTextSplitter(
                    separator="\n",
                    chunk_size=2500,
                    chunk_overlap=300,
                    length_function=len
                )
                chunks = text_splitter.split_text(text)
                
                if not chunks:
                    st.error("No chunks were created from the PDF. Please check the PDF content.")
                    return
                
                # Create embeddings
                embeddings = OpenAIEmbeddings()
                try:
                    knowledge_base = FAISS.from_texts(chunks, embeddings)
                except IndexError as e:
                    st.error(f"Error in generating embeddings: {e}")
                    return
                
                # Generate quiz questions
                generated_questions = generate_quiz(knowledge_base, question_limit=5)
                all_generated_questions.extend(generated_questions)
                selected_quizzes.append(course_name)
            
            # Prepare exam data
            exam_data = {
                "ProfessorID": professor_name,
                "name": exam_name,
                "subject": subject,
                "duration": duration,
                "selectedQuizzes": selected_quizzes,
                "additionalQuestions": all_generated_questions,
                "examenDate": datetime.now(),
                "maxScore": max_score,
                "content": None  # Will be filled with PDF content later
            }
            
            # Generate and save PDF as binary data
            pdf_content = generate_pdf(exam_data)
            exam_data["content"] = pdf_content
            
            # Save to MongoDB
            save_exam_to_mongodb(exam_data)
            
            st.success("Exam generated successfully!")
            
            # Display the PDF content
            st.download_button("Download Exam PDF", data=pdf_content, file_name="exam.pdf")
        else:
            st.error("Please fill in all required fields.")
    
if __name__ == "__main__":
    main()
