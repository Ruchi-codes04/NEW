import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SignUpProvider } from './contexts/SignUpContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Courses from './components/Courses';
import AboutUs from './components/AboutUs';
import PopularCourses from './components/PopularCourses';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Instructors from './components/Instructors';
import TrendingCourses from './components/TrendingCourses';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import SignUpPopup from './components/SignUpPopup';
import NotFound from './pages/NotFound';
import Login from './pages/Profiledashboard/Login';
import ProfileDashboard from './pages/Profiledashboard/parentLayout';
import CoursePlayer from './pages/CoursePlayer';
import {
  ParticipantReviews,
  VideoReviews,
  CorporateTrainingReviews,
  CollegeTrainingReviews,
  JobSupportReviews,
  MouthShutReviews,
  JustDialReviews,
  ReviewsReporter,
  LinkedinReviews,
  YoutubeReviews,
  LearnerReviewsComplaints,
  MediumReviews,
} from './pages/reviews';
import {
  AboutBrainBridge,
  OurAffiliation,
  OurCustomers,
  PlacementPartners,
  ContactUs,
} from './pages/about';
import {
  CustomerSupport,
  Events,
  InternshipSupport,
  CareerSupport,
  Certification,
  SubmitFeedback,
} from './pages/students';
import { AllCourses, CorporateTraining, ViewCourse } from './pages/Courses';

// Home page component
const Home = () => {
  return (
    <>
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <HeroSection />
        <TrendingCourses />
        <Courses />
        <AboutUs />
        <WhyChooseUs />
        <Testimonials />
        <Instructors />
        <Reviews />
      </div>
    </>
  );
};

// Layout component to handle conditional Header and Footer rendering
const AppLayout = () => {
  const location = useLocation();
  const hideHeaderAndFooter = location.pathname === '/profile-dashboard' || location.pathname.startsWith('/course-player');

  return (
    <div className="min-h-screen overflow-x-hidden">
      {!hideHeaderAndFooter && <Header />}
      <SignUpPopup />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/profile-dashboard" element={<ProfileDashboard />} />
        <Route path="/course-player/:courseId" element={<CoursePlayer />} />
        <Route path="/reviews/participant" element={<ParticipantReviews />} />
        <Route path="/reviews/video" element={<VideoReviews />} />
        <Route path="/reviews/corporate" element={<CorporateTrainingReviews />} />
        <Route path="/reviews/college" element={<CollegeTrainingReviews />} />
        <Route path="/reviews/job-support" element={<JobSupportReviews />} />
        <Route path="/reviews/mouthshut" element={<MouthShutReviews />} />
        <Route path="/reviews/justdial" element={<JustDialReviews />} />
        <Route path="/reviews/reporter" element={<ReviewsReporter />} />
        <Route path="/reviews/linkedin" element={<LinkedinReviews />} />
        <Route path="/reviews/youtube" element={<YoutubeReviews />} />
        <Route path="/reviews/complaints" element={<LearnerReviewsComplaints />} />
        <Route path="/reviews/medium" element={<MediumReviews />} />
        <Route path="/about/company" element={<AboutBrainBridge />} />
        <Route path="/about/team" element={<OurAffiliation />} />
        <Route path="/about/mission" element={<OurCustomers />} />
        <Route path="/about/testimonials" element={<PlacementPartners />} />
        <Route path="/about/contact" element={<ContactUs />} />
        <Route path="/students/student-support" element={<CustomerSupport />} />
        <Route path="/students/events" element={<Events />} />
        <Route path="/students/internship-support" element={<InternshipSupport />} />
        <Route path="/students/career-support" element={<CareerSupport />} />
        <Route path="/students/certification" element={<Certification />} />
        <Route path="/students/submit-feedback" element={<SubmitFeedback />} />
        <Route path="/courses/all" element={<AllCourses />} />
        <Route path="/courses/:id" element={<ViewCourse />} />
        <Route path="/corporate-training" element={<CorporateTraining />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideHeaderAndFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <SignUpProvider>
      <ThemeProvider> {/* Add ThemeProvider here */}
        <Router>
          <AppLayout />
        </Router>
      </ThemeProvider>
    </SignUpProvider>
  );
}

export default App;