import os
import requests
from app.core.config import Settings as settings

API_URL = "https://router.huggingface.co/featherless-ai/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {settings.HF_TOKEN}",
}

def generate_answer(prompt: str) -> str:
    payload = {
         "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
        "messages": [{"role": "user", "content": prompt}]
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        print("API Error:", response.status_code, response.text)
        return "Sorry, something went wrong while generating the answer."

    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "No answer generated.")
