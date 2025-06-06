from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image 
import io 
from app.services.breed_model import predict_breed

router = APIRouter() 


@router.get("/")
async def root():
    return {"message": "Welcome to Know Your Dog API"}

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    breed = predict_breed(image)
    return {"breed":breed}