import face_recognition
import numpy as np
from PIL import Image
import io

def image_bytes_to_embedding(image_bytes):
    # Load image from bytes
    image = face_recognition.load_image_file(io.BytesIO(image_bytes))
    # detect face encodings
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return None
    # return first face's encoding (128D)
    return encodings[0].tolist()

def embedding_distance(a, b):
    a = np.array(a)
    b = np.array(b)
    return float(np.linalg.norm(a - b))
