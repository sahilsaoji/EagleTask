import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Help = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const steps = [
        "Step 1: Log in to Canvas",
        "Step 2: Open Account Settings",
        "Step 3: Create an Access Token",
        "Step 4: Set Token Details",
        "Step 5: Copy Your Token",
        "Step 6: Paste the Token in EagleTask",
        "Important: Keep Your Token Secure",
    ];

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-[80vh] bg-[#7B313C] py-10">
            <div className="bg-[#1E1E1E] rounded-[40px] shadow-2xl p-10 w-full max-w-3xl text-[#D9D9D9]">
                <h1 className="text-4xl font-bold text-center text-white mb-8">Generate Your Canvas Access Token</h1>

                <p className="text-center mb-6">
                    To use EagleTask, you need to provide your Canvas access token. This token allows us to securely access your course data and generate insights. Follow the steps below to create your token.
                </p>

                <div className="space-y-4">
                    {steps.map((title, index) => (
                        <div key={index} className="border border-[#BC9B6A] rounded-lg">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className={`w-full p-4 bg-[#BC9B6A] text-white rounded-lg flex justify-between items-center transition duration-200 ${
                                    openIndex === index ? 'bg-[#7B313C]' : ''
                                }`}
                            >
                                <h2 className="font-semibold">{title}</h2>
                                <span className="transform transition-transform duration-200">
                                    {openIndex === index ? '▲' : '▼'}
                                </span>
                            </button>

                            {openIndex === index && (
                                <div className="p-4 bg-[#FFF3D1] text-[#333] rounded-b-lg">
                                    {index === 0 && (
                                        <>
                                            Go to your school's Canvas website (e.g.,{' '}
                                            <a
                                                href="https://bostoncollege.instructure.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-[#BC9B6A] hover:underline"
                                            >
                                                Boston College Canvas
                                            </a>) and sign in with your credentials.
                                        </>
                                    )}
                                    {index === 1 && "Click on your profile picture or the 'Account' icon in the left sidebar, then select 'Settings.'"}
                                    {index === 2 && "Scroll down to the 'Approved Integrations' section and click 'New Access Token.'"}
                                    {index === 3 && "Enter a purpose (e.g., 'EagleTask') and optionally set an expiration date. Click 'Generate Token.'"}
                                    {index === 4 && (
                                        <>
                                            Your new token will appear on the screen. Copy it carefully—you won't be able to see it again.
                                            <div className="bg-[#333] p-4 rounded-lg mt-2">
                                                <p className="text-sm">Example Token: <code>12345~abcdEfghIjklMnopQrStuvwxYz</code></p>
                                            </div>
                                        </>
                                    )}
                                    {index === 5 && (
                                        <>
                                            Go back to the EagleTask login page and paste your token into the "Access Token" input box.
                                            <input
                                                type="text"
                                                placeholder="Paste your access token here"
                                                className="w-full px-4 py-3 rounded-lg border border-[#BC9B6A] focus:outline-none bg-[#333] text-white placeholder-gray-400 mt-2"
                                                disabled
                                                value="12345~abcdEfghIjklMnopQrStuvwxYz"
                                            />
                                        </>
                                    )}
                                    {index === 6 && "Do not share your token with anyone. It provides access to your personal Canvas data and should be kept private."}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <Link to="/login">
                    <button
                        className="w-full py-3 mt-6 bg-[#BC9B6A] text-white font-semibold rounded-full hover:bg-[#7B313C] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
                    >
                        Back to Login
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Help;
