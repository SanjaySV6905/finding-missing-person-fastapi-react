from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.types import JSON
from .database import Base

class MissingPerson(Base):
    __tablename__ = "missing_persons"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image_path = Column(String(300), nullable=False)
    embedding = Column(Text, nullable=False)  # store embedding as JSON string
