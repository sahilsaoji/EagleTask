import React from 'react';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

function Navbar({ isLoggedIn, onSignOut }) {
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert("You must log in with your Canvas API key first.");
    }
  };

  return (
    <nav className="bg-[#7B313C] text-white py-4 px-6 flex justify-between items-center shadow-lg">
      {/* Home Button */}
      <button
        onClick={() => handleProtectedClick('/')}
        className="text-2xl text-white hover:text-gray-300"
      >
        <FaHome />
      </button>

      {/* Centered Nav Links */}
      <ul className="flex space-x-6 text-lg font-semibold">
        <li>
          <button
            onClick={() => handleProtectedClick('/login')}
            className={`hover:text-gray-300 ${!isLoggedIn ? 'text-gray-400 cursor-not-allowed' : ''}`}
          >
            Login
          </button>
        </li>
        <li>
          <button
            onClick={() => handleProtectedClick('/grades')}
            className={`hover:text-gray-300 ${!isLoggedIn ? 'text-gray-400 cursor-not-allowed' : ''}`}
          >
            Grades
          </button>
        </li>
        <li>
          <button
            onClick={() => handleProtectedClick('/tasks')}
            className={`hover:text-gray-300 ${!isLoggedIn ? 'text-gray-400 cursor-not-allowed' : ''}`}
          >
            Tasks
          </button>
        </li>
      </ul>

      {/* Sign Out Button */}
      {isLoggedIn && (
        <button
          onClick={() => {
            onSignOut();
            navigate('/login');
          }}
          className="text-lg font-semibold hover:text-gray-300 transition duration-200"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}

export default Navbar;
