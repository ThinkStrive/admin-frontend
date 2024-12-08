import React, { useEffect, useState } from "react";
import { DELETE_SINGLE_USER, GET_ALL_USER } from "../../api/ApiDetails";
import axios from "axios";
import moment from "moment";
import {
  tailThirdBackgroundColor,
  tailThirdBackgroundColorHover,
} from "../../Styles/Color";
import UserAdd from "../Reuse/user/UserAdd";
import UserUpdate from "../Reuse/user/UserUpdate";
import Loading from "../Resources/Loading";
import UserCard from "../Reuse/user/UserCard";
import { FaCalendarAlt, FaClock, FaEdit, FaMobile, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [duplicateData, setDuplicateData] = useState([]);
  const [isStateChanged, setIsStateChanged] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const getAllUsers = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(GET_ALL_USER);
      setAllUsers(res.data.data.reverse());
      setDuplicateData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [isStateChanged]);

  const [addNewUserModel, setAddNewUserModel] = useState(false);
  const [updateUserModel, setUpdateUserModel] = useState(false);
  const [singleUserData, setSingleUserData] = useState("");

  useEffect(() => {
    const searchFunction = () => {
      const lowerCaseInput = searchInput.toLowerCase();

      const filtered = duplicateData.filter((user) => {
        return (
          user.userEmail?.toLowerCase().includes(lowerCaseInput) ||
          user.mobileNumber.includes(lowerCaseInput)
        );
      });

      setAllUsers(filtered);
    };

    searchFunction();
  }, [searchInput, duplicateData]);

  const handleClickFilterFunction = (event) => {
    const selectedValue = event.target.value; // Get the selected value from the event
    try {
      const filteredData = duplicateData.filter((item) => {
        return (
          selectedValue === "all" || item.subscriptionType === selectedValue
        );
      });
      setAllUsers(filteredData);
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className="w-full h-full pt-2 pb-4 px-6 ">
        <div className="flex md:flex-row flex-col gap-3 justify-between md:items-center mt-4 mb-10">
          <h4 className="font-semibold text text-lg">
            Users - {allUsers.length}
          </h4>
          <div className="flex md:flex-row flex-col gap-3 justify-between md:items-center items-start">
            <select
              name=""
              id=""
              onChange={handleClickFilterFunction}
              className="px-3 py-1 rounded-lg shadow"
            >
              <option value="all">All</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <div className="relative md:mx-5 flex gap-3">
              <i className="fa-solid fa-magnifying-glass absolute top-3 left-4 text-slate-500"></i>
              <input
                type="text"
                className="shadow-md md:w-[350px] rounded-lg py-2.5 bg-white pl-12 search-input text-sm"
                placeholder="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div
                className={`w-10 h-10 md:hidden flex justify-center items-center rounded cursor-pointer ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover}`}
                onClick={() => setAddNewUserModel(true)}
              >
                <i className="fa-solid fa-plus"></i>
              </div>
            </div>
            <div
              className={`w-10 h-10 md:flex hidden justify-center items-center rounded cursor-pointer ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover}`}
              onClick={() => setAddNewUserModel(true)}
            >
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
        </div>

        {loading ? ( // Show loading spinner/message when loading
          <div className="w-full h-[80%] flex justify-center items-center">
            <>
              <Loading />
            </>
            {/* Replace this with a spinner for better UX */}
          </div>
        ) : allUsers.length !== 0 ? (
          <>
            <div className="overflow-x-auto mt-10">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[0.6fr,1fr,0.6fr,0.6fr,0.5fr,0.3fr] gap-8 bg-gray-800 text-slate-200 p-3 rounded-md text-base mb-1">
                  <p className="text-center font-medium">
                    <FaUser className="inline-block mr-1" />
                    Name
                  </p>
                  <p className=" ml-8 font-medium">
                    <MdEmail className="inline-block mr-1" />
                    Email ID
                  </p>
                  <p className="text-end font-medium">
                  <FaMobile className="inline-block mr-1" />
                    Mobile Number
                  </p>
                  <p className="text-end font-medium">
                    <FaCalendarAlt className="inline-block mr-1" />
                   Subscribed
                  </p>
                  <p className="text-center font-medium">
                  <BsCashCoin className="inline-block mr-1" />
                    Plan
                  </p>
                  <p className="text-center font-medium">
                  <FaEdit className="inline-block mr-1" />
                    Edit</p>
                </div>
                <div>
                  {allUsers.map((user) => (
                    <UserCard
                      key={user._id}
                      userData={user}
                      setUpdateUserModel={setUpdateUserModel}
                      setSingleUserData={setSingleUserData}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-[80%] flex justify-center items-center">
            <p>No Data's available</p>
          </div>
        )}
      </div>
      {addNewUserModel && (
        <UserAdd
          setAddNewUserModel={setAddNewUserModel}
          addNewUserModel={addNewUserModel}
          setIsStateChanged={setIsStateChanged}
          isStateChanged={isStateChanged}
        />
      )}

      {updateUserModel && (
        <UserUpdate
          singleUserData={singleUserData}
          setUpdateUserModel={setUpdateUserModel}
          updateUserModel={updateUserModel}
          setIsStateChanged={setIsStateChanged}
          isStateChanged={isStateChanged}
        />
      )}
    </>
  );
};

export default Users;
