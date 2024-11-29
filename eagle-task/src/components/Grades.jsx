import React, { useState, useEffect } from 'react';
import { getCoursesWithGradedAssignments, analyzeGrades } from '../api/api';
import ReactMarkdown from 'react-markdown';
import LoadingIndicator from './LoadingIndicator';

const Grades = () => {
    const [coursesWithGrades, setCoursesWithGrades] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [loadingResponse, setLoadingResponse] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem('courses_with_graded_assignments');
        if (storedData) {
            setCoursesWithGrades(JSON.parse(storedData));
        }
    }, []);

    const toggleDropdown = (index) => {
        const updatedCourses = coursesWithGrades.map((course, i) => {
            if (i === index) {
                return { ...course, isOpen: !course.isOpen };
            }
            return course;
        });
        setCoursesWithGrades(updatedCourses);
    };

    const sendMessage = async (message = input) => {
        if (message.trim() === "") return;

        const newMessage = { sender: "user", text: message };
        const loadingMessage = { sender: "bot", text: "Loading...", isLoading: true };

        setMessages((prevMessages) => [...prevMessages, newMessage, loadingMessage]);
        setInput("");
        setLoadingResponse(true);

        try {
            const grades = JSON.parse(localStorage.getItem('courses_with_graded_assignments'));
            const response = await analyzeGrades(message, grades);

            const botMessage = { sender: "bot", text: response };
            setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.isLoading ? botMessage : msg))
            );
        } catch (error) {
            console.error("Error analyzing grades:", error);
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.isLoading ? { sender: "bot", text: "Sorry, something went wrong. Please try again." } : msg
                )
            );
        } finally {
            setLoadingResponse(false);
        }
    };

    const fetchGrades = async () => {
        setLoading(true);
        try {
            const apiKey = localStorage.getItem('canvasApiKey');
            if (!apiKey) {
                alert("No API key found. Please log in again.");
                return;
            }

            const response = await getCoursesWithGradedAssignments(apiKey);
            const coursesWithGrades = response;

            localStorage.setItem('courses_with_graded_assignments', JSON.stringify(coursesWithGrades));
            setCoursesWithGrades(coursesWithGrades);
        } catch (error) {
            console.error("Error fetching courses with grades:", error);
            alert("Failed to fetch grades. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#D9D9D9] text-white p-4 sm:p-6 gap-4 overflow-auto">
            {/* Grades Section */}
            <div className="w-full lg:w-1/2 bg-[#1E1E1E] rounded-lg p-6 mb-6 lg:mb-0 lg:mr-3 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold">Grades</h1>
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md text-sm sm:text-base"
                        onClick={fetchGrades}
                    >
                        {loading ? "Loading Grades..." : "Refresh My Grades"}
                    </button>
                </div>

                {loading && <LoadingIndicator loading={loading} />}

                {!loading && (
                    <div className="space-y-4">
                        {coursesWithGrades.map((course, index) => (
                            <div key={index} className="bg-[#7B313C] rounded-lg p-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleDropdown(index)}
                                >
                                    <h2 className="text-lg sm:text-xl font-semibold">{course.course_name}</h2>
                                    <button className="text-white">
                                        {course.isOpen ? (
                                            <i className="fas fa-chevron-up text-xl"></i>
                                        ) : (
                                            <i className="fas fa-chevron-down text-xl"></i>
                                        )}
                                    </button>
                                </div>
                                {course.isOpen && (
                                    <div className="bg-[#D9D9D9] p-4 mt-2 rounded-md">
                                        {course.graded_assignments.length > 0 ? (
                                            course.graded_assignments.map((assignment, assignmentIndex) => (
                                                <div
                                                    key={assignmentIndex}
                                                    className="flex justify-between bg-[#BC9B6A] rounded-md p-4 mb-2 text-white items-center"
                                                >
                                                    <span>{assignment.name}</span>
                                                    <span className="font-bold ml-auto text-right">
                                                        {assignment.submission_score} / {assignment.points_possible} (
                                                        {((assignment.submission_score / assignment.points_possible) * 100).toFixed(2)}%)
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No grades available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Section */}
            <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col max-h-[80vh] overflow-y-auto relative">
                <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-900 flex items-center justify-center gap-2">
                    Grades Chat
                    {/* Info Icon */}
                    <div className="relative group">
                        <span className="text-gray-600 hover:text-[#7B313C] cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 20.5A8.5 8.5 0 103.5 12a8.5 8.5 0 008.5 8.5z"
                                />
                            </svg>
                        </span>
                        {/* Tooltip */}
                        <div className="absolute hidden group-hover:block bg-black text-white text-sm rounded-md p-2 top-full mt-2 shadow-lg z-10 w-64">
                            Ask me any question about your real-time grades, like:
                            <br />
                            <span className="font-semibold">"What class am I doing best in?"</span>
                        </div>
                    </div>
                </h1>
                <div className="flex-1 bg-gray-100 rounded-lg p-4 mb-4 overflow-y-auto border border-gray-300">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-3 mb-2 rounded-lg max-w-lg ${
                                    msg.sender === "user"
                                        ? "bg-[#7B313C] text-white text-right"
                                        : "bg-gray-300 text-gray-900 text-left"
                                }`}
                                style={{ wordWrap: "break-word" }}
                            >
                                {msg.isLoading ? (
                                    <img src={`${process.env.PUBLIC_URL}/loading.svg`} alt="Loading" className="h-5 w-5 mx-auto" />
                                ) : (
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        className="flex-1 p-2 rounded-md border border-gray-400 bg-black text-white text-sm sm:text-base"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md text-sm sm:text-base"
                        onClick={() => sendMessage(input)}
                    >
                        Send
                    </button>
                    <button
                        className="bg-[#1E1E1E] text-white px-4 py-2 rounded-md text-sm sm:text-base"
                        onClick={clearMessages}
                    >
                        Clear
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Grades;
