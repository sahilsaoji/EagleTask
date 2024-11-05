from fastapi import FastAPI, Depends, HTTPException
from typing import Optional
from pydantic import BaseModel
from canvasapi import Canvas
import canvas_api 

app = FastAPI()

# Define a Pydantic model to receive the Canvas API key
class CanvasAPIKey(BaseModel):
    api_key: str

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI!"}

# Endpoint to get courses
@app.post("/get-courses")
async def get_courses(data: CanvasAPIKey):
    try:
        courses = canvas_api.get_courses(data.api_key)
        return {"courses": courses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to get assignments
@app.post("/get-assignments")
async def get_assignments(data: CanvasAPIKey):
    try:
        assignments = canvas_api.get_assignments(data.api_key)
        return {"assignments": assignments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to get modules
@app.post("/get-modules")
async def get_modules(data: CanvasAPIKey):
    try:
        modules = canvas_api.get_modules(data.api_key)
        return {"modules": modules}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to get grades
@app.post("/get-grades")
async def get_grades(data: CanvasAPIKey):
    try:
        grades = canvas_api.get_grades(data.api_key)
        return {"grades": grades}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Non-CanvasAPI endpoint example
@app.post("/question")
async def question(data: dict):
    # Implement logic for non-Canvas question-answering here
    return {"response": "Question handling logic here"}
