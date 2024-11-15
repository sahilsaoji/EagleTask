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
 * @param {string} apiKey - The user's Canvas API key.
 * @returns {Promise<Object>} - A promise that resolves to the created task list.
 */
export async function createTaskList(apiKey) {
    try {
        const response = await axios.post(`${BASE_URL}/create-tasks`, {
            apiKey: apiKey
        });
        // Parse the response if it's a string
        const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        return data;
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

/** 
 * Send a dummy request to the backend to wake up the server.
 * Query the base endpoint and wait for the reponse 
 */
export async function dummyRequest() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return response.data.message; // Updated field
    } catch (error) {
        console.error("Error waking up server:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Sends a POST request to the FastAPI backend to validate the Canvas API key.
 * 
 * @param {string} apiKey - The user's Canvas API key.
 * @returns {Promise<Object>} - A promise that resolves to the validation result.
 */
export async function validateApiKey(apiKey) {
    try {
        const response = await axios.post(`${BASE_URL}/validate-api-key`, {
            api_key: apiKey
        });
        return response.data;
    } catch (error) {
        console.error("Error validating API Key:", error.response?.data || error.message);
        throw error;
    }
}

/** 
 * Chat with the support resources 
 * 
 * @param {string} message - The message to send to the support resources.
 * @returns {Promise<Object>} - A promise that resolves to the response from the support resources.
 */
export async function chatWithSupport(message) {
    try {
        const response = await axios.post(`${BASE_URL}/support`, {
            prompt: message
        });
        return response.data.response;
    } catch (error) {
        console.error("Error chatting with support:", error.response?.data || error.message);
        throw error;
    }
}

/** 
 * Chat with the tasks chat 
 * 
 * @param {string} message - The message to send to the tasks chat.
 * @param {Array} tasks - The tasks data retrieved from localStorage.
 */
export async function chatWithTasks(message, tasks) {
    try {
        const response = await axios.post(`${BASE_URL}/chat-tasks`, {
            prompt: message,
            tasks: tasks
        });

        return response.data.response;
        
    } catch (error) {
        console.error("Error chatting with tasks:", error.response?.data || error.message);
        throw error;
    }
}