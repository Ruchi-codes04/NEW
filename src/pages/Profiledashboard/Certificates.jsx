import React from 'react';

const Certificates = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Certificates</h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">1-2 of 2</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 text-gray-900 dark:text-gray-200">Title</th>
                <th className="text-left py-2 text-gray-900 dark:text-gray-200">Type</th>
                <th className="text-left py-2 text-gray-900 dark:text-gray-200">Issued On</th>
                <th className="text-left py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 text-gray-800 dark:text-gray-300">Introduction to Machine Learning</td>
                <td className="py-2 text-gray-800 dark:text-gray-300">Content Completion</td>
                <td className="py-2 text-gray-800 dark:text-gray-300">08 Nov 2022</td>
                <td className="py-2">
                  <span className="text-blue-500 dark:text-blue-400 cursor-pointer">👁️</span>
                  <span className="text-blue-500 dark:text-blue-400 cursor-pointer ml-2">⬆️</span>
                </td>
              </tr>
              <tr>
                <td className="py-2 text-gray-800 dark:text-gray-300">Overview of Infosys Springboard</td>
                <td className="py-2 text-gray-800 dark:text-gray-300">Content Completion</td>
                <td className="py-2 text-gray-800 dark:text-gray-300">08 Nov 2022</td>
                <td className="py-2">
                  <span className="text-blue-500 dark:text-blue-400 cursor-pointer">👁️</span>
                  <span className="text-blue-500 dark:text-blue-400 cursor-pointer ml-2">⬆️</span>
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