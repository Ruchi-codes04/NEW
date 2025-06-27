import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const Certificates = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`container mx-auto p-4 min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div
        className={`p-6 rounded-lg shadow-sm ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex justify-between mb-4">
          <h2
            className={`text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Certificates
          </h2>
          <span
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            1-2 of 2
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <th
                className={`text-left py-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Title
              </th>
              <th
                className={`text-left py-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Type
              </th>
              <th
                className={`text-left py-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Issued On
              </th>
              <th className="text-left py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              className={`border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <td
                className={`py-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Introduction to Machine Learning
              </td>
              <td
                className={`py-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Content Completion
              </td>
              <td
                className={`py-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                08 Nov 2022
              </td>
              <td className="py-2">
                <span
                  className={`cursor-pointer ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`}
                >
                  👁️
                </span>
                <span
                  className={`cursor-pointer ml-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`}
                >
                  ⬆️
                </span>
              </td>
            </tr>
            <tr>
              <td
                className={`py-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Overview of Infosys Springboard
              </td>
              <td
                className={`py-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                Content Completion
              </td>
              <td
                className={`py-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                }`}
              >
                08 Nov 2022
              </td>
              <td className="py-2">
                <span
                  className={`cursor-pointer ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`}
                >
                  👁️
                </span>
                <span
                  className={`cursor-pointer ml-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                  }`}
                >
                  ⬆️
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Certificates;