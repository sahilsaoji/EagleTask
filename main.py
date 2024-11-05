from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
import canvas_api

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CanvasAPIKey(BaseModel):
    api_key: str

@app.get("/")
async def root():
    logging.info("Root endpoint accessed")
    return {"message": "Hello, FastAPI!"}

@app.post("/get-courses-with-graded-assignments")
async def get_courses_with_graded_assignments(data: CanvasAPIKey):
    logging.info(f"Fetching courses and graded assignments for API Key: {data.api_key}")
    try:
        courses = canvas_api.get_courses(data.api_key)
        courses_with_graded_assignments = []

        for course in courses:
            graded_assignments = canvas_api.get_graded_assignments(data.api_key, course.id)
            course_details = {
                "course_name": course.name,
                "graded_assignments": graded_assignments
            }
            courses_with_graded_assignments.append(course_details)
            logging.info(f"Fetched graded assignments for course ID: {course.id}")

        return {"courses_with_graded_assignments": courses_with_graded_assignments}
    except Exception as e:
        logging.error("Failed to fetch courses and graded assignments", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

