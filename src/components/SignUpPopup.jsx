import React, { useState, useEffect } from 'react';
import { FaTimes, FaRocket, FaStar, FaGraduationCap } from 'react-icons/fa';
import { useSignUp } from '../contexts/SignUpContext';

const SignUpPopup = () => {
  const { isPopupVisible, hideSignUpPopup, showSignUpPopup } = useSignUp();
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    course: '',
    experience: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Show popup every 15 minutes (900000 milliseconds)
    const interval = setInterval(() => {
      showSignUpPopup();
    }, 900000);

    // Show popup for the first time after 15 minutes
    const initialTimeout = setTimeout(() => {
      showSignUpPopup();
    }, 900000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [showSignUpPopup]);

  const handleClose = () => {
    hideSignUpPopup();
    setShowSignUpForm(false);
    setShowEmailForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    // Handle sign up submission
    console.log('Sign up data submitted:', formData);
    alert('Thank you for signing up! Welcome to our learning platform!');
    hideSignUpPopup();

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      course: '',
      experience: '',
      password: '',
      confirmPassword: ''
    });
    setShowSignUpForm(false);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (formData.email) {
      // Handle email submission
      console.log('Email submitted:', formData.email);
      alert('Thank you for signing up! Check your email for confirmation.');
      hideSignUpPopup();
      setFormData(prev => ({ ...prev, email: '' }));
      setShowEmailForm(false);
    }
  };

  if (!isPopupVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <FaTimes className="text-gray-600 text-sm sm:text-base" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-50 to-blue-50 p-6 lg:p-8 flex-col justify-center items-center relative">
            {/* Career Benefits */}
            <div className="absolute top-4 lg:top-6 left-4 lg:left-6 bg-white rounded-full px-2 lg:px-3 py-1 shadow-sm">
              <div className="flex items-center text-xs lg:text-sm">
                <FaRocket className="text-purple-500 mr-1" />
                <span className="text-gray-700 font-medium">Career Switch</span>
              </div>
            </div>

            <div className="absolute top-16 lg:top-20 right-4 lg:right-6 bg-white rounded-full px-2 lg:px-3 py-1 shadow-sm">
              <div className="flex items-center text-xs lg:text-sm">
                <FaGraduationCap className="text-blue-500 mr-1" />
                <span className="text-gray-700 font-medium">Promotion</span>
              </div>
            </div>

            <div className="absolute bottom-16 lg:bottom-20 left-4 lg:left-6 bg-white rounded-full px-2 lg:px-3 py-1 shadow-sm">
              <div className="flex items-center text-xs lg:text-sm">
                <FaStar className="text-green-500 mr-1" />
                <span className="text-gray-700 font-medium">Salary Hike</span>
              </div>
            </div>

            {/* Main Illustration */}
            <div className="relative">
              <div className="w-48 h-64 bg-gradient-to-b from-red-400 to-red-500 rounded-t-full relative overflow-hidden">
                {/* Rocket Body */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-white rounded-t-3xl shadow-lg">
                  {/* Person in rocket */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full relative">
                      {/* Face */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-200 rounded-full">
                        {/* Eyes */}
                        <div className="absolute top-3 left-2 w-1 h-1 bg-black rounded-full"></div>
                        <div className="absolute top-3 right-2 w-1 h-1 bg-black rounded-full"></div>
                        {/* Smile */}
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-1 border-b-2 border-black rounded-full"></div>
                      </div>
                      {/* Hair */}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-black rounded-t-full"></div>
                    </div>
                  </div>
                  
                  {/* Rocket Windows */}
                  <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-200 rounded-full border-2 border-gray-300"></div>
                  
                  {/* Rocket Details */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gray-200 rounded"></div>
                </div>
                
                {/* Rocket Fins */}
                <div className="absolute bottom-0 left-4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600"></div>
                <div className="absolute bottom-0 right-4 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-red-600"></div>
              </div>
              
              {/* Flame Effect */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-80"></div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-t from-yellow-300 to-orange-400 rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome!
              </h2>
            </div>

            {!showEmailForm && !showSignUpForm ? (
              <div className="space-y-4 sm:space-y-6">
                <button
                  onClick={() => setShowSignUpForm(true)}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            ) : showSignUpForm ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />

                <div className="flex">
                  <div className="flex items-center bg-gray-50 border border-gray-300 rounded-l-lg px-3">
                    <img
                      src="https://flagcdn.com/w20/in.png"
                      alt="India"
                      className="w-5 h-3 mr-2"
                    />
                    <span className="text-gray-700 font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Course Interest</option>
                  <option value="web-development">Web Development</option>
                  <option value="data-science">Data Science</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="ai-ml">AI & Machine Learning</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="cloud-computing">Cloud Computing</option>
                  <option value="digital-marketing">Digital Marketing</option>
                </select>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Experience Level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  minLength="6"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                  minLength="6"
                />

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={() => setShowSignUpForm(false)}
                  className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
                >
                  ← Back to options
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Continue with Email
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
                >
                  ← Back to options
                </button>
              </form>
            )}

            {!showSignUpForm && !showEmailForm && (
              <div className="text-center my-6">
                <span className="text-gray-500">or</span>
              </div>
            )}

            {!showSignUpForm && !showEmailForm && (
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full text-gray-700 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors underline"
              >
                Continue with Email
              </button>
            )}

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPopup;
