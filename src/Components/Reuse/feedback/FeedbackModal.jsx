import React from "react";
import Modal from "../../Resources/Model";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaStar } from "react-icons/fa"; // Import star icon for rating

const FeedbackModal = ({ isOpen, onClose, feedbackData, onUpdate, onDelete }) => {
  // Function to render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return (
      <div className="flex space-x-1"> {/* Flex container with space between stars */}
        {stars}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Feedback Details"
      className="feedback-modal"
    >
      <div className="p-4 bg-white rounded-lg shadow-lg max-w-lg  max-h-[65vh] mx-auto">
        {/* Header with User Details */}
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <IoPersonSharp className="mr-2 text-xl text-blue-600" />
            {feedbackData.userName}
          </h2>
          <p className="flex items-center font-semibold text-gray-600">
            <MdEmail className="mr-2 text-xl text-red-600" />
            {feedbackData.userEmail}
          </p>
        </div>

        {/* Feedback Content with Background */}
        <div className="space-y-4 text-gray-800">
          {[ 
            { question: "Any additional feedback or thoughts you'd like to share?", answer: feedbackData.Afeedback },
            { question: "Are there any features you'd like to see added?", answer: feedbackData.features },
            { question: "Would you like us to follow up with you regarding your feedback?", answer: feedbackData.followUp },
            { question: "What suggestions do you have to improve your experience?", answer: feedbackData.improve },
            { question: "Did you encounter any issues or bugs? Please describe them:", answer: feedbackData.issues },
            { question: "How would you rate your overall experience with the app?", answer: renderRating(feedbackData.rating) }, // Use renderRating for the rating
            { question: "How easy is it to navigate the app?", answer: renderRating(feedbackData.ratingNav) }, // Add navigation rating
            { question: "Which features do you find most useful?", answer: feedbackData.selectedOptions?.join(", ") },
          ].map((item, index) => (
            <div key={index}>
              <strong className="block text-gray-900">{item.question}</strong>
              <p className="mt-1 bg-gray-50 p-2 rounded">
                {Array.isArray(item.answer) ? item.answer : item.answer || "N/A"}
              </p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
