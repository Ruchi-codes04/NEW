import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, HelpCircle, Star, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import arrowLeft from '../assets/image (1).png';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [courseTitle, setCourseTitle] = useState('Course Player');
  const [instructorName, setInstructorName] = useState('Unknown Instructor');
  const [courses, setCourses] = useState([]);
  const [activeLecture, setActiveLecture] = useState({ moduleIndex: null, lessonIndex: null });
  const [assessments, setAssessments] = useState([]);
  const [isAssessmentsModalOpen, setIsAssessmentsModalOpen] = useState(false);
  const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState('');
  const [assessmentsError, setAssessmentsError] = useState('');
  const [contentError, setContentError] = useState('');
  const [form, setForm] = useState({
    name: '',
    subject: '',
    message: '',
    category: 'course',
    relatedCourse: courseId || '',
  });
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [contactCourses, setContactCourses] = useState([]);
  const notificationsPopupRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [contentRes, enrollmentRes, coursesRes, assessmentsRes, profileRes, notificationsRes] = await Promise.all([
          axios.get(`https://lms-backend-flwq.onrender.com/api/v1/courses/${courseId}/content`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
          axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://lms-backend-flwq.onrender.com/api/v1/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://lms-backend-flwq.onrender.com/api/v1/students/courses/${courseId}/assessments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://new-lms-backend-vmgr.onrender.com/api/v1/notifications/course/${courseId}?page=1&limit=10&isRead=false`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch((err) => ({ data: { success: false }, error: err })),
        ]);

        if (profileRes.data.data) {
          const { firstName, lastName } = profileRes.data.data;
          setForm((prev) => ({ ...prev, name: `${firstName} ${lastName}` }));
        }

        if (enrollmentRes.data.success) {
          const enrolledCourses = enrollmentRes.data.data || [];
          const course = enrolledCourses.find(
            (enrollment) => enrollment.course && String(enrollment.course._id) === String(courseId)
          );
          if (course?.course) {
            setCourseTitle(course.course.title);
            setInstructorName(`${course.course.instructor.firstName} ${course.course.instructor.lastName}`);
          } else {
            setCourseTitle('Course Not Found');
            setInstructorName('ixo');
          }

          setContactCourses(
            enrolledCourses
              .filter((enrollment) => enrollment.course && enrollment.course._id)
              .map((enrollment) => ({
                _id: enrollment.course._id,
                title: enrollment.course.title,
              }))
          );
        }

        if (contentRes.data.success && Array.isArray(contentRes.data.data)) {
          const formattedModules = contentRes.data.data.map((section) => ({
            title: section.sectionTitle || 'Untitled Section',
            lessons: (section.lectures || []).map((lecture, index) => ({
              title: lecture.title || `Lesson ${index + 1}`,
              time: lecture.duration
                ? `${Math.floor(lecture.duration / 60)}:${(lecture.duration % 60).toString().padStart(2, '0')}`
                : '0:00',
              content: lecture.content || {},
              isPreview: lecture.isPreview || false,
            })),
            active: false,
          }));
          setModules(formattedModules);

          if (formattedModules.length > 0 && formattedModules[0].lessons.length > 0) {
            const firstLecture = formattedModules[0].lessons[0];
            if (firstLecture.content?.url) {
              setSelectedVideo({
                title: firstLecture.content.title || firstLecture.title,
                description: firstLecture.content.description || 'No description available.',
                url: firstLecture.content.url,
              });
              setActiveLecture({ moduleIndex: 0, lessonIndex: 0 });
              setModules((prev) => [
                { ...prev[0], active: true },
                ...prev.slice(1),
              ]);
            } else {
              setContentError('No playable videos available for this course.');
            }
          } else {
            setContentError('No lessons available for this course.');
          }
        } else {
          setContentError('Failed to load course content.');
          console.error('Content API Error:', contentRes.error?.message || 'Unknown error');
        }

        if (coursesRes.data.success) {
          setCourses(coursesRes.data.data.filter((course) => String(course._id) !== String(courseId)));
        }

        if (assessmentsRes.data.success) {
          setAssessments(assessmentsRes.data.data);
        } else {
          setAssessmentsError('No assessments found for this course.');
        }

        if (notificationsRes.data.success) {
          setNotifications(notificationsRes.data.data);
        } else {
          setNotificationsError('Failed to load notifications.');
          console.error('Notifications API Error:', notificationsRes.error?.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrorMsg(
          error.message === 'No authentication token found' || error.response?.status === 401
            ? 'Unauthorized access. Please log in again.'
            : 'Failed to load course data. Please try again later.'
        );
      }
    };

    fetchData();
  }, [courseId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationsOpen && notificationsPopupRef.current && !notificationsPopupRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen]);

  const toggleModule = (index) => {
    setModules((prevModules) =>
      prevModules.map((mod, i) => ({
        ...mod,
        active: i === index ? !mod.active : mod.active,
      }))
    );
  };

  const toggleAssessmentsModal = () => {
    setIsAssessmentsModalOpen(!isAssessmentsModalOpen);
  };

  const toggleHelpSidebar = () => {
    setIsHelpSidebarOpen(!isHelpSidebarOpen);
  };

  const toggleFeedback = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const toggleNotificationsModal = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const markAllNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotificationsError('Authentication failed. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.put(
        'https://new-lms-backend-vmgr.onrender.com/api/v1/notifications/mark-all-read',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setNotifications([]);
        setNotificationsError('');
        setIsNotificationsOpen(false);
      } else {
        setNotificationsError('Failed to mark all notifications as read.');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setNotificationsError(error.message || 'Failed to mark all notifications as read.');
    }
  };

  const handleAttemptAssessment = (assessmentId) => {
    navigate(`/courses/${courseId}/assessments/${assessmentId}`);
    setIsAssessmentsModalOpen(false);
  };

  const handleNotificationClick = (actionUrl) => {
    if (actionUrl) {
      window.location.href = actionUrl;
    }
    setIsNotificationsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setFeedback((prev) => ({ ...prev, rating }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setFeedbackSuccess('');
    setFeedbackError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `https://lms-backend-flwq.onrender.com/api/v1/courses/${courseId}/reviews`,
        {
          rating: feedback.rating,
          comment: feedback.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setFeedbackSuccess('Feedback submitted successfully.');
        setFeedback({ rating: 0, comment: '' });
      } else {
        setFeedbackError('Failed to submit feedback. Server returned success: false.');
      }
    } catch (error) {
      setFeedbackError(
        error?.response?.data?.message ||
        'Failed to submit feedback due to a network or server error.'
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://lms-backend-flwq.onrender.com/api/v1/students/support',
        {
          subject: form.subject,
          message: form.message,
          category: 'course',
          relatedCourse: form.relatedCourse || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setSuccessMsg('Support ticket submitted successfully.');
        setForm((prev) => ({
          ...prev,
          subject: '',
          message: '',
          category: 'course',
          relatedCourse: courseId || '',
        }));
      } else {
        setErrorMsg('Failed to submit the ticket. Server returned success: false.');
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
        'Failed to submit the ticket due to a network or server error.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-t600 p-4 flex flex-col min-h-[calc(100vh-3.5rem)] w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow w-full gap-y-2"
      >
        <div className="flex items-center gap-3 min-w-[12rem] w-full sm:flex-1">
          <Link to="/courses" className="p-1 w-[2.5rem] h-[2.5rem] rounded-full bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            <img src={arrowLeft} alt="Back" className="w-full h-full rounded-md" />
          </Link>
          <div className="w-full flex-1">
            <h1 className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
              Course: {courseTitle}
            </h1>
            <p className="text-xs w-fit text-white bg-green-300 dark:bg-green-500 px-2 py-1 rounded">
              {instructorName}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-2 w-full sm:flex-row justify-end sm:gap-2">
          <div className="relative flex items-center">
            <button
              onClick={toggleNotificationsModal}
              className="bg-transparent text-gray-900 dark:text-gray-100 px-4 py-2 rounded-md text-sm hover:bg-[#49BBBD] hover:text-white border border-[#49BBBD] transition flex items-center gap-1 flex-1 sm:flex-none justify-center sm:justify-start"
            >
              <Bell className="w-4 h-4" />
              Notifications
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={toggleAssessmentsModal}
            className="bg-[#49BBBD] text-white px-4 py-2 rounded-md text-sm hover:bg-[#3AA8AA] transition flex-1 sm:flex-none"
          >
            Assessments
          </button>
          <button
            onClick={toggleHelpSidebar}
            className="bg-transparent text-gray-900 dark:text-gray-100 px-4 py-2 rounded-md text-sm hover:bg-[#49BBBD] hover:text-white border border-[#49BBBD] transition flex items-center gap-1 flex-1 sm:flex-none justify-center sm:justify-start"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </button>
        </div>
      </motion.div>

      {contentError && (
        <div className="bg-red-100 dark:bg-red-900 p-2 rounded-md mt-2 text-sm text-center text-gray-900 dark:text-gray-100">
          {contentError}
        </div>
      )}

      <AnimatePresence>
        {isNotificationsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <div
              ref={notificationsPopupRef}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      aria-label="Mark all notifications as read"
                    >
                      Mark All Read
                    </button>
                  )}
                  <button
                    onClick={toggleNotificationsModal}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {notificationsError ? (
                <p className="text-red-500 dark:text-red-400 text-sm">{notificationsError}</p>
              ) : notifications.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No new notifications.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="border dark:border-gray-700 rounded-lg p-3 flex justify-between items-center bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleNotificationClick(notification.actionUrl)}
                    >
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{notification.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAssessmentsModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Course Assessments</h2>
                <button
                  onClick={toggleAssessmentsModal}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {assessmentsError ? (
                <p className="text-red-500 dark:text-red-400 text-sm">{assessmentsError}</p>
              ) : assessments.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-sm">No assessments available.</p>
              ) : (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment._id} className="border dark:border-gray-700 rounded-lg p-3 flex justify-between items-center bg-white dark:bg-gray-800">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{assessment.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.description}</p>
                      </div>
                      <button
                        onClick={() => handleAttemptAssessment(assessment._id)}
                        className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 dark:hover:bg-green-700 transition"
                      >
                        Attempt
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHelpSidebarOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Contact Support</h2>
              <button
                onClick={toggleHelpSidebar}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-6"
            >
              {successMsg && (
                <p className="text-green-600 dark:text-green-400 text-sm sm:text-base mb-4 sm:mb-6 text-center">
                  {successMsg}
                </p>
              )}
              {errorMsg && (
                <p className="text-red-600 dark:text-red-400 text-sm sm:text-base mb-4 sm:mb-6 text-center">
                  {errorMsg}
                </p>
              )}
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    disabled
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 cursor-not-allowed text-gray-600 dark:text-gray-300 text-sm sm:text-base focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base font-medium">
                    Related Course
                  </label>
                  <select
                    name="relatedCourse"
                    value={form.relatedCourse}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                  >
                    <option value="">Select a course (optional)</option>
                    {contactCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base font-medium">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-y"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-900 dark:text-gray-100 mb-1 text-sm sm:text-base font-medium">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                    disabled
                  >
                    <option value="course">Course</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#49BBBD] text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-[#3AA8AA] transition duration-200 text-sm sm:text-base font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-2 w-full max-w-7xl mx-auto flex-1">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow p-3 flex flex-col">
            {selectedVideo?.url ? (
              <video
                src={selectedVideo.url}
                controls
                controlsList="nodownload"
                className="rounded-lg object-cover w-full max-h-[500px]"
              />
            ) : (
              <div className="rounded-lg w-full bg-gray-200 dark:bg-gray-700 h-[400px] flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">Select a lesson to play the video.</p>
              </div>
            )}
            {selectedVideo && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{selectedVideo.title || 'Untitled Video'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVideo.description || 'No description available.'}</p>
              </div>
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col">
            <div
              className="flex justify-between items-center cursor-pointer lg:cursor-default"
              onClick={() => {
                if (window.innerWidth < 1024) toggleFeedback();
              }}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Leave Feedback</h2>
              <ChevronDown
                className={`w-5 h-5 lg:hidden transform transition-transform ${
                  isFeedbackOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            <AnimatePresence>
              {(isFeedbackOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {feedbackSuccess && (
                    <p className="text-green-600 dark:text-green-400 text-sm mt-3 mb-3 text-center">{feedbackSuccess}</p>
                  )}
                  {feedbackError && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-3 mb-3 text-center">{feedbackError}</p>
                  )}

                  <div className="flex items-center mb-3">
                    <label className="text-gray-700 dark:text-gray-300 text-sm font-medium mr-3">Rating:</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 cursor-pointer ${
                            feedback.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-500'
                          }`}
                          onClick={() => handleStarClick(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm font-medium">Comment</label>
                    <textarea
                      name="comment"
                      value={feedback.comment}
                      onChange={handleFeedbackChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 resize-y"
                      rows={3}
                      placeholder="Share your thoughts about the course..."
                    />
                  </div>

                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={feedbackLoading || feedback.rating === 0}
                    className="bg-[#49BBBD] text-white py-2 px-4 rounded-lg hover:bg-[#3AA8AA] transition duration-200 text-sm font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
                  >
                    {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 flex flex-col"
        >
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow h-fit flex flex-col overflow-hidden">
            <div>
              <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">{instructorName}</h2>
              <p className="text-xs text-green-600 dark:text-green-400">{modules.length} Modules</p>
            </div>
            <div className="flex-1 overflow-y-auto mt-3 pr-2" style={{ maxHeight: 'calc(100vh - 230px)' }}>
              {modules.map((mod, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={i !== modules.length - 1 ? 'mb-3' : ''}
                >
                  <div className="border dark:border-gray-700 rounded-lg p-2">
                    <div
                      className={`flex justify-between font-semibold items-center cursor-pointer text-gray-900 dark:text-gray-100 ${mod.active ? 'text-black' : ''}`}
                      onClick={() => toggleModule(i)}
                    >
                      <span className="truncate text-sm">{mod.title}</span>
                      {mod.active ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{mod.lessons.length} Lessons</span>
                      )}
                    </div>
                    {mod.active && (
                      <div className="mt-1 space-y-1 text-sm">
                        {mod.lessons.map((lesson, idx) => (
                          <div
                            key={idx}
                            className={`flex justify-between items-center p-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-[#00c8a0] cursor-pointer ${
                              activeLecture.moduleIndex === i && activeLecture.lessonIndex === idx ? 'bg-green-50 dark:bg-green-900' : ''
                            }`}
                            onClick={() => {
                              if (lesson.content?.url) {
                                setSelectedVideo({
                                  title: lesson.content.title || lesson.title,
                                  description: lesson.content.description || 'No description available.',
                                  url: lesson.content.url,
                                });
                                setActiveLecture({ moduleIndex: i, lessonIndex: idx });
                              }
                            }}
                          >
                            <span className="text-gray-900 dark:text-gray-100">{lesson.title || `Lesson ${idx + 1}`}</span>
                            <span className="text-[10px] text-gray-600 dark:text-gray-400">{lesson.time || '0:00'}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow mt-3">
              <h2 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-2">Explore more</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courses.map((course, idx) => (
                  <Link
                    to={`/courses/${course._id}`}
                    key={idx}
                    className="p-1 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow"
                  >
                    <img
                      src={course.thumbnail}
                      className="rounded-lg mb-1 h-24 object-cover w-full"
                      alt={course.title}
                    />
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{course.title}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">₹{course.discountPrice || course.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}