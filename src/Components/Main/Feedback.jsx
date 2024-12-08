import React, { useEffect, useState } from "react";  
import { GET_ALL_FEEDBACK } from "../../api/ApiDetails";
import axios from "axios";
import FeedbackModal from "../Reuse/feedback/FeedbackModal";
import Loading from "../Resources/Loading";

const Feedback = () => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [duplicateData, setDuplicateData] = useState([]);
  const [singleFeedbackData, setSingleFeedbackData] = useState(null);
  const [updateFeedbackModel, setUpdateFeedbackModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableBgColor, setTableBgColor] = useState("bg-white");

  const getAllFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.get(GET_ALL_FEEDBACK);
      setAllFeedback(res.data.reverse());
      setDuplicateData(res.data);
    } catch (err) {
      console.log("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFeedback();
  }, []);

  useEffect(() => {
    const searchFunction = () => {
      const lowerCaseInput = searchInput.toLowerCase();
      const filtered = duplicateData.filter(
        (feedback) =>
          feedback.email?.toLowerCase().includes(lowerCaseInput) ||
          feedback.Afeedback?.toLowerCase().includes(lowerCaseInput)
      );
      setAllFeedback(filtered);
    };
    searchFunction();
  }, [searchInput, duplicateData]);

  const handleClickFilterFunction = (event) => {
    const selectedValue = event.target.value;
    let filteredData;

    if (selectedValue === "all") {
      filteredData = duplicateData;
      setTableBgColor("bg-white");
    } else if (selectedValue === "positive") {
      filteredData = duplicateData.filter((item) => item.rating > 3);
      setTableBgColor("bg-green-100");
    } else if (selectedValue === "neutral") {
      filteredData = duplicateData.filter((item) => item.rating === 3);
      setTableBgColor("bg-gray-200");
    } else if (selectedValue === "negative") {
      filteredData = duplicateData.filter((item) => item.rating < 3);
      setTableBgColor("bg-red-100");
    } else {
      filteredData = duplicateData;
      setTableBgColor("bg-white");
    }

    setAllFeedback(filteredData);
  };

  const formatDate = (date) => {
    const now = new Date();
    const feedbackDate = new Date(date);
    const timeDiff = now - feedbackDate;

    const secondsDiff = Math.floor(timeDiff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);

    if (secondsDiff < 60) {
      return "Just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
    } else if (daysDiff === 1) {
      return "1 day ago";
    } else if (daysDiff < 30) {
      return `${daysDiff} days ago`;
    } else {
      return feedbackDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="w-full h-full px-4 py-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h4 className="font-semibold text-lg text-gray-800">
          Feedback Records - {allFeedback.length}
        </h4>
        <div className="flex gap-4 items-center">
          <select
            onChange={handleClickFilterFunction}
            className="px-4 py-2 rounded-lg shadow-md bg-white border border-gray-300 text-gray-700"
          >
            <option value="all">All</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute top-3 left-4 text-gray-400"></i>
            <input
              type="text"
              className="pl-12 py-2.5 shadow-md bg-white rounded-lg w-full sm:w-[300px] md:w-[350px] border border-gray-300 text-sm text-gray-700"
              placeholder="Search by Email or Feedback"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Feedback Grid */}
      {loading ? (
        <div className="w-full h-[80%] flex justify-center items-center">
          <Loading />
        </div>
      ) : allFeedback.length !== 0 ? (
        <div className="mt-10 overflow-x-auto "> 
          <div className="min-w-[1000px]">
            {/* Header Grid */}
            <div className="grid grid-cols-[2fr,2fr,1fr,1fr] font-semibold text-sm text-gray-700 bg-gray-800 p-4 rounded-lg">
              <span className="text-white pl-2">Username</span>
              <span className="text-white pl-4">Email ID</span>
              <span className="text-white pl-3">Date</span>
              <span className="text-white pl-6">Time</span>
            </div>

            {/* Feedback Rows */}
            {allFeedback.map((feedback, index) => (
              <div
                key={index}
                className={`grid grid-cols-[2fr,2fr,1fr,1fr] gap-4 items-center cursor-pointer p-4 rounded-lg border-2 my-2 border-gray-700 ${tableBgColor}`}
                onClick={() => {
                  setUpdateFeedbackModel(true);
                  setSingleFeedbackData(feedback);
                }}
              >
                <span className="px-2 whitespace-nowrap">{feedback.userName || "No Name"}</span>
                <span className="px-2">{feedback.userEmail || "N/A"}</span>
                <span className="px-2">{formatDate(feedback.createdAt)}</span>
                <span className="px-2">{new Date(feedback.createdAt).toLocaleTimeString() || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-[80%] flex justify-center items-center">
          <p className="text-gray-800">No Feedback Available</p>
        </div>
      )}

      {/* Feedback Modal */}
      {updateFeedbackModel && singleFeedbackData && (
        <FeedbackModal
          isOpen={updateFeedbackModel}
          onClose={() => setUpdateFeedbackModel(false)}
          feedbackData={singleFeedbackData}
        />
      )}
    </div>
  );
};

export default Feedback;