import React, { useEffect, useState , useCallback } from "react";
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
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaMobile,
  FaUser,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
// import { log } from "console";
import debounce from "../../utils/debouncing";

const Users = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [duplicateData, setDuplicateData] = useState([]);
  const [isStateChanged, setIsStateChanged] = useState(false);
  const [addNewUserModel, setAddNewUserModel] = useState(false);
  const [updateUserModel, setUpdateUserModel] = useState(false);
  const [singleUserData, setSingleUserData] = useState("");
  // pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 50;
  const [totalPages, setTotalPages] = useState(1);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const fetchUsersData = async (searchValue = "") => {
    try {
      const response = await axios.get(
        `${GET_ALL_USER}?page=${currentPage}&limit=${usersPerPage}&search=${searchValue}`
      );
      if (response.data.status) {
        const { data, totalCount } = response.data;
        setAllUsers(data);
        setDuplicateData(data);
        setTotalPages(Math.ceil(totalCount / usersPerPage));
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
   
    fetchUsersData();
   
  }, []);

  useEffect(() => {
    fetchUsersData();
  }, [currentPage]);

  // Debouncing API calls on searchInput change for better performance
  const debouncedFetchUsers = useCallback(debounce((value)=>{
    fetchUsersData(value);
  },600),[]);

  useEffect(() => {
    debouncedFetchUsers(searchInput);
    return ()=> debouncedFetchUsers.cancel();
  }, [searchInput , debouncedFetchUsers]);

  const handleClickFilterFunction = (event) => {
    const selectedValue = event.target.value;
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
        <div className="flex md:flex-row flex-col gap-3 justify-between md:items-center mt-4 mb-6">
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

        {isInitialLoad ? (
          <div className="w-full h-[80%] flex justify-center items-center">
            {/* Replace this with a spinner for better UX */}
            <>
              <Loading />
            </>
          </div>
        ) : (
          <>
            {/* users Data Table */}
            <div className="overflow-x-auto mt-2">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[0.6fr,1fr,0.6fr,0.7fr,0.4fr,0.2fr] gap-5 bg-gray-800 text-slate-200 p-3 rounded-md text-base mb-1">
                  <p className="ml-3 font-medium">
                    <FaUser className="inline-block mr-1" />
                    Name
                  </p>
                  <p className="font-medium">
                    <MdEmail className="inline-block mr-1" />
                    Email ID
                  </p>
                  <p className="ml-1 font-medium">
                    <FaMobile className="inline-block mr-1" />
                    Mobile Number
                  </p>
                  <p className="text-center font-medium">
                    <FaCalendarAlt className="inline-block mr-1" />
                    Subscribed
                  </p>
                  <p className="ml-1 font-medium">
                    <BsCashCoin className="inline-block mr-1" />
                    Plan
                  </p>
                  <p className="font-medium">
                    <FaEdit className="inline-block mr-1" />
                    Edit
                  </p>
                </div>
                { allUsers.length !== 0 &&
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
                }
                {allUsers.length === 0 && 
                  <div className="mt-5 flex justify-center items-center">
                    <p>No Users Found</p>
                  </div>
                }
              </div>
              {allUsers.length !== 0 && 
                <div className="min-w-[1100px]">
                  {/* pagination */}
                  <div className="flex justify-center mt-5 pb-5">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 lg:px-4 lg:py-2 mx-1 bg-gray-800 text-slate-200 rounded-md hover:bg-black ${
                        currentPage === 1 ? "opacity-80 cursor-not-allowed" : ""
                      }`}
                    >
                      &lt;
                    </button>
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 lg:px-4 lg:py-2 mx-0.5 rounded-md ${
                          currentPage === page
                            ? "bg-blue-700 text-white"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 lg:px-4 lg:py-2 mx-1 bg-gray-800 text-slate-200 rounded-md hover:bg-black ${
                        currentPage === totalPages
                          ? "opacity-80 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              }
            </div>
          </>
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