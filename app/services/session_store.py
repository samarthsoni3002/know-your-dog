import uuid

session_store = {}

def create_session(breed: str) -> str:
    session_id = str(uuid.uuid4())
    session_store[session_id] = breed
    return session_id

def get_breed_for_session(session_id: str) -> str | None:
    return session_store.get(session_id)
