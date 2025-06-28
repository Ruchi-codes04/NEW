import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navigation from './sidebar';
import Dashboard from './dashboard';
import MyCourses from './MyCourses';
import Contact from './contact';
import AssessmentScores from './assessmentscore';
import Interest from './Interest';
import Settings from './Settings';
import CoursePlayer from '../CoursePlayer';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white transition-opacity duration-300 z-50 ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 p-2 hover:text-gray-200">✕</button>
      </div>
    </div>
  );
};

const ParentLayout = () => {
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState('dashboard');
  const [courseId, setCourseId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState('64px');
  const [userName, setUserName] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setNotification({ message: 'Authentication required. Please log in.', type: 'error' });
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const res = await axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const studentData = res.data.data;
        setUserName(studentData.firstName || `${studentData.firstName} ${studentData.lastName}` || 'User');
      } catch (err) {
        console.error('Error fetching profile:', err);
        let message = 'Unable to retrieve profile data. Please try again later.';
        if (err.response?.status === 401) {
          message = 'Session expired or invalid token. Please log in again.';
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
          }, 2000);
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        setNotification({ message, type: 'error' });
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    setSidebarWidth(isSidebarOpen ? '200px' : '64px');
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Navigate to="/" />;
      case 'dashboard':
        return <Dashboard sidebarWidth={sidebarWidth} />;
      case 'Achievements':
        return <MyCourses sidebarWidth={sidebarWidth} />;
      case 'contact':
        return <Contact sidebarWidth={sidebarWidth} relatedCourseId={null} />;
      case 'assessmentscore':
        return <AssessmentScores sidebarWidth={sidebarWidth} />;
      case 'Interest':
        return <Interest sidebarWidth={sidebarWidth} />;
      case 'Settings':
        return <Settings sidebarWidth={sidebarWidth} />;
      case 'courseplayer':
        return <CoursePlayer sidebarWidth={sidebarWidth} courseId={courseId} />;
      default:
        return <Dashboard sidebarWidth={sidebarWidth} />;
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
      }`}
    >
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <button
        className="md:hidden p-4 fixed top-0 left-0 z-40"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>
      <Navigation
        activePage={activePage}
        setActivePage={(page, courseId) => {
          setActivePage(page);
          if (courseId) setCourseId(courseId);
          setIsSidebarOpen(false); // Close sidebar on item selection
        }}
        userName={userName}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setSidebarWidth={setSidebarWidth}
      />
      {isSidebarOpen && (
        <div
          className={`md:hidden fixed inset-0 z-30 ${
            theme === 'dark' ? 'bg-gray-900 bg-opacity-70' : 'bg-black bg-opacity-50'
          }`}
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`flex-1 overflow-auto px-2 min-h-screen transition-all duration-300 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
        }`}
        style={{ marginLeft: sidebarWidth }}
      >
        {renderPage()}
      </div>
    </div>
  );
};

export default ParentLayout;