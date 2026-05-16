from pydantic_settings import BaseSettings
from dotenv import load_dotenv 
import os 

load_dotenv(override=True) 

class Settings:
    MODEL_PATH = os.getenv("MODEL_PATH")
    CHUNKS_FILE = os.getenv("CHUNKS_FILE")
    INDEX_FILE = os.getenv("INDEX_FILE")
    MODEL_ID = os.getenv("MODEL_ID")
    HF_API_URL = os.getenv(
        "HF_API_URL",
        "https://router.huggingface.co/v1/chat/completions",
    )
    HF_TOKEN: str = os.getenv("HF_TOKEN")
    assert HF_TOKEN is not None, "HF_TOKEN not found in .env"

settings = Settings()
