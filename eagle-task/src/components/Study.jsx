import React, { useState } from 'react';
import { createQuiz } from '../api/api';
import LoadingIndicator from './LoadingIndicator';

const Study = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [error, setError] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setUploadedFile(file);
        setError('');
        setShowQuiz(false);
    };

    // Generate quiz
    const generateQuiz = async () => {
        if (!uploadedFile) {
            setError('Please upload a document before generating a quiz.');
            return;
        }

        setIsLoading(true); // Show loading indicator

        try {
            const quizData = await createQuiz(uploadedFile);
            if (quizData?.Quiz) {
                setQuizQuestions(quizData.Quiz);
                setCurrentQuestion(0);
                setScore(0);
                setShowQuiz(true);
                setError('');
                setShowExplanation(false);
            } else {
                setError('Failed to generate quiz. Please try again.');
            }
        } catch (err) {
            setError('Error generating quiz. Check console for details.');
            console.error(err);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    // Handle answer submission
    const handleAnswerSubmit = () => {
        const correctAnswer = quizQuestions[currentQuestion].Answer;

        if (selectedAnswer === correctAnswer) {
            setScore(score + 1);
            setShowExplanation(false);
            setSelectedAnswer('');
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowExplanation(true); // Show explanation for incorrect answer
        }
    };

    // Move to the next question after showing explanation
    const handleNextQuestion = () => {
        setShowExplanation(false);
        setSelectedAnswer('');
        setCurrentQuestion(currentQuestion + 1);
    };

    // Restart quiz
    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer('');
        setShowQuiz(false);
        setShowExplanation(false);
    };

    return (
        <div className="bg-[#D9D9D9] min-h-screen flex flex-col items-center justify-center p-6 sm:p-8">
            <h1 className="text-center text-4xl sm:text-6xl font-bold text-black mb-6 sm:mb-8">Study Assistant</h1>
            <p className="text-center text-lg text-gray-600 mb-6 sm:mb-8">
                Upload your notes, generate quizzes, and test your knowledge
            </p>

            {/* Upload Section */}
            {!showQuiz && !isLoading && (
                <div className="bg-[#1E1E1E] rounded-[30px] p-8 shadow-xl w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6 text-[#BC9B6A]">Upload Your Document</h2>
                    <div className="flex flex-col gap-4 items-center">
                        <input
                            type="file"
                            accept=".doc,.docx"
                            onChange={handleFileUpload}
                            className="file-input file-input-bordered w-full max-w-md bg-[#7B313C] text-white h-12"
                        />
                        <button
                            onClick={generateQuiz}
                            className="w-full max-w-md h-12 px-6 bg-[#7B313C] text-white rounded-lg hover:bg-[#BC9B6A] transition"
                        >
                            Generate Quiz
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>
            )}


            {/* Loading Indicator */}
            {isLoading && (
                <div className="bg-[#1E1E1E] rounded-[30px] p-8 shadow-xl w-full max-w-4xl max-h-100px">
                    <LoadingIndicator />
                </div>
            )}

            {/* Quiz Section */}
            {showQuiz && (
                <div className="bg-[#1E1E1E] rounded-[30px] p-8 shadow-xl w-full max-w-4xl">
                    {/* Progress Bar */}
                    <div className="flex justify-center">
                        <div className="w-3/4 bg-[#BC9B6A] rounded-full h-4 mb-6">
                            <div
                                className="bg-[#7B313C] h-4 rounded-full transition-all"
                                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {currentQuestion < quizQuestions.length ? (
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-[#BC9B6A] mb-4">
                                Question {currentQuestion + 1}/{quizQuestions.length}
                            </h2>
                            <p className="text-white text-lg mb-6">{quizQuestions[currentQuestion].Question}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quizQuestions[currentQuestion].Choices.map((choice, index) => (
                                    <button
                                        key={index}
                                        className={`w-full px-4 py-3 rounded-lg text-lg font-semibold border ${
                                            selectedAnswer === choice
                                                ? 'bg-[#7B313C] text-white'
                                                : 'bg-[#BC9B6A] text-black hover:bg-[#7B313C] hover:text-white'
                                        }`}
                                        onClick={() => setSelectedAnswer(choice)}
                                    >
                                        {choice}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <p className="text-[#BC9B6A] font-semibold text-lg">
                                    Score: {score} / {quizQuestions.length}
                                </p>
                                <button
                                    onClick={handleAnswerSubmit}
                                    disabled={!selectedAnswer || showExplanation}
                                    className={`px-6 py-3 rounded-lg text-white font-bold ${
                                        selectedAnswer
                                            ? 'bg-[#BC9B6A] hover:bg-[#7B313C] transition'
                                            : 'bg-gray-600 cursor-not-allowed'
                                    }`}
                                >
                                    Submit
                                </button>
                            </div>

                            {/* Show explanation if the answer is incorrect */}
                            {showExplanation && (
                                <div className="mt-6 bg-[#7B313C] text-white p-4 rounded-lg">
                                    <h3 className="text-lg font-bold">Explanation:</h3>
                                    <p className="mt-2">{quizQuestions[currentQuestion].Explanation}</p>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="mt-4 px-6 py-2 bg-[#BC9B6A] text-black font-bold rounded-lg hover:bg-[#7B313C] hover:text-white transition"
                                    >
                                        Next Question
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-white">
                            <h2 className="text-2xl font-semibold text-[#BC9B6A]">Quiz Complete!</h2>
                            <p className="text-lg mt-4">Your Final Score: {score} / {quizQuestions.length}</p>
                            <button
                                onClick={restartQuiz}
                                className="mt-6 px-6 py-2 bg-[#7B313C] text-white rounded-lg hover:bg-[#BC9B6A] transition"
                            >
                                Restart Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Study;
