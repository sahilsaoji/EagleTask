from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize a router
router = APIRouter()

# Define request and response models
class TaskRequest(BaseModel):
    prompt: str

class TaskResponse(BaseModel):
    response: str

# API endpoint to create a task list based on user input - need to feed in tasks here 
@router.post("/create-tasks", response_model=TaskResponse)
async def create_task_list(request: TaskRequest):
    """Creates a task list from the user's prompt using the OpenAI API."""
    try:
        # Instructions for the assistant
        assistant_instructions = (
            "You are a helpful assistant designed to create organized task lists for students based on their assignments or workload. "
            "Break down tasks into actionable steps with priorities and deadlines where possible."
            "Currently you do not have functionality yet to actually see tasks, and you should let the student know this, and tell them what you will eventually be able to do!"
        )
        
        # Make the correct OpenAI ChatCompletion API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Use gpt-4o-mini as specified
            messages=[
                {"role": "system", "content": assistant_instructions},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=150
        )

        # Access the response content using dot notation
        reply = response.choices[0].message.content.strip()
        return TaskResponse(response=reply)

    except Exception as e:
        logging.error("Error in create_task_list: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")

# API endpoint to analyze grades for a class 
@router.post("/analyze-grades", response_model=TaskResponse)
async def create_task_list(request: TaskRequest):
    """Creates a task list from the user's prompt using the OpenAI API."""
    try:
        # Instructions for the assistant
        assistant_instructions = (
            "You are a helpful assistant designed to provide analyses on a students current grades and where they are doing well and where they have opportunities for improvement. "
            "Break down grades by class and offer an analysis of the student's performance and reccoemndations for improvement. "   
            "Currently you do not have functionality yet to actually see grades, and you should let the student know this, and tell them what you will eventually be able to do!"
        )
        
        # Make the correct OpenAI ChatCompletion API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Use gpt-4o-mini as specified
            messages=[
                {"role": "system", "content": assistant_instructions},
                {"role": "user", "content": request.prompt}
            ],
            max_tokens=150
        )

        # Access the response content using dot notation
        reply = response.choices[0].message.content.strip()
        return TaskResponse(response=reply)

    except Exception as e:
        logging.error("Error in create_task_list: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")