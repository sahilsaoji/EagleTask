import React, { useState, useEffect } from 'react';
import { dummyRequest, validateApiKey } from '../api/api';
import LoadingIndicator from './LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Login = ({ setLoggedIn }) => {
    const [api_key, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const validationResponse = await validateApiKey(api_key);
            localStorage.setItem('canvasApiKey', api_key);
            localStorage.setItem('userId', validationResponse.user);
            localStorage.setItem('isLoggedIn', 'true');
            setLoggedIn(true);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err);
            if (err.message.includes("Backend did not respond")) {
                setError("Our server is starting up. Please try again in a moment.");
            } else {
                setError("Invalid API Key. Please check your key and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingIndicator loading={true} />;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#7B313C] px-4 sm:px-6 lg:px-8">
            <div className="bg-[#1E1E1E] rounded-[40px] shadow-2xl p-6 sm:p-10 w-full max-w-lg text-[#D9D9D9] flex flex-col items-center space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white">
                    EagleTask
                </h1>
                {error && <p className="text-[#7B313C] text-center text-sm sm:text-base">{error}</p>}
                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center space-y-4">
                    <div className="w-full sm:w-5/6">
                        <input
                            type="password"
                            id="api_key"
                            value={api_key}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-[#BC9B6A] focus:outline-none focus:ring-2 focus:ring-[#BC9B6A] bg-[#333] text-white placeholder-gray-400 text-sm sm:text-base"
                            placeholder="Access Token"
                            required
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between w-full sm:w-5/6 space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 py-3 bg-[#BC9B6A] text-white font-semibold rounded-full hover:bg-[#7B313C] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
                        >
                            Login
                        </button>
                        <Link to="/help" className="w-full sm:w-1/2">
                            <button
                                type="button"
                                className="w-full py-3 bg-[#555] text-white font-semibold rounded-full hover:bg-[#7B313C] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
                            >
                                Help
                            </button>
                        </Link>
                    </div>
                </form>
                <p className="text-center mt-4 text-xs sm:text-sm">
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
            <p className="text-white text-center text-xs sm:text-sm mt-4 fixed bottom-4">
                Using your access token, we will provide insights and analysis on your performance
            </p>
        </div>
    );
};

export default Login;
