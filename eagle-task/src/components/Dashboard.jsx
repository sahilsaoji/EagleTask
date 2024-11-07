import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="bg-[#D9D9D9] min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-center text-6xl font-bold text-[#7B313C] mb-8">Dashboard</h1>
      
      <div className="bg-[#1E1E1E] rounded-[50px] shadow-2xl p-12 max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Task Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-2xl shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Tasks</h2>
            <p className="text-center text-[#D9D9D9] mb-4 flex-grow">
              Organize what you need to do and receive quality advice
            </p>
            <Link to="/tasks">
              <button className="bg-[#BC9B6A] text-white py-3 px-8 rounded-full font-semibold flex items-center justify-center transition-transform duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7B313C]">
                <span className="mr-2">&rarr;</span>
              </button>
            </Link>
          </div>

          {/* Calendar Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-2xl shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Calendar</h2>
            <p className="text-center text-[#D9D9D9] mb-4 flex-grow">
              Visualize your upcoming exams, assignments, and course events
            </p>
            <Link to="/calendar">
              <button className="bg-[#BC9B6A] text-white py-3 px-8 rounded-full font-semibold flex items-center justify-center transition-transform duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7B313C]">
                <span className="mr-2">&rarr;</span>
              </button>
            </Link>
          </div>

          {/* Resources Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-2xl shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Resources</h2>
            <p className="text-center text-[#D9D9D9] mb-4 flex-grow">
              Academic and wellness resources for Boston College students
            </p>
            <Link to="https://www.bc.edu/bc-web/campus-life/health-wellness.html" target="_blank" rel="noopener noreferrer">
              <button className="bg-[#BC9B6A] text-white py-3 px-8 rounded-full font-semibold flex items-center justify-center transition-transform duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7B313C]">
                <span className="mr-2">&rarr;</span>
              </button>
            </Link>
          </div>

          {/* Grades Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-2xl shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Grades</h2>
            <p className="text-center text-[#D9D9D9] mb-4 flex-grow">
              A comprehensive look at the score you've received so far
            </p>
            <Link to="/grades">
              <button className="bg-[#BC9B6A] text-white py-3 px-8 rounded-full font-semibold flex items-center justify-center transition-transform duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7B313C]">
                <span className="mr-2">&rarr;</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
