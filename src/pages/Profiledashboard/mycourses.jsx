import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Certificates from './Certificates'; // Adjust path to where Certificates.jsx is located

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('badges');
  const [student, setStudent] = useState(null);
  const [showAllTargets, setShowAllTargets] = useState(false);

  // Debug theme on mount
  useEffect(() => {
    console.log('Dashboard: Current theme from localStorage:', localStorage.getItem('theme'));
    console.log('Dashboard: Document classes:', document.documentElement.classList.toString());
  }, []);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Authentication required. Please log in.');
        return;
      }

      try {
        const res = await axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(res.data.data);
      } catch (err) {
        console.error('Unable to retrieve profile data:', err);
      }
    };

    fetchProfile();
  }, []);

  const recentlyEarnedBadges = [
    { name: 'Warrior', description: 'Badge for completing first course', date: 'Aug 24, 2024', icon: '🛡️' },
    { name: 'Ace', description: 'Badge for completing 25 quiz resources', date: 'Aug 17, 2024', icon: '🎯' },
    { name: 'Duelist', description: 'Badge for completing first quiz resource', date: 'Aug 17, 2024', icon: '⚔️' },
    { name: 'The Fledgling', description: 'Badge for registering on Wingspan platform', date: 'Aug 6, 2024', icon: '🐣' },
  ];

  const nextTargets = [
    { name: 'Management Jedi', description: 'Badge for completing the MBA management HBP courses', icon: '🏹' },
    { name: 'Quizzer', description: 'Badge for completing 100 quiz resources', icon: '❓' },
    { name: 'Champion', description: 'Badge for completing 25 courses', icon: '🏆' },
    { name: 'Knight', description: 'Badge for completing 10 courses', icon: '⚔️' },
    { name: 'Sensei', description: 'Badge for completing 100 courses', icon: '👨‍🏫' },
    { name: 'Wizard', description: 'Badge for completing 250 quiz resources', icon: '🎩' },
    { name: 'Genie', description: 'Badge for completing 100 quiz resources', icon: '🧞' },
  ];

  const handleViewToggle = () => {
    setShowAllTargets(!showAllTargets);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      {/* Tabs */}
      <div className="flex justify-center mb-4 bg-white dark:bg-gray-800 p-2 rounded-t-lg">
        <div className="flex w-full">
          <button
            className={`flex-1 px-4 py-2 rounded-t-lg ${
              activeTab === 'badges' ? 'bg-blue-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-t-lg ${
              activeTab === 'certificates' ? 'bg-blue-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setActiveTab('certificates')}
          >
            Certificates
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'badges' && (
          <>
            {/* Header Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Hi {student?.firstName || 'User'}!
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">Congratulations for your recently earned badges</p>
            </div>

            {/* Recently Earned Badges Section */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Recently earned badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recentlyEarnedBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                          {badge.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Awarded on {badge.date}</p>
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            {badge.name} {badge.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-purple-600 dark:text-purple-400 text-sm">✔</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Target Section */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Your Next Target</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {nextTargets.slice(0, showAllTargets ? nextTargets.length : 4).map((target, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-2xl">
                          {target.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{target.name}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{target.description}</p>
                        </div>
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-sm">✔</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={handleViewToggle}
              >
                {showAllTargets ? 'View Less' : 'View More'}
              </button>
            </div>
          </>
        )}

        {activeTab === 'certificates' && <Certificates />}
      </div>
    </div>
  );
};

export default Dashboard;