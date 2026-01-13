# Finding Missing Person — FastAPI + React

This repository is a FastAPI backend + React frontend reimplementation of the "Finding missing person using AI" idea.

Features
- Register missing persons (image + metadata)
- Search by image — returns nearest face matches
- Simple React UI for registering and searching

Quick start (dev)
1. Backend:
   - cd backend
   - python -m venv venv && source venv/bin/activate
   - pip install -r requirements.txt
   - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

2. Frontend:
   - cd frontend
   - npm install
   - npm run dev

Docker (recommended for reproducible environment)
- docker-compose up --build
- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Notes
- This prototype uses the `face_recognition` library for embeddings (dlib). If you can't install dlib locally, use Docker to avoid build issues.
- For production, store images and embeddings in cloud storage and use a vector DB for similarity search.
