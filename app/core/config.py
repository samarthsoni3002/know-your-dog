from pydantic_settings import BaseSettings
from dotenv import load_dotenv 
import os 

load_dotenv() 

class Settings:
    MODEL_PATH = os.getenv("MODEL_PATH")
    CHUNKS_FILE = os.getenv("CHUNKS_FILE")
    INDEX_FILE = os.getenv("INDEX_FILE")
    MODEL_ID = os.getenv("MODEL_ID")
    HF_TOKEN: str = os.getenv("HF_TOKEN")
    assert HF_TOKEN is not None, "❌ HF_TOKEN not found in .env"

settings = Settings()
