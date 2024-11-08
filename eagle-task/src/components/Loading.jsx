import React, { useState, useEffect } from 'react';

const Loading = () => {
  const messages = [
    { text: 'Checking into Beacon St. 📚', delay: 1500 },
    { text: 'Walking to Bapst 📝', delay: 3000 },
    { text: 'Working in O`Neill 📊', delay: 4500 },
    { text: 'Talking to Father Leahy 🧐', delay: 6000 },
    { text: 'Going to the Mods ✅', delay: 7500 },
    { text: 'Almost there! 🚀', delay: 9000 },
  ];

  const [showProgressBar, setShowProgressBar] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('Spooling up our backend, this may take a bit! ⚙️');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (showProgressBar) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 100); // Increment progress every 100ms for 10 seconds

      const timer = setTimeout(() => {
        setShowProgressBar(false);
        clearInterval(progressInterval);
      }, 10000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [showProgressBar]);

  useEffect(() => {
    if (!showProgressBar) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => {
          const currentIndex = messages.findIndex((msg) => msg.text === prev);
          return messages[(currentIndex + 1) % messages.length].text;
        });
      }, 1500); // Rotate messages every 1.5 seconds

      return () => clearInterval(interval);
    }
  }, [showProgressBar]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#D9D9D9]">
      <div className="flex flex-col items-center w-full max-w-xl bg-[#1E1E1E] rounded-[60px] shadow-2xl p-10 text-[#D9D9D9] min-h-[250px]">
        {showProgressBar ? (
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="relative w-full">
              <div className="overflow-hidden h-8 text-lg rounded-full bg-[#333] shadow-inner">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-8 flex items-center justify-center text-white font-bold bg-[#BC9B6A] transition-all duration-300"
                />
              </div>
            </div>
            <p className="text-lg font-semibold animate-pulse text-center">{currentMessage}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {/* Animated Spinner */}
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-[#BC9B6A] border-opacity-75"></div>

            {/* Loading Messages */}
            <p className="text-lg font-semibold text-center animate-pulse">{currentMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
