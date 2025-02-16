from canvasapi import Canvas, exceptions
import logging
from datetime import datetime, timedelta, timezone
from dateutil import parser

# Base URL for Canvas API
BASE_URL = "https://bostoncollege.instructure.com"

# Configure logging for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Create an instance of the Canvas API using the provided API key
def get_canvas_instance(api_key: str):
    """Helper function to create a Canvas instance."""
    logger.info("Creating a Canvas instance")
    return Canvas(BASE_URL, api_key)

# Get all the courses a user is currently enrolled in 
def get_courses(api_key: str):
    """Fetches the list of courses for the user, filtering for the current term."""
    logger.info("Fetching courses from Canvas")
    current_term_id = 7109  # Define the current term ID here
    try:
        canvas = get_canvas_instance(api_key)
        user = canvas.get_current_user()
        courses = user.get_courses()
        
        # Filter courses by enrollment term ID
        course_list = [course for course in courses if getattr(course, 'enrollment_term_id', None) == current_term_id]
        
        logger.info(f"Retrieved {len(course_list)} courses for the current term (term ID: {current_term_id})")
        if course_list:
            logger.info(f"Attributes of the first course object: {course_list[0].__dict__}")
            
        return course_list
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}", exc_info=True)
        raise

# Get all the graded assignments for a user 
def get_graded_assignments(api_key: str, course_id: int):
    """Fetches graded assignments for a specific course."""
    logger.info(f"Fetching graded assignments for course ID: {course_id}")
    try:
        canvas = get_canvas_instance(api_key)
        user = canvas.get_current_user()
        course = canvas.get_course(course_id)
        assignments = course.get_assignments()
        
        graded_assignments = []
        
        for assignment in assignments:
            # Only add assignments that have been graded
            if assignment.has_submitted_submissions and assignment.points_possible:
                submission = assignment.get_submission(user.id)
                
                # Check if the submission has a 'score' attribute and if it's graded
                submission_score = getattr(submission, 'score', None) if submission else None
                if submission_score is not None:
                    graded_assignments.append({
                        "name": assignment.name,
                        "due_date": assignment.due_at,
                        "points_possible": assignment.points_possible,
                        "submission_score": submission_score
                    })
        
        logger.info(f"Retrieved {len(graded_assignments)} graded assignments for course ID: {course_id}")
        return graded_assignments
    except exceptions.Forbidden as e:
        logger.warning(f"Access denied for course ID {course_id}: {str(e)}")
        return []  # Skip this course if access is denied
    except Exception as e:
        logger.error(f"Error fetching graded assignments for course ID {course_id}: {str(e)}", exc_info=True)
        return []  # Return an empty list on any other exception

# Get all courses and their graded assignments for a user
def get_courses_with_graded_assignments(api_key: str):
    """Fetches courses and their graded assignments, handling access errors."""
    courses = get_courses(api_key)
    all_graded_assignments = {}
    
    for course in courses:
        graded_assignments = get_graded_assignments(api_key, course.id)
        all_graded_assignments[course.id] = graded_assignments
    
    return all_graded_assignments

# Get all the upcoming assignments due in the next two weeks
def get_upcoming_assignments(api_key: str):
    """Fetches upcoming assignments due in the next two weeks."""
    logger.info("Fetching upcoming assignments due in the next two weeks")
    try:
        canvas = get_canvas_instance(api_key)
        user = canvas.get_current_user()
        courses = user.get_courses()

        # Parse courses
        courses = [course for course in courses if getattr(course, 'enrollment_term_id', None) == 7109]

        # Define the date range for upcoming assignments (make them timezone-aware)
        today = datetime.now(timezone.utc)
        two_weeks_later = today + timedelta(days=14)

        upcoming_assignments = []

        for course in courses:
            assignments = course.get_assignments()
            for assignment in assignments:
                if assignment.due_at:
                    # Parse the due_at date string to an aware datetime object
                    due_date = parser.parse(assignment.due_at)

                    # Compare the parsed due date with today and two weeks later
                    if today <= due_date <= two_weeks_later:
                        upcoming_assignments.append({
                            "course_name": course.name,
                            "assignment_name": assignment.name,
                            "due_date": due_date.strftime("%Y-%m-%d %H:%M:%S %Z")
                        })

        logger.info(f"Retrieved {len(upcoming_assignments)} upcoming assignments due in the next two weeks")
        return upcoming_assignments
    except Exception as e:
        logger.error(f"Error fetching upcoming assignments: {str(e)}", exc_info=True)
        raise