import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Import your page components
import Tasks from './components/Tasks';
import Dashboard from './components/Dashboard';
import Grades from './components/Grades';
import LoadingIndicator from './components/LoadingIndicator';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Support from './components/Support';
import Help from './components/Help';
import Study from './components/Study';

function App() {
  // Initialize `loggedIn` from `localStorage` to persist state across reloads
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // Update `localStorage` whenever `loggedIn` changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', loggedIn);
  }, [loggedIn]);

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
              element={loggedIn ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/tasks"
              element={loggedIn ? <Tasks /> : <Navigate to="/login" />}
            />
            <Route
              path="/grades"
              element={loggedIn ? <Grades /> : <Navigate to="/login" />}
            />
            <Route
              path="/support"
              element={loggedIn ? <Support /> : <Navigate to="/login" />}
            />
            <Route
              path="/study"
              element={loggedIn ? <Study /> : <Navigate to="/login" />}
            />
            <Route path="/loading" element={<LoadingIndicator />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
