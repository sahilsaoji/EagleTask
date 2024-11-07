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

/**
 * Sends a POST request to the FastAPI backend to create a task list for the user.
 * 
 * @param {string} prompt - The prompt or message input for task creation.
 * @returns {Promise<Object>} - A promise that resolves to the created task list.
 */
export async function createTaskList(prompt) {
    try {
        const response = await axios.post(`${BASE_URL}/create-tasks`, {
            prompt: prompt
        });
        return response.data.response; 
    } catch (error) {
        console.error("Error creating task list:", error);
        throw error;
    }
}

/** 
 * Sends a POST request to analyze the user's grades.
 * 
 * @param {string} message - The prompt or message input for analysis.
 * @param {Array} grades - The grades data retrieved from localStorage.
 * @returns {Promise<Object>} - A promise that resolves to the analysis result.
 */
export async function analyzeGrades(message, grades) {
    try {
        const response = await axios.post(`${BASE_URL}/analyze-grades`, {
            prompt: message,
            grades: grades
        });
        return response.data.response;
    } catch (error) {
        console.error("Error analyzing grades:", error);
        throw error;
    }
}
