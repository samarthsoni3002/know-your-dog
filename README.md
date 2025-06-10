# 🐶 Know Your Dog – Full Stack ML Application

**Know Your Dog** is a full-stack machine learning application that combines Computer Vision and Natural Language Processing to give users intelligent insights about dog breeds.

Upload a picture of a dog to:

- 🧠 Detect its breed using a CNN-based image classifier
- 📚 Retrieve detailed information using a RAG-powered NLP pipeline
- (Coming Soon) 💬 Ask follow-up questions via chatbot
- (Coming Soon) 🏥 View shelters/NGOs where this breed is available

---

## 🖼️ Demo Preview

### 🔻 Upload and Detect Flow

![upload preview]("./image.png")

---

## 🚀 Tech Stack Overview

| Layer        | Tools Used                             |
| ------------ | -------------------------------------- |
| 🧠 ML Engine | PyTorch, Custom CNN, RAG for NLP       |
| ⚙️ Backend   | FastAPI, Pydantic, Uvicorn             |
| 🎨 Frontend  | React, Tailwind CSS                    |
| 🌐 API Comm  | REST API (file upload + JSON response) |

---

## 🔁 How It Works

1. 🖼️ User uploads a dog image from the UI
2. 📡 React sends a POST request to `/predict`
3. ⚙️ FastAPI:
   - Loads and processes the image
   - Predicts breed using CNN
   - Uses NLP module (RAG) to find breed info
4. 📩 Frontend displays result dynamically

---

## 🧠 Machine Learning Details

### 🐕 Dog Breed Classifier (CV)

- Fine-tuned **ResNet** architecture on a curated dog breed dataset
- Image preprocessing and inference handled in FastAPI backend
- Outputs breed name from a real-world photo

- Trained on curated dog image dataset
- CNN-based architecture (custom or ResNet)
- Outputs breed name from photo

### 📚 RAG Pipeline (NLP)

- Implements Retrieval-Augmented Generation to provide contextual info for detected breed
- Uses a local vector store to retrieve relevant passages
- Generates natural language answers using a fine-tuned language model (FLAN-T5)
- Integrated as a FastAPI route for dynamic response

- Retrieves breed info using vector search

---

## 📦 Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## ⚙️ Running the Backend

```bash
cd app
uvicorn main:app --reload
```

Runs on: `http://127.0.0.1:8000`

---

## ✅ Next Steps

- [ ] Add chatbot UI to frontend
- [ ] Connect chatbot to backend RAG model
- [ ] Add NGO/shelter data section

---

## 👨‍💻 Author

Made by **Samarth**  
Full-stack ML application built with ❤️ using modern tools.
