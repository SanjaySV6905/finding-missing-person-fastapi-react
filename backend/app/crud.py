from sqlalchemy.orm import Session
from . import models
import json

def create_missing(db: Session, name: str, description: str, image_path: str, embedding):
    m = models.MissingPerson(
        name=name,
        description=description,
        image_path=image_path,
        embedding=json.dumps(embedding),
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

def get_all_missing(db: Session):
    return db.query(models.MissingPerson).all()

def get_missing(db: Session, id: int):
    return db.query(models.MissingPerson).filter(models.MissingPerson.id == id).first()
