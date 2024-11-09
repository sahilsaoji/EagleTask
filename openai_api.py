from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict
import openai
import os
from dotenv import load_dotenv
import logging
from typing import List, Optional

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
    due_date: Optional[str]
    points_possible: float
    submission_score: float

class Course(BaseModel):
    course_name: str
    graded_assignments: List[Assignment]

class GradesRequest(BaseModel):
    prompt: str
    grades: List[Course]

# Chat histories
chat_history_tasks = []
chat_history_grades = {}

# Helper function to initialize chat history for grades
def initialize_grades_history(user_id: str, grades: List[Course]):
    if user_id not in chat_history_grades:
        grades_summary = "\n".join(
            f"Course: {course.course_name}\n" +
            "\n".join(
                f"Assignment: {assignment.name}, Score: {assignment.submission_score}/{assignment.points_possible}"
                for assignment in course.graded_assignments
            )
            for course in grades
        )
        chat_history_grades[user_id] = [
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant analyzing a student's grades. Here are the user's current grades and enrolled courses:\n"
                    f"{grades_summary}\n"
                )
            }
        ]

# Endpoint to create a task list based on user input
@router.post("/create-tasks", response_model=TaskResponse)
async def generate_task_list(request: TaskRequest):
    try:
        assistant_instructions = (
            "You are a helpful assistant designed to create organized task lists for students based on their assignments or workload. "
            "Break down tasks into actionable steps with priorities and deadlines where possible."
            "Currently you do not have functionality yet to actually see tasks, and you should let the student know this, and tell them what you will eventually be able to do!"
        )
        
        # Initialize chat history if it's empty
        if not chat_history_tasks:
            chat_history_tasks.append({"role": "system", "content": assistant_instructions})
        
        # Append user prompt to chat history
        chat_history_tasks.append({"role": "user", "content": request.prompt})

        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=chat_history_tasks,
            max_tokens=150
        )

        # Append assistant response to chat history
        reply = response.choices[0].message.content.strip()
        chat_history_tasks.append({"role": "assistant", "content": reply})

        return TaskResponse(response=reply)

    except Exception as e:
        logger.error("Error in generate_task_list: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")

# Endpoint to analyze grades and provide recommendations
@router.post("/analyze-grades", response_model=TaskResponse)
async def analyze_grades(request: GradesRequest):
    user_id = "default_user"  # Replace this with user-specific identification if available
    logger.info(f"Received request: {request.model_dump()}")

    try:
        # Initialize grades chat history if not already done
        initialize_grades_history(user_id, request.grades)

        # Append user prompt to chat history
        chat_history_grades[user_id].append({"role": "user", "content": request.prompt})

        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=chat_history_grades[user_id],
        )

        # Append assistant response to chat history
        reply = response.choices[0].message.content.strip()
        chat_history_grades[user_id].append({"role": "assistant", "content": reply})

        return TaskResponse(response=reply)

    except Exception as e:
        logger.error("Error in analyze_grades: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")
