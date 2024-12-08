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

  console.log('singleUserData', singleUserData)

  const handleChangeCreateUser = (e) => {
    const { name, value } = e.target;

    // Check if the name belongs to the project plan fields
    if (["project1", "project2","project3", "project4"].includes(name)) {
      setNewUserData((prevState) => ({
        ...prevState,
        projectsPlan: {
          ...prevState.projectsPlan,
          [name]: value, // Update specific project plan field
        },
      }));
    } else {
      // Otherwise, update the rest of newUserData
      setNewUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
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
        subscriptionDate:'',
        subscriptionTime: '',
        isPaid : {
          paid : (newUserData.subscriptionType !== 'none' || singleUserData.isPaid.paid === true) ? true : false,
          paidType : singleUserData.isPaid.paidType === 'none' ? singleUserData.subscriptionType : 'none'
        }
      };

      if(newUserData.subscriptionType === 'none'){
        data.subscriptionDate = singleUserData.subscriptionDate || '';
        data.subscriptionTime = singleUserData.subscriptionTime || '';
      }else if (newUserData.subscriptionType !== singleUserData.subscriptionType) {
        data.subscriptionDate = moment().format("YYYY-MM-DD");
        data.subscriptionTime = moment().format("HH:mm:ss");
      }
  

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
        <div className="con-con3">
          <h2 className="text-left w-full px-6 font-medium">Basic Info</h2>
          <div className="w-full flex flex-wrap justify-between px-6 ">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Name *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="text"
                placeholder="Enter user name"
                onChange={handleChangeCreateUser}
                name="userName"
                value={newUserData.userName}
              />
            </Form.Group>

            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Email *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="text"
                placeholder="Enter user email"
                onChange={handleChangeCreateUser}
                name="userEmail"
                value={newUserData.userEmail}
              />
            </Form.Group>

            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Password *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="text"
                placeholder="Enter password"
                onChange={handleChangeCreateUser}
                name="password"
                value={newUserData.password}
              />
            </Form.Group>

            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Mobile Number *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="text"
                placeholder="Enter mobile number"
                onChange={handleChangeCreateUser}
                name="mobileNumber"
                value={newUserData.mobileNumber}
              />
            </Form.Group>

            <Form.Group
              controlId="formBasicSubscription"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Subscription Type *
              </Form.Label>
              <br />
              <Form.Control
                as="select"
                className="item-con-input-text bg-slate-200"
                onChange={handleChangeCreateUser}
                name="subscriptionType"
                value={newUserData.subscriptionType}
              >
                <option value="none" >No Plan</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Form.Control>
            </Form.Group>

            {/* Project Plan Fields */}
            <Form.Group
              controlId="formBasicProject1"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Project 1 *</Form.Label>
              <br />
              <Form.Control
                as="select"
                className="item-con-input-text bg-slate-200"
                onChange={handleChangeCreateUser}
                name="project1"
                value={newUserData.projectsPlan?.project1 || ""}
              >
                <option value="" disabled>
                  Give Access
                </option>
                <option value={true}>Enable</option>
                <option value={false}>Disable</option>
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="formBasicProject2"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Project 2 *</Form.Label>
              <br />
              <Form.Control
                as="select"
                className="item-con-input-text bg-slate-200"
                onChange={handleChangeCreateUser}
                name="project2"
                value={newUserData.projectsPlan?.project2 || ""}
              >
                <option value="" disabled>
                  Give Access
                </option>
                <option value={true}>Enable</option>
                <option value={false}>Disable</option>
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="formBasicProject3"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Project 3 *</Form.Label>
              <br />
              <Form.Control
                as="select"
                className="item-con-input-text bg-slate-200"
                onChange={handleChangeCreateUser}
                name="project3"
                value={newUserData.projectsPlan?.project3 || ""}
              >
                <option value="" disabled>
                  Give Access
                </option>
                <option value={true}>Enable</option>
                <option value={false}>Disable</option>
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="formBasicProject4"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Project 4 *</Form.Label>
              <br />
              <Form.Control
                as="select"
                className="item-con-input-text bg-slate-200"
                onChange={handleChangeCreateUser}
                name="project4"
                value={newUserData.projectsPlan?.project4 || ""}
              >
                <option value="" disabled>
                  Give Access
                </option>
                <option value={true}>Enable</option>
                <option value={false}>Disable</option>
              </Form.Control>
            </Form.Group>
            
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Subscribed Date *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="date"
                onChange={handleChangeCreateUser}
                name=""
                disabled

                value={newUserData.subscriptionDate}
              />
            </Form.Group>

            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
              Subscribed Time *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="time"
                disabled
                onChange={handleChangeCreateUser}
                name=""

                value={newUserData.subscriptionTime}
              />
            </Form.Group>
          </div>

          <div className="flex justify-end items-center mt-6">
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg`}
              onClick={handleClickCreateNewUser}
            >
              Update
            </button>
            <button
              className={`font-semibold text-md bg-red-400 px-6 py-2 rounded-lg ml-10`}
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
