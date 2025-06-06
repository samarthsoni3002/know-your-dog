from fastapi import FastAPI 
from app.api.routes import router 


app = FastAPI(
    title = "Know Your Dog API",
    description = "Detect dog breed and get info about it.",
    version = "1.0.0"
)


app.include_router(router)

