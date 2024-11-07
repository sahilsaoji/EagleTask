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
    // Check if user is logged in by looking for stored courses with grades in localStorage
    setLoggedIn(!!localStorage.getItem('courses_with_graded_assignments'));
  }, []);

  // Function to check if the user is logged in
  const isLoggedIn = () => {
    const loggedInStatus = !!localStorage.getItem('courses_with_graded_assignments');
    console.log("Is user logged in:", loggedInStatus); // Debug log to verify login status
    return loggedInStatus;
  };

  const handleSignOut = () => {
    localStorage.clear();
    setLoggedIn(false); // Update login state to reflect sign-out
  };

  // Set basename based on environment
  const basename = process.env.NODE_ENV === 'production' ? '/eagletask' : '/';

  return (
    <Router basename={basename}>
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
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
