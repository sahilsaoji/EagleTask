import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const Support = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef(null);

    // Sample list of support resources
    const supportResources = [
        { name: "Counseling Services", description: "Mental health support and counseling." },
        { name: "Academic Advising", description: "Help with course selection and academic planning." },
        { name: "Health Services", description: "On-campus health services for students." },
        { name: "Disability Services", description: "Support for students with disabilities." },
        { name: "Career Center", description: "Career guidance and internship/job search help." },
    ];

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Handle sending a message
    const sendMessage = async (message = input) => {
        if (message.trim() === "") return;

        const newMessage = { sender: "user", text: message };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            // Mock bot response for now (replace with API call if needed)
            const botResponse = `You asked about: **${message}**. Here is some information:\n\n*Please visit the official site for more details.*`;
            const botMessage = { sender: "bot", text: botResponse };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error in sending message:", error);
        }

        setInput(""); // Clear the input box
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex min-h-screen bg-[#D9D9D9] p-8">
            {/* Left Pane: Support Resources */}
            <div className="w-1/3 bg-[#1E1E1E] text-white rounded-lg p-6 shadow-lg mr-4 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-6">Support Resources</h2>
                <ul className="space-y-4">
                    {supportResources.map((resource, index) => (
                        <li
                            key={index}
                            className="bg-[#7B313C] p-4 rounded-lg cursor-pointer hover:bg-[#BC9B6A] transition duration-200"
                            onClick={() => sendMessage(resource.name)}
                        >
                            <h3 className="text-xl font-semibold">{resource.name}</h3>
                            <p className="text-sm text-[#D9D9D9]">{resource.description}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Pane: Chat Window */}
            <div className="w-2/3 bg-white shadow-md rounded-lg p-6 flex flex-col max-h-[80vh]">
                <h1 className="text-3xl font-semibold text-center mb-6 text-gray-900">Support Chat</h1>
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
                    <div ref={chatEndRef}></div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Ask about a support resource..."
                        className="flex-1 p-2 rounded-md border border-gray-400 bg-black text-white"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="bg-[#7B313C] text-white px-4 py-2 rounded-md hover:bg-[#BC9B6A] transition duration-200"
                        onClick={() => sendMessage(input)}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
