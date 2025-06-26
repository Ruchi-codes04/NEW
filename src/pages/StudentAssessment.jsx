import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function StudentAssessment() {
  const { courseId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://lms-backend-flwq.onrender.com/api/v1/students/courses/${courseId}/assessments/${assessmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setAssessment(response.data.data);
          // Assuming the API returns an isSubmitted field to indicate prior submission
          // If this field doesn't exist, you'll need to provide the correct API or field
          setIsSubmitted(response.data.data.isSubmitted || false);
        } else {
          setError('Failed to load assessment.');
        }
      } catch (err) {
        setError('Failed to load assessment.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [courseId, assessmentId]);

  const handleAnswerSelect = (questionId, optionId) => {
    if (!isSubmitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionId,
      }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    if (Object.keys(answers).length !== assessment.questions.length) {
        setError('Please answer all questions before submitting.');
        setTimeout(() => {
          navigate(`/course-player/${courseId}`);
        }, 1500);
        return;
      }

    setSubmitting(true);
    setError('');
    setSubmissionResult('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://lms-backend-flwq.onrender.com/api/v1/students/courses/${courseId}/assessments/${assessmentId}/submit`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmissionResult('Assessment submitted successfully!');
      setAnswers({});
      setIsSubmitted(true);
      // Redirect to CoursePlayer after a brief delay to show success message
      setTimeout(() => {
        navigate(`/course-player/${courseId}`);
      }, 1500);
    } catch (err) {
      setError('Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#eaf5ff] p-1 sm:p-2 md:p-4 flex flex-col min-h-[calc(100vh-3.5rem)] w-full mt-[3.5rem]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow p-4 sm:p-6 max-w-3xl mx-auto w-full"
      >
        {loading ? (
          <p className="text-gray-600 text-sm text-center">Loading assessment...</p>
        ) : error ? (
          <p className="text-red-500 text-sm text-center">{error}</p>
        ) : assessment ? (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-2">{assessment.title}</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{assessment.description}</p>
            {isSubmitted ? (
              <div className="text-center">
                <p className="text-red-500 text-sm mb-4">
                  You have already attempted this test. Please attend other assessments.
                </p>
                <button
                  onClick={() => navigate(`/course-player/${courseId}`)}
                  className="bg-[#49BBBD] text-white px-6 py-2 rounded-md text-sm sm:text-base hover:bg-[#49BBBD] transition"
                >
                  Back to Course
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {assessment.questions.map((question, index) => (
                    <div key={question._id} className="border rounded-lg p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-medium mb-2">
                        {index + 1}. {question.questionText}
                      </h3>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <label
                            key={option._id}
                            className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={question._id}
                              value={option._id}
                              checked={answers[question._id] === option._id}
                              onChange={() => handleAnswerSelect(question._id, option._id)}
                              className="h-4 w-4 text-blue-500"
                              disabled={submitting}
                            />
                            {option.text}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {submissionResult && (
                  <p className="text-green-500 text-sm mt-4 text-center">{submissionResult}</p>
                )}
                {error && (
                  <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
                )}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-[#49BBBD] text-white px-6 py-2 rounded-md text-sm sm:text-base hover:bg-[#49BBBD] transition disabled:bg-blue-300"
                  >
                    {submitting ? 'Submitting...' : 'Submit Test'}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-gray-600 text-sm text-center">No assessment data available.</p>
        )}
      </motion.div>
    </div>
  );
}
