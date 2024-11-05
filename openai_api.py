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

@router.post("/create-tasks", response_model=TaskResponse)
async def create_task_list(request: TaskRequest):
    """Creates a task list from the user's prompt using the OpenAI API."""
    try:
        # Instructions for the assistant
        assistant_instructions = (
            "You are a helpful assistant designed to create organized task lists for students based on their assignments or workload. "
            "Break down tasks into actionable steps with priorities and deadlines where possible."
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
