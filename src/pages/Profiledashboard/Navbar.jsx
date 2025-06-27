import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell } from 'lucide-react';

const Navbar = ({ activePage, sidebarWidth, isSidebarOpen, userName }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const pageName = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  const subtitle = `Welcome back! Here's your ${pageName.toLowerCase()} overview`;
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JP';
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed. Please log in again.');
      setNotifications([]);
      setNotificationCount(0);
      return;
    }

    try {
      const response = await fetch('https://new-lms-backend-vmgr.onrender.com/api/v1/notifications?page=1&limit=5&isRead=false', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setError('Authentication failed. Please log in again.');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch notifications. Please check your connection.');
      }
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
        setNotificationCount(data.pagination.total);
        setError(null);
      } else {
        throw new Error('API response unsuccessful. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message || 'Unable to load notifications. Please try again later.');
      setNotifications([]);
      setNotificationCount(0);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await fetch(`https://new-lms-backend-vmgr.onrender.com/api/v1/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setNotificationCount((prev) => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('https://new-lms-backend-vmgr.onrender.com/api/v1/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      const data = await response.json();
      if (data.success) {
        setNotifications([]);
        setNotificationCount(0);
        setError(null);
      } else {
        throw new Error('API response unsuccessful');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError(error.message || 'Failed to mark all notifications as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  const toggleThemeHandler = () => {
    console.log('Toggling theme from:', theme);
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleRetry = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setError(null);
    fetchNotifications();
  };

  return (
    <nav
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 shadow-md flex items-center justify-between"
      style={{ marginLeft: isSidebarOpen ? '256px' : sidebarWidth }}
    >
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2" aria-label="Toggle sidebar">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold">{pageName}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="p-2"
          onClick={toggleThemeHandler}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: theme === 'dark' ? '#FFD700' : 'currentColor' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
        <div className="relative flex items-center">
          <button
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm relative flex items-center"
            onClick={togglePopup}
            aria-label={`Notifications, ${notificationCount} new`}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        <button
          className="p-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
          aria-label={`User profile for ${userName || 'User'}`}
        >
          {initials}
        </button>
      </div>

      {/* Notification Popup */}
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="absolute top-16 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto z-50"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h2>
              {notifications.length > 0 && (
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={markAllAsRead}
                  aria-label="Mark all notifications as read"
                >
                  Mark All Read
                </button>
              )}
            </div>
            {error ? (
              <div className="text-sm text-red-600 dark:text-red-400">
                <p>{error}</p>
                <button
                  className="text-sm mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={handleRetry}
                  aria-label="Retry loading notifications"
                >
                  Retry
                </button>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  {notification.actionUrl && (
                    <Link
                      to={`../CoursePlayer.jsx/${notification.relatedEntity._id}`}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block"
                      onClick={() => {
                        togglePopup();
                        markAsRead(notification._id);
                      }}
                      aria-label={`View course: ${notification.relatedEntity.title}`}
                    >
                      View Course
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">No new notifications</p>
            )}
            <button
              className="mt-2 w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={togglePopup}
              aria-label="Close notifications popup"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;