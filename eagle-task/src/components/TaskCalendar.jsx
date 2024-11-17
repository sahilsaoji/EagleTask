import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaCalendarAlt, FaBook } from "react-icons/fa";

const TaskCalendar = ({ tasks, selectedDate, setSelectedDate }) => {
    // Function to get tile content based on tasks
    const tileContent = ({ date }) => {
        const tasksDue = tasks.filter((task) => {
            const taskDate = new Date(task.due_date).toDateString();
            return taskDate === date.toDateString();
        });

        if (tasksDue.length > 0) {
            return (
                <div className="flex justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#BC9B6A]"></div>
                </div>
            );
        }
        return null;
    };

    // Function to render tile classes based on tasks
    const tileClassName = ({ date }) => {
        const hasTask = tasks.some((task) => {
            const taskDate = new Date(task.due_date).toDateString();
            return taskDate === date.toDateString();
        });

        return hasTask ? "bg-[#7B313C] text-black rounded-lg" : "text-black";
    };

    return (
        <div className="w-full bg-[#1E1E1E] p-6 rounded-lg border border-[#7B313C]">
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full h-full text-black bg-[#1E1E1E] text-lg"
                prevLabel={<span className="text-black">&#x3C;</span>}
                nextLabel={<span className="text-black">&#x3E;</span>}
                next2Label={null}
                prev2Label={null}
            />
            <div className="mt-4 text-center">
                <h2 className="text-lg font-semibold text-white">Tasks Due on {selectedDate.toDateString()}</h2>
                <ul className="space-y-2">
                    {tasks
                        .filter((task) => new Date(task.due_date).toDateString() === selectedDate.toDateString())
                        .map((task, index) => (
                            <li key={index} className="bg-[#7B313C] p-3 rounded-lg text-white">
                                <h3 className="font-bold">{task.task}</h3>
                                <p className="text-sm"><FaBook className="inline mr-1" /> {task.course}</p>
                                <p className="text-sm"><FaClock className="inline mr-1" /> {task.time_estimate}</p>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskCalendar;
