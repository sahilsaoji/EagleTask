import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createTaskList, chatWithTasks } from '../api/api';
import LoadingIndicator from './LoadingIndicator';
import { FaClock, FaCalendarAlt, FaBook } from "react-icons/fa";
import TaskCalendar from './TaskCalendar';
import ReactMarkdown from 'react-markdown';



const Tasks = () => {
    const [messages, setMessages] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [input, setInput] = useState("");
    const [isTaskView, setIsTaskView] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);

    // Load tasks from local storage
    useEffect(() => {
        const storedData = localStorage.getItem('tasks');
        if (storedData) {
            setTaskList(JSON.parse(storedData));
        }
    }, []);

    // Function to refresh tasks
    const refreshTasks = async () => {
        setLoadingTasks(true);
        setTaskList([]);

        try {
            const apiKey = localStorage.getItem('canvasApiKey');
            const response = await createTaskList(apiKey);
            console.log("Tasks received (parsed):", response);

            // Access the tasks array directly
            const tasks = response.tasks || [];
            console.log("Parsed Tasks:", tasks);

            // Add tasks to local storage
            localStorage.setItem('tasks', JSON.stringify(tasks));

            setTaskList(tasks);
        } catch (error) {
            console.error("Error refreshing tasks:", error);
            setTaskList(["Failed to load tasks. Please try again."]);
        } finally {
            setLoadingTasks(false);
        }
    };

    // Handle sending a message
    const sendMessage = async (message = input) => {
        if (message.trim() === "") return;

        const newMessage = { sender: "user", text: message };
        const loadingMessage = { sender: "bot", text: "Loading...", isLoading: true };

        setMessages((prevMessages) => [...prevMessages, newMessage, loadingMessage]);
        setInput("");
        setLoadingResponse(true);

        try {
            // load tasks from local Storage
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            const response = await chatWithTasks(message, tasks);
            const botMessage = { sender: "bot", text: response};

            setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.isLoading ? botMessage : msg))
            );
        } catch (error) {
            console.error("Error creating task list:", error);
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.isLoading ? { sender: "bot", text: "Sorry, something went wrong. Please try again." } : msg
                )
            );
        } finally {
            setLoadingResponse(false);
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

    const TaskCard = ({ task }) => {
        // State to track task completion
        const [isCompleted, setIsCompleted] = useState(false);
    
        // Toggle the completion status
        const handleCheckboxChange = () => {
            setIsCompleted(!isCompleted);
        };
    
        return (
            <div
                className={`relative bg-[#7B313C] p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    isCompleted ? "opacity-50 line-through" : ""
                }`}
            >
                {/* Completion Checkbox */}
                <input
                    type="checkbox"
                    className="absolute top-4 right-4 w-5 h-5 cursor-pointer"
                    checked={isCompleted}
                    onChange={handleCheckboxChange}
                />
    
                {/* Assignment Name (Centered) */}
                <h2 className="text-xl font-bold text-center mb-4">{task.task}</h2>
    
                {/* Two-Column Layout */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Left Column (1/3 width) */}
                    <div className="col-span-1 flex flex-col gap-4">
                        {/* Course Name */}
                        <div className="flex items-center text-sm">
                            <FaBook className="mr-2 text-white" />
                            <p>{task.course}</p>
                        </div>
    
                        {/* Time Estimate */}
                        <div className="flex items-center text-sm">
                            <FaClock className="mr-2 text-white" />
                            <span>Time Estimate:</span>
                            <span className="ml-1 font-medium">{task.time_estimate}</span>
                        </div>
    
                        {/* Due Date */}
                        <div className="flex items-center text-sm">
                            <FaCalendarAlt className="mr-2 text-white" />
                            <span>Due:</span>
                            <span className="ml-1">{new Date(task.due_date).toLocaleString()}</span>
                        </div>
                    </div>
    
                    {/* Right Column (2/3 width) */}
                    <div className="col-span-2">
                        <p className="text-sm mb-4">{task.description}</p>
                    </div>
                </div>
            </div>
        );
    };
    


    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#D9D9D9] p-4 gap-4">
            {/* Task List / Calendar Section */}
            <div className="w-1/2 bg-[#1E1E1E] rounded-lg p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl text-white font-semibold">{isTaskView ? "Task List" : "Calendar"}</h1>
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md hover:bg-[#BC9B6A]"
                        onClick={refreshTasks}
                    >
                        {loadingTasks ? "Refreshing Tasks..." : "Refresh My Tasks"}
                    </button>
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md hover:bg-[#BC9B6A]"
                        onClick={() => setIsTaskView(!isTaskView)}
                    >
                        {isTaskView ? "Switch to Calendar View" : "Switch to Task List View"}
                    </button>
                </div>

                {/* Task List or Calendar View */}
                {isTaskView ? (
                    <div>
                        {loadingTasks ? (
                            <LoadingIndicator loading={loadingTasks} />
                        ) : taskList.length > 0 ? (
                            <ul className="space-y-4">
                                {taskList.map((task, index) => (
                                    <TaskCard key={index} task={task} />
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center">
                                Your task list will appear here after you request it.
                            </p>
                        )}
                    </div>
                ) : (
                    <TaskCalendar tasks={taskList} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                )}
            </div>

            {/* Chat Section */}
            <div className="w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col max-h-[80vh]">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">Tasks Chat</h1>
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
                        className="flex-1 p-2 rounded-md border border-gray-400 bg-black text-white"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md hover:bg-[#BC9B6A]"
                        onClick={() => sendMessage(input)}
                    >
                        Send
                    </button>
                    <button
                        className="bg-[#1E1E1E] text-white px-4 py-2 rounded-md hover:bg-[#BC9B6A]"
                        onClick={clearMessages}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
