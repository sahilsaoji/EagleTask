import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define request and response models
class TaskRequest(BaseModel):
    prompt: str  # This will contain details about the student's assignments or work

class TaskResponse(BaseModel):
    response: str  # This will be the generated task list for the student

@app.post("/create-tasks", response_model=TaskResponse)
async def create_task_list(request: TaskRequest):
    try:
        # Send request to OpenAI API with a specialized prompt
        assistant_instructions = (
            "You are a helpful assistant designed to create organized task lists for students based on their assignments or workload. "
            "The student will describe their tasks or assignments, and you should break them down into actionable steps with priorities "
            "and deadlines if possible. Focus on helping them manage their workload effectively."
        )
        
        prompt = f"{assistant_instructions}\n\nStudent's tasks: {request.prompt}\n\nCreate a detailed task list for the student:"
        
        # OpenAI API call
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )
        
        # Extract and return response text
        reply = response.choices[0].text.strip()
        return TaskResponse(response=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")
