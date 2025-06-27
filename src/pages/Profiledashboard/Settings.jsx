import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../contexts/ThemeContext';

const Notification = ({ message, type, onClose }) => {
  const { theme } = useContext(ThemeContext);
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white transition-opacity duration-300 z-50 ${
        type === 'error'
          ? theme === 'dark'
            ? 'bg-red-600 dark:bg-red-700'
            : 'bg-red-500'
          : theme === 'dark'
          ? 'bg-green-600 dark:bg-green-700'
          : 'bg-green-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 hover:text-gray-200 dark:hover:text-gray-300">
          ✕
        </button>
      </div>
    </div>
  );
};

const Settings = () => {
  const { theme, setTheme, language, setLanguage } = useContext(ThemeContext);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    skills: '',
   
    email: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: '', type: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ message: 'Authentication required. Please log in to access your profile.', type: 'error' });
        return;
      }

      try {
        const res = await axios.get('https://lms-backend-flwq.onrender.com/api/v1/students/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;
        if (!data) {
          throw new Error('No profile data returned from the server.');
        }
        setStudent(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          role: data.role || '',
          skills: data.skills || '',
          interest: data.interest || '',
          email: data.email || '',
        });
        setAvatarPreview(data.avatar || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          setNotification({ message: 'Session expired. Please log in again.', type: 'error' });
          localStorage.removeItem('token');
        } else {
          setNotification({
            message: err.response?.data?.message || 'Unable to retrieve profile data. Please try again later.',
            type: 'error',
          });
        }
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification({ message: 'Invalid file format. Please select a valid image file (e.g., JPG, PNG).', type: 'error' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setNotification({ message: 'File size exceeds the limit. Please select an image smaller than 5MB.', type: 'error' });
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setNotification({ message: '', type: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      setNotification({ message: 'Authentication required. Please log in.', type: 'error' });
      setSaving(false);
      return;
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
      if (avatarFile) payload.append('avatar', avatarFile);

      const res = await axios.put('https://lms-backend-flwq.onrender.com/api/v1/auth/updatedetails', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedData = res.data.data;
      setStudent((prev) => ({
        ...prev,
        ...formData,
        avatar: updatedData.avatar || prev.avatar,
      }));
      setNotification({ message: 'Your profile has been updated successfully.', type: 'success' });
      setAvatarFile(null);
      setAvatarPreview(updatedData.avatar || avatarPreview);
      setIsEditing(false);
    } catch (err) {
      setNotification({
        message: `Failed to update profile: ${err.response?.data?.message || 'An error occurred. Please try again.'}`,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setAvatarFile(null);
    setNotification({ message: '', type: '' });
    if (!isEditing) setAvatarPreview(student?.avatar || null);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    alert(`Application will reload after switching to ${e.target.value === 'en' ? 'English' : 'Hindi'}`);
    // Add reload or translation logic here if needed
  };

  const handleThemeChange = (e) => {
    console.log('Changing theme to:', e.target.value);
    setTheme(e.target.value);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-5 font-sans min-h-screen">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />

      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-5 shadow-md">
        <h2 className="text-xl mb-2 text-gray-900 dark:text-gray-100">Choose Your Language</h2>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          After changing the application language, the application will reload
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-5 shadow-md">
        <h2 className="text-xl mb-2 text-gray-900 dark:text-gray-100">Choose Your Theme</h2>
        <div className="flex items-center gap-5">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={theme === 'light'}
              onChange={handleThemeChange}
              className="hidden"
            />
            <div
              className={`w-48 h-16 border border-gray-300 bg-white rounded ${
                theme === 'light' ? 'ring-2 ring-blue-500' : ''
              }`}
            ></div>
            <span className="text-gray-900 dark:text-gray-100">Light</span>
          </label>
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={theme === 'dark'}
              onChange={handleThemeChange}
              className="hidden"
            />
            <div
              className={`w-48 h-16 border border-gray-300 bg-gray-800 rounded ${
                theme === 'dark' ? 'ring-2 ring-blue-500' : ''
              }`}
            ></div>
            <span className="text-gray-900 dark:text-gray-100">Dark</span>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-900 dark:text-gray-100">Edit Profile</h2>
          <button
            onClick={toggleEditMode}
            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {student && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src={avatarPreview || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow"
                />
                {isEditing && (
                  <>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-blue-500 dark:bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{student.firstName} {student.lastName}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{student.email}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">1 month ago</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['firstName', 'lastName', 'phone', 'role', 'skills', 'email'].map((field) => (
                <div key={field}>
                  <label className="block text-gray-600 dark:text-gray-400 mb-1 text-sm capitalize">
                    {field.replace('email', 'Email Address').replace('firstName', 'First Name').replace('lastName', 'Last Name')}
                  </label>
                  {field === 'role' && isEditing ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select Role</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full border ${isEditing ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'} border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm text-gray-900 dark:text-gray-100`}
                      readOnly={!isEditing || field === 'email'}
                      disabled={!isEditing && field === 'email'}
                    />
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;