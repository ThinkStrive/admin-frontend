import React, { useEffect, useState } from "react";
import Modal from "../../../Resources/Model";
import { Form } from "react-bootstrap";
import {
  tailThirdBackgroundColor,
  tailThirdBackgroundColorHover,
} from "../../../../Styles/Color";
import "../../../../Styles/common.css";
import axios from "axios";
import { ADD_NEW_WEBINAR } from "../../../../api/ApiDetails";
import moment from "moment";
import { v4 } from "uuid";
import AWS from "aws-sdk";
import {
  AWS_ACCESSKEYID,
  AWS_BUCKET,
  AWS_REGION,
  AWS_SECERTACCESSKEY,
} from "../../../../config";
import Loading from "../../../Resources/Loading";
import { useToast } from "../../../Resources/Toast";

const AddWebinar = ({
  isOpenAddNewWebinar,
  setIsOpenAddNewWebinar,
  setIsStateChanged,
  isStateChanged,
}) => {
  const today = moment().format("YYYY-MM-DD");
  const currentTime = moment().format("HH:mm");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const [newWebinarData, setNewWebinarData] = useState({
    webinar_name: "",
    mentor_name: "",
    title: "",
    webinar_url : '',
    regular_price: "",
    today_price: "",
    duration: "",
    date: "",
    from_time: "",
    to_time: "",
    happen_join: {
      text1: "",
      text2: "",
      text3: "",
      text4: "",
    },
    webinar_topics: {
      text1: "",
      text2: "",
      text3: "",
      text4: "",
    },
    mentor_image_top: "",
    mentor_image_middle: "",
    mentor_image_bottom: "",
    what_will_change_image: "",
    will_help_best_image: "",
    banner_desktop: "",
    banner_mobile: "",
    bonus: [null, null],
    promise: false,
    faq: false,
  });

  const handleChangeCreateWebinar = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");
    if (nameParts.length === 2) {
      setNewWebinarData((prevState) => ({
        ...prevState,
        [nameParts[0]]: {
          ...prevState[nameParts[0]],
          [nameParts[1]]: value,
        },
      }));
    } else {
      setNewWebinarData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const nameParts = name.split(".");
    if (nameParts[0] === "bonus") {
      const index = parseInt(nameParts[1], 10);
      setNewWebinarData((prevState) => {
        const newBonus = [...prevState.bonus];
        newBonus[index] = files[0];
        return {
          ...prevState,
          bonus: newBonus,
        };
      });
    } else {
      setNewWebinarData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const handleToggleChange = (e) => {
    const { name } = e.target;
    setNewWebinarData((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleAddBonus = () => {
    setNewWebinarData((prevState) => ({
      ...prevState,
      bonus: [...prevState.bonus, null],
    }));
  };

  const handleRemoveBonus = (index) => {
    setNewWebinarData((prevState) => {
      const newBonus = prevState.bonus.filter((_, i) => i !== index);
      return {
        ...prevState,
        bonus: newBonus,
      };
    });
  };

  const uploadImageToS3 = async (image, path) => {
    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESSKEYID,
      secretAccessKey: AWS_SECERTACCESSKEY,
    });

    const params = {
      Bucket: AWS_BUCKET,
      Key: `${path}/${v4()}.jpg`,
      Body: image,
      ContentType: "image/jpg",
      ACL: "private",
    };

    let data = await s3.upload(params).promise();
    return data.Key
  };



  const handleClickCreateNewWebinar = async () => {
    setLoading(true);
    try {
      const uploadResults = await Promise.all([
        uploadImageToS3(newWebinarData.mentor_image_top, "webinar/mentor"),
        uploadImageToS3(newWebinarData.mentor_image_middle, "webinar/mentor"),
        uploadImageToS3(newWebinarData.mentor_image_bottom, "webinar/mentor"),
        uploadImageToS3(
          newWebinarData.what_will_change_image,
          "webinar/assets"
        ),
        uploadImageToS3(newWebinarData.will_help_best_image, "webinar/assets"),
        uploadImageToS3(newWebinarData.banner_desktop, "webinar/assets"),
        uploadImageToS3(newWebinarData.banner_mobile, "webinar/assets"),
        ...newWebinarData.bonus.map((image) =>
          uploadImageToS3(image, "webinar/bonus")
        ),
      ]);

      const [
        uploadResultMentorImageTop,
        uploadResultMentorImageMiddle,
        uploadResultMentorImageBottom,
        uploadResultWhatWillChangeImage,
        uploadResultWillHelpBestImage,
        uploadResultBannerDesktop,
        uploadResultBannerMobile,
        ...uploadResultsBonus
      ] = uploadResults;


      const data = {
        webinar_name: newWebinarData.webinar_name,
        mentor_name: newWebinarData.mentor_name,
        title: newWebinarData.title,
        webinar_url : newWebinarData.webinar_url,
        regular_price: newWebinarData.regular_price,
        today_price: newWebinarData.today_price,
        duration: newWebinarData.duration,
        date: newWebinarData.date,
        from_time: newWebinarData.from_time,
        to_time: newWebinarData.to_time,
        happen_join: newWebinarData.happen_join,
        webinar_topics: newWebinarData.webinar_topics,
        mentor_image1: uploadResultMentorImageTop,
        mentor_image2: uploadResultMentorImageMiddle,
        mentor_image3: uploadResultMentorImageBottom,
        what_will_change_image: uploadResultWhatWillChangeImage,
        will_help_best_image: uploadResultWillHelpBestImage,
        banner_desktop: uploadResultBannerDesktop,
        banner_mobile: uploadResultBannerMobile,
        bonus: uploadResultsBonus,
        promise: newWebinarData.promise,
        faq: newWebinarData.faq,
      };

      await axios
        .post(ADD_NEW_WEBINAR, data)
        .then((res) => {
          if (res.data.status) {
            setIsOpenAddNewWebinar(false);
            setIsStateChanged(!isStateChanged);
            setLoading(false);
            showToast("Webinar created successfully", "success");
          } else {
            setLoading(false);
            showToast(res.data.msg, "error");
          }
        })
        .catch((err) => {
          setLoading(false);
          showToast(err, "error");
        });
    } catch (err) {
      console.log(err);
      showToast("Error with creating webinar", "error");
      setLoading(false);
    }
  };


  return (
    <>
      <Modal
        isOpen={isOpenAddNewWebinar}
        onClose={() => setIsOpenAddNewWebinar(false)}
        title='Create New Webinar'
      >
        <div className="con-con3">
          <h2 className="text-left w-full px-6 font-medium">Basic Info</h2>
          <div className="w-full flex flex-wrap justify-between px-6">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Webinar Name *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter Webinar Name"
                onChange={handleChangeCreateWebinar}
                name="webinar_name"
                value={newWebinarData.webinar_name}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Mentor Name *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter Webinar Name"
                onChange={handleChangeCreateWebinar}
                name="mentor_name"
                value={newWebinarData.mentor_name}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Title *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter Title"
                onChange={handleChangeCreateWebinar}
                name="title"
                value={newWebinarData.title}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Webinar URL *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter webinar url"
                onChange={handleChangeCreateWebinar}
                name="webinar_url"
                value={newWebinarData.webinar_url}
              />
            </Form.Group>
          </div>
          <h2 className="text-left w-full px-6 font-medium mt-4">Price</h2>
          <div className="w-full flex flex-wrap justify-between px-6">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Regular Price *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter Regular Price"
                onChange={handleChangeCreateWebinar}
                name="regular_price"
                value={newWebinarData.regular_price}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Today Price *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200 "
                type="text"
                placeholder="Enter Today Price"
                onChange={handleChangeCreateWebinar}
                name="today_price"
                value={newWebinarData.today_price}
              />
            </Form.Group>
          </div>
          <h2 className="text-left w-full px-6 font-medium mt-4">Time</h2>
          <div className="w-full flex flex-wrap justify-between px-6">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Duration *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="text"
                placeholder="Enter Duration"
                onChange={handleChangeCreateWebinar}
                name="duration"
                value={newWebinarData.duration}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">Date *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="date"
                min={today}
                placeholder="Enter Date"
                onChange={handleChangeCreateWebinar}
                name="date"
                value={newWebinarData.date}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">From Time *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="time"
                min={
                  newWebinarData.date === today
                    ? currentTime
                    : undefined
                }
                placeholder="Enter from time"
                onChange={handleChangeCreateWebinar}
                name="from_time"
                value={newWebinarData.from_time}
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">To Time *</Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-text bg-slate-200"
                type="time"
                min={
                  newWebinarData.date === today
                    ? currentTime
                    : undefined
                }
                placeholder="Enter to time"
                onChange={handleChangeCreateWebinar}
                name="to_time"
                value={newWebinarData.to_time}
              />
            </Form.Group>
          </div>

          <h2 className="text-left w-full px-6 font-medium mt-5">
            What happen when you join ?
          </h2>

          <div className="w-full flex flex-wrap justify-between px-6">
            {["text1", "text2", "text3", "text4"].map((text, index) => (
              <Form.Group
                controlId={`happen_join.${text}`}
                className="input-item-con-group"
                key={index}
              >
                <br />
                <Form.Control
                  autoComplete="off"
                  className="item-con-input-des bg-slate-200"
                  as="textarea"
                  placeholder={`Enter Text ${index + 1}`}
                  onChange={handleChangeCreateWebinar}
                  name={`happen_join.${text}`}
                  value={newWebinarData.happen_join[text]}
                />
              </Form.Group>
            ))}
          </div>
          <h2 className="text-left w-full px-6 font-medium mt-5">
            What you will learn ?
          </h2>
          <div className="w-full flex flex-wrap justify-between px-6">
            {["text1", "text2", "text3", "text4"].map((text, index) => (
              <Form.Group
                controlId={`webinar_topics.${text}`}
                className="input-item-con-group"
                key={index}
              >
                <br />
                <Form.Control
                  autoComplete="off"
                  className="item-con-input-des bg-slate-200"
                  as="textarea"
                  placeholder={`Enter Text ${index + 1}`}
                  onChange={handleChangeCreateWebinar}
                  name={`webinar_topics.${text}`}
                  value={newWebinarData.webinar_topics[text]}
                />
              </Form.Group>
            ))}
          </div>
          <h2 className="text-left w-full px-6 font-medium mt-5">Images</h2>
          <div className="w-full flex flex-wrap justify-between px-6">
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Banner for Desktop *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="banner_desktop"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Banner for Mobile *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="banner_mobile"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Mentor Image 1 *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="mentor_image_top"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Mentor Image 2 *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="mentor_image_middle"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Mentor Image 3 *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="mentor_image_bottom"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                What will change ? *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="what_will_change_image"
              />
            </Form.Group>
            <Form.Group
              controlId="formBasicEmail"
              className="input-item-con-group"
            >
              <Form.Label className="input-item-label">
                Will help the best ? *
              </Form.Label>
              <br />
              <Form.Control
                autoComplete="off"
                className="item-con-input-image bg-slate-200 "
                type="file"
                placeholder="Enter content"
                onChange={handleFileChange}
                name="will_help_best_image"
              />
            </Form.Group>
          </div>

          <div className="flex justify-between items-center mt-5 -mb-4 px-6 w-full">
            <h2 className="text-left w-full font-medium mt-4">Bonus</h2>
            <i
              className="fa-solid fa-circle-plus cursor-pointer text-2xl"
              onClick={handleAddBonus}
            ></i>
          </div>
          <div className="w-full flex flex-wrap justify-between px-6">
            {newWebinarData.bonus?.map((bonus, index) => (
              <Form.Group
                controlId={`bonus.${index}`}
                className="input-item-con-group relative"
                key={index}
              >
                <br />
                <Form.Control
                  autoComplete="off"
                  className="item-con-input-image-text bg-slate-200"
                  type="file"
                  placeholder={`Enter content ${index + 1}`}
                  onChange={handleFileChange}
                  name={`bonus.${index}`}
                />
                <button
                  type="button"
                  className="mt-2 text-red-500 absolute top-0 right-0"
                  onClick={() => handleRemoveBonus(index)}
                >
                  <i className="fa-solid fa-circle-minus cursor-pointer text-2xl"></i>
                </button>
              </Form.Group>
            ))}
          </div>

          <div className="w-full flex justify-between px-6 mt-6 mb-3">
            <h4>Promise</h4>
            <label className="custom-toggle">
              <input
                type="checkbox"
                onChange={handleToggleChange}
                name="promise"
                value={newWebinarData.promise}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="w-full flex justify-between px-6 my-3">
            <h4>FAQ</h4>
            <label className="custom-toggle">
              <input
                type="checkbox"
                onChange={handleToggleChange}
                name="faq"
                value={newWebinarData.faq}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="flex justify-end items-center">
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg`}
              onClick={handleClickCreateNewWebinar}
            >
              Add
            </button>
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg ml-10`}
              onClick={() => setIsOpenAddNewWebinar(false)}
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

export default AddWebinar;
