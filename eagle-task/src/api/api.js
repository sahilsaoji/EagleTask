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
export async function dummyRequest(retries = 5, delay = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(`${BASE_URL}/`);
            console.log("Backend woke up on attempt:", attempt);
            return response.data.message; // Return the server's message if successful
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            if (attempt === retries) {
                // Throw error after the final attempt
                throw new Error("Backend did not respond after multiple attempts.");
            }
            // Wait for the specified delay before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
}

/**
 * Sends a POST request to the FastAPI backend to validate the Canvas API key,
 * with retry logic to handle backend wake-up delays.
 * 
 * @param {string} apiKey - The user's Canvas API key.
 * @param {number} retries - Number of retry attempts.
 * @param {number} delay - Delay between retries in milliseconds.
 * @returns {Promise<Object>} - A promise that resolves to the validation result.
 */
export async function validateApiKey(apiKey, retries = 25, delay = 5000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to validate API key.`);
            const response = await axios.post(`${BASE_URL}/validate-api-key`, {
                api_key: apiKey
            });
            console.log("Backend responded successfully.");
            return response.data;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error.message);
            if (attempt === retries) {
                throw new Error("Backend did not respond after multiple attempts.");
            }
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
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

/** 
 * Create a mock quiz for the user based on the doc or docx uploaded 
 * 
 * @param {File} file - The file to upload for quiz creation.
 * @returns {Promise<Object>} - A promise that resolves to the response from the quiz creation.
 */
export async function createQuiz(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        console.log("Uploading file:", file.name); // Debug log

        const response = await axios.post(`${BASE_URL}/create-quiz`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log("Response received:", response.data); // Debug log

        return response.data;
    } catch (error) {
        console.error('Error creating quiz:', error.response?.data || error.message);
        throw error;
    }
}
