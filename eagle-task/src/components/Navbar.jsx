import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaBars, FaTimes } from 'react-icons/fa';

function Navbar({ isLoggedIn, onSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

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

  const shouldShowNavbar = loggedIn && !['/login', '/loading'].includes(location.pathname);

  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-[#7B313C] to-[#430707] text-white py-4 px-6 shadow-xl sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Left Section: Home Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() => handleProtectedClick('/')}
            className="text-2xl flex items-center hover:text-gray-300 transition duration-200"
          >
            <FaHome className="mr-2" />
            <span className="hidden sm:inline text-xl font-bold">EagleTask</span>
          </button>
        </div>

        {/* Center Section: Nav Links */}
        <div className="flex-grow flex justify-center space-x-6">
          <button
            onClick={() => handleProtectedClick('/grades')}
            className="text-lg font-bold text-white hover:text-[#BC9B6A] hover:font-extrabold transition"
            >
            Grades
          </button>
          <button
            onClick={() => handleProtectedClick('/tasks')}
            className="text-lg font-bold text-white hover:text-[#BC9B6A] hover:font-extrabold transition"
          >
            Tasks
          </button>
          <button
            onClick={() => handleProtectedClick('/support')}
            className="text-lg font-bold text-white hover:text-[#BC9B6A] hover:font-extrabold transition"
          >
            Support
          </button>
          <button
            onClick={() => handleProtectedClick('/study')}
            className="text-lg font-bold text-white hover:text-[#BC9B6A] hover:font-extrabold transition"
          >
            Study
          </button>
        </div>

        {/* Right Section: Sign Out Button */}
        <div className="flex-shrink-0">
          {loggedIn && (
            <button
              onClick={() => {
                onSignOut();
                navigate('/login');
              }}
              className="hidden sm:block text-lg font-semibold bg-[#BC9B6A] py-2 px-6 rounded-full hover:bg-[#7B313C] hover:text-white transition duration-200 min-w-[140px]"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
