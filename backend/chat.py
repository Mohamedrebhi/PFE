import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from pymongo import MongoClient
import io
from htmlTemplate import css, bot_template, user_template

def fetch_pdf_by_chapter_name(chapter_name):
    """Fetch a single PDF by chapter name from MongoDB."""
    mongo_uri = "mongodb://localhost:27017"
    client = MongoClient(mongo_uri)
    
    db = client["Users"]
    chapters_collection = db["chapitres"]
    
    # Fetch the chapter by name
    chapter_doc = chapters_collection.find_one({"Name": chapter_name})
    
    if chapter_doc:
        pdf_content = chapter_doc["Content"]
        return io.BytesIO(pdf_content)
    else:
        st.error(f"No chapter found with the name {chapter_name}.")
        return None

def get_pdf_text(pdf_doc):
    text = ""
    if pdf_doc:
        pdf_reader = PdfReader(pdf_doc)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=2500,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore

def get_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(
        memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

def handle_userinput(user_question):
    response = st.session_state.conversation({'question': user_question})
    st.session_state.chat_history = response['chat_history']

    for i, message in enumerate(st.session_state.chat_history):
        if i % 2 == 0:
            st.write(user_template.replace(
                "{{MSG}}", message.content), unsafe_allow_html=True)
        else:
            st.write(bot_template.replace(
                "{{MSG}}", message.content), unsafe_allow_html=True)

def main():
    load_dotenv()
    st.set_page_config(page_title="Chat with Your Chapter",
                       page_icon=":books:")
    st.write(css, unsafe_allow_html=True)

    if "conversation" not in st.session_state:
        st.session_state.conversation = None
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = None

    st.header("Chat with Your Chapter :books:")

    chapter_name = st.text_input("Enter chapter name:")
    if chapter_name:
        if st.button("Process"):
            with st.spinner("Processing"):
                # Fetch PDF by chapter name
                pdf_doc = fetch_pdf_by_chapter_name(chapter_name)
                if not pdf_doc:
                    return
                
                # Extract text from the PDF
                raw_text = get_pdf_text(pdf_doc)

                # Get the text chunks
                text_chunks = get_text_chunks(raw_text)

                # Create vector store
                vectorstore = get_vectorstore(text_chunks)

                # Create conversation chain
                st.session_state.conversation = get_conversation_chain(vectorstore)

    user_question = st.text_input("Ask a question about your chapter:")
    if user_question:
        handle_userinput(user_question)

if __name__ == '__main__':
    main()
