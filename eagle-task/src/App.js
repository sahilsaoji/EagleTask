import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    setLoggedIn(!!localStorage.getItem('courses_with_graded_assignments'));
  }, []);

  // Function to check if the user is logged in
  const isLoggedIn = () => !!localStorage.getItem('courses_with_graded_assignments');

  const handleSignOut = () => {
    localStorage.clear();
    setLoggedIn(false); // Update login state to reflect sign-out
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar always shown, with buttons greyed out if not logged in */}
        <Navbar isLoggedIn={loggedIn} onSignOut={handleSignOut} />

        {/* Route Definitions */}
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
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
