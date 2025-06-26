// src/ParentLayout.js
import React, { useState } from 'react';
import { ThemeProvider } from '../Profiledashboard/ThemeContext';
import Sidebar from './sidebar';
import Dashboard from './dashboard';
import MyCourses from './mycourses';
import Contact from './contact';
import AssessmentScores from './assessmentscore';
import Interest from './Interest';
import Settings from './Settings';

import { Navigate } from 'react-router-dom';

const ParentLayout = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 const renderPage = () => {
  switch (activePage) {
    case 'home':
      return <Navigate to="/"  />;
    case 'dashboard':
      return <Dashboard />;
    case 'Achievements':
      return <MyCourses />;
    case 'contact':
      return <Contact />;
    case 'assessmentscore':
      return <AssessmentScores />;
    case 'Interest':
      return <Interest />;
    case 'Settings':
      return <Settings />;
  
    default:
      return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        {/* <div className="h-[3.5rem] bg-white dark:bg-gray-800 shadow-md flex items-center px-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </div> */}

        {/* Sidebar Toggle Button (Visible only on mobile) */}
        <button
          className="md:hidden fixed top-[4rem] right-4 z-20 p-2 bg-[#49BBBD] dark:bg-[#2A9D8F] text-white dark:text-gray-100 rounded-md"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? 'Close' : 'Menu'}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed left-0 h-[calc(100vh-3.5rem)] w-16 md:w-64 transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } z-40`}
        >
          <Sidebar
            activePage={activePage}
            setActivePage={(page) => {
              setActivePage(page);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Overlay when sidebar is open (Visible only on mobile) */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-30"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-700 px-2 min-h-[calc(100vh-3.5rem)] md:ml-16 md:ml-64">
          {renderPage()}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ParentLayout;