import React, { useState } from 'react';

const Study = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [notesSummary, setNotesSummary] = useState('');
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setUploadedFile(file);
        setShowSummary(false);
        setShowQuiz(false);
    };

    // Dummy function to simulate generating a summary
    const generateSummary = () => {
        setNotesSummary('This is a summary of the uploaded notes. It will be replaced by AI-generated content.');
        setShowSummary(true);
    };

    // Dummy function to simulate generating quiz questions
    const generateQuiz = () => {
        const dummyQuestions = [
            { question: 'What is the main topic of the notes?', answer: 'Main topic' },
            { question: 'List one key point from the notes.', answer: 'Key point' },
            { question: 'What is the conclusion of the notes?', answer: 'Conclusion' },
        ];
        setQuizQuestions(dummyQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setShowQuiz(true);
    };

    // Handle answer submission
    const handleAnswerSubmit = () => {
        const isCorrect = userAnswer.toLowerCase() === quizQuestions[currentQuestion].answer.toLowerCase();
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
                    <h2 className="text-2xl font-semibold text-gray-200 mb-6">Upload Your Notes</h2>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                        <input
                            type="file"
                            accept=".txt,.pdf"
                            onChange={handleFileUpload}
                            className="file-input file-input-bordered w-full max-w-xs bg-[#7B313C] text-white h-12"
                        />
                        <button
                            onClick={generateSummary}
                            className="h-12 px-6 bg-[#BC9B6A] text-white rounded-lg hover:bg-[#7B313C] transition duration-200"
                        >
                            Generate Summary
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Notes Summary Section */}
                <div className="bg-[#1E1E1E] rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">Notes Summary</h2>
                    {showSummary ? (
                        <div className="bg-[#333] p-4 rounded-lg text-lg text-gray-200">
                            {notesSummary}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-400 text-center">No summary available. Upload notes to generate a summary.</p>
                    )}
                    {showSummary && (
                        <button
                            onClick={generateQuiz}
                            className="mt-6 py-2 px-4 bg-[#BC9B6A] text-white rounded-lg hover:bg-[#7B313C] transition duration-200 w-full"
                        >
                            Quiz Me
                        </button>
                    )}
                </div>

                {/* Quiz Section */}
                <div className="bg-[#1E1E1E] rounded-lg p-6 shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-200 mb-4 text-center">Quiz Time!</h2>
                    {showQuiz && currentQuestion < quizQuestions.length ? (
                        <div>
                            <div className="bg-[#333] p-4 rounded-lg mb-4 text-lg text-gray-200">
                                {quizQuestions[currentQuestion].question}
                            </div>
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
                        <p className="text-lg text-gray-400 text-center">No quiz available. Generate a summary to start the quiz.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Study;
