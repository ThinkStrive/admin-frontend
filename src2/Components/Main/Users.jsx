import React, { useEffect, useState } from "react";
import { DELETE_SINGLE_USER, GEL_ALL_USER } from "../../api/ApiDetails";
import axios from "axios";
import moment from "moment";
import {
  tailThirdBackgroundColor,
  tailThirdBackgroundColorHover,
} from "../../Styles/Color";
import UserAdd from "../Reuse/user/UserAdd";
import UserUpdate from "../Reuse/user/UserUpdate";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [duplicateData, setDuplicateData] = useState([]);
  const [isStateChanged, setIsStateChanged] = useState(false);
  const getAllUsers = async () => {
    await axios
      .get(GEL_ALL_USER)
      .then((res) => {
        console.log(res.data.data);
        setAllUsers(res.data.data);
        setDuplicateData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, [isStateChanged]);

  const [addNewUserModel, setAddNewUserModel] = useState(false);
  const [updateUserModel, setUpdateUserModel] = useState(false);

  // Webinar ID

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

  return (
    <>
      <div className="w-full h-full py-4 px-6">
        <div className="flex justify-between">
          <div className="w-[30%] relative">
            <i className="fa-solid fa-magnifying-glass absolute top-3 left-4 text-slate-500"></i>
            <input
              type="text"
              className="shadow-md w-[100%] rounded-lg py-2.5 bg-white pl-12 search-input text-sm"
              placeholder="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between my-4">
          <h4 className="font-semibold text-lg">
            Total Users - {allUsers.length}
          </h4>
          <div
            className={`w-10 h-10 flex justify-center items-center rounded  cursor-pointer ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover}`}
            onClick={() => {
              setAddNewUserModel(true);
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>

        {allUsers.length !== 0 ? (
          <div className="w-full mt-4 max-h-[95%] flex flex-wrap justify-start items-start">
            {allUsers.map((user, index) => (
              <div
                key={index}
                className="shadow-md bg-white rounded-xl p-3 m-2 cursor-pointer"
                onClick={() => {
                  setUpdateUserModel(true);
                  setSingleUserData(user);
                }}
              >
                <h2>{user.userName}</h2>
                <h2>{user.userEmail}</h2>
                <h2>{user.mobileNumber}</h2>
              </div>
            ))}
          </div>
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
