import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatWithSupport } from '../api/api';

const Support = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    const supportResources = [
        { name: "Counseling Services", description: "Where can I go for counseling at BC?" },
        { name: "Academic Advising", description: "How do I access academic advising?" },
        { name: "Health Services", description: "Is there on campus health services?" },
        { name: "Disability Services", description: "What do I have access too as a disabled student" },
        { name: "Policy Guidance", description: "What are the university policies?" },
    ];

    useEffect(() => {
        if (messages.length > 0 && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [messages]);

    const sendMessage = async (message = input) => {
        if (message.trim() === "") return;
        setInput("");

        const newMessage = { sender: "user", text: message };
        const loadingMessage = { sender: "bot", text: "Loading...", isLoading: true };

        setMessages((prevMessages) => [...prevMessages, newMessage, loadingMessage]);

        try {
            const botResponse = await chatWithSupport(message);
            const botMessage = { sender: "bot", text: botResponse };

            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.isLoading ? botMessage : msg
                )
            );
        } catch (error) {
            console.error("Error in sending message:", error);
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.isLoading ? { sender: "bot", text: "Sorry, something went wrong. Please try again." } : msg
                )
            );
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
            {/* Questions Section */}
            <div className="w-full lg:w-1/3 bg-[#1E1E1E] text-white rounded-lg p-6 shadow-lg mb-6 lg:mb-0 lg:mr-4 max-h-[60vh] lg:max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Sample Questions</h2>
                <ul className="space-y-4">
                    {supportResources.map((resource, index) => (
                        <li
                            key={index}
                            className="bg-[#7B313C] p-4 rounded-lg cursor-pointer hover:bg-[#BC9B6A] transition duration-200"
                            onClick={() => sendMessage(resource.description)}
                        >
                            <h3 className="text-lg sm:text-xl font-semibold">{resource.name}</h3>
                            <p className="text-sm text-[#D9D9D9]">{resource.description}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Section */}
            <div className="w-full lg:w-2/3 bg-white shadow-md rounded-lg p-6 flex flex-col max-h-[60vh] lg:max-h-[80vh] overflow-hidden">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-4 sm:mb-6 text-gray-900">Support Chat</h1>
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
                    <div ref={chatEndRef}></div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Ask about a support resource..."
                        className="flex-1 p-2 rounded-md border border-gray-400 bg-black text-white text-sm sm:text-base"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md text-sm sm:text-base hover:bg-[#BC9B6A] transition duration-200"
                        onClick={() => sendMessage(input)}
                    >
                        Send
                    </button>
                    <button
                        className="bg-[#1E1E1E] text-white px-4 py-2 rounded-md text-sm sm:text-base hover:bg-[#BC9B6A] transition duration-200"
                        onClick={clearMessages}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
