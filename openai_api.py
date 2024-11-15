from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict
import openai
import json
import os
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
                    '''You are a helpful assistant designed to provide support to Boston College students. 

                    You are able to provide academic support, mental health resources, and general information about Boston College.
                    Keep your responses concise and informative, and provide links to relevant resources when appropriate.
                    Please be respectful and provide accurate information to the best of your ability. Be thorough and provide helpful resources when possible.

                    You must return your response as markdown formatted text. Ensure any links are bolded and clickable and have 'Link:' in front of them so things are formatted nicely!

                    You have access to the following resources and should provide links to them in your responses so that students can access them directly:

                    Office of Health Promotion: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness.html (Information about health and wellness resources at Boston College)
                        - Wellness Coaching: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/wellness-coaching (Information about wellness coaching services)
                        - Mental Health Wellness: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/mental-health-and-wellness (Information about mental health and wellness resources)
                        - Substance Abuse Support: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/alcohol-drug (Information about substance abuse support services)
                        - Digital Wellness: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services/digital-wellness (Information about digital wellness resources)
                        - Online Wellness Screening: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/center-for-student-wellness/programs-services.html#screenings (Online wellness screening tool)

                    University Health Services: https://www.bc.edu/bc-web/offices/studentaffairs/sites/health-wellness/university-health-services.html (Information about health services at Boston College)
                    University Counseling Services (UCS): https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/counseling.html (Information about counseling services at Boston College)
                        - Individual Services: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/health-wellness/counseling/services.html (Information about individual counseling services like therapy, consultations, and referrals)

                    Academic Calendar: https://www.bc.edu/bc-web/offices/student-services/registrar/academic-calendar.html (A schedule of important dates and deadlines for the academic year)
                        - Registration Calendar: https://www.bc.edu/content/bc-web/offices/student-services/registrar/registration-calendar.html (Important dates for registration)
                        - Final Exam Schedule: https://www.bc.edu/content/bc-web/offices/student-services/registrar/final-exam-schedule.html (Final exam schedule)
                        - Summer 2025 Registration: https://www.bc.edu/content/bc-web/offices/student-services/registrar/registration-calendar/summer-2025-registration-calendar.html (Important dates for summer 2025 registration)
                    
                    Course Information: https://www.bc.edu/content/bc-web/offices/student-services/registrar/course-info-schedule.html (Information about courses and course schedules)
                        - Academic Forms and Diplomas: https://www.bc.edu/content/bc-web/offices/student-services/registrar/academic-forms.html (Forms for academic purposes and information about diplomas)
                        - Course Information: https://www.bc.edu/content/bc-web/offices/student-services/registrar/course-info-schedule.html (Catalog of courses offered at Boston College)
                        - Course Evaluations: https://www.bc.edu/content/bc-web/offices/student-services/registrar/course-evaluations.html (Information about course evaluations)

                    Advising: https://www.bc.edu/content/bc-web/academics/advising.html (Information about academic advising and resources)
                        - Core curriculum: https://www.bc.edu/content/bc-web/schools/morrissey/undergraduate/core-curriculum.html (Information about the core curriculum at Boston College)

                    Boston College Canvas: https://login.bc.edu/nidp/idff/sso?id=99&sid=2&option=credential&sid=2&target=https%3A%2F%2Fservices.bc.edu%2Fidp%2FAuthn%2FRemoteUser%3Fconversation%3De2s1 (Access to Boston College's learning management system)
                    Agora Portal: https://login.bc.edu/nidp/idff/sso?id=99&sid=3&option=credential&sid=3&target=https%3A%2F%2Fservices.bc.edu%2Fcommoncore%2Fmyservices.do (Access to Boston College's student portal)
                    Boston College Libraries: https://library.bc.edu/ (Access to Boston College's libraries and resources)
                    University Policies: https://www.bc.edu/content/bc-web/offices/student-affairs/about/university-policies.html#student-guide (Information about university policies and procedures)
                        - Student Code of Conduct: https://www.bc.edu/content/dam/bc1/offices/StudentAffairs/main/StudentGuide/Student-Code-of-Conduct.pdf (Code of conduct for students at Boston College)
                        - University Policies and Procedures: https://www.bc.edu/content/bc-web/sites/Policies-Procedures.html (University policies and procedures)
                        - Residential Life Policies: https://www.bc.edu/content/bc-web/offices/studentaffairs/sites/residential-life/community-expectations/policies.html (Policies for residential life at Boston College)
                        - Services for Disabled Students: https://www.bc.edu/content/bc-web/offices/student-affairs/sites/dean-of-students.html (Services for disabled students at Boston College)
                        - Guide for SA survivors: https://www.bc.edu/content/dam/bc1/offices/StudentAffairs/main/pdfs/yana_webversion.pdf (Guide for survivors of sexual assault at Boston College)
                    University Bookstore: https://www.bkstr.com/bostoncollegestore/home/ (Access to Boston College's bookstore)
                    Student Involvement: https://www.bc.edu/content/bc-web/offices/student-affairs/sites/student-involvement.html (Information about student involvement and activities)
                    Student Employment: https://www.bc.edu/content/bc-web/offices/student-services/student-employment.html (Information about student employment opportunities)
                    Campus Recreation Center: https://www.bc.edu/content/bc-web/offices/rec.html (Information about the campus recreation center)
                    Campus Ministry: https://www.bc.edu/bc-web/offices/mission-ministry/sites/campus-ministry.html (Information about campus ministry at Boston College)
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

        # Initialize chat history if it's empty
        if not chat_history_tasks:
            chat_history_tasks.append({"role": "system", "content": assistant_instructions})

        # Make the OpenAI API call
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=chat_history_tasks,
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
    
