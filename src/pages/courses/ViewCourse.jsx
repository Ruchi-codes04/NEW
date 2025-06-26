import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const ViewCourse = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Scroll to top when component mounts or when course ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Function to get course data based on ID
  const getCourseData = (courseId) => {
    const courses = {
      1: {
        id: 1,
        title: "Complete Web Development Bootcamp",
        description: "Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and more to become a full-stack web developer.",
        longDescription: "This comprehensive bootcamp will take you from a complete beginner to a professional web developer. You'll learn the latest technologies and best practices used by top companies worldwide. The course includes hands-on projects, real-world examples, and personalized feedback from experienced instructors.",
        instructor: "Dr. Sarah Johnson",
        instructorBio: "Dr. Sarah Johnson is a senior software engineer with 10+ years of experience at Google and Microsoft. She has taught over 100,000 students worldwide and is passionate about making programming accessible to everyone.",
        instructorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        rating: 4.8,
        reviews: 1245,
        students: 12500,
        duration: "48 hours",
        level: "Beginner to Advanced",
        category: "Web Development",
        price: "₹12,999",
        originalPrice: "₹19,999",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        subtitles: ["English", "Hindi", "Spanish"],
        lastUpdated: "December 2024",
        certificate: true,
        downloadable: true,
        lifetime: true,
        mobileAccess: true,
        modules: [
          {
            id: 1,
            title: "Introduction to Web Development",
            duration: "2 hours",
            lessons: [
              { id: 1, title: "What is Web Development?", duration: "15 min", type: "video", preview: true, completed: false },
              { id: 2, title: "Setting up Development Environment", duration: "20 min", type: "video", preview: false, completed: false },
              { id: 3, title: "Your First HTML Page", duration: "25 min", type: "video", preview: true, completed: false },
              { id: 4, title: "Quiz: HTML Basics", duration: "10 min", type: "quiz", preview: false, completed: false }
            ]
          },
          {
            id: 2,
            title: "HTML Fundamentals",
            duration: "6 hours",
            lessons: [
              { id: 5, title: "HTML Structure and Syntax", duration: "30 min", type: "video", preview: false, completed: false },
              { id: 6, title: "Working with Text and Links", duration: "25 min", type: "video", preview: false, completed: false },
              { id: 7, title: "Images and Media", duration: "20 min", type: "video", preview: false, completed: false },
              { id: 8, title: "Forms and Input Elements", duration: "35 min", type: "video", preview: false, completed: false }
            ]
          }
        ],
        learningOutcomes: [
          "Build responsive websites using HTML, CSS, and JavaScript",
          "Create dynamic web applications with React.js",
          "Develop backend APIs using Node.js and Express",
          "Work with databases using MongoDB",
          "Deploy applications to cloud platforms",
          "Understand modern development workflows and tools"
        ],
        requirements: [
          "No prior programming experience required",
          "A computer with internet connection",
          "Willingness to learn and practice coding",
          "Basic computer skills (file management, web browsing)"
        ],
        features: [
          { icon: FaRegClock, text: "48 hours of on-demand video" },
          { icon: FaDownload, text: "Downloadable resources" },
          { icon: FaGlobe, text: "Access on mobile and desktop" },
          { icon: FaCertificate, text: "Certificate of completion" },
          { icon: FaUsers, text: "Access to student community" }
        ]
      },
      2: {
        id: 2,
        title: "Python for Data Science Masterclass",
        description: "Master Python programming and data science with NumPy, Pandas, Matplotlib, and Machine Learning algorithms.",
        longDescription: "Dive deep into the world of data science with Python. This comprehensive course covers everything from Python basics to advanced machine learning techniques. You'll work with real datasets, build predictive models, and create stunning visualizations. Perfect for aspiring data scientists and analysts.",
        instructor: "Prof. Michael Chen",
        instructorBio: "Prof. Michael Chen is a data science expert with PhD in Computer Science from MIT. He has worked at Netflix and Amazon as a senior data scientist and has published numerous research papers in machine learning.",
        instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        rating: 4.9,
        reviews: 2156,
        students: 18750,
        duration: "65 hours",
        level: "Intermediate",
        category: "Data Science",
        price: "₹15,999",
        originalPrice: "₹24,999",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        subtitles: ["English", "Hindi", "Spanish"],
        lastUpdated: "November 2024",
        certificate: true,
        downloadable: true,
        lifetime: true,
        mobileAccess: true,
        modules: [
          {
            id: 1,
            title: "Python Fundamentals",
            duration: "8 hours",
            lessons: [
              { id: 1, title: "Introduction to Python", duration: "20 min", type: "video", preview: true, completed: false },
              { id: 2, title: "Variables and Data Types", duration: "30 min", type: "video", preview: false, completed: false },
              { id: 3, title: "Control Structures", duration: "45 min", type: "video", preview: true, completed: false },
              { id: 4, title: "Functions and Modules", duration: "40 min", type: "video", preview: false, completed: false }
            ]
          },
          {
            id: 2,
            title: "Data Analysis with Pandas",
            duration: "12 hours",
            lessons: [
              { id: 5, title: "Introduction to Pandas", duration: "35 min", type: "video", preview: false, completed: false },
              { id: 6, title: "Data Cleaning Techniques", duration: "50 min", type: "video", preview: false, completed: false },
              { id: 7, title: "Data Visualization", duration: "45 min", type: "video", preview: false, completed: false },
              { id: 8, title: "Statistical Analysis", duration: "60 min", type: "video", preview: false, completed: false }
            ]
          }
        ],
        learningOutcomes: [
          "Master Python programming from basics to advanced",
          "Analyze and visualize data using Pandas and Matplotlib",
          "Build machine learning models with Scikit-learn",
          "Work with real-world datasets and case studies",
          "Create interactive dashboards and reports",
          "Apply statistical analysis techniques"
        ],
        requirements: [
          "Basic understanding of mathematics and statistics",
          "Computer with Python installed (guidance provided)",
          "Willingness to work with data and numbers",
          "No prior programming experience required"
        ],
        features: [
          { icon: FaRegClock, text: "65 hours of on-demand video" },
          { icon: FaDownload, text: "Datasets and code files" },
          { icon: FaGlobe, text: "Access on mobile and desktop" },
          { icon: FaCertificate, text: "Certificate of completion" },
          { icon: FaUsers, text: "Data science community access" }
        ]
      },
      3: {
        id: 3,
        title: "Digital Marketing Mastery Course",
        description: "Learn SEO, Social Media Marketing, Google Ads, Content Marketing, and Email Marketing to grow your business online.",
        longDescription: "Transform your marketing skills with this comprehensive digital marketing course. Learn proven strategies used by top marketers to drive traffic, generate leads, and increase sales. Includes hands-on projects with real campaigns and industry tools.",
        instructor: "Emma Rodriguez",
        instructorBio: "Emma Rodriguez is a digital marketing strategist with 8+ years of experience helping businesses grow online. She has managed campaigns for Fortune 500 companies and trained over 50,000 marketers worldwide.",
        instructorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        rating: 4.7,
        reviews: 987,
        students: 8900,
        duration: "35 hours",
        level: "Beginner to Intermediate",
        category: "Digital Marketing",
        price: "₹9,999",
        originalPrice: "₹14,999",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        subtitles: ["English", "Hindi"],
        lastUpdated: "October 2024",
        certificate: true,
        downloadable: true,
        lifetime: true,
        mobileAccess: true,
        modules: [
          {
            id: 1,
            title: "Digital Marketing Fundamentals",
            duration: "6 hours",
            lessons: [
              { id: 1, title: "Introduction to Digital Marketing", duration: "25 min", type: "video", preview: true, completed: false },
              { id: 2, title: "Understanding Your Target Audience", duration: "30 min", type: "video", preview: false, completed: false },
              { id: 3, title: "Creating a Marketing Strategy", duration: "35 min", type: "video", preview: true, completed: false },
              { id: 4, title: "Marketing Funnel Basics", duration: "20 min", type: "video", preview: false, completed: false }
            ]
          },
          {
            id: 2,
            title: "Search Engine Optimization (SEO)",
            duration: "10 hours",
            lessons: [
              { id: 5, title: "SEO Fundamentals", duration: "40 min", type: "video", preview: false, completed: false },
              { id: 6, title: "Keyword Research", duration: "45 min", type: "video", preview: false, completed: false },
              { id: 7, title: "On-Page SEO", duration: "50 min", type: "video", preview: false, completed: false },
              { id: 8, title: "Link Building Strategies", duration: "35 min", type: "video", preview: false, completed: false }
            ]
          }
        ],
        learningOutcomes: [
          "Create effective digital marketing campaigns",
          "Master SEO techniques to rank higher on Google",
          "Run profitable Google Ads and Facebook campaigns",
          "Build engaging social media strategies",
          "Create compelling content that converts",
          "Analyze and optimize marketing performance"
        ],
        requirements: [
          "Basic computer and internet skills",
          "Access to social media platforms",
          "Willingness to learn and experiment",
          "No prior marketing experience required"
        ],
        features: [
          { icon: FaRegClock, text: "35 hours of on-demand video" },
          { icon: FaDownload, text: "Marketing templates and tools" },
          { icon: FaGlobe, text: "Access on mobile and desktop" },
          { icon: FaCertificate, text: "Certificate of completion" },
          { icon: FaUsers, text: "Marketing community access" }
        ]
      }
    };

    return courses[courseId] || courses[1]; // Default to course 1 if ID not found
  };

  // Get course data based on the ID from URL
  const course = getCourseData(parseInt(id));

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Course link copied to clipboard!');
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

  return (
    <div className="min-h-screen">
      {/* Course Header */}
      <section className="py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <img 
                    src={course.instructorImage} 
                    alt={course.instructor}
                    className="w-12 h-12 rounded-full mr-3"
                  />
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
                      <span className="text-lg text-gray-500 line-through">{course.originalPrice}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        35% OFF
                      </span>
                      <span className="text-sm text-gray-600">Limited time offer!</span>
                    </div>
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
                        <p className="text-teal-600 font-medium mb-4">Senior Software Engineer & Educator</p>
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
                          <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">JavaScript Expert</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React Specialist</span>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Full-Stack Developer</span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">10+ Years Experience</span>
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
