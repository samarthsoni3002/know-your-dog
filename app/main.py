from fastapi import FastAPI 
from app.api.routes import router 
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title = "Know Your Dog API",
    description = "Detect dog breed and get info about it.",
    version = "1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

