import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contact = ({ relatedCourseId }) => {
  const [form, setForm] = useState({
    name: '',
    subject: '',
    message: '',
    category: 'technical',
    relatedCourse: relatedCourseId || '',
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user profile
        const profileRes = await axios.get(
          'https://lms-backend-flwq.onrender.com/api/v1/students/profile',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { firstName, lastName } = profileRes.data.data;
        setForm((prev) => ({ ...prev, name: `${firstName} ${lastName}` }));

        // Fetch enrolled courses
        const coursesRes = await axios.get(
          'https://lms-backend-flwq.onrender.com/api/v1/students/courses',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (coursesRes.data.success) {
          setCourses(coursesRes.data.data.map((enrollment) => ({
            _id: enrollment.course._id,
            title: enrollment.course.title,
          })));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const allowedCategories = ['technical', 'course', 'billing', 'account', 'other'];
    if (!allowedCategories.includes(form.category)) {
      setErrorMsg('Invalid category selected.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://lms-backend-flwq.onrender.com/api/v1/students/support',
        {
          subject: form.subject,
          message: form.message,
          category: form.category,
          relatedCourse: form.relatedCourse || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response from support API:", response);

      if (response.data.success) {
        setSuccessMsg('Support ticket submitted successfully.');
        setForm((prev) => ({
          ...prev,
          subject: '',
          message: '',
          category: 'technical',
          relatedCourse: relatedCourseId || '',
        }));
      } else {
        setErrorMsg('Failed to submit the ticket. Server returned success: false.');
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setErrorMsg(
        error?.response?.data?.message ||
        'Failed to submit the ticket due to a network or server error.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:p-0 mt-12 md:mt-0 h-fit px-[10px] lg:py-6 lg:px-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg space-y-6 max-w-7xl mx-auto transition-colors duration-300">
      <div className="w-full max-w-full sm:max-w-[60%] px-4 py-6 mx-0 mt-12 md:mt-6 sm:mx-auto sm:px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-center text-gray-900 dark:text-white">
          Ticket Support
        </h2>

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
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              disabled
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-600 dark:text-gray-400 text-sm sm:text-base focus:ring-0"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
              Related Course
            </label>
            <select
              name="relatedCourse"
              value={form.relatedCourse}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a course (optional)</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y"
              rows={4}
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm sm:text-base font-medium">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="course">Course</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#49BBBD] dark:bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-[#3A9D9D] dark:hover:bg-blue-500 transition duration-200 text-sm sm:text-base font-medium disabled:bg-blue-300 dark:disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;