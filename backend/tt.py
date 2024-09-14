import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.llms import OpenAI
from pymongo import MongoClient
from bson import ObjectId
import io
import streamlit.components.v1 as components

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
                st.error(f"Error retrieving course: {e}")
        
        return pdf_content, course_name
    else:
        st.error(f"No PDF found with the name {pdf_name}.")
        return None, None

def reformulate_text(text_chunks):
    """Reformulate the text chunks to be more detailed and easier to understand."""
    llm = OpenAI()  # Use OpenAI LLM for text reformulation
    reformulated_text = ""
    
    for chunk in text_chunks:
        reformulated_chunk = llm(prompt=f"Please rewrite the following text to be more detailed and easier to understand:\n\n{chunk}")
        reformulated_text += reformulated_chunk + "\n\n"
    
    return reformulated_text

def main():
    load_dotenv()
    st.set_page_config(page_title="Chapter Reformulator", page_icon="📄")
    
    
    st.header("Chapter Reformulator 📄")

    # User input to search for the PDF by name
    pdf_name = st.text_input("Enter the name of the Chapter:")
    
    if pdf_name:
        pdf_content, course_name = fetch_pdf_and_course_from_mongodb(pdf_name)
        
        if pdf_content:
            st.write(f"This chapter is from the course: {course_name}")
            
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
            
            # Reformulate text chunks
            reformulated_text = reformulate_text(chunks)
            
            # Display reformulated text
            st.subheader("Reformulated Chapter Content")
            st.write(reformulated_text)

if __name__ == '__main__':
    main()
