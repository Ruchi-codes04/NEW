import React, { useContext } from 'react';
import { ThemeContext } from '../Profiledashboard/ThemeContext'; // Adjust path as needed

const Certificates = () => {
  const { theme } = useContext(ThemeContext); // Access theme from context

  return (
    <div className={`container mx-auto p-4 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Content Area */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">Certificates</h2>
            <span className="text-sm">1-2 of 2</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Issued On</th>
                <th className="text-left py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2">Introduction to Machine Learning</td>
                <td className="py-2">Content Completion</td>
                <td className="py-2">08 Nov 2022</td>
                <td className="py-2">
                  <span className="text-blue-400 dark:text-blue-300 cursor-pointer">👁️</span>
                  <span className="text-blue-400 dark:text-blue-300 cursor-pointer ml-2">⬆️</span>
                </td>
              </tr>
              <tr>
                <td className="py-2">Overview of Infosys Springboard</td>
                <td className="py-2">Content Completion</td>
                <td className="py-2">08 Nov 2022</td>
                <td className="py-2">
                  <span className="text-blue-400 dark:text-blue-300 cursor-pointer">👁️</span>
                  <span className="text-blue-400 dark:text-blue-300 cursor-pointer ml-2">⬆️</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Certificates;