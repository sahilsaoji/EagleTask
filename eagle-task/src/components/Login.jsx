import React, { useState } from 'react';
import { getCoursesWithGradedAssignments } from '../api/api';
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

export const Login = ({ setLoggedIn }) => {
    const [api_key, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const coursesWithGrades = await getCoursesWithGradedAssignments(api_key);
            localStorage.setItem('api_key', api_key);
            localStorage.setItem('courses_with_graded_assignments', JSON.stringify(coursesWithGrades));
            setLoggedIn(true);
            navigate('/');
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
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#7B313C]">
            <div className="bg-[#1E1E1E] rounded-[60px] shadow-2xl p-10 w-full max-w-xl text-[#D9D9D9] flex flex-col items-center space-y-6 min-h-[250px]">
                <h1 className="text-5xl font-bold text-center text-white">EagleTask</h1>
                {error && <p className="text-[#7B313C] text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-4">
                    <div className="w-5/6">
                        <input
                            type="password"
                            id="api_key"
                            value={api_key}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-[#BC9B6A] focus:outline-none focus:ring-2 focus:ring-[#BC9B6A] bg-[#333] text-white placeholder-gray-400"
                            placeholder="Access Token"
                            required
                        />
                    </div>
                    <div className="flex justify-between w-5/6 space-x-4">
                        <button
                            type="submit"
                            className="w-1/2 py-3 bg-[#BC9B6A] text-white font-semibold rounded-full hover:bg-[#7B313C] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
                        >
                            Login
                        </button>
                        <div className="relative w-1/2 group">
                            <button
                                type="button"
                                className="w-full py-3 bg-[#555] text-white font-semibold rounded-full hover:bg-[#7B313C] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
                            >
                                Help
                            </button>
                            <div className="absolute bottom-full left-0 w-full p-3 text-sm bg-[#333] text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
                                Go to "Account ➡️ Settings ➡️ New Access Token" to generate an API key.
                            </div>
                        </div>
                    </div>
                </form>
                <p className="text-center mt-4 text-sm">
                    Please login with your{' '}
                    <a
                        href="https://bostoncollege.instructure.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#BC9B6A] hover:underline"
                    >
                        Canvas
                    </a>{' '}
                    Access Token
                </p>
            </div>
            <p className="text-white text-center text-sm mt-4 fixed bottom-4">
                Using your access token, we will provide insights and analysis on your performance
            </p>
        </div>
    );
};

export default Login;
