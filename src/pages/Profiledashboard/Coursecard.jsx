import React, { useState, useEffect } from "react";
import { FaPlay, FaBookmark } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white transition-opacity duration-300 z-50 ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "https://new-lms-backend-vmgr.onrender.com/api/v1/students";

  const fetchBookmarkedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(
        `${API_BASE_URL}/courses/bookmarked`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookmarkedCourses(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch bookmarks');
      }
    } catch (err) {
      console.error('Bookmarks API Error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to load bookmarks';
      setError(errorMessage);
      setNotification({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedCourses();
  }, []);

  const handleBookmark = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ message: 'Please login to manage bookmarks', type: 'error' });
        return;
      }

      const isBookmarked = bookmarkedCourses.some(c => c._id === courseId);
      
      const config = {
        method: isBookmarked ? 'delete' : 'post',
        url: `${API_BASE_URL}/courses/${courseId}/bookmark`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios(config);

      if (response.data.success) {
        setNotification({
          message: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
          type: 'success',
        });
        await fetchBookmarkedCourses();
      }
    } catch (err) {
      console.error('Bookmark Error:', err);
      let errorMessage = 'Bookmark operation failed';
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Session expired. Please login again.';
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      setNotification({
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handlePlayCourse = (courseId) => {
    navigate(`/course-player/${courseId}`);
  };

  const displayedCourses = showAll ? bookmarkedCourses : bookmarkedCourses.slice(0, 3);
  const shouldShowViewAllButton = bookmarkedCourses.length > 3 && !showAll;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Notification 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: '', type: '' })} 
      />

      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          My Bookmarked Courses
        </h2>
      </div>

      {bookmarkedCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            You haven't bookmarked any courses yet.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 px-8 py-3 bg-[#59c1c3] text-white rounded-full font-semibold text-lg hover:bg-[#7ddedf] transition-colors duration-300 shadow-lg"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 mb-4 rounded-md overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Thumbnail";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No thumbnail</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(course._id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      bookmarkedCourses.some(c => c._id === course._id)
                        ? 'text-yellow-500 bg-white bg-opacity-90'
                        : 'text-gray-500 bg-white bg-opacity-70 hover:bg-opacity-90'
                    }`}
                  >
                    <FaBookmark />
                  </button>
                </div>
                <h3 className="font-medium text-lg text-gray-800 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    {course.discountPrice ? (
                      <>
                        <span className="font-bold text-gray-800">
                          ₹{course.discountPrice}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ₹{course.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-800">
                        ₹{course.price}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlayCourse(course._id)}
                    className="flex items-center gap-2 text-sm bg-[#49BBBD] hover:bg-[#3AA8AA] text-white px-4 py-2 rounded"
                  >
                    <FaPlay size={10} /> Continue
                  </button>
                </div>
              </div>
            ))}
          </div>

          {shouldShowViewAllButton && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="px-8 py-3 bg-[#59c1c3] text-white rounded-full font-semibold text-lg hover:bg-[#7ddedf] transition-colors duration-300 shadow-lg"
              >
                View All Bookmarked Courses
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;