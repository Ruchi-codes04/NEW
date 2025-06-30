import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaStar,
  FaRegClock,
  FaUserGraduate,
  FaUsers,
  FaPlay,
  FaCheck,
  FaDownload,
  FaGlobe,
  FaCertificate,
  FaChevronDown,
  FaChevronUp,
  FaShare,
  FaLock,
  FaPlayCircle,
  FaQuestionCircle,
  FaCode,
  FaArrowLeft,
  FaShoppingCart
} from 'react-icons/fa';
import Notification from './AllCoursesComponents/Notification'; 

const API_BASE_URL = 'https://lms-backend-flwq.onrender.com';

const ViewCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Scroll to top when component mounts or when course ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('Token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_BASE_URL}/api/v1/courses/${id}`, { headers });
        console.log('Course details response:', response.data);

        if (response.data.success) {
          const courseData = response.data.data;
          // Transform API data to match expected structure
          const transformedCourse = {
            id: courseData._id,
            title: courseData.title,
            description: courseData.description,
            longDescription: courseData.longDescription || courseData.description, // Fallback to description
            instructor: `${courseData.instructor.firstName} ${courseData.instructor.lastName}`,
            instructorBio: courseData.instructorBio || 'Experienced instructor with expertise in the field.', // Default
            instructorImage: courseData.instructorImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', // Default
            rating: courseData.rating,
            reviews: courseData.totalRatings,
            students: courseData.totalStudents,
            duration: `${courseData.duration} hours`,
            level: courseData.level.charAt(0).toUpperCase() + courseData.level.slice(1),
            category: courseData.category.toLowerCase(),
            price: courseData.price === 0 ? 'Free' : `₹${courseData.price}`,
            originalPrice: courseData.discountPrice ? `₹${courseData.discountPrice}` : null,
            image: courseData.thumbnail,
            videoUrl: courseData.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default
            language: courseData.language || 'English', // Default
            subtitles: courseData.subtitles || ['English', 'Hindi'], // Default
            lastUpdated: courseData.lastUpdated || 'December 2024', // Default
            certificate: courseData.certificate !== undefined ? courseData.certificate : true, // Default
            downloadable: courseData.downloadable !== undefined ? courseData.downloadable : true, // Default
            lifetime: courseData.lifetime !== undefined ? courseData.lifetime : true, // Default
            mobileAccess: courseData.mobileAccess !== undefined ? courseData.mobileAccess : true, // Default
            modules: courseData.modules || [], 
            learningOutcomes: courseData.learningOutcomes || [
              'Master key concepts and skills',
              'Apply knowledge to real-world projects',
              'Gain industry-relevant expertise'
            ], // Default
            requirements: courseData.requirements || [
              'Basic computer skills',
              'Internet access',
              'Willingness to learn'
            ], // Default
            features: courseData.features || [
              { icon: FaRegClock, text: `${courseData.duration} hours of on-demand video` },
              { icon: FaDownload, text: 'Downloadable resources' },
              { icon: FaGlobe, text: 'Access on mobile and desktop' },
              { icon: FaCertificate, text: 'Certificate of completion' },
              { icon: FaUsers, text: 'Access to student community' }
            ] // Default
          };
          setCourse(transformedCourse);
        } else {
          throw new Error('Failed to fetch course details');
        }
      } catch (err) {
        console.error('Fetch Course Error:', err);
        let errorMessage = err.response?.data?.message || 'Error fetching course details';
        if (err.response?.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
          localStorage.removeItem('Token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/'), 2000);
        }
        setError(errorMessage);
        setNotification({ message: errorMessage, type: 'error' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course?.title || 'Course',
        text: course?.description || 'Check out this course!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setNotification({ message: 'Course link copied to clipboard!', type: 'success' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handlePreviewVideo = () => {
    setShowVideoModal(true);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaPlayCircle className="text-teal-600" />;
      case 'quiz':
        return <FaQuestionCircle className="text-blue-600" />;
      case 'project':
        return <FaCode className="text-purple-600" />;
      default:
        return <FaPlayCircle className="text-teal-600" />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading course...</div>;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'Course not found'}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Notification notification={notification} setNotification={setNotification} />
      {/* Course Header */}
      <section className="py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/courses/all" className="flex items-center text-teal-600 hover:text-teal-700">
              <FaArrowLeft className="mr-2" />
              Back to All Courses
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6 lg:space-y-8">
              {/* Course Badge */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-teal-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {course.category}
                </span>
                <span className="bg-yellow-500 text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                  Bestseller
                </span>
                <span className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Updated {course.lastUpdated}
                </span>
              </div>

              {/* Course Title and Description */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{course.title}</h1>
                <p className="text-lg sm:text-xl text-gray-400 mb-4 sm:mb-6">{course.description}</p>
                
                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold mr-1">{course.rating}</span>
                    <span className="text-black">({course.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center text-black">
                    <FaUsers className="mr-1" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center text-black">
                    <FaRegClock className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-black">
                    <FaUserGraduate className="mr-1" />
                    <span>{course.level}</span>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center mt-6">
                  {/* <img 
                    src={course.instructorImage} 
                    alt={course.instructor}
                    className="w-12 h-12 rounded-full mr-3"
                  /> */}
                  <div>
                    <p className="text-sm text-black">Created by</p>
                    <p className="font-semibold">{course.instructor}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 mt-8">
                  <button
                    onClick={handleShare}
                    className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-teal-100 transition-all duration-300 hover:border-teal-500"
                  >
                    <FaShare className="mr-2" />
                    Share Course
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content - Course Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
                {/* Video Preview */}
                <div className="relative group">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-60 transition-all duration-300">
                    <button
                      onClick={handlePreviewVideo}
                      className="bg-white rounded-full p-3 hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <FaPlay className="text-teal-600 text-lg ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    Preview Course
                  </div>
                </div>

                {/* Pricing and Enrollment */}
                <div className="p-5">
                  <div className="text-center mb-5">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                      {course.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">{course.originalPrice}</span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          {Math.round(((parseFloat(course.originalPrice.replace('₹', '')) - parseFloat(course.price.replace('₹', ''))) / parseFloat(course.originalPrice.replace('₹', ''))) * 100)}% OFF
                        </span>
                        <span className="text-sm text-gray-600">Limited time offer!</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      ⏰ Offer ends in 2 days
                    </div>
                  </div>

                  <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4">
                    <FaShoppingCart className="inline mr-2" />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'curriculum', label: 'Curriculum' },
                    { id: 'instructor', label: 'Instructor' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-teal-600 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* About Course */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About this course</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{course.longDescription}</p>
                  </div>

                  {/* What You'll Learn */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.learningOutcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start">
                          <FaCheck className="text-teal-600 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Course curriculum</h3>
                    <div className="text-sm text-gray-600">
                      {course.modules.length} sections • {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons • {course.duration}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-4 font-bold text-sm">
                              {moduleIndex + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">{module.title}</h4>
                              <p className="text-sm text-gray-600">{module.lessons.length} lessons • {module.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {module.lessons.filter(l => l.preview).length} preview{module.lessons.filter(l => l.preview).length !== 1 ? 's' : ''}
                            </span>
                            {expandedModule === module.id ? (
                              <FaChevronUp className="text-gray-400" />
                            ) : (
                              <FaChevronDown className="text-gray-400" />
                            )}
                          </div>
                        </button>

                        {expandedModule === module.id && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            {module.lessons.map((lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-white transition-colors">
                                <div className="flex items-center flex-1">
                                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <p className="font-medium text-gray-900">{lesson.title}</p>
                                      {lesson.preview && (
                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                                          FREE
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-4 mt-1">
                                      <p className="text-sm text-gray-600">{lesson.duration}</p>
                                      <span className="text-xs text-gray-500 capitalize">{lesson.type}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {lesson.preview ? (
                                    <button className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center">
                                      <FaPlay className="mr-1 text-xs" />
                                      Preview
                                    </button>
                                  ) : (
                                    <FaLock className="text-gray-400 text-sm" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'instructor' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Meet your instructor</h3>
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                      <div className="flex-shrink-0">
                        <img
                          src={course.instructorImage}
                          alt={course.instructor}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor}</h4>
                        <p className="text-teal-600 font-medium mb-4">Senior Instructor</p>
                        <p className="text-gray-700 leading-relaxed mb-6">{course.instructorBio}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                            <div className="flex items-center justify-center mb-2">
                              <FaStar className="text-yellow-400 mr-1" />
                              <span className="font-bold text-lg">{course.rating}</span>
                            </div>
                            <p className="text-sm text-gray-600">Instructor Rating</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                            <div className="flex items-center justify-center mb-2">
                              <FaUsers className="text-teal-600 mr-1" />
                              <span className="font-bold text-lg">{(course.students / 1000).toFixed(0)}K+</span>
                            </div>
                            <p className="text-sm text-gray-600">Students Taught</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                            <div className="flex items-center justify-center mb-2">
                              <FaCertificate className="text-purple-600 mr-1" />
                              <span className="font-bold text-lg">15+</span>
                            </div>
                            <p className="text-sm text-gray-600">Courses Created</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">Expert Instructor</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{course.category} Specialist</span>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Industry Leader</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Student reviews</h3>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="text-gray-600">Reviews section coming soon...</p>
                    <p className="text-sm text-gray-500 mt-2">Students will be able to leave reviews after course completion.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Details */}
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <FaCertificate className="mr-2 text-teal-600" />
                  Course Details
                </h4>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <FaUserGraduate className="mr-2 text-gray-400" />
                      Level:
                    </span>
                    <span className="font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <FaRegClock className="mr-2 text-gray-400" />
                      Duration:
                    </span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <FaGlobe className="mr-2 text-gray-400" />
                      Language:
                    </span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">{course.lastUpdated}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center">
                      <FaCertificate className="mr-2 text-gray-400" />
                      Certificate:
                    </span>
                    <span className="font-medium text-green-600">
                      {course.certificate ? '✓ Included' : 'Not included'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-3">Share this course</h5>
                  <button
                    onClick={handleShare}
                    className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <FaShare className="inline mr-2" />
                    Share Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Course Preview</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={course.videoUrl}
                title="Course Preview"
                className="w-full h-full"
                style={{ border: 'none' }}
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600">
                This is a preview of the course content. Enroll now to access the full course with {course.modules.reduce((total, module) => total + module.lessons.length, 0)} lessons.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCourse;