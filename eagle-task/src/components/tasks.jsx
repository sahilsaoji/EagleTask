// Tasks.js
import React, { useState } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [messages, setMessages] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [input, setInput] = useState("");
    const [isTaskView, setIsTaskView] = useState(true); // State to toggle between Task List and Calendar views

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const newMessage = { sender: "user", text: input };
        setMessages([...messages, newMessage]);

        try {
            const response = await axios.post('/create-tasks', {
                prompt: input,
            });

            const botMessage = {
                sender: "bot",
                text: response.data.response, // The full response from OpenAI with task details
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);

            const tasks = response.data.response.split("\n").map(task => task.trim()).filter(task => task !== "");
            setTaskList(tasks);

        } catch (error) {
            console.error("Error with the OpenAI API request:", error);
        }

        setInput("");
    };

    return (
        <div className="flex min-h-screen bg-[#F5F5F5] text-gray-900">
            {/* Main Content */}
            <div className="flex-1 p-6 flex gap-6">
                
                {/* Chat Section */}
                <div className="w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col h-screen">
                    <h1 className="text-3xl font-semibold text-center mb-6">Chat With AI</h1>
                    <div className="flex-1 bg-gray-100 rounded-lg p-4 mb-4 overflow-y-auto border border-gray-300">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 mb-2 rounded-md ${
                                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Describe your assignments or tasks!"
                            className="flex-1 p-2 rounded-md border border-gray-400"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            className="bg-[#7B313C] text-white px-4 py-2 rounded-md"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* Task List / Calendar Section with Toggle */}
                <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-semibold">{isTaskView ? "Task List" : "Calendar"}</h1>
                        <button
                            className="bg-[#7B313C] text-white px-4 py-2 rounded-md"
                            onClick={() => setIsTaskView(!isTaskView)}
                        >
                            {isTaskView ? "Switch to Calendar View" : "Switch to Task List View"}
                        </button>
                    </div>

                    {isTaskView ? (
                        // Task List View
                        <div>
                            {taskList.length > 0 ? (
                                <ul className="space-y-4">
                                    {taskList.map((task, index) => (
                                        <li key={index} className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                                            <span className="font-medium text-gray-800">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center">Your task list will appear here after you describe your assignments.</p>
                            )}
                        </div>
                    ) : (
                        // Calendar View (Placeholder)
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-300 h-64 flex items-center justify-center">
                            <p className="text-gray-500">Calendar view coming soon! This will show tasks by date.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
