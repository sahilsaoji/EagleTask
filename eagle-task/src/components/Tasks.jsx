import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createTaskList } from '../api/api';
import LoadingIndicator from './LoadingIndicator';

const Tasks = () => {
    const [messages, setMessages] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [input, setInput] = useState("");
    const [isTaskView, setIsTaskView] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);

    // Function to refresh tasks
    const refreshTasks = async () => {
        setLoadingTasks(true);
        setTaskList(["LoadingPage..."]);

        try {
            const apiKey = localStorage.getItem('canvasApiKey');
            const response = await createTaskList(apiKey);
            const tasks = response.data.response
                .split("\n")
                .map(task => task.trim())
                .filter(task => task !== "");

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
            const response = await createTaskList(message);
            const botMessage = { sender: "bot", text: response.data.response };

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
                                    <li
                                        key={index}
                                        className="bg-[#1E1E1E] p-4 rounded-lg border border-[#7B313C] text-white"
                                    >
                                        <span className="font-medium">{task}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center">
                                Your task list will appear here after you request it.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#7B313C]">
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            className="bg-[#1E1E1E] text-white"
                        />
                        <p className="text-gray-400 mt-4 text-center">
                            Selected Date: {selectedDate.toDateString()}
                        </p>
                    </div>
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
