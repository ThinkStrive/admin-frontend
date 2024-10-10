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
  ADD_NEW_USER,
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

  const handleChangeCreateUser = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickCreateNewUser = async () => {
    setLoading(true);
    try {
      const data = {
        userName: newUserData.userName,
        userEmail: newUserData.userEmail,
        password: newUserData.password,
        mobileNumber: newUserData.mobileNumber,
      };

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
          setUpdateUserModel(false)
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
          <div className="w-full flex flex-wrap justify-between px-6">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Name *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
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
                className="item-con-input-text bg-slate-200 "
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
                className="item-con-input-text bg-slate-200 "
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
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter mobile number"
                onChange={handleChangeCreateUser}
                name="mobileNumber"
                value={newUserData.mobileNumber}
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
