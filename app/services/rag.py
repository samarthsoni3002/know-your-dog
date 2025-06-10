import faiss 
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from app.core.config import settings


embedder = SentenceTransformer("all-MiniLM-l6-v2")

with open(settings.CHUNKS_FILE, "rb") as f:
    texts = pickle.load(f)

index = faiss.read_index(settings.INDEX_FILE)


def search_knowledge_base(query: str, k: int=3) -> str: 
    
    query_embedding = embedder.encode([query])
    distances, indices = index.search(np.array(query_embedding), k)
    
    results = [] 
    
    for i in indices[0]:
        if i<len(texts):
            results.append(texts[i])
            
    return "\n---\n".join(results)