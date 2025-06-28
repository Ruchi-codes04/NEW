import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import defaultCourseAvatar from '../../assets/iconsss.png';

const InterestPage = () => {
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [myInterests, setMyInterests] = useState(() => {
    const savedInterests = localStorage.getItem('myInterests');
    return savedInterests ? JSON.parse(savedInterests) : [];
  });
  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialVisibleCount = 5;
  const navigate = useNavigate();

  // Validate image URL
  const isValidImageUrl = (url) => {
    return typeof url === 'string' && url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://lms-backend-flwq.onrender.com/api/v1/courses');
        if (response.data.success) {
          console.log('Courses:', response.data.data);
          setCourses(response.data.data);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Error fetching courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    localStorage.setItem('myInterests', JSON.stringify(myInterests));
  }, [myInterests]);

  const handleAddInterest = (courseCategory) => {
    if (!myInterests.includes(courseCategory)) {
      setMyInterests([...myInterests, courseCategory]);
    }
  };

  const handleRemoveInterest = (interest) => {
    setMyInterests(myInterests.filter((item) => item !== interest));
  };

  const handleToggleView = (e) => {
    e.preventDefault();
    setVisibleCourses((prev) =>
      prev < uniqueCategories.length ? uniqueCategories.length : initialVisibleCount
    );
  };

  const uniqueCategories = [
    ...new Set(courses.map((course) => course.category)),
  ]
    .filter((category) =>
      category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((category) => !myInterests.includes(category))
    .sort((a, b) => a.localeCompare(b));

  const allInterestCourses = courses.filter((course) =>
    myInterests.includes(course.category)
  );

  const handleCourseClick = (course) => {
    navigate(`/courses/${course._id}`);
  };

  const defaultInstructorAvatar = 'https://via.placeholder.com/30?text=Instructor';

  if (loading)
    return (
      <p
        className={`text-center text-base sm:text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        Loading courses...
      </p>
    );
  if (error)
    return (
      <p
        className={`text-center text-base sm:text-lg ${
          theme === 'dark' ? 'text-red-400' : 'text-red-500'
        }`}
      >
        {error}
      </p>
    );

  return (
    <div
      className={`w-full min-h-screen mx-auto p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg max-w-7xl flex flex-col transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <h1
        className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        } mb-4`}
      >
        What are your interests?
      </h1>
      <p
        className={`text-sm sm:text-base lg:text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        } mb-4 max-w-3xl`}
      >
        Please let us know topics of interest to you, so we can help identify the content that would be most relevant to you.
      </p>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search categories"
          className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-800 text-gray-100 focus:ring-blue-400'
              : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && uniqueCategories.length === 0 && (
          <p
            className={`text-sm sm:text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            } mt-2`}
          >
            No matching categories found
          </p>
        )}
      </div>

      <div className="mb-6">
        <h2
          className={`text-lg sm:text-xl lg:text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          } mb-2`}
        >
          My Interests
        </h2>
        {myInterests.length === 0 ? (
          <p
            className={`text-sm sm:text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            No Interests
          </p>
        ) : (
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {myInterests.map((interest, index) => (
                <button
                  key={index}
                  className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base text-white rounded-lg transition ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-500'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } flex items-center`}
                  onClick={() => handleRemoveInterest(interest)}
                >
                  {interest}{' '}
                  <span
                    className={`ml-2 text-sm ${
                      theme === 'dark' ? 'text-red-400' : 'text-red-500'
                    }`}
                  >
                    ✕
                  </span>
                </button>
              ))}
            </div>
            {allInterestCourses.length > 0 && (
              <div className="ml-0 sm:ml-4">
                <h3
                  className={`text-base sm:text-lg lg:text-xl font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  } mb-2`}
                >
                  Associated Courses
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {allInterestCourses.map((course, idx) => (
                    <div
                      key={course._id || idx}
                      className={`rounded-lg shadow-md p-4 flex flex-col justify-between ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                      } transition-transform hover:scale-105`}
                    >
                      <div>
                        <img
                          src={
                            isValidImageUrl(course.thumbnail)
                              ? course.thumbnail
                              : defaultCourseAvatar
                          }
                          alt={course.title || 'Course Image'}
                          className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg mb-4"
                          onError={(e) => {
                            console.log(
                              `Image failed to load for course: ${course.title}, URL: ${course.thumbnail}`
                            );
                            e.target.src = defaultCourseAvatar;
                          }}
                        />
                        <h4
                          className={`text-base sm:text-lg font-semibold line-clamp-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {course.title || 'Untitled Course'}
                        </h4>
                        <p
                          className={`text-sm sm:text-base ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          } mt-2 line-clamp-1`}
                        >
                          {course.category || 'No category'}
                        </p>
                        <p
                          className={`font-bold text-sm sm:text-base mt-2 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`}
                        >
                          ₹{course.discountPrice || course.price || '0'}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={
                              course.instructor?.avatar || defaultInstructorAvatar
                            }
                            alt="Instructor"
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2"
                            onError={(e) => (e.target.src = defaultInstructorAvatar)}
                          />
                          <span
                            className={`text-sm sm:text-base line-clamp-1 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {course.instructor
                              ? `${course.instructor.firstName} ${course.instructor.lastName}`
                              : 'Unknown Instructor'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`mr-1 text-sm sm:text-base ${
                              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                            }`}
                          >
                            ★
                          </span>
                          <span
                            className={`text-sm sm:text-base ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            {course.rating || '0'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCourseClick(course)}
                        className={`mt-4 w-full text-sm sm:text-base text-white py-2 rounded-lg transition ${
                          theme === 'dark'
                            ? 'bg-blue-600 hover:bg-blue-500'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        View Course
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        <h2
          className={`text-lg sm:text-xl lg:text-2xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          } mb-2`}
        >
          All Categories
        </h2>
        <p
          className={`text-sm sm:text-base lg:text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          } mb-4 max-w-3xl`}
        >
          Pick categories below you're interested in and help Infosys Springboard to know you better. The platform will use this information to improve your learning recommendations. The more often you use Infosys Springboard, the better the recommendations will be. Take the first step to your personalized learning experience!
        </p>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          {uniqueCategories.slice(0, visibleCourses).map((category, index) => (
            <button
              key={index}
              className={`px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg transition ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
              onClick={() => handleAddInterest(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {uniqueCategories.length > initialVisibleCount && (
          <a
            href="#"
            className={`text-sm sm:text-base ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
            } hover:underline`}
            onClick={handleToggleView}
          >
            {visibleCourses < uniqueCategories.length
              ? `View ${uniqueCategories.length - visibleCourses} more`
              : 'View less'}
          </a>
        )}
      </div>
    </div>
  );
};

export default InterestPage;