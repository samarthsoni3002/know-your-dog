from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image 
import io 
from app.services.breed_model import predict_breed
from app.services.rag_model import get_dog_info

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
    response = get_dog_info(breed)
    return {"breed":breed, "info":response}



