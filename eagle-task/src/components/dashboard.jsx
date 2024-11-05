// Dashboard page 
/* 
    Dashboard for navigating between the 4 views of the app in the Figma 
*/ 

import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">

      <div className="flex-1 bg-white p-10">
        <h1 className="text-center text-3xl font-semibold text-[#7B313C] mb-8">Dashboard</h1>
        <div className="grid grid-cols-2 gap-6">
          {/* Task Card */}
          <div className="bg-[#7B313C] text-[#FFFFFF] p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-[#D9D9D9] mb-4">Organize what you need to do and receive quality advice</p>
            <Link to="/tasks">
              <button className="bg-[#BC9B6A] text-[#7B313C] px-4 py-2 rounded hover:bg-[#7B313C] hover:text-[#BC9B6A] border border-[#BC9B6A]">
                &rarr;
              </button>
            </Link>
          </div>

          {/* Calendar Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Calendar</h2>
            <p className="text-[#D9D9D9] mb-4">Visualize your upcoming exams, assignments, and course events</p>
            <Link to="/calendar">
              <button className="bg-[#BC9B6A] text-[#7B313C] px-4 py-2 rounded hover:bg-[#7B313C] hover:text-[#BC9B6A] border border-[#BC9B6A]">
                &rarr;
              </button>
            </Link>
          </div>

          {/* Resources Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <p className="text-[#D9D9D9] mb-4">Academic and wellness resources for Boston College students</p>
            <Link to="/resources">
              <button className="bg-[#BC9B6A] text-[#7B313C] px-4 py-2 rounded hover:bg-[#7B313C] hover:text-[#BC9B6A] border border-[#BC9B6A]">
                &rarr;
              </button>
            </Link>
          </div>

          {/* Grades Card */}
          <div className="bg-[#7B313C] text-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Grades</h2>
            <p className="text-[#D9D9D9] mb-4">A comprehensive look at the score you've received so far</p>
            <Link to="/grades">
              <button className="bg-[#BC9B6A] text-[#7B313C] px-4 py-2 rounded hover:bg-[#7B313C] hover:text-[#BC9B6A] border border-[#BC9B6A]">
                &rarr;
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
