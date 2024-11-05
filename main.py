from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import canvas_api

app = FastAPI()

# Define Pydantic model for Canvas API key
class CanvasAPIKey(BaseModel):
    api_key: str

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI!"}

# Endpoint to get courses and their grades
@app.post("/get-courses-with-grades")
async def get_courses_with_grades(data: CanvasAPIKey):
    try:
        courses = canvas_api.get_courses(data.api_key)
        courses_with_grades = []

        # For each course, fetch the grades
        for course in courses:
            course_details = {
                "course_name": course,
                "grades": canvas_api.get_grades(data.api_key, course.id)  # Use course ID to get grades
            }
            courses_with_grades.append(course_details)

        return {"courses_with_grades": courses_with_grades}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
