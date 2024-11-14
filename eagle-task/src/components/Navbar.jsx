import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';

function Navbar({ isLoggedIn, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  // Sync `loggedIn` state with `localStorage`
  useEffect(() => {
    setLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, [isLoggedIn]);

  const handleProtectedClick = (path) => {
    if (loggedIn) {
      navigate(path);
    } else {
      alert("You must log in with your Canvas API key first.");
      navigate('/login');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Determine if the navbar should be shown based on the current location
  const shouldShowNavbar = loggedIn && !['/login', '/loading'].includes(location.pathname);

  if (!shouldShowNavbar) {
    return null; // Don't render the navbar if it shouldn't be shown
  }

  return (
    <nav className="bg-gradient-to-r from-[#7B313C] to-[#430707] text-white py-4 px-6 shadow-xl sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Left-aligned Home Button */}
        <button
          onClick={() => handleProtectedClick('/')}
          className="text-3xl flex items-center hover:text-gray-300 transition duration-200"
        >
          <FaHome className="mr-2" />
          <span className="hidden sm:inline text-xl font-bold">EagleTask</span>
        </button>

        {/* Hamburger Menu for Mobile */}
        <button
          className="sm:hidden text-2xl hover:text-gray-300 transition duration-200"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Centered Nav Links */}
        <ul
          className={`${
            menuOpen ? 'block' : 'hidden'
          } sm:flex space-x-6 text-lg font-semibold items-center transition-all duration-200`}
        >
          <li>
            <button
              onClick={() => handleProtectedClick('/grades')}
              className="hover:text-gray-300 transition"
            >
              Grades
            </button>
          </li>
          <li>
            <button
              onClick={() => handleProtectedClick('/tasks')}
              className="hover:text-gray-300 transition"
            >
              Tasks
            </button>
          </li>
          <li>
            <button
              onClick={() => handleProtectedClick('/support')}
              className="hover:text-gray-300 transition"
            >
              Support
            </button>
          </li>
          <li>
            <button
              onClick={() => handleProtectedClick('/calendar')}
              className="hover:text-gray-300 transition"
            >
              Calendar
            </button>
          </li>
        </ul>

        {/* Right-aligned Sign Out Button */}
        {loggedIn && (
          <button
            onClick={() => {
              onSignOut();
              navigate('/login');
            }}
            className="hidden sm:block text-lg font-semibold bg-[#BC9B6A] py-2 px-4 rounded-full hover:bg-[#7B313C] hover:text-white transition duration-200"
          >
            Sign Out
          </button>
        )}
      </div>

      {/* Mobile Sign Out Button */}
      {loggedIn && menuOpen && (
        <button
          onClick={() => {
            onSignOut();
            navigate('/login');
          }}
          className="block sm:hidden w-full text-lg font-semibold bg-[#555] py-2 mt-4 rounded-full hover:bg-[#7B313C] hover:text-white transition duration-200"
        >
          Sign Out
        </button>
      )}
    </nav>
  );
}

export default Navbar;
