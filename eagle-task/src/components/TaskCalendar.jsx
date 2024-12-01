import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaClock, FaBook } from "react-icons/fa";

const TaskCalendar = ({ tasks, selectedDate, setSelectedDate }) => {
    const tileContent = ({ date }) => {
        const tasksDue = tasks.filter((task) => {
            const taskDate = new Date(task.due_date).toDateString();
            return taskDate === date.toDateString();
        });

        if (tasksDue.length > 0) {
            return (
                <div className="flex justify-center items-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#FF6363] to-[#FFC15E]"></div>
                </div>
            );
        }
        return null;
    };

    const tileClassName = ({ date }) => {
        const hasTask = tasks.some((task) => {
            const taskDate = new Date(task.due_date).toDateString();
            return taskDate === date.toDateString();
        });

        return hasTask ? "bg-gradient-to-br from-[#2A2A72] to-[#009FFD] text-white rounded-lg shadow-md" : "text-gray-800";
    };

    return (
        <div className="max-w-4xl mx-auto bg-[#1E1E1E] p-8 rounded-lg shadow-lg border border-gray-700">
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="text-black bg-[#1E1E1E] text-lg"
                prevLabel={<span className="text-white">&#x3C;</span>}
                nextLabel={<span className="text-white">&#x3E;</span>}
                next2Label={null}
                prev2Label={null}
            />
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-white text-center">
                    Tasks Due on {selectedDate.toDateString()}
                </h2>
                <ul className="mt-4 space-y-4">
                    {tasks
                        .filter((task) => new Date(task.due_date).toDateString() === selectedDate.toDateString())
                        .map((task, index) => (
                            <li
                                key={index}
                                className="bg-gradient-to-r from-[#2A2A72] to-[#009FFD] p-4 rounded-lg shadow-md text-white"
                            >
                                <h3 className="font-semibold text-lg">{task.task}</h3>
                                <p className="text-sm flex items-center mt-1">
                                    <FaBook className="inline mr-2" /> {task.course}
                                </p>
                                <p className="text-sm flex items-center mt-1">
                                    <FaClock className="inline mr-2" /> {task.time_estimate}
                                </p>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskCalendar;
