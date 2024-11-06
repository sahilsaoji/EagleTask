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
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#D9D9D9] px-4">
            {/* Left side with GIF and instructions */}
            <div className="flex flex-col items-center md:w-1/2 md:pr-8 mb-8 md:mb-0">
                <div className="p-5 rounded-lg border-4 border-[#1E1E1E] bg-[#1E1E1E]">
                    <img
                        src="/token.gif"
                        alt="Token animation"
                        className="w-full h-auto object-contain max-w-[650px]"
                    />
                </div>
                <p className="text-center mt-4 text-black text-lg max-w-[500px]">
                    Generate an Access Token by going to <strong>"Account ➡️ Settings ➡️ New Access Token"</strong>.
                    Then copy down the access token.
                </p>
            </div>


            {/* Right side with form */}
            <div className="bg-[#1E1E1E] rounded-lg shadow-xl p-8 w-full max-w-md md:w-1/2 flex flex-col">
                <h1 className="text-4xl font-bold text-center text-[#BC9B6A] mb-6">EagleTask</h1>
                {error && <p className="text-[#7B313C] text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[#D9D9D9] text-sm font-medium mb-2" htmlFor="api_key">
                            Access Token
                        </label>
                        <input
                            type="password"
                            id="api_key"
                            value={api_key}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-[#BC9B6A] focus:outline-none focus:ring-2 focus:ring-[#BC9B6A] bg-[#D9D9D9] text-black"
                            placeholder="Enter your Canvas API key"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#BC9B6A] text-white font-semibold rounded-lg hover:bg-[#7B313C] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
