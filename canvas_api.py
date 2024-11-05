from canvasapi import Canvas
import logging

# Base URL for Canvas API
BASE_URL = "https://bostoncollege.instructure.com"

# Configure logging for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

def get_canvas_instance(api_key: str):
    """Helper function to create a Canvas instance."""
    logger.info("Creating a Canvas instance")
    return Canvas(BASE_URL, api_key)

def get_courses(api_key: str):
    """Fetches the list of courses for the user."""
    logger.info("Fetching courses from Canvas")
    try:
        canvas = get_canvas_instance(api_key)
        user = canvas.get_current_user()
        courses = user.get_courses(enrollment_status="active")
        course_list = list(courses)
        logger.info(f"Retrieved {len(course_list)} courses")
        if course_list:
            logger.info(f"Attributes of the first course object: {course_list[0].__dict__}")
        return course_list
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}", exc_info=True)
        raise

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
                graded_assignments.append({
                    "name": assignment.name,
                    "due_date": assignment.due_at,
                    "points_possible": assignment.points_possible,
                    "submission_score": assignment.get_submission(user.id).score if assignment.get_submission(user.id) else None
                })
        
        logger.info(f"Retrieved {len(graded_assignments)} graded assignments for course ID: {course_id}")
        return graded_assignments
    except Exception as e:
        logger.error(f"Error fetching graded assignments for course ID {course_id}: {str(e)}", exc_info=True)
        raise
