import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaStar, FaRegClock, FaUserGraduate, FaChevronDown } from 'react-icons/fa';
import Instructors from '../../components/Instructors';
import TrendingCourses from '../../components/TrendingCourses';
import MicrosoftAI from '../../components/MicrosoftAI';
import FAQ from '../../components/FAQ';
import SignUpPopup from '../../components/SignUpPopup';
import { FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Add CSS for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const AllCourses = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const coursesPerPage = 9;
  const scrollRef = useRef(null);
  const coursesScrollRef = useRef(null);
    const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    price: {
      free: false,
      paid: false
    },
    level: {
      beginner: false,
      intermediate: false,
      advanced: false
    },
    duration: {
      short: false,    // 0-10 hours
      medium: false,   // 10-20 hours
      long: false      // 20+ hours
    },
    rating: {
      high: false,     // 4.5 & up
      good: false,     // 4.0 & up
      average: false   // 3.5 & up
    }
  });

  // Helper function to handle filter changes
  const handleFilterChange = (category, filterKey) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [filterKey]: !prev[category][filterKey]
      }
    }));
  };

  // Helper function to clear all filters
  const clearAllFilters = () => {
    setFilters({
      price: {
        free: false,
        paid: false
      },
      level: {
        beginner: false,
        intermediate: false,
        advanced: false
      },
      duration: {
        short: false,
        medium: false,
        long: false
      },
      rating: {
        high: false,
        good: false,
        average: false
      }
    });
  };

   // Add the same handleBookmark function
  const handleBookmark = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotification({ message: 'Please login to bookmark courses', type: 'error' });
        navigate('/login');
        return;
      }

      const isBookmarked = bookmarkedCourses.includes(courseId);
      
      const response = await axios.patch(
        `https://lms-backend-flwq.onrender.com/api/v1/students/courses/${courseId}/bookmark`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotification({
          message: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
          type: 'success',
        });
        if (isBookmarked) {
          setBookmarkedCourses(bookmarkedCourses.filter(id => id !== courseId));
        } else {
          setBookmarkedCourses([...bookmarkedCourses, courseId]);
        }
      }
    } catch (err) {
      console.error('Bookmark Error:', err);
      setNotification({
        message: err.response?.data?.message || 'Failed to update bookmark',
        type: 'error',
      });
    }
  };

  // Add notification component
  {notification.message && (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-50 ${
      notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`}>
      <div className="flex items-center justify-between">
        <span>{notification.message}</span>
        <button onClick={() => setNotification({ message: '', type: '' })} className="ml-4">
          ✕
        </button>
      </div>
    </div>
  )}



  // Helper function to check if course matches price filter
  const matchesPriceFilter = (course) => {
    const { free, paid } = filters.price;
    if (!free && !paid) return true; // No filter selected

    const isFree = course.price === 'Free' || course.price === '₹0';
    const isPaid = course.price !== 'Free' && course.price !== '₹0';

    return (free && isFree) || (paid && isPaid);
  };

  // Helper function to check if course matches level filter
  const matchesLevelFilter = (course) => {
    const { beginner, intermediate, advanced } = filters.level;
    if (!beginner && !intermediate && !advanced) return true; // No filter selected

    const level = course.level.toLowerCase();
    return (
      (beginner && level.includes('beginner')) ||
      (intermediate && level.includes('intermediate')) ||
      (advanced && level.includes('advanced'))
    );
  };

  // Helper function to check if course matches duration filter
  const matchesDurationFilter = (course) => {
    const { short, medium, long } = filters.duration;
    if (!short && !medium && !long) return true; // No filter selected

    const duration = parseInt(course.duration);
    return (
      (short && duration <= 10) ||
      (medium && duration > 10 && duration <= 20) ||
      (long && duration > 20)
    );
  };

  // Helper function to check if course matches rating filter
  const matchesRatingFilter = (course) => {
    const { high, good, average } = filters.rating;
    if (!high && !good && !average) return true; // No filter selected

    const rating = course.rating;
    return (
      (high && rating >= 4.5) ||
      (good && rating >= 4.0) ||
      (average && rating >= 3.5)
    );
  };

  // Sample course data
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and more to become a full-stack web developer.",
      instructor: "Dr. Sarah Johnson",
      rating: 4.8,
      reviews: 1245,
      students: 12500,
      duration: "48 hours",
      level: "Beginner to Advanced",
      category: "development",
      price: "₹12,999",
      originalPrice: "₹19,999",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Data Science and Machine Learning Masterclass",
      description: "Master data analysis, visualization, machine learning algorithms and deep learning with Python.",
      instructor: "Prof. Michael Chen",
      rating: 4.9,
      reviews: 987,
      students: 8900,
      duration: "56 hours",
      level: "Intermediate",
      category: "data-science",
      price: "₹14,999",
      originalPrice: "₹21,999",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "UX/UI Design Fundamentals",
      description: "Learn user experience design principles, wireframing, prototyping and design thinking methodologies.",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      reviews: 756,
      students: 6200,
      duration: "32 hours",
      level: "Beginner",
      category: "design",
      price: "₹9,999",
      originalPrice: "₹15,999",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Advanced React and Redux",
      description: "Take your React skills to the next level with advanced patterns, hooks, context API and Redux.",
      instructor: "David Wilson",
      rating: 4.8,
      reviews: 632,
      students: 5400,
      duration: "28 hours",
      level: "Advanced",
      category: "development",
      price: "₹11,999",
      originalPrice: "₹17,999",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: "Financial Analysis and Modeling",
      description: "Learn financial statement analysis, valuation, forecasting, and financial modeling in Excel.",
      instructor: "Robert Chang",
      rating: 4.6,
      reviews: 521,
      students: 4800,
      duration: "36 hours",
      level: "Intermediate",
      category: "business",
      price: "₹10,999",
      originalPrice: "₹16,999",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: "Digital Marketing Mastery",
      description: "Comprehensive guide to SEO, SEM, social media marketing, content marketing and analytics.",
      instructor: "Jennifer Lee",
      rating: 4.7,
      reviews: 689,
      students: 7300,
      duration: "42 hours",
      level: "Beginner to Intermediate",
      category: "marketing",
      price: "₹11,499",
      originalPrice: "₹16,999",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 7,
      title: "iOS App Development with Swift",
      description: "Build iOS applications from scratch using Swift and Xcode. Create real-world apps for the App Store.",
      instructor: "Alex Thompson",
      rating: 4.8,
      reviews: 542,
      students: 4900,
      duration: "38 hours",
      level: "Intermediate",
      category: "development",
      price: "₹13,499",
      originalPrice: "₹19,999",
      image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 8,
      title: "Artificial Intelligence Fundamentals",
      description: "Introduction to AI concepts, neural networks, natural language processing and computer vision.",
      instructor: "Dr. James Miller",
      rating: 4.9,
      reviews: 478,
      students: 3800,
      duration: "44 hours",
      level: "Intermediate to Advanced",
      category: "data-science",
      price: "₹15,999",
      originalPrice: "₹22,999",
      image: "https://images.unsplash.com/photo-1677442135136-760c813a743d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 9,
      title: "Project Management Professional (PMP) Certification",
      description: "Complete preparation for the PMP exam with practice tests and real-world case studies.",
      instructor: "Lisa Anderson",
      rating: 4.7,
      reviews: 612,
      students: 5600,
      duration: "35 hours",
      level: "Intermediate",
      category: "business",
      price: "₹12,499",
      originalPrice: "₹18,999",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 10,
      title: "Graphic Design Masterclass",
      description: "Learn Adobe Photoshop, Illustrator, InDesign and principles of graphic design from scratch.",
      instructor: "Carlos Mendez",
      rating: 4.6,
      reviews: 589,
      students: 6100,
      duration: "40 hours",
      level: "Beginner",
      category: "design",
      price: "₹10,499",
      originalPrice: "₹15,999",
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 11,
      title: "Cybersecurity Fundamentals",
      description: "Learn network security, ethical hacking, cryptography, and security best practices.",
      instructor: "Mark Williams",
      rating: 4.8,
      reviews: 498,
      students: 4200,
      duration: "46 hours",
      level: "Beginner to Intermediate",
      category: "it",
      price: "₹13,999",
      originalPrice: "₹20,999",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 12,
      title: "Cloud Computing with AWS",
      description: "Master Amazon Web Services including EC2, S3, Lambda, and more for cloud infrastructure.",
      instructor: "Sophia Garcia",
      rating: 4.7,
      reviews: 532,
      students: 4700,
      duration: "38 hours",
      level: "Intermediate",
      category: "it",
      price: "₹12,999",
      originalPrice: "₹18,999",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 13,
      title: "Introduction to Programming",
      description: "Learn the basics of programming with this free introductory course covering fundamental concepts.",
      instructor: "John Smith",
      rating: 4.2,
      reviews: 324,
      students: 2100,
      duration: "8 hours",
      level: "Beginner",
      category: "development",
      price: "Free",
      originalPrice: "Free",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 14,
      title: "Basic HTML & CSS",
      description: "Free course covering HTML and CSS fundamentals for web development beginners.",
      instructor: "Jane Doe",
      rating: 4.0,
      reviews: 156,
      students: 1800,
      duration: "6 hours",
      level: "Beginner",
      category: "development",
      price: "Free",
      originalPrice: "Free",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
    }
  ];

  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'development', name: 'Development' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'it', name: 'IT & Software' }
  ];

  // Enhanced search function
  const matchesSearch = (course) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const searchFields = [
      course.title,
      course.description,
      course.instructor,
      course.level,
      course.category
    ];

    return searchFields.some(field =>
      field && field.toLowerCase().includes(query)
    );
  };

  // Filter courses based on active category, search query, and filters
  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearchQuery = matchesSearch(course);
    const matchesPrice = matchesPriceFilter(course);
    const matchesLevel = matchesLevelFilter(course);
    const matchesDuration = matchesDurationFilter(course);
    const matchesRating = matchesRatingFilter(course);

    return matchesCategory && matchesSearchQuery && matchesPrice && matchesLevel && matchesDuration && matchesRating;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll the course container to the top
    setTimeout(() => {
      if (coursesScrollRef.current) {
        coursesScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Also scroll to the top of the courses section
      const coursesSection = document.querySelector('.courses-section');
      if (coursesSection) {
        const yOffset = -80; // Offset to account for header
        const y = coursesSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        // Fallback to scrolling to course grid
        const courseGrid = document.getElementById('course-grid');
        if (courseGrid) {
          const yOffset = -100;
          const y = courseGrid.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 100); // Small delay to ensure DOM is updated
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, filters]);

  // Signup popup timer - show every 15 minutes
  useEffect(() => {
    // Show popup for the first time after 15 minutes (900000ms)
    const initialTimeout = setTimeout(() => {
      setShowSignupPopup(true);
    }, 900000);

    // Show popup every 15 minutes after the first one
    const interval = setInterval(() => {
      setShowSignupPopup(true);
    }, 900000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Synchronized scrolling effect
  useEffect(() => {
    const handleWheelOnCoursesArea = (e) => {
      // Check if the target is not already the courses scrollable container
      if (!e.target.closest('.courses-scrollable-container')) {
        e.preventDefault();
        if (coursesScrollRef.current) {
          coursesScrollRef.current.scrollTop += e.deltaY;
        }
      }
    };

    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
      coursesSection.addEventListener('wheel', handleWheelOnCoursesArea, { passive: false });
    }

    return () => {
      if (coursesSection) {
        coursesSection.removeEventListener('wheel', handleWheelOnCoursesArea);
      }
    };
  }, []);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      {/* Hero Section */}
      <section className="py-20 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm">
                <span className="w-2 h-2 bg-teal-600 rounded-full mr-2"></span>
                Trusted by 1M+ professionals worldwide
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Professional Course Catalog
                </h1>
              </div>

              {/* Key Value Propositions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expert Instructors</h3>
                    <p className="text-sm text-gray-600">Learn from industry professionals with real-world experience</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Verified Certificates</h3>
                    <p className="text-sm text-gray-600">Earn industry-recognized credentials to boost your career</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Flexible Learning</h3>
                    <p className="text-sm text-gray-600">Study at your own pace with lifetime access to content</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Community Support</h3>
                    <p className="text-sm text-gray-600">Connect with peers and get help when you need it</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-xl p-8">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  alt="Professional Learning Environment"
                  className="w-full h-80 lg:h-96 object-cover rounded-xl"
                />

                {/* Stats Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-teal-600">500+</div>
                        <div className="text-xs text-gray-600">Courses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-600">50K+</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-600">4.8★</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-8 lg:p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-4xl lg:text-4xl font-bold text-teal-600 mb-2">1 Million+</div>
                <div className="text-lg text-gray-600 font-medium">Enrolled Learners</div>
              </div>

              <div className="text-center">
                <div className="text-4xl lg:text-4xl font-bold text-teal-600 mb-2">100+</div>
                <div className="text-lg text-gray-600 font-medium">Free Courses</div>
              </div>

              <div className="text-center">
                <div className="text-4xl lg:text-4xl font-bold text-teal-600 mb-2">100+</div>
                <div className="text-lg text-gray-600 font-medium">Job Ready Skills</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Courses Section */}
      <TrendingCourses />

      {/* Course Catalog Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 bg-white">
          {/* Category Tabs */}
          <div className="mb-8">
            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-2 min-w-max">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category.id
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Button (Mobile) */}
          <div className="md:hidden mb-6 courses-mobile-filters">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <span className="font-medium text-gray-700">Filters</span>
              </div>
              <FaChevronDown className={`text-gray-500 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Filter Options</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Price</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.price.free}
                          onChange={() => handleFilterChange('price', 'free')}
                        />
                        <span className="ml-2 text-gray-700">Free</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.price.paid}
                          onChange={() => handleFilterChange('price', 'paid')}
                        />
                        <span className="ml-2 text-gray-700">Paid</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Level</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.level.beginner}
                          onChange={() => handleFilterChange('level', 'beginner')}
                        />
                        <span className="ml-2 text-gray-700">Beginner</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.level.intermediate}
                          onChange={() => handleFilterChange('level', 'intermediate')}
                        />
                        <span className="ml-2 text-gray-700">Intermediate</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.level.advanced}
                          onChange={() => handleFilterChange('level', 'advanced')}
                        />
                        <span className="ml-2 text-gray-700">Advanced</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Duration</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.duration.short}
                          onChange={() => handleFilterChange('duration', 'short')}
                        />
                        <span className="ml-2 text-gray-700">0-10 hours</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.duration.medium}
                          onChange={() => handleFilterChange('duration', 'medium')}
                        />
                        <span className="ml-2 text-gray-700">10-20 hours</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.duration.long}
                          onChange={() => handleFilterChange('duration', 'long')}
                        />
                        <span className="ml-2 text-gray-700">20+ hours</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Rating</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.rating.high}
                          onChange={() => handleFilterChange('rating', 'high')}
                        />
                        <span className="ml-2 text-gray-700 flex items-center">
                          4.5 & up <FaStar className="text-yellow-400 ml-1" size={12} />
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.rating.good}
                          onChange={() => handleFilterChange('rating', 'good')}
                        />
                        <span className="ml-2 text-gray-700 flex items-center">
                          4.0 & up <FaStar className="text-yellow-400 ml-1" size={12} />
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.rating.average}
                          onChange={() => handleFilterChange('rating', 'average')}
                        />
                        <span className="ml-2 text-gray-700 flex items-center">
                          3.5 & up <FaStar className="text-yellow-400 ml-1" size={12} />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row courses-section">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden md:block w-64 flex-shrink-0 mr-8 courses-sidebar">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Price</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.price.free}
                          onChange={() => handleFilterChange('price', 'free')}
                        />
                        <span className="ml-2 text-gray-700">Free</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.price.paid}
                          onChange={() => handleFilterChange('price', 'paid')}
                        />
                        <span className="ml-2 text-gray-700">Paid</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Level</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.level.beginner}
                          onChange={() => handleFilterChange('level', 'beginner')}
                        />
                        <span className="ml-2 text-gray-700">Beginner</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.level.intermediate}
                          onChange={() => handleFilterChange('level', 'intermediate')}
                        />
                        <span className="ml-2 text-gray-700">Intermediate</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.level.advanced}
                          onChange={() => handleFilterChange('level', 'advanced')}
                        />
                        <span className="ml-2 text-gray-700">Advanced</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Duration</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.duration.short}
                          onChange={() => handleFilterChange('duration', 'short')}
                        />
                        <span className="ml-2 text-gray-700">0-10 hours</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.duration.medium}
                          onChange={() => handleFilterChange('duration', 'medium')}
                        />
                        <span className="ml-2 text-gray-700">10-20 hours</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.duration.long}
                          onChange={() => handleFilterChange('duration', 'long')}
                        />
                        <span className="ml-2 text-gray-700">20+ hours</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Rating</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.rating.high}
                          onChange={() => handleFilterChange('rating', 'high')}
                        />
                        <span className="ml-2 text-gray-700 flex items-center">
                          4.5 & up <FaStar className="text-yellow-400 ml-1" size={12} />
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.rating.good}
                          onChange={() => handleFilterChange('rating', 'good')}
                        />
                        <span className="ml-2 text-gray-700 flex items-center">
                          4.0 & up <FaStar className="text-yellow-400 ml-1" size={12} />
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-teal-600 focus:ring-teal-500"
                          checked={filters.rating.average}
                          onChange={() => handleFilterChange('rating', 'average')}
                        />
                        <span className="ml-2 text-gray-700 flex items-center">
                          3.5 & up <FaStar className="text-yellow-400 ml-1" size={12} />
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Grid */}
            <div className="flex-1" id="course-grid">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} available
                    {totalPages > 1 && (
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        (Page {currentPage} of {totalPages})
                      </span>
                    )}
                  </h2>

                  {/* Search Bar */}
                  <div className="max-w-md w-full md:w-auto relative">
                    <input
                      type="text"
                      placeholder="Search for courses, instructors, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="mr-2 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                          title="Clear search"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      <FaSearch className={`text-gray-400 transition-colors duration-300 ${searchQuery ? 'text-teal-500' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Search Results Indicator */}
                {searchQuery && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Search results for:</span>
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-md font-medium">
                      "{searchQuery}"
                    </span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                )}
                <div className="hidden md:block">

                </div>
              </div>

              {filteredCourses.length > 0 ? (
                <div className="relative h-[600px]">
          

                  {/* Scrollable Container */}
                  <div
                    ref={coursesScrollRef}
                    className="h-full overflow-y-auto pr-4 scrollbar-hide courses-scrollable-container"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                      paddingRight: '10px'
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                      {currentCourses.map(course => (
                        <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                          <div className="relative pb-[56.25%]">
                            <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleBookmark(course.id);
        }}
        className={`absolute top-2 right-2 p-2 rounded-full z-10 ${
          bookmarkedCourses.includes(course.id) 
            ? 'text-yellow-500 bg-white' 
            : 'text-gray-400 bg-white hover:text-yellow-500'
        }`}
      >
        <FaBookmark />
      </button>
                            <img
                              src={course.image}
                              alt={course.title}
                              className="absolute h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

                            <div className="flex items-center mb-3">
                              <p className="text-sm text-gray-700">By <span className="font-medium">{course.instructor}</span></p>
                            </div>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                <span className="text-yellow-400 font-bold mr-1">{course.rating}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`w-3 h-3 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">({course.reviews})</span>
                              <span className="text-xs text-gray-500 ml-4">{course.students.toLocaleString()} students</span>
                            </div>

                            <div className="flex items-center text-xs text-gray-500 mb-4">
                              <div className="flex items-center mr-3">
                                <FaRegClock className="mr-1" />
                                <span>{course.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <FaUserGraduate className="mr-1" />
                                <span>{course.level}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-gray-900">{course.price}</span>
                                <span className="text-gray-500 text-sm line-through ml-2">{course.originalPrice}</span>
                              </div>
                              <Link
                                to={`/courses/${course.id}`}
                                className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 transition-colors inline-block text-center"
                              >
                                View Course
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg text-center">
                  <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {searchQuery ? `No results found for "${searchQuery}"` : 'No courses found'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery
                        ? 'Try searching with different keywords or check your spelling'
                        : 'Try adjusting your filter criteria'
                      }
                    </p>
                    {searchQuery && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Suggestions:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {['React', 'JavaScript', 'Python', 'Data Science', 'Web Development'].map(suggestion => (
                            <button
                              key={suggestion}
                              onClick={() => setSearchQuery(suggestion)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {filteredCourses.length > 0 && totalPages > 1 && (
                <div className="mt-8 sm:mt-10 flex justify-center">
                  <nav className="flex items-center">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-l-md border border-gray-300 text-sm ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>

                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={index} className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-400">
                          ...
                        </span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 border-t border-b border-gray-300 ${
                            currentPage === page
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-r-md border border-gray-300 text-sm ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">Next</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Microsoft AI Section */}
      <MicrosoftAI />

      <Instructors />

      {/* FAQ Section */}
      <FAQ
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our courses and learning platform"
        faqs={[
          {
            question: "How do I enroll in a course?",
            answer: "Simply click on the 'Enroll Now' button on any course page. You'll be guided through the enrollment process, which includes creating an account if you don't have one and completing the payment for paid courses."
          },
          {
            question: "Are there any free courses available?",
            answer: "Yes! We offer over 100 free courses across various categories. Look for courses marked with 'Free' or use the price filter to find all free courses."
          },
          {
            question: "Can I get a certificate after completing a course?",
            answer: "Yes, you'll receive a certificate of completion for most courses. Premium courses also offer industry-recognized certifications that you can add to your LinkedIn profile."
          },
          {
            question: "What if I'm not satisfied with a course?",
            answer: "We offer a 30-day money-back guarantee for all paid courses. If you're not satisfied, contact our support team for a full refund."
          },
          {
            question: "How long do I have access to course materials?",
            answer: "Once enrolled, you have lifetime access to course materials, including any future updates. You can learn at your own pace and revisit content anytime."
          }
        ]}
      />

      {/* Signup Popup */}
      <SignUpPopup
        isOpen={showSignupPopup}
        onClose={() => setShowSignupPopup(false)}
      />
    </div>
  );
};

export default AllCourses;