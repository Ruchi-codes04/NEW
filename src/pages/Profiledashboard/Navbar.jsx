import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = ({ activePage, sidebarWidth, isSidebarOpen, userName }) => {
  const { theme, setTheme } = useTheme();
  const pageName = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  const subtitle = `Welcome back! Here's your ${pageName.toLowerCase()} overview`;
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JP';

  const toggleThemeHandler = () => {
    console.log('Toggling theme from:', theme);
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav 
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 shadow-md flex items-center justify-between"
      style={{ marginLeft: isSidebarOpen ? '256px' : sidebarWidth }}
    >
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2">
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
        <button className="p-2" onClick={toggleThemeHandler}>
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
        <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">0 New</button>
        <button className="p-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
          {initials}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;