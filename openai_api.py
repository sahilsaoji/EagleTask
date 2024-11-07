from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
import openai
import os
from dotenv import load_dotenv
import logging
from typing import List, Optional, Dict


# Set up logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize a router
router = APIRouter()

# Define request and response models for tasks 
class TaskRequest(BaseModel):
    prompt: str

class TaskResponse(BaseModel):
    response: str

# Define request and response models for grades
class Assignment(BaseModel):
    name: str
    due_date: Optional[str]  # Use Optional in case the due date is missing
    points_possible: float
    submission_score: float

class Course(BaseModel):
    course_name: str
    graded_assignments: List[Assignment]

class GradesRequest(BaseModel):
    prompt: str
    grades: List[Course]  # Expecting `grades` to be a list of `Course` objects

# Endpoint to create a task list based on user input
@router.post("/create-tasks", response_model=TaskResponse)
async def generate_task_list(request: TaskRequest):
    """Creates a task list from the user's prompt using the OpenAI API."""
    try:
        # Instructions for the assistant
        assistant_instructions = (
            "You are a helpful assistant designed to create organized task lists for students based on their assignments or workload. "
            "Break down tasks into actionable steps with priorities and deadlines where possible."
            "Currently you do not have functionality yet to actually see tasks, and you should let the student know this, and tell them what you will eventually be able to do!"
        )
        
        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": assistant_instructions},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=150
        )

        # Access the response content
        reply = response.choices[0].message.content.strip()
        return TaskResponse(response=reply)

    except Exception as e:
        logger.error("Error in generate_task_list: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")

# Endpoint to analyze grades and provide recommendations
@router.post("/analyze-grades", response_model=TaskResponse)
async def analyze_grades(request: GradesRequest):
    logger.info(f"Received request: {request.dict()}")  # Log the request content
    try:
        # Prepare the instructions for the assistant
        assistant_instructions = (
            "You are a helpful assistant that provides analysis on a student's grades, "
            "Showing areas of strength and where improvement is needed. Break down grades by course and provide recommendations.\n\n"
            "Here are the user's current grades and enrolled courses:\n"
            f"{request.grades}\n\n"
            "Now, based on the user's prompt, provide some analysis and recommendations."
            "DO NOT: Provide any markdown code, only plain text"
            "DO NOT: Simply repeat a users grades, they can already see them in the UI"
            "DO: Provide actionable advice and recommendations for improvement, and deep analysis of performance"
        )
        
        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": assistant_instructions},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=150
        )

        # Access the assistant's reply
        reply = response.choices[0].message.content.strip()
        return TaskResponse(response=reply)

    except Exception as e:
        logger.error("Error in analyze_grades: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")

