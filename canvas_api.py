from canvasapi import Canvas

# Base URL for Canvas API (replace with your Canvas instance URL)
BASE_URL = "https://bostoncollege.instructure.com"

def get_canvas_instance(api_key: str):
    """Helper function to create a Canvas instance."""
    return Canvas(BASE_URL, api_key)

# Fetches the list of courses for the user
def get_courses(api_key: str):
    """Fetches the list of courses for the user."""
    canvas = get_canvas_instance(api_key)
    user = canvas.get_current_user()
    courses = user.get_courses()
    return courses  # Return course objects directly

# Fetches grades for a specific course
def get_grades(api_key: str, course_id: int):
    """Fetches grades for a specific course."""
    canvas = get_canvas_instance(api_key)
    course = canvas.get_course(course_id)
    enrollments = course.get_enrollments(type="StudentEnrollment")
    grades = [{"user_id": enrollment.user_id, "grades": enrollment.grades} for enrollment in enrollments]
    return grades
