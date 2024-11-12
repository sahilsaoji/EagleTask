import React, { useState, useEffect } from 'react';
import { getCalendar } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch calendar events
  const fetchCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      // Grab the API key from local storage
      const storedApiKey = localStorage.getItem('api_key');
      if (!storedApiKey) {
        setError('API key not found. Please log in again.');
        setLoading(false);
        return;
      }

      const calendarData = await getCalendar(storedApiKey);
      setEvents(calendarData);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      setError('Failed to load calendar events. Please try again.');
    }
    setLoading(false);
  };

  // useEffect to fetch calendar data on component mount
  useEffect(() => {
    fetchCalendar();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#D9D9D9]">
        <div className="text-[#7B313C] text-xl font-semibold">Loading calendar events...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#D9D9D9]">
        <div className="text-[#7B313C] text-xl font-semibold">{error}</div>
      </div>
    );
  }

  // No events state
  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#D9D9D9]">
        <div className="text-[#7B313C] text-xl font-semibold">No upcoming events!</div>
      </div>
    );
  }

  // Render calendar events
  return (
    <div className="bg-[#D9D9D9] min-h-screen p-8">
      <h1 className="text-center text-6xl font-bold text-[#7B313C] mb-8">Calendar</h1>
      <div className="bg-[#1E1E1E] rounded-[50px] shadow-2xl p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-[#7B313C] text-white p-6 rounded-2xl shadow-md flex flex-col"
            >
              <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
              <p className="text-[#D9D9D9] mb-2">
                <strong>Course:</strong> {event.context_name}
              </p>
              <p className="text-[#D9D9D9] mb-2">
                <strong>Due:</strong> {new Date(event.start_at).toLocaleString()}
              </p>
              {event.assignment?.points_possible && (
                <p className="text-[#D9D9D9] mb-2">
                  <strong>Points:</strong> {event.assignment.points_possible}
                </p>
              )}
              <a
                href={event.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#BC9B6A] text-white py-3 px-6 mt-auto rounded-full font-semibold text-center transition-transform duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
              >
                View Assignment &rarr;
              </a>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 bg-[#BC9B6A] text-white py-3 px-8 rounded-full font-semibold flex items-center justify-center transition-transform duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7B313C]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Calendar;
