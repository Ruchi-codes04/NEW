import React, { useState, useContext } from 'react';
import { FiGrid, FiHeart, FiHome, FiFileText, FiSettings, FiMessageSquare, FiStar } from 'react-icons/fi';
import { RiMedalLine } from 'react-icons/ri';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Ensure this import is present
import { ThemeContext } from '../../contexts/ThemeContext';

const Sidebar = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useContext(ThemeContext);

  const menu = [
    { name: 'home', icon: <FiHome className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Go to Home' },
    { name: 'dashboard', icon: <FiGrid className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Dashboard' },
    { name: 'Achievements', icon: <RiMedalLine className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Achievements' },
    { name: 'assessmentscore', icon: <FiStar className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Assessment Score' },
    { name: 'Interest', icon: <FiHeart className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Interest' },
    { name: 'contact', icon: <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Contact' },
    { name: 'Settings', icon: <FiSettings className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div
      className={`shadow-md flex flex-col items-center py-6 space-y-1 fixed left-0 h-screen transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-16'
      } ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-600'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {menu.map((item) => (
        <div
          key={item.name}
          className="relative group w-full flex justify-center p-3 cursor-pointer rounded-xl transition-colors duration-200"
          onClick={() => setActivePage(item.name)}
        >
          <div
            className={`flex items-center gap-4 rounded-xl p-2 transition-colors duration-200 ${
              activePage === item.name
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-100'
                  : 'bg-gray-200 text-gray-800'
                : theme === 'dark'
                ? 'text-gray-300 group-hover:bg-gray-700 group-hover:text-gray-100'
                : 'text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800'
            } ${isExpanded ? 'w-full pl-4' : 'w-10 justify-center'}`}
          >
            {item.icon}
            {isExpanded && <span className="text-sm capitalize">{item.label}</span>}
          </div>
        </div>
      ))}
      <div
        className="relative group w-full flex justify-center p-3 cursor-pointer rounded-xl transition-colors duration-200 mt-auto"
        onClick={handleLogout}
      >
        <div
          className={`flex items-center gap-4 rounded-xl p-2 transition-colors duration-200 ${
            theme === 'dark'
              ? 'text-gray-300 group-hover:bg-gray-700 group-hover:text-gray-100'
              : 'text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800'
          } ${isExpanded ? 'w-full pl-4' : 'w-10 justify-center'}`}
        >
          <FaSignOutAlt className="w-5 h-5 sm:w-6 sm:h-6" />
          {isExpanded && <span className="text-sm capitalize">Sign Out</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;