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
            # Safely fetch the course name or use a placeholder if it's missing
            course_name = getattr(course, 'name', 'Unnamed Course')
            logging.info(f"Processing course: {course_name} (ID: {course.id})")
            
            graded_assignments = canvas_api.get_graded_assignments(data.api_key, course.id)
            
            if graded_assignments:  # Only add the course if there are graded assignments
                course_details = {
                    "course_name": course_name,
                    "graded_assignments": graded_assignments
                }
                courses_with_graded_assignments.append(course_details)
                logging.info(f"Added course {course_name} with graded assignments")
            else:
                logging.info(f"No graded assignments or access issues for course ID: {course.id}")

        if not courses_with_graded_assignments:
            logging.info("No courses with graded assignments were found.")
            return {"message": "No courses with graded assignments could be retrieved."}


        # Print the thing being returned
        returnObject = {"courses_with_graded_assignments": courses_with_graded_assignments}
        logging.info(str(returnObject))

        return returnObject

    except Exception as e:
        logging.error("Failed to fetch courses and graded assignments", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
