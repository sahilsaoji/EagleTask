import React, { useState, useEffect } from 'react';
import { analyzeGrades } from '../api/api';

const Grades = () => {
    const [coursesWithGrades, setCoursesWithGrades] = useState([]);
    const [messages, setMessages] = useState([]);
    //const [taskList, setTaskList] = useState([]);
    const [input, setInput] = useState("");
    //const [isTaskView, setIsTaskView] = useState(true);
    //const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // Retrieve courses with grades from localStorage
        const storedData = localStorage.getItem('courses_with_graded_assignments');
        if (storedData) {
            console.log(JSON.parse(storedData)); // Log to verify structure
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
    
        try {
            const grades = JSON.parse(localStorage.getItem('courses_with_graded_assignments'));
            console.log("Payload sent to backend:", { prompt: message, grades: grades });

            // Use analyzeGrades to send the prompt and parsed grades to the backend
            const response = await analyzeGrades(message, grades);
            
            const botMessage = {
                sender: "bot",
                text: response,
            };
    
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error analyzing grades:", error);
        }
    
        setInput("");
    };
    
    

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex min-h-screen bg-[#D9D9D9] text-white">
            {/* Main Content */}
            <div className="flex-1 p-6 flex gap-6">
                {/* Grades Section */}
                <div className="w-1/2 bg-[#1E1E1E] rounded-lg p-6">
                    <h1 className="text-3xl font-semibold text-center mb-6">Grades</h1>
                    <div className="space-y-4">
                        {coursesWithGrades.map((course, index) => (
                            <div key={index} className="bg-[#7B313C] rounded-lg p-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleDropdown(index)}
                                >
                                    <h2 className="text-xl font-semibold">{course.course_name}</h2>
                                    <button>
                                        {course.isOpen ? (
                                            <i className="fas fa-chevron-up text-white"></i>
                                        ) : (
                                            <i className="fas fa-chevron-down text-white"></i>
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
                </div>

                {/* Chat with AI Section */}
                <div className="w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col h-screen">
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
                                    {msg.text}
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
