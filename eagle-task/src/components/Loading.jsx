import React, { useState, useEffect } from 'react';

const Loading = () => {
  const messages = [
    { text: 'Fetching your courses 📚', delay: 1000 },
    { text: 'Fetching your assignments 📝', delay: 2000 },
    { text: 'Grabbing grades 📊', delay: 3000 },
    { text: 'Analyzing your grades 🧐', delay: 4000 },
    { text: 'Creating your task list ✅', delay: 5000 },
    { text: 'Almost there! 🚀', delay: 6000 },
  ];

  const [currentMessage, setCurrentMessage] = useState(messages[0].text);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        const currentIndex = messages.findIndex((msg) => msg.text === prev);
        return messages[(currentIndex + 1) % messages.length].text;
      });
    }, 1500); // Rotate messages every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#D9D9D9] text-[#1E1E1E]">
      <div className="flex flex-col items-center">
        {/* Animated Spinner */}
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-[#BC9B6A] border-opacity-75 mb-8"></div>

        {/* Loading Messages */}
        <p className="text-2xl font-semibold text-center">{currentMessage}</p>
      </div>
    </div>
  );
};

export default Loading;
