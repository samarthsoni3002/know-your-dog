import requests
from app.core.config import settings

headers = {
    "Authorization": f"Bearer {settings.HF_TOKEN}",
    "Content-Type": "application/json",
}

def generate_answer(prompt: str) -> str:
    payload = {
        "model": settings.MODEL_ID,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
    }

    response = requests.post(settings.HF_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        print("API Error:", response.status_code, response.text)
        return "Sorry, something went wrong while generating the answer."

    data = response.json()
    return data.get("choices", [{}])[0].get("message", {}).get("content", "No answer generated.")
