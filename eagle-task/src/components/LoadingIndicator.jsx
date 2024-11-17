import React, { useState, useEffect } from 'react';

const loadingMessages = [
    { text: 'Checking into Beacon St. 📚', delay: 1500 },
    { text: 'Walking to Bapst 📝', delay: 3000 },
    { text: 'Working in O`Neill 📊', delay: 4500 },
    { text: 'Talking to Father Leahy 🧐', delay: 6000 },
    { text: 'Going to the Mods ✅', delay: 7500 },
    { text: 'Almost there! 🚀', delay: 9000 },
    { text: 'Paying Tuition 💸', delay: 10500 },
    { text: 'Getting ready for graduation 🎓', delay: 12000 },
    { text: 'EagleTask is loading...', delay: 13500 },
];

const LoadingIndicator = ({ loading }) => {
    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0].text);

    useEffect(() => {
        if (loading) {
            let index = 0;

            // Update the message based on the defined delays
            const messageInterval = setInterval(() => {
                index += 1;
                if (index < loadingMessages.length) {
                    setCurrentMessage(loadingMessages[index].text);
                } else {
                    clearInterval(messageInterval);
                }
            }, 1500); // Change message every 1.5 seconds

            return () => clearInterval(messageInterval);
        }
    }, [loading]);

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-[#7B313C] text-white">
            <div className="animate-spin rounded-full h-28 w-28 border-t-4 border-white border-opacity-75"></div>
            <div className="text-xl font-semibold text-center mt-8">{currentMessage}</div>
        </div>
    );
};

export default LoadingIndicator;
