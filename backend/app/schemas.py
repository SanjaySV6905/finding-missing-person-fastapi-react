from pydantic import BaseModel
from typing import Optional, List

class MissingCreate(BaseModel):
    name: str
    description: Optional[str] = None

class MissingOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_path: str

    class Config:
        orm_mode = True

class SearchMatch(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_path: str
    score: float
