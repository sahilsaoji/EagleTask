import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';


// Import your page components
import Tasks from './components/Tasks';
import Dashboard from './components/Dashboard';
import Grades from './components/Grades';
import Loading from './components/Loading';
import Login from './components/Login';
import Navbar from './components/Navbar'; // Make sure Navbar is capitalized here

function App() {
  return (
    <Router>
      <div className="App">
        {/* Use Navbar component here */}
        <Navbar />

        {/* Route Definitions */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
