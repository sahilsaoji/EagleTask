import axios from 'axios';

// Base URL for FastAPI backend
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://eagletask.onrender.com' 
  : 'http://127.0.0.1:8000';

/**
 * Sends a POST request to the FastAPI backend to retrieve courses and their grades.
 * 
 * @param {string} apiKey - The user's Canvas API key.
 * @returns {Promise<Object>} - A promise that resolves to the courses with grades data.
 */
export async function getCoursesWithGradedAssignments(apiKey) {
    try {
        const response = await axios.post(`${BASE_URL}/get-courses-with-graded-assignments`, {
            api_key: apiKey
        });
        return response.data.courses_with_graded_assignments; 
    } catch (error) {
        console.error("Error fetching courses with grades:", error);
        throw error;
    }
}

