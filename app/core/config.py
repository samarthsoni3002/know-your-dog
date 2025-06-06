from pydantic import BaseSettings 


class Settings(BaseSettings):
    model_path: str 
    rag_api_url: str 
    rag_api_key: str 
    
class Config: 
    env_file = ".env"
    
settings = Settings() 
