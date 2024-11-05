import requests

# Base URL for Canvas API (replace with your Canvas instance URL)
BASE_URL = "https://your_canvas_instance.instructure.com/api/v1"

def get_headers(api_key: str):
    """Helper function to create headers for Canvas API requests."""
    return {
        "Authorization": f"Bearer {api_key}"
    }

def get_courses(api_key: str):
    """Fetches the list of courses for the user."""
    url = f"{BASE_URL}/courses"
    headers = get_headers(api_key)
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_assignments(api_key: str, course_id: int):
    """Fetches assignments for a specific course."""
    url = f"{BASE_URL}/courses/{course_id}/assignments"
    headers = get_headers(api_key)
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_modules(api_key: str, course_id: int):
    """Fetches modules for a specific course."""
    url = f"{BASE_URL}/courses/{course_id}/modules"
    headers = get_headers(api_key)
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def get_grades(api_key: str, course_id: int):
    """Fetches grades for a specific course."""
    url = f"{BASE_URL}/courses/{course_id}/enrollments"
    headers = get_headers(api_key)
    params = {"type": ["StudentEnrollment"]}
    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()
