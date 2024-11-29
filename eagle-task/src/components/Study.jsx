import React, { useState } from 'react';
import { createQuiz } from '../api/api';

const Study = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [error, setError] = useState('');

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setUploadedFile(file);
        setError('');
        setShowQuiz(false);
    };

    // Generate quiz by sending the file to the backend
    const generateQuiz = async () => {
        if (!uploadedFile) {
            setError('Please upload a document before generating a quiz.');
            return;
        }

        try {
            const quizData = await createQuiz(uploadedFile);
            if (quizData?.Quiz) {
                setQuizQuestions(quizData.Quiz);
                setCurrentQuestion(0);
                setScore(0);
                setShowQuiz(true);
                setError('');
            } else {
                setError('Failed to generate quiz. Please try again.');
            }
        } catch (err) {
            setError('Error generating quiz. Check console for details.');
            console.error(err);
        }
    };

    // Handle answer submission
    const handleAnswerSubmit = () => {
        const isCorrect =
            userAnswer.toLowerCase() === quizQuestions[currentQuestion].Answer.toLowerCase();
        if (isCorrect) {
            setScore(score + 1);
        }
        setUserAnswer('');
        setCurrentQuestion(currentQuestion + 1);
    };

    // Restart Quiz
    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowQuiz(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#D9D9D9] px-4 py-8">
            <h1 className="text-4xl font-bold text-[#7B313C] mb-12">Study Assistant</h1>

            {/* Upload Notes Section */}
            <div className="w-full max-w-7xl mb-10">
                <div className="bg-[#1E1E1E] rounded-lg p-8 shadow-lg flex flex-col items-center">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-6">Upload Your Document</h2>
                    <input
                        type="file"
                        accept=".doc,.docx"
                        onChange={handleFileUpload}
                        className="file-input file-input-bordered w-full max-w-xs bg-[#7B313C] text-white h-12"
                    />
                    <button
                        onClick={generateQuiz}
                        className="mt-6 h-12 px-6 bg-[#BC9B6A] text-white rounded-lg hover:bg-[#7B313C] transition duration-200"
                    >
                        Generate Quiz
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            </div>

            {/* Quiz Section */}
            <div className="w-full max-w-7xl">
                {showQuiz && currentQuestion < quizQuestions.length ? (
                    <div className="bg-[#1E1E1E] rounded-lg p-6 shadow-lg text-center">
                        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                            Question {currentQuestion + 1}
                        </h2>
                        <p className="text-lg text-gray-200 mb-4">{quizQuestions[currentQuestion].Question}</p>
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="input input-bordered w-full max-w-xs bg-[#7B313C] text-white mb-4"
                        />
                        <button
                            onClick={handleAnswerSubmit}
                            className="py-2 px-4 bg-[#BC9B6A] text-white rounded-lg hover:bg-[#7B313C] transition duration-200 w-full"
                        >
                            Submit Answer
                        </button>
                    </div>
                ) : showQuiz && currentQuestion >= quizQuestions.length ? (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Quiz Complete!</h2>
                        <p className="text-lg text-gray-300 mb-4">Your Score: {score} / {quizQuestions.length}</p>
                        <button
                            onClick={restartQuiz}
                            className="py-2 px-4 bg-[#BC9B6A] text-white rounded-lg hover:bg-[#7B313C] transition duration-200 w-full"
                        >
                            Restart Quiz
                        </button>
                    </div>
                ) : (
                    <p className="text-lg text-gray-400 text-center">No quiz available. Upload a document to start.</p>
                )}
            </div>
        </div>
    );
};

export default Study;
