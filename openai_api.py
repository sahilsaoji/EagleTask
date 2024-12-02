from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from docx import Document
from typing import Dict
import openai
import json
import os
import re
from dotenv import load_dotenv
import logging
from typing import List, Optional
from canvas_api import get_upcoming_assignments

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

# Define task list request 
class TaskListRequest(BaseModel):
    apiKey: str

# Define chat task request
class TaskChatRequest(BaseModel):
    prompt: str
    tasks: List[Dict]

# Define task response
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

class QuizRequest(BaseModel):
    document: str

# Chat histories
chat_history_tasks = []
chat_history_support = {}
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

# Helper function to initialize chat history for support 
def initialize_support_history(user_id: str):
    if user_id not in chat_history_support: 
        chat_history_support[user_id] = [
            {
                "role": "system",
                "content": (
                    '''
                    You are a helpful assistant dedicated to supporting Boston College students by providing academic assistance, mental health resources, and general campus information.

                    **Key Guidelines:**
                    1. **Accuracy and Clarity:** Provide accurate and concise responses tailored to the user's needs. Ensure your tone is respectful and professional at all times.
                    2. **Link Integration:** Include links to relevant resources wherever applicable. Format links as **bolded and clickable** with 'Link:' prefixed for ease of use.
                    3. **Structured Responses:** Use clear formatting (e.g., bullet points or numbered lists) to make information easy to read and follow.
                    4. **Personalization:** Adapt your responses based on the user's query, offering detailed help when necessary.

                    **Available Resources:**
                    You have access to the following Boston College resources. Use them as references to provide accurate information:

                    - **Office of Health Promotion**:
                        - [General Wellness Information](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness.html)
                        - [Wellness Coaching](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/wellness-coaching)
                        - [Mental Health Resources](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/mental-health-and-wellness)
                        - [Substance Abuse Support](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/alcohol-drug)
                        - [Digital Wellness](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/digital-wellness)

                    - **University Health Services**:
                        - [Health Services Information](https://www.bc.edu/bc-web/offices/studentaffairs/sites/health-wellness/university-health-services.html)

                    - **University Counseling Services (UCS)**:
                        - [Counseling Services Overview](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/counseling.html)
                        - [Individual Therapy and Referrals](https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/counseling/services.html)

                    - **Academic Resources**:
                        - [Academic Calendar](https://www.bc.edu/bc-web/offices/student-services/registrar/academic-calendar.html)
                        - [Registration Calendar](https://www.bc.edu/content/bc-web/offices/student-services/registrar/registration-calendar.html)
                        - [Final Exam Schedule](https://www.bc.edu/content/bc-web/offices/student-services/registrar/final-exam-schedule.html)
                        - [Core Curriculum Information](https://www.bc.edu/content/bc-web/schools/morrissey/undergraduate/core-curriculum.html)

                    - **Student Services**:
                        - [Agora Portal](https://login.bc.edu/nidp/idff/sso?id=99&sid=3&option=credential&sid=3&target=https%3A%2F%2Fservices.bc.edu%2Fcommoncore%2Fmyservices.do)
                        - [Boston College Libraries](https://library.bc.edu/)
                        - [Campus Recreation Center](https://www.bc.edu/content/bc-web/offices/rec.html)

                    Provide detailed, resourceful, and student-friendly assistance in every response.
                    '''
                )
            }
        ]

# Endpoint to create a task list based on user input
@router.post("/create-tasks", response_model=Dict)
async def generate_task_list(request: TaskListRequest):
    try:
        upcoming_tasks = get_upcoming_assignments(request.apiKey)
        assistant_instructions = (
            '''You are a helpful assistant designed to create organized task lists for students based on their assignments or workload.
            Break down tasks into actionable steps with priorities and deadlines where possible.

            You need to break down the upcoming assignments into tasks and provide a brief description and time estimate for each task.
            
            Please return a JSON object directly, without wrapping it in code blocks, ie no triple backticks or json keyword.
            Please return tasks in order, with the most urgent tasks at the top. 
            Please return a JSON object in the following format:
            {
                "tasks": [
                    {
                        "task": "Task name",
                        "course": "Course name",
                        "description": "Task description",
                        "time_estimate": "Estimated time",
                        "due_date": "Due date"
                    }
                ]
            }

            Here are the upcoming assignments you need to break down into tasks:
            '''
            f"{upcoming_tasks}"
        )

        # Initialize a local chat history for this endpoint
        initialize_tasks = []
        initialize_tasks.append({"role": "system", "content": assistant_instructions})

        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=initialize_tasks,
        )

        # Extract the assistant's response
        reply = response.choices[0].message.content.strip()
        chat_history_tasks.append({"role": "assistant", "content": reply})

        # Log the reply
        logger.info(f"Assistant response: {reply}")

        # Remove markdown code block delimiters if present
        if reply.startswith("```json") and reply.endswith("```"):
            reply = reply[7:-3].strip()  # Strip the "```json" and "```"

        # Attempt to parse the cleaned response
        try:
            tasks_json = json.loads(reply)
            return JSONResponse(content=tasks_json)
        
        except json.JSONDecodeError:
            logger.error("Failed to parse assistant response as JSON.")
            raise HTTPException(status_code=500, detail="Failed to parse response as JSON.")

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

