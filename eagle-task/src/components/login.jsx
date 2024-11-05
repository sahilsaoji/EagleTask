// Login.jsx
import React, { useState } from 'react';
import { getCoursesWithGrades } from '../api/api';

export const Login = () => {
    const [api_key, setApiKey] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the API key to the backend and retrieve courses with grades
            const coursesWithGrades = await getCoursesWithGrades(api_key);

            // Store the API key and courses data in local storage (or wherever needed)
            localStorage.setItem('api_key', api_key);
            localStorage.setItem('courses_with_grades', JSON.stringify(coursesWithGrades));

            // Redirect to dashboard or wherever appropriate
            window.location.href = '/dashboard';
        } catch (err) {
            console.error("Login failed:", err);
            setError("Failed to retrieve data. Please check your API key and try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#D9D9D9]">
            <div className="bg-[#1E1E1E] rounded-lg shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-semibold text-center text-white mb-6">EagleTask</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="api_key">
                            Canvas API Key
                        </label>
                        <input
                            type="text"
                            id="api_key"
                            value={api_key}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7B313C] bg-gray-200 text-gray-900"
                            placeholder="Enter your Canvas API key"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#BC9B6A] text-white font-semibold rounded-lg hover:bg-[#7d643f] transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
