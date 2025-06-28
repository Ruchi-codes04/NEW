import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaChevronDown, FaGraduationCap } from "react-icons/fa";
import { useSignUp } from "../contexts/SignUpContext";
import ComingSoonPopup from "./ComingSoonPopup";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const { showSignUpPopup } = useSignUp();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleComingSoonClick = (featureName) => {
    setComingSoonFeature(featureName);
    setShowComingSoon(true);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-600 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                  <FaGraduationCap className="text-white text-sm sm:text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">BrainBridge</h3>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
              <button className="absolute right-1 top-1 bottom-1 px-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center">
                <FaSearch className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-shrink-0">
            <Link to="/courses/all" className="bg-gray-100 text-gray-700 px-2 xl:px-3 py-1.5 rounded text-sm hover:bg-gray-200 transition-colors duration-300 whitespace-nowrap">
              All Courses
            </Link>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-300 text-sm">
                Review
                <FaChevronDown className="ml-1 w-2 h-2" />
              </button>
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link to="/reviews/participant" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Participant Reviews</Link>
                  <Link to="/reviews/video" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Video Reviews</Link>
                  <Link to="/reviews/corporate" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Corporate Training Reviews</Link>
                  <Link to="/reviews/college" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">College Training Reviews</Link>
                  <Link to="/reviews/job-support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Job Support Reviews</Link>
                  <button onClick={() => handleComingSoonClick('MouthShut Reviews')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Mouth Shut Reviews</button>
                  <button onClick={() => handleComingSoonClick('JustDial Reviews')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Just Dial Reviews</button>
                  <Link to="/reviews/reporter" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Reviews Reporter</Link>
                  <button onClick={() => handleComingSoonClick('LinkedIn Reviews')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Linkedin Reviews</button>
                  <button onClick={() => handleComingSoonClick('YouTube Reviews')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Youtube Reviews</button>
                  <Link to="/reviews/complaints" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Learner Reviews & Complaints</Link>
                  <button onClick={() => handleComingSoonClick('Medium Reviews')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Medium Reviews</button>
                </div>
              </div>
            </div>

            <Link to="/corporate-training" className="text-gray-700 hover:text-teal-600 transition-colors duration-300 text-sm whitespace-nowrap">
              Corporate Training
            </Link>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-300 text-sm whitespace-nowrap">
                Existing Students
                <FaChevronDown className="ml-1 w-2 h-2" />
              </button>
              <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link to="/students/student-support" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Student Support</Link>
                  <Link to="/students/events" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Events</Link>
                  <button onClick={() => handleComingSoonClick('Internship Support')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Internship Support</button>
                  <button onClick={() => handleComingSoonClick('Career Support')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Career Support</button>
                  <Link to="/students/certification" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Certification</Link>
                  <Link to="/students/submit-feedback" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Submit Feedback</Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-300 text-sm">
                About Us
                <FaChevronDown className="ml-1 w-2 h-2" />
              </button>
              <div className="absolute left-0 mt-2 w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <Link to="/about/company" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">About BrainBridge</Link>
                  <Link to="/about/team" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Our Affiliation</Link>
                  <Link to="/about/mission" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Our Student</Link>

                  <Link to="/about/testimonials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Placement Partners</Link>
                  <Link to="/about/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-teal-600" role="menuitem">Contact Us</Link>
                </div>
              </div>
            </div>

            <button
              onClick={showSignUpPopup}
              className="bg-teal-600 text-white px-3 xl:px-4 py-1.5 rounded text-sm hover:bg-teal-700 transition-colors duration-300 whitespace-nowrap"
            >
              Login
            </button>
       
  {/* <Link
    to="/Login"
    className="block w-full text-left bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
    onClick={() => setIsMobileMenuOpen(false)}
  >
    Login
  </Link> */}

          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex flex-col gap-1 p-2 text-gray-700 ml-2"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen pb-4" : "max-h-0"
          }`}
        >
          <nav className="px-4 py-4 bg-white border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                  <FaSearch className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  to="/courses/all"
                  className="block w-full text-left bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Courses
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-teal-600 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const submenu = e.currentTarget.nextElementSibling;
                    submenu.classList.toggle('hidden');
                    const icon = e.currentTarget.querySelector('svg');
                    icon.classList.toggle('rotate-180');
                  }}
                >
                  <span className="font-medium">Review</span>
                  <FaChevronDown className="w-3 h-3 transition-transform duration-200" />
                </button>
                <div className="hidden mt-2 ml-4 border-l-2 border-teal-200 pl-4 space-y-1">
                  <Link to="/reviews/participant" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Participant Reviews</Link>
                  <Link to="/reviews/video" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Video Reviews</Link>
                  <Link to="/reviews/corporate" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Corporate Training Reviews</Link>
                  <Link to="/reviews/college" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>College Training Reviews</Link>
                  <Link to="/reviews/job-support" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Job Support Reviews</Link>
                  <button onClick={() => {handleComingSoonClick('MouthShut Reviews'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Mouth Shut Reviews</button>
                  <button onClick={() => {handleComingSoonClick('JustDial Reviews'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Just Dial Reviews</button>
                  <Link to="/reviews/reporter" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Reviews Reporter</Link>
                  <button onClick={() => {handleComingSoonClick('LinkedIn Reviews'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Linkedin Reviews</button>
                  <button onClick={() => {handleComingSoonClick('YouTube Reviews'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Youtube Reviews</button>
                  <Link to="/reviews/complaints" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Learner Reviews & Complaints</Link>
                  <button onClick={() => {handleComingSoonClick('Medium Reviews'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Medium Reviews</button>
                </div>
              </li>
              <li>
                <Link
                  to="/corporate-training"
                  className="block text-gray-700 hover:text-teal-600 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Corporate Training
                </Link>
              </li>
              <li className="relative">
                <button
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-teal-600 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const submenu = e.currentTarget.nextElementSibling;
                    submenu.classList.toggle('hidden');
                    const icon = e.currentTarget.querySelector('svg');
                    icon.classList.toggle('rotate-180');
                  }}
                >
                  <span className="font-medium">Existing Students</span>
                  <FaChevronDown className="w-3 h-3 transition-transform duration-200" />
                </button>
                <div className="hidden mt-2 ml-4 border-l-2 border-teal-200 pl-4 space-y-1">
                  <Link to="/students/student-support" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Student Support</Link>
                  <Link to="/students/events" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
                  <button onClick={() => {handleComingSoonClick('Internship Support'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Internship Support</button>
                  <button onClick={() => {handleComingSoonClick('Career Support'); setIsMobileMenuOpen(false);}} className="block w-full text-left py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors">Career Support</button>
                  <Link to="/students/certification" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Certification</Link>
                  <Link to="/students/submit-feedback" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Submit Feedback</Link>
                </div>
              </li>
              <li className="relative">
                <button
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-teal-600 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const submenu = e.currentTarget.nextElementSibling;
                    submenu.classList.toggle('hidden');
                    const icon = e.currentTarget.querySelector('svg');
                    icon.classList.toggle('rotate-180');
                  }}
                >
                  <span className="font-medium">About Us</span>
                  <FaChevronDown className="w-3 h-3 transition-transform duration-200" />
                </button>
                <div className="hidden mt-2 ml-4 border-l-2 border-teal-200 pl-4 space-y-1">
                  <Link to="/about/company" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Company</Link>
                  <Link to="/about/team" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Our Team</Link>
                  <Link to="/about/mission" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mission & Vision</Link>
                  <Link to="/about/testimonials" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</Link>
                  <Link to="/about/contact" className="block py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-2 rounded transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                </div>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => {showSignUpPopup(); setIsMobileMenuOpen(false);}}
                  className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Coming Soon Popup */}
      <ComingSoonPopup
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        featureName={comingSoonFeature}
      />
    </header>
  );
};

export default Header;