# Endpoint to chat with support resources 
@router.post("/support", response_model=TaskResponse)
async def chat_with_support(request: TaskRequest):
    
    user_id = "default_user"  # Replace this with user-specific identification if available
    logger.info(f"Received request: {request.model_dump()}")

    try:
        initialize_support_history(user_id)

        # Append user prompt to chat history
        chat_history_support[user_id].append({"role": "user", "content": request.prompt})

        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=chat_history_support[user_id],
        )

        # Append assistant response to chat history
        reply = response.choices[0].message.content.strip()
        logger.info(f"Assistant response: {reply}")
        chat_history_support[user_id].append({"role": "assistant", "content": reply})

        return TaskResponse(response=reply)

    except Exception as e:
        logger.error("Error in chat_with_support: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")
    
# Endpoint to chat about tasks
@router.post("/chat-tasks", response_model=TaskResponse)
async def chat_about_tasks(request: TaskChatRequest):

    try:
        tasks = request.tasks
        assistant_instructions = (
            '''You are a helpful assistant designed to help users plan and organize their tasks. 

            You have identified the following tasks so far and the user will now ask you questions about them.

            Please provide detailed responses to the user's question as text. No JSON or code blocks are needed.
            
            Current user tasks: 
            '''
            f"{tasks}"
        )

        # Initialize chat history if it's empty
        if not chat_history_tasks:
            chat_history_tasks.append({"role": "system", "content": assistant_instructions})

        chat_history_tasks.append({"role": "user", "content": request.prompt})

        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=chat_history_tasks,
        )

        # Extract the assistant's response
        reply = response.choices[0].message.content.strip()
        chat_history_tasks.append({"role": "assistant", "content": reply})

        # Log the reply
        return TaskResponse(response=reply)

    except Exception as e:
        logger.error("Error in generate_task_list: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API")

def extract_text_from_docx(file):
    """Extract text content from a .docx file."""
    document = Document(file)
    full_text = []
    for paragraph in document.paragraphs:
        full_text.append(paragraph.text)
    return '\n'.join(full_text)

@router.post("/create-quiz")
async def generate_quiz(file: UploadFile = File(...)):
    try:
        # Log the uploaded file's metadata
        logging.info(f"Received file: {file.filename} of type {file.content_type}")

        # Check file type
        if not file.filename.endswith(('.txt', '.docx')):
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload a .txt or .docx file.",
            )

        # Read the uploaded file's content
        content = await file.read()

        # Extract text from the file
        if file.filename.endswith('.txt'):
            text_content = content.decode('utf-8')  # Decode assuming UTF-8 for .txt
        elif file.filename.endswith('.docx'):
            try:
                text_content = extract_text_from_docx(file.file)  # Parse .docx content
            except Exception as e:
                logging.error(f"Failed to parse .docx file: {e}")
                raise HTTPException(
                    status_code=400, detail="Failed to parse .docx file. Ensure it is a valid Word document."
                )

        # Prepare the OpenAI API request
        assistant_instructions = f"""
        Generate a quiz based on the following document. The output should be a JSON object containing anywhere from 3 to 15 questions, with each question including the question text, 4 answer choices, and an optional hint. Use the following format:

        ENSURE YOUR JSON IS VALID. IT MUST CONFORM TO THE FOLLOWING FORMAT:
        
        {{
            "Quiz": [
                {{
                    "Question": "Sample question text",
                    "Choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
                    "Answer": "The correct answer choice",
                    "Explanation": "Explanation of the correct answer."
                }},
                ...
            ]
        }}

        Ensure the questions are relevant to the provided document content. Use the document text to create meaningful questions and plausible answer choices.

        Document Content:
        {text_content}
        """

        # Send request to OpenAI
        logging.info("Sending request to OpenAI...")
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": assistant_instructions},
            ],
        )

        # Extract and clean up the reply
        reply = response.choices[0].message.content.strip()

        # Remove triple backticks and clean JSON
        cleaned_reply = re.sub(r"```json|```", "", reply).strip()
        logging.error(f"GPT-4 response: {cleaned_reply}")


        # Parse the response as JSON
        try:
            quiz_json = json.loads(cleaned_reply)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse OpenAI response: {e}")
            raise HTTPException(
                status_code=500,
                detail="Error parsing OpenAI response. Please try again later.",
            )

        logging.info("Quiz successfully generated.")
        return JSONResponse(content=quiz_json)

    except HTTPException as e:
        logging.error(f"HTTP Exception: {e.detail}")
        raise
    except Exception as e:
        logging.error(f"Unhandled Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")