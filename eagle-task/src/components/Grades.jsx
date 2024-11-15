import React, { useState, useEffect } from 'react';
import { getCoursesWithGradedAssignments, analyzeGrades } from '../api/api';
import ReactMarkdown from 'react-markdown';
import LoadingIndicator from './LoadingIndicator';

const Grades = () => {
    const [coursesWithGrades, setCoursesWithGrades] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        const storedData = localStorage.getItem('courses_with_graded_assignments');
        if (storedData) {
            console.log(JSON.parse(storedData));
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
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput("");

        try {
            const grades = JSON.parse(localStorage.getItem('courses_with_graded_assignments'));
            const response = await analyzeGrades(message, grades);
            
            const botMessage = {
                sender: "bot",
                text: response,
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error analyzing grades, please ensure you have refreshed your grades first!", error);
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

            console.log("Courses with Grades:", coursesWithGrades);
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

    return (
        <div className="flex min-h-screen bg-[#D9D9D9] text-white overflow-auto">
            <div className="flex-1 p-6 flex gap-6">
                {/* Grades Section */}
                <div className="w-1/2 bg-[#1E1E1E] rounded-lg p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold">Grades</h1>
                        <button
                            className="bg-[#7B313C] text-white px-4 py-2 rounded-md"
                            onClick={fetchGrades}
                        >
                            {loading ? "Loading Grades..." : "Refresh My Grades"}
                        </button>
                    </div>

                    {/* Loading Indicator */}
                    {loading && <LoadingIndicator loading={loading} />}

                    {!loading && (
                        <div className="space-y-4">
                            {coursesWithGrades.map((course, index) => (
                                <div key={index} className="bg-[#7B313C] rounded-lg p-4">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleDropdown(index)}
                                    >
                                        <h2 className="text-xl font-semibold">{course.course_name}</h2>
                                        <button className="text-white">
                                            {course.isOpen ? (
                                                <i className="fas fa-chevron-up text-2xl"></i>
                                            ) : (
                                                <i className="fas fa-chevron-down text-2xl"></i>
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

                {/* Chat with AI Section */}
                <div className="w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col max-h-[80vh]">
                    <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">Chat With AI</h1>
                    <div className="flex-1 bg-gray-100 rounded-lg p-4 mb-4 overflow-y-auto border border-gray-300">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-3 mb-2 rounded-lg max-w-xs ${
                                        msg.sender === "user"
                                            ? "bg-[#7B313C] text-white text-right"
                                            : "bg-gray-300 text-gray-900 text-left"
                                    }`}
                                    style={{ wordWrap: "break-word" }}
                                >
                                    {msg.sender === "bot" ? (
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type your message here..."
                            className="flex-1 p-2 rounded-md border border-gray-400 bg-black text-white"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className="bg-[#7B313C] text-white px-4 py-2 rounded-md"
                            onClick={() => sendMessage(input)}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grades;
