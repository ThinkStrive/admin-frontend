import React, { useEffect, useState } from "react";
import Modal from "../../Resources/Model";
import { Form } from "react-bootstrap";
import {
  tailThirdBackgroundColor,
  tailThirdBackgroundColorHover,
} from "../../../Styles/Color";
import "../../../Styles/common.css";
import axios from "axios";
import moment from "moment";
import Loading from "../../Resources/Loading";
import { useToast } from "../../Resources/Toast";
import {
  DELETE_SINGLE_USER,
  UPDATE_SINGLE_USER,
} from "../../../api/ApiDetails";
import Alert from "../../Resources/Alert";

const UserUpdate = ({
  singleUserData,
  updateUserModel,
  setUpdateUserModel,
  setIsStateChanged,
  isStateChanged,
}) => {
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const [newUserData, setNewUserData] = useState(singleUserData);

  // console.log('singleUserData', singleUserData)
  
  // const handleUserInfoEdit = (e) => {
  //   const { name, value } = e.target;
  
  //   setNewUserData((prevState) => {
  //     // Destructure to handle nested updates
  //     const keys = name.split('.'); // Split nested keys
  //     let newState = { ...prevState };
  //     let currentLevel = newState;
  
  //     // Traverse to the appropriate nested level
  //     for (let i = 0; i < keys.length - 1; i++) {
  //       const key = keys[i];
  //       if (!currentLevel[key]) currentLevel[key] = {}; 
  //       currentLevel = currentLevel[key];
  //     }
  
  //     // Set the value at the last key
  //     const lastKey = keys[keys.length - 1];
  //     if (lastKey === "projectAccess") {
  //       currentLevel[lastKey] = value === "true"; 
  //     } else {
  //       currentLevel[lastKey] = value;
  //     }
  
  //     return newState;
  //   });
  // };
   
  const handleUserInfoEdit = (e) => {
    const { name, value } = e.target;

    setNewUserData((prevState) => {
        // Initialize new state as a deep copy
        const updatedData = JSON.parse(JSON.stringify(prevState));

        // Handle nested object updates
        if (name.includes('.')) {
            const keys = name.split('.');
            let current = updatedData;
            
            // Navigate through nested objects
            for (let i = 0; i < keys.length - 1; i++) {
                // Create object if it doesn't exist
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            // Set the final value
            current[keys[keys.length - 1]] = value;
        } else {
            // Handle top-level updates
            updatedData[name] = value;
        }

        // Handle main subscription type changes
        if (name === "subscriptionType" && value !== "none") {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split("T")[0];
            const formattedTime = currentDate.toTimeString().split(" ")[0];

            updatedData.projectsPlan = {
                project1: "true",
                project2: "true",
                project4: "true",
            };

            updatedData.subscriptionDate = formattedDate;
            updatedData.subscriptionTime = formattedTime;
        }

        // Handle baccarat subscription type changes
        if (name === "projectSubscription.baccarat.subscriptionType") {
            if (value !== "none") {
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().split("T")[0];
                const formattedTime = currentDate.toTimeString().split(" ")[0];

                // Ensure the baccarat object structure exists
                if (!updatedData.projectSubscription) {
                    updatedData.projectSubscription = {};
                }
                if (!updatedData.projectSubscription.baccarat) {
                    updatedData.projectSubscription.baccarat = {};
                }

                // Update baccarat specific fields
                updatedData.projectSubscription.baccarat = {
                    ...updatedData.projectSubscription.baccarat,
                    projectAccess: true,
                    subscriptionType: value,
                    subscriptionDate: formattedDate,
                    subscriptionTime: formattedTime
                };
            } else {
                // Reset baccarat fields when subscription type is none
                updatedData.projectSubscription.baccarat = {
                    ...updatedData.projectSubscription.baccarat,
                    projectAccess: false,
                    subscriptionType: 'none',
                    subscriptionDate: null,
                    subscriptionTime: null
                };
            }
        }

        return updatedData;
    });
};


  const handleClickCreateNewUser = async () => {
    setLoading(true);
    
    try {
      const data = {
        userName: newUserData.userName,
        userEmail: newUserData.userEmail,
        password: newUserData.password,
        mobileNumber: newUserData.mobileNumber,
        subscriptionType: newUserData.subscriptionType,
        projectsPlan: {
            project1: newUserData.projectsPlan.project1,
            project2: newUserData.projectsPlan.project2,
            project3: newUserData.projectsPlan.project3,
            project4: newUserData.projectsPlan.project4,
        },
        subscriptionDate: newUserData.subscriptionDate,
        subscriptionTime: newUserData.subscriptionTime,
        isPaid: {
            paid: (newUserData.subscriptionType !== 'none' || newUserData.isPaid.paid === true) ? true : false,
            paidType: newUserData.isPaid.paidType === 'none' ? newUserData.subscriptionType : 'none'
        },
        projectSubscription: {
            baccarat: {
                projectAccess: newUserData.projectSubscription?.baccarat?.projectAccess || false,
                subscriptionType: newUserData.projectSubscription?.baccarat?.subscriptionType || 'none',
                subscriptionDate: newUserData.projectSubscription?.baccarat?.subscriptionDate || null,
                subscriptionTime: newUserData.projectSubscription?.baccarat?.subscriptionTime || null,
            }
        }
    };

      // if(newUserData.subscriptionType === 'none'){
      //   data.subscriptionDate = singleUserData.subscriptionDate || '';
      //   data.subscriptionTime = singleUserData.subscriptionTime || '';
      // }else if (newUserData.subscriptionType !== singleUserData.subscriptionType) {
      //   data.subscriptionDate = moment().format("YYYY-MM-DD");
      //   data.subscriptionTime = moment().format("HH:mm:ss");
      // }
  
      console.log("data of user",data)

      await axios
        .put(`${UPDATE_SINGLE_USER}/${singleUserData._id}`, data)
        .then((res) => {
          if (res.data.status) {
            setUpdateUserModel(false);
            setIsStateChanged(!isStateChanged);
            setLoading(false);
            showToast("User updated successfully", "success");
          } else {
            setLoading(false);
            showToast(res.data.data, "error");
          }
        })
        .catch((err) => {
          setLoading(false);
          showToast(err.response.data.data, "error");
        });
    } catch (err) {
      console.log(err);
      showToast("Error while creating user", "error");
      setLoading(false);
    }
  };

  const handleDeleteSingleUser = async (id) => {
    try {
      await axios.delete(`${DELETE_SINGLE_USER}/${id}`).then((res) => {
        if (res.data.status) {
          setUpdateUserModel(false);
          setIsStateChanged(!isStateChanged);
          showToast("Deleted successfully", "success");
        }
      });
    } catch (err) {
      console.log(err);
      showToast("Problem with delete user", "error");
    }
  };

  const [alertForDelete, setAlertForDelete] = useState(false);

  const handleAlertForDelete = () => {
    setAlertForDelete(true);
  };

  const handleDeleteConfirmed = () => {
    handleDeleteSingleUser(singleUserData._id);
    setAlertForDelete(false);
  };

  const handleDeleteCancelled = () => {
    setAlertForDelete(false);
  };

  return (
    <>
      <Modal
        isOpen={updateUserModel}
        onClose={() => setUpdateUserModel(false)}
        title="Update User"
      >
        <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-medium mb-6">Basic Info</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information Fields */}
        <Form.Group controlId="formBasicName">
          <Form.Label className="block text-sm font-medium mb-2">Name *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user name"
            className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
            name="userName"
            value={newUserData.userName}
            onChange={handleUserInfoEdit}
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label className="block text-sm font-medium mb-2">Email *</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter user email"
            className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
            name="userEmail"
            value={newUserData.userEmail}
            onChange={handleUserInfoEdit}
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label className="block text-sm font-medium mb-2">Password *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter password"
            className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
            name="password"
            value={newUserData.password}
            onChange={handleUserInfoEdit}
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group controlId="formBasicMobile">
          <Form.Label className="block text-sm font-medium mb-2">Mobile Number *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter mobile number"
            className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
            name="mobileNumber"
            value={newUserData.mobileNumber}
            onChange={handleUserInfoEdit}
            autoComplete="off"
          />
        </Form.Group>
      </div>

      {/* Project Access Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roulette & SpinCycle Section */}
        <div className="p-4 border-2 border-orange-100 rounded-xl">
          <div className="bg-orange-200 py-3 mb-4 rounded-lg">
            <h2 className="text-center font-bold text-xl">Roulette & SpinCycle</h2>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium mb-2">Subscription Type *</Form.Label>
            <Form.Select
                className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                name="subscriptionType"
                value={newUserData.subscriptionType || ""}
                onChange={handleUserInfoEdit}
            >
                <option value="none">No Plan</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium mb-2">Subscribed Date *</Form.Label>
            <Form.Control
                type="date"
                className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                name="subscriptionDate"
                value={newUserData.subscriptionDate || ""}
                onChange={handleUserInfoEdit}
            />
        </Form.Group>

        <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium mb-2">Subscribed Time *</Form.Label>
            <Form.Control
                type="time"
                className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                name="subscriptionTime"
                value={newUserData.subscriptionTime || ""}
                onChange={handleUserInfoEdit}
            />
        </Form.Group>

          {/* Project Access Dropdowns */}
          <div className="space-y-4">
            <Form.Group>
              <Form.Label className="block text-sm font-medium mb-2">DD-Roulette</Form.Label>
              <Form.Select
                className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                name="projectsPlan.project1"
                value={newUserData.projectsPlan?.project1 || "false"}
                onChange={handleUserInfoEdit}
              >
                <option value="true">Enable</option>
                <option value="false">Disable</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="block text-sm font-medium mb-2">RSA</Form.Label>
              <Form.Select
                className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                name="projectsPlan.project2"
                value={newUserData.projectsPlan?.project2 || "true"}
                onChange={handleUserInfoEdit}
              >
                <option value="true">Enable</option>
                <option value="false">Disable</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="block text-sm font-medium mb-2">SpinCycle</Form.Label>
              <Form.Select
                className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                name="projectsPlan.project4"
                value={newUserData.projectsPlan?.project4 || "false"}
                onChange={handleUserInfoEdit}
              >
                <option value="true">Enable</option>
                <option value="false">Disable</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>

        {/* Baccarat Section */}
        <div className="p-4 border-2 border-orange-100 rounded-xl">
          <div className="bg-orange-200 py-3 mb-4 rounded-lg">
            <h2 className="text-center font-bold text-xl">Baccarat</h2>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium mb-2">Subscription Type *</Form.Label>
            <Form.Select
              className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
              name="projectSubscription.baccarat.subscriptionType"
              value={newUserData.projectSubscription?.baccarat?.subscriptionType || "none"}
              onChange={handleUserInfoEdit}
            >
              <option value="none">No Plan</option>
              <option value="hourly">1 Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium mb-2">Subscribed Date *</Form.Label>
            <Form.Control
              type="date"
              className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
              name="projectSubscription.baccarat.subscriptionDate"
              value={newUserData.projectSubscription?.baccarat?.subscriptionDate || ""}
              onChange={handleUserInfoEdit}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium mb-2">Subscribed Time *</Form.Label>
            <Form.Control
              type="time"
              className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
              name="projectSubscription.baccarat.subscriptionTime"
              value={newUserData.projectSubscription?.baccarat?.subscriptionTime || ""}
              onChange={handleUserInfoEdit}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="block text-sm font-medium mb-2">Project Access *</Form.Label>
            <Form.Select
              className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
              name="projectSubscription.baccarat.projectAccess"
              value={newUserData.projectSubscription?.baccarat?.projectAccess ? "true" : "false"}
              onChange={handleUserInfoEdit}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center mt-6 space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
          onClick={handleClickCreateNewUser}
        >
          Update
        </button>
        <button
          className="px-6 py-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg"
          onClick={handleAlertForDelete}
        >
          Delete
        </button>
      </div>
    </div>
      </Modal>
      {loading && <Loading />}
      {alertForDelete && (
        <Alert
          content={"Are you want to delete user ?"}
          onConfirm={handleDeleteConfirmed}
          onCancel={handleDeleteCancelled}
        />
      )}
    </>
  );
};

export default UserUpdate;
