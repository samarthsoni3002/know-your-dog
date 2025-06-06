from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings 
from langchain.chains import RetrievalQA
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import torch 


embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vectorstore = FAISS.load_local("app/vector_index",embedding_model, allow_dangerous_deserialization=True)

retriever = vectorstore.as_retriever(search_kwargs={"k":3})

qa_pipeline = pipeline(
    "text2text-generation",
    model="google/flan-t5-base", 
    tokenizer="google/flan-t5-base",
    max_length=512,
    truncation=True
)

def get_dog_info(breed_name:str) -> str: 
    
    docs = retriever.get_relevant_documents(breed_name) 
    
    context = "\n".join([doc.page_content for doc in docs])
    
    prompt = f"Use the following information to answer the question:\n{context}\n\nQuestion: Tell me about the {breed_name} dog breed."

    result = qa_pipeline(prompt)[0]["generated_text"]
    
    return result