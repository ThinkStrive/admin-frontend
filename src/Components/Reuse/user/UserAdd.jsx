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
import { ADD_NEW_USER } from "../../../api/ApiDetails";

const UserAdd = ({
  addNewUserModel,
  setAddNewUserModel,
  setIsStateChanged,
  isStateChanged,
}) => {
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const [newUserData, setNewUserData] = useState({
    userName: "",
    userEmail: "",
    password: "",
    mobileNumber : ''
  });

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
        .post(ADD_NEW_USER, data)
        .then((res) => {
          if (res.data.status) {
            setAddNewUserModel(false);
            setIsStateChanged(!isStateChanged);
            setLoading(false);
            showToast("User created successfully", "success");
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
      showToast('Error while creating user', "error");
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={addNewUserModel}
        onClose={() => setAddNewUserModel(false)}
        title="Create New User"
      >
        <div className="con-con3">
          <h2 className="text-left w-full px-6 font-medium">Basic Info</h2>
          <div className="flex md:flex-row flex-col flex-wrap justify-between px-6  ">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Name *
              </Form.Label>
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
              <Form.Label className="input-item-label">
                Email *
              </Form.Label>
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

          <div className="flex md:flex-row flex-col gap-3 justify-center items-center mt-6">
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg`}
              onClick={handleClickCreateNewUser}
            >
              Add
            </button>
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg`}
              onClick={() => setAddNewUserModel(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      {loading && <Loading />}
    </>
  );
};

export default UserAdd;
