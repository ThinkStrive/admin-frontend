import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCalendarAlt , FaClock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GrNotes } from "react-icons/gr";
import { filterUsersByDate } from "../../utils/helpers"; 
import { HISTORY_DETAILS } from "../../api/ApiDetails";

const PaidHistory = () => {
  const [ data, setData ] = useState([]);
  const [ filteredData,setFilteredData ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ searchValue , setSearchValue ] = useState("");
  const [ dropDownData , setDropDownData ] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(
        HISTORY_DETAILS
      );
      const { data } = response?.data;
      setData(data); 
      setFilteredData(data); // duplicating Data 

      // filtering data using helper function
      const { usersWithinMonth , usersInThreeMonths , usersInSixMonths , usersWithinYear } = filterUsersByDate(data);
      setDropDownData({
        oneMonth:usersWithinMonth,
        threeMonths:usersInThreeMonths,
        sixMonths:usersInSixMonths,
        oneYear:usersWithinYear
      });
      console.log(data);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Formatting database timeString to localeTimeString()
  const formatTime = (timeString)=>{
    const [ hours , minutes ] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours,minutes);

    const localTimeStr = date.toLocaleTimeString([],{
      hour:"2-digit",
      minute:"2-digit",
      hour12:true
    });

    return localTimeStr;
  }

  // Dropdown filter
  const handleFilterChange = (e)=>{
      const selectedCategory = e.target.value;
    try {
        if( selectedCategory === "all"){
            setFilteredData(data); 
        }else if( dropDownData[selectedCategory]){
              const filterSubscribedUsers = dropDownData[selectedCategory].filter(item=> item.subscriptionType !== "none");
              setFilteredData(filterSubscribedUsers);
          }else{
          const filteredCategoryData = data.filter(item=> item.subscriptionType === selectedCategory);
          setFilteredData(filteredCategoryData);
        }
    } catch (error) {
        console.log(error.message);
        
    }
  }

  // searching payment history

  const searchByInput = (e)=>{
        const searchInputValue = e.target.value;
        setSearchValue(searchInputValue);
        try {
          if(searchInputValue === ""){
            setFilteredData(data);   // displays all data when search bar is empty
          }else{
            const filteredBySearch = data.filter(item=> item?.userName.toLowerCase().includes(searchInputValue.toLowerCase()) || item?.userEmail.toLowerCase().includes(searchInputValue.toLowerCase()));
             setFilteredData(filteredBySearch);
          }
        } catch (error) {
          console.log(error.message);
          
        }
  }


  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-6 text-lg text-gray-600">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-6 text-lg text-red-600">Error: {error}</p>
    );

  return (
    <div className="p-6">
          <div className="flex md:flex-row flex-col gap-3 md:justify-between items-start mt-4 mb-10">
              <div>
              <h1 className="text-xl font-semibold text-center mb-4 text-gray-800">
               History - {data?.length}
              </h1>
              </div>
         <div className="flex md:flex-row flex-col gap-4 justify-between md:items-center items-start">
          <select name="" id="" onChange={handleFilterChange} className="px-3 py-1 rounded-lg shadow">
              <option value="all">All</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="oneMonth">1 Month</option>
              <option value="threeMonths">3 Month</option>
              <option value="sixMonths">6 Month</option>
              <option value="oneYear">1 Year</option>
            </select>
            <div className="relative flex gap-3">
              <i className="fa-solid fa-magnifying-glass absolute top-3 left-4 text-slate-500"></i>
              <input
                type="text"
                className="shadow-md md:w-[350px] rounded-lg py-2.5 bg-white pl-12 search-input text-sm"
                placeholder="search"
                value={searchValue}
                onChange={searchByInput}
              />
            </div>
            </div>
          </div>
      {/* Subscription history grid */}
      <div className="overflow-x-auto mt-10">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[1fr,1.5fr,1fr,1fr,1fr] gap-6 bg-gray-800 text-slate-200 p-3 rounded-lg text-base mb-1">
            <p className="text-center font-semibold">
            <FaUser className="inline-block mr-1" />
              Username
            </p>
            <p className="text-center font-semibold">
            <MdEmail className="inline-block mr-1" />
              Email ID
            </p>
            <p className="text-center font-semibold">
              <GrNotes className="inline-block mr-1"/>
              Subscription Type
              </p>
            <p className="text-center font-semibold">
              <FaCalendarAlt className="inline-block mr-1" />
              Subscription Date
              </p>
            <p className="text-center font-semibold">
              <FaClock className="inline-block mr-1" />
              Time
              </p>
          </div>

                {/* conditional rendering History */}
          {
            (filteredData.length === 0)? <h2 className="text-center my-8 text-lg font-semibold">No History Found !!!</h2> 
            :filteredData.map((item) => {
              const {
                _id,
                userName,
                userEmail,
                subscriptionType,
                subscriptionDate,
                subscriptionTime,
              } = item;
              return (
                <div
                  key={_id}
                  className={`grid grid-cols-[1fr,1.5fr,1fr,1fr,1fr] gap-5 p-5 cursor-pointer rounded-lg mb-1 border-2 ${(subscriptionType === "monthly") ? "bg-green-300" : (subscriptionType === "weekly") ? "bg-orange-300" : "bg-red-300"} `}
                >
                  <p className="text-center font-medium">
                    {userName ? userName : "N/A"}
                  </p>
                  <p className="text-center font-medium">
                    {userEmail ? userEmail : "N/A"}
                  </p>
                  <p className="text-center font-medium">
                    {subscriptionType ? subscriptionType : "N/A"}
                  </p>
                  <p className="text-center font-medium">
                    {subscriptionDate ? subscriptionDate : "N/A"}
                  </p>
                  <p className="text-center font-medium">
                    {subscriptionTime ? formatTime(subscriptionTime) : "N/A"}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PaidHistory;
