// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCog } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-[#7B313C] text-white py-4 px-6 flex justify-between items-center shadow-lg">
      {/* Home Button */}
      <Link to="/" className="text-2xl text-white hover:text-gray-300">
        <FaHome />
      </Link>

      {/* Centered Nav Links */}
      <ul className="flex space-x-6 text-lg font-semibold">
        <li>
          <Link to="/chat" className="hover:text-gray-300">
            Chat
          </Link>
        </li>
        <li>
          <Link to="/grades" className="hover:text-gray-300">
            Grades
          </Link>
        </li>
        <li>
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
        </li>
      </ul>

      {/* Settings Button */}
      <button className="text-2xl text-white hover:text-gray-300">
        <FaCog />
      </button>
    </nav>
  );
}

export default Navbar;
