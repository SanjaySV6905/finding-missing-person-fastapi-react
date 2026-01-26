import os
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, SessionLocal
from .embeddings import image_bytes_to_embedding, embedding_distance
import shutil
import json
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Missing Person Finder (FastAPI)")

# CORS - allow the frontend dev server (adjust origin as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # for quick testing you can use ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ensure data folders
os.makedirs("data/images", exist_ok=True)

# mount static images
app.mount("/images", StaticFiles(directory="data/images"), name="images")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/missing", response_model=schemas.MissingOut)
async def register_missing(
    name: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    contents = await file.read()
    embedding = image_bytes_to_embedding(contents)
    if embedding is None:
        raise HTTPException(status_code=400, detail="No face detected in the uploaded image")
    # save image
    filename = f"{int(os.times().system)}_{file.filename.replace(' ', '_')}"
    save_path = os.path.join("data/images", filename)
    with open(save_path, "wb") as f:
        f.write(contents)
    person = crud.create_missing(db, name=name, description=description, image_path=f"/images/{filename}", embedding=embedding)
    return person

@app.get("/api/missing", response_model=List[schemas.MissingOut])
def list_missing(db: Session = Depends(get_db)):
    return crud.get_all_missing(db)

@app.get("/api/missing/{person_id}", response_model=schemas.MissingOut)
def get_missing(person_id: int, db: Session = Depends(get_db)):
    person = crud.get_missing(db, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Not found")
    return person

@app.post("/api/search", response_model=List[schemas.SearchMatch])
async def search_by_image(file: UploadFile = File(...), top_k: int = 5, db: Session = Depends(get_db)):
    contents = await file.read()
    query_embedding = image_bytes_to_embedding(contents)
    if query_embedding is None:
        raise HTTPException(status_code=400, detail="No face detected")
    # load all embeddings
    persons = crud.get_all_missing(db)
    results = []
    for p in persons:
        emb = json.loads(p.embedding)
        score = embedding_distance(query_embedding, emb)
        results.append((score, p))
    results.sort(key=lambda x: x[0])
    matches = []
    for score, p in results[:top_k]:
        matches.append(
            schemas.SearchMatch(
                id=p.id,
                name=p.name,
                description=p.description,
                image_path=p.image_path,
                score=score
            )
        )
    return matches