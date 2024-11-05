// GradesPage.js
import React, { useState, useEffect } from 'react';

const Grades = () => {
    const [coursesWithGrades, setCoursesWithGrades] = useState([]);

    useEffect(() => {
        // Retrieve courses with grades from localStorage
        const storedData = localStorage.getItem('courses_with_graded_assignments');

        // Log stored data to verify it is loaded
        if (storedData) {
            console.log(JSON.parse(storedData)); // Parsing to see the object structure
            setCoursesWithGrades(JSON.parse(storedData));
        }
    }, []);

    const toggleDropdown = (index) => {
        const updatedCourses = coursesWithGrades.map((course, i) => {
            if (i === index) {
                return { ...course, isOpen: !course.isOpen };
            }
            return course;
        });
        setCoursesWithGrades(updatedCourses);
    };

    return (
        <div className="flex min-h-screen bg-[#D9D9D9] text-white">
            {/* Main Content */}
            <div className="flex-1 p-6 flex gap-6">
                {/* Grades Section */}
                <div className="w-1/2 bg-[#1E1E1E] rounded-lg p-6">
                    <h1 className="text-3xl font-semibold text-center mb-6">Grades</h1>
                    <div className="space-y-4">
                        {coursesWithGrades.map((course, index) => (
                            <div key={index} className="bg-[#7B313C] rounded-lg p-4">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleDropdown(index)}
                                >
                                    <h2 className="text-xl font-semibold">{course.course_name}</h2>
                                    <button>
                                        {course.isOpen ? (
                                            <i className="fas fa-chevron-up text-white"></i>
                                        ) : (
                                            <i className="fas fa-chevron-down text-white"></i>
                                        )}
                                    </button>
                                </div>
                                {course.isOpen && (
                                    <div className="bg-[#D9D9D9] p-4 mt-2 rounded-md">
                                        {course.graded_assignments.length > 0 ? (
                                            course.graded_assignments.map((assignment, assignmentIndex) => (
                                                <div
                                                    key={assignmentIndex}
                                                    className="flex justify-between bg-[#BC9B6A] rounded-md p-2 mb-2 text-white"
                                                >
                                                    <span>{assignment.name}</span>
                                                    <span>{assignment.submission_score}</span>
                                                    <span>{assignment.total_score}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No grades available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat with AI Section */}
                <div className="w-1/2 bg-gray-100 text-gray-900 rounded-lg p-6">
                    <h1 className="text-3xl font-semibold text-center mb-6">Chat With AI</h1>
                    <div className="bg-gray-200 rounded-lg p-4 mb-4 h-64 overflow-y-auto border border-gray-300">
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Create a study plan for me!"
                            className="flex-1 p-2 rounded-md border border-gray-400"
                        />
                        <button className="bg-[#7B313C] text-white px-4 py-2 rounded-md">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grades;
