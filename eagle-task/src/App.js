import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Import your page components
import Tasks from './components/Tasks';
import Dashboard from './components/Dashboard';
import Grades from './components/Grades';
import Loading from './components/Loading';
import Login from './components/Login';
import Navbar from './components/Navbar';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for stored courses with grades in localStorage
    setLoggedIn(!!localStorage.getItem('courses_with_graded_assignments'));
  }, []);

  const isLoggedIn = () => {
    return !!localStorage.getItem('courses_with_graded_assignments');
  };

  const handleSignOut = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={loggedIn} onSignOut={handleSignOut} />

        {/* Main Content */}
        <div className="mt-[0px]">
          <Routes>
            <Route
              path="/"
              element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks"
              element={isLoggedIn() ? <Tasks /> : <Navigate to="/login" />}
            />
            <Route
              path="/grades"
              element={isLoggedIn() ? <Grades /> : <Navigate to="/login" />}
            />
            <Route path="/loading" element={<Loading />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
