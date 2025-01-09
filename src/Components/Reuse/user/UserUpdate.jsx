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
  const [alertForDelete, setAlertForDelete] = useState(false);
  const showToast = useToast();
  
  // Initialize form data with database values
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    if (singleUserData) {
      setFormData(singleUserData);
    }
  }, [singleUserData]);

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0]
    };
  };

  const handleSubscriptionChange = (subscriptionType, section = 'main') => {
    const { date, time } = getCurrentDateTime();

    if (section === 'main') {
      if (subscriptionType === 'none') {
        // Reset to original values for main subscription
        return {
          subscriptionType,
          subscriptionDate: 'none',
          subscriptionTime: 'none',
          projectsPlan: { 
            project1:false,
            project2:true,
            project4:false
          }
        };
      }
      // Set new values for main subscription
      return {
        subscriptionType,
        subscriptionDate: date,
        subscriptionTime: time,
        projectsPlan: {
          project1: 'true',
          project2: 'true',
          project4: 'true'
        }
      };
    } else if (section === 'baccarat') {
      if (subscriptionType === 'none') {
        // Reset baccarat subscription to original values
        return {
          projectAccess: false,
          subscriptionType,
          subscriptionDate: null,
          subscriptionTime: null
        };
      }
      // Set new values for baccarat subscription
      return {
        projectAccess: true,
        subscriptionType,
        subscriptionDate: date,
        subscriptionTime: time
      };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      const newData = { ...prevData };

      if (name.includes('.')) {
        const keys = name.split('.');
        let current = newData;
        
        // Handle nested object updates
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        const lastKey = keys[keys.length - 1];
        
        // Handle special subscription type changes
        if (lastKey === 'subscriptionType') {
          if (keys[0] === 'projectSubscription' && keys[1] === 'baccarat') {
            const baccaratUpdates = handleSubscriptionChange(value, 'baccarat');
            Object.assign(current, baccaratUpdates);
          }
        } else {
          current[lastKey] = value;
        }
      } else {
        // Handle top-level updates
        if (name === 'subscriptionType') {
          const updates = handleSubscriptionChange(value, 'main');
          Object.assign(newData, updates);
        } else {
          newData[name] = value;
        }
      }

      return newData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        isPaid: {
          paid: (formData.subscriptionType !== 'none' || formData.isPaid.paid === true),
          paidType: formData.isPaid.paidType === 'none' ? formData.subscriptionType : 'none'
        }
      };

      const response = await axios.put(`${UPDATE_SINGLE_USER}/${singleUserData._id}`, submitData);
      
      if (response.data.status) {
        setUpdateUserModel(false);
        setIsStateChanged(!isStateChanged);
        showToast("User updated successfully", "success");
      } else {
        showToast(response.data.data, "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.data || "Error while updating user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${DELETE_SINGLE_USER}/${singleUserData._id}`);
      if (response.data.status) {
        setUpdateUserModel(false);
        setIsStateChanged(!isStateChanged);
        showToast("Deleted successfully", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Problem with delete user", "error");
    }
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
                value={formData.userName || ''}
                onChange={handleInputChange}
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
                value={formData.userEmail || ''}
                onChange={handleInputChange}
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
                value={formData.password || ''}
                onChange={handleInputChange}
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
                value={formData.mobileNumber || ''}
                onChange={handleInputChange}
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
                  value={formData.subscriptionType || 'none'}
                  onChange={handleInputChange}
                >
                  <option value="none">No Plan</option>
                  <option value="thirtyMinutes">30 Minutes</option>
                  <option value="twoDays">48 Hours</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium mb-2">Subscribed Date *</Form.Label>
                <Form.Control
                  type="date"
                  className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                  name="subscriptionDate"
                  value={formData.subscriptionDate || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium mb-2">Subscribed Time *</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                  name="subscriptionTime"
                  value={formData.subscriptionTime || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              {/* Project Access Dropdowns */}
              <div className="space-y-4">
                <Form.Group>
                  <Form.Label className="block text-sm font-medium mb-2">DD-Roulette</Form.Label>
                  <Form.Select
                    className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                    name="projectsPlan.project1"
                    value={formData.projectsPlan?.project1?.toString() || 'false'}
                    onChange={handleInputChange}
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
                    value={formData.projectsPlan?.project2?.toString() || 'true'}
                    onChange={handleInputChange}
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
                    value={formData.projectsPlan?.project4?.toString() || 'false'}
                    onChange={handleInputChange}
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
                  value={formData.projectSubscription?.baccarat?.subscriptionType || 'none'}
                  onChange={handleInputChange}
                >
                  <option value="none">No Plan</option>
                  <option value="thirtyMinutes">30 Minutes</option>
                  <option value="twoDays">48 Hours</option>
                  <option value="monthly">Monthly</option>
                  <option value="hourly">1 Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium mb-2">Subscribed Date *</Form.Label>
                <Form.Control
                  type="date"
                  className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                  name="projectSubscription.baccarat.subscriptionDate"
                  value={formData.projectSubscription?.baccarat?.subscriptionDate || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium mb-2">Subscribed Time *</Form.Label>
                <Form.Control
                  type="time"
                  className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                  name="projectSubscription.baccarat.subscriptionTime"
                  value={formData.projectSubscription?.baccarat?.subscriptionTime || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="block text-sm font-medium mb-2">Project Access *</Form.Label>
                <Form.Select
                  className="w-full p-2 rounded-lg bg-slate-100 border border-slate-200"
                  name="projectSubscription.baccarat.projectAccess"
                  value={formData.projectSubscription?.baccarat?.projectAccess?.toString() || 'false'}
                  onChange={handleInputChange}
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
              onClick={handleSubmit}
            >
              Update
            </button>
            <button
              className="px-6 py-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg"
              onClick={() => setAlertForDelete(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      
      {loading && <Loading />}
      
      {alertForDelete && (
        <Alert
          content="Are you sure you want to delete this user?"
          onConfirm={handleDelete}
          onCancel={() => setAlertForDelete(false)}
        />
      )}
    </>
  );
};

export default UserUpdate;