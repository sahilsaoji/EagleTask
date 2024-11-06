import React, { useState } from 'react';
import { getCoursesWithGradedAssignments } from '../api/api';
import Loading from './Loading';

export const Login = () => {
    const [api_key, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const coursesWithGrades = await getCoursesWithGradedAssignments(api_key);
            localStorage.setItem('api_key', api_key);
            localStorage.setItem('courses_with_graded_assignments', JSON.stringify(coursesWithGrades));
            window.location.href = '/';
        } catch (err) {
            console.error("Login failed:", err);
            setError("Failed to retrieve data. Please check your API key and try again.");
        } finally {
            setLoading(false); // Set loading to false after processing
        }
    };

    if (loading) {
        return <Loading />; // Show loading screen if loading is true
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#D9D9D9]">
            {/* Left side with GIF */}
            <div className="hidden md:flex md:w-1/2 justify-center">
                <div className="p-5 rounded-lg border-5 border-[#1E1E1E] bg-[#1E1E1E] flex items-center justify-center">
                    <img
                        src="/token.gif"
                        alt="Token animation"
                        className="max-w-full max-h-350 object-contain"
                    />
                </div>
            </div>

            {/* Right side with form */}
            <div className="flex bg-[#1E1E1E] rounded-lg shadow-lg p-8 w-full max-w-md md:w-1/2">
                <div className="w-full">
                    <h1 className="text-3xl font-semibold text-center text-white mb-6">EagleTask</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="api_key">
                                Canvas API Key
                            </label>
                            <input
                                type="password"
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
        </div>
    );
};

export default Login;
