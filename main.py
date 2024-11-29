from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import sys
from pydantic import BaseModel
import canvas_api
from openai_api import router as openai_router  # Import the router

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# CORS setup


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sahilsaoji.github.io", "https://eagletask.onrender.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Content-Disposition"],
)

'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
'''

# Log incoming requests
@app.middleware("http")
async def log_requests(request, call_next):
    logging.info(f"Request: {request.method} {request.url}")
    logging.info(f"Headers: {request.headers}")
    logging.info(f"Origin: {request.headers.get('origin', 'No Origin')}")
    
    if request.method == "OPTIONS":
        logging.info("Handling CORS preflight request.")
    
    response = await call_next(request)
    logging.info(f"Response status: {response.status_code}")
    return response



# Include the OpenAI router
app.include_router(openai_router)

class CanvasAPIKey(BaseModel):
    api_key: str

# Root endpoint
@app.get("/")
async def root():
    logging.info("Root endpoint accessed")
    return {"message": "Hello, FastAPI!"}

# Validate the api key by creating a new canvas instance with it 
@app.post("/validate-api-key")
async def validate_api_key(data: CanvasAPIKey):
    logging.info(f"Validating API Key: {data.api_key}")
    try:
        canvas = canvas_api.get_canvas_instance(data.api_key)
        user = canvas.get_current_user()
        return {"message": "API Key is valid", "user": user.id}
    except Exception as e:
        logging.error("Failed to validate API Key", exc_info=True)
        raise HTTPException(status_code=401, detail="Invalid API Key")

# API endpoint to fetch courses and graded assignments for Grades Page 
@app.post("/get-courses-with-graded-assignments")
async def get_courses_with_graded_assignments(data: CanvasAPIKey):
    logging.info(f"Fetching courses and graded assignments for API Key: {data.api_key}")
    try:
        courses = canvas_api.get_courses(data.api_key)
        courses_with_graded_assignments = []

        for course in courses:
            course_name = getattr(course, 'name', 'Unnamed Course')
            logging.info(f"Processing course: {course_name} (ID: {course.id})")
            
            graded_assignments = canvas_api.get_graded_assignments(data.api_key, course.id)
            
            if graded_assignments:
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

        logging.info(str(courses_with_graded_assignments))
        return {"courses_with_graded_assignments": courses_with_graded_assignments}

    except Exception as e:
        logging.error("Failed to fetch courses and graded assignments", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


