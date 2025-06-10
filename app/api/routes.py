from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image 
import io 
from app.services.breed_model import predict_breed
from app.services.rag_model import generate_answer
from app.services.prompt import build_prompt
from pydantic import BaseModel
from app.services.session_store import create_session, get_breed_for_session

router = APIRouter() 


@router.get("/")
async def root():
    return {"message": "Welcome to Know Your Dog API"}

@router.post("/predict")
async def predict_dog_breed(file: UploadFile = File(...)):
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
    
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, 
                            detail="Could not process the image.")
    try:
        breed = predict_breed(image)
    except Exception as e:
        raise HTTPException(status_code=500,
                            details="Error while making prediction")
    breed = breed.split("-")[1]
    prompt = build_prompt(f"Describe {breed}")
    response = generate_answer(prompt)
    
    session_id = create_session(breed)
    return {"breed":breed, "info":response,"session_id": session_id}

class ChatRequest(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    answer: str
    
@router.post("/chat")
async def chat(request: ChatRequest):
    question = request.message.strip()
    breed = get_breed_for_session(request.session_id)

    if not question:
        return {"response": "Please ask a valid question."}
    
    if not breed:
        return {"response": "Session expired or invalid. Please upload a dog image first."}


    combined = f"User is asking about a {breed}. Question: {question}"
    answer = generate_answer(combined)
    return {"response": answer}