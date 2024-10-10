import React, { useEffect, useState } from "react";
import Modal from "../../../Resources/Model";
import { Form } from "react-bootstrap";
import {
  tailThirdBackgroundColor,
  tailThirdBackgroundColorHover,
} from "../../../../Styles/Color";
import "../../../../Styles/common.css";
import axios from "axios";
import {
  ADD_NEW_WEBINAR,
  GET_SINGLE_WEBINAR,
  UPDATE_SINGLE_WEBINAR,
} from "../../../../api/ApiDetails";
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

const UpdateWebinar = ({
  isOpenUpdateNewWebinar,
  setIsOpenUpdateNewWebinar,
  setIsStateChanged,
  isStateChanged,
  singleWebinarId,
}) => {
  const today = moment().format("YYYY-MM-DD");
  const currentTime = moment().format("HH:mm");
  const [loading, setLoading] = useState(false);
  const showToast = useToast();
  const [duplicateData, setDuplicateData] = useState({})
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
    banner_desktop : "",
    banner_mobile : "",
    bonus: [null, null],
    promise: false,
    faq: false,
  });

  const generateSignedUrl = async (key, folder) => {
    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESSKEYID,
      secretAccessKey: AWS_SECERTACCESSKEY,
    });

    const params = {
      Bucket: AWS_BUCKET,
      Key: key,
      Expires: 60 * 5,
    };

    try {
      const signedUrl = await s3.getSignedUrlPromise("getObject", params);
      return signedUrl;
    } catch (error) {
      console.log("Error generating signed URL:", error);
      return null;
    }
  };

  const handleGetSingleWebinarDetails = async () => {
    try {
      const response = await axios.get(
        `${GET_SINGLE_WEBINAR}/${singleWebinarId}`
      );
      if (response.data.status) {
        const webinarData = response.data.data;
        const {
          mentor_image1,
          mentor_image2,
          mentor_image3,
          what_will_change_image,
          will_help_best_image,
          banner_desktop,
          banner_mobile,
          bonus,
          happen_join,
          webinar_topics,
          promise,
          faq,
          ...rest
        } = webinarData;

        const signedUrls = await Promise.all([
          generateSignedUrl(mentor_image1),
          generateSignedUrl(mentor_image2),
          generateSignedUrl(mentor_image3),
          generateSignedUrl(what_will_change_image),
          generateSignedUrl(will_help_best_image),
          generateSignedUrl(banner_desktop),
          generateSignedUrl(banner_mobile),
          ...bonus.map((image) => generateSignedUrl(image)),
        ]);

        setDuplicateData(response.data.data)
        setNewWebinarData({
          mentor_image_top: signedUrls[0],
          mentor_image_middle: signedUrls[1],
          mentor_image_bottom: signedUrls[2],
          what_will_change_image: signedUrls[3],
          will_help_best_image: signedUrls[4],
          banner_desktop: signedUrls[5],
          banner_mobile: signedUrls[6],
          bonus: bonus.map((_, index) => signedUrls[index + 7]),
          happen_join: {
            ...happen_join,
          },
          webinar_topics: {
            ...webinar_topics,
          },
          promise,
          faq,
          ...rest,
        });
      } else {
        showToast(response.data.msg, "error");
      }
    } catch (error) {
      console.error("Error fetching webinar data:", error);
      showToast("Error fetching webinar data", "error");
    }
  };

  useEffect(() => {
    handleGetSingleWebinarDetails();
  }, [singleWebinarId]);

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
      ContentType: "image/png",
      ACL: "private",
    };

    let data = await s3.upload(params).promise();
    return data.Key;
  };

  const handleClickUpdateNewWebinar = async () => {
    setLoading(true);
    try {
          const uploadResults = await Promise.all([
            typeof newWebinarData.mentor_image_top === 'object' 
              ? uploadImageToS3(newWebinarData.mentor_image_top, "webinar/mentor")
              : duplicateData.mentor_image1,
            typeof newWebinarData.mentor_image_middle === 'object' 
              ? uploadImageToS3(newWebinarData.mentor_image_middle, "webinar/mentor")
              : duplicateData.mentor_image2,
            typeof newWebinarData.mentor_image_bottom === 'object' 
              ? uploadImageToS3(newWebinarData.mentor_image_bottom, "webinar/mentor")
              : duplicateData.mentor_image3,
            typeof newWebinarData.what_will_change_image === 'object' 
              ? uploadImageToS3(newWebinarData.what_will_change_image, "webinar/assets")
              : duplicateData.what_will_change_image,
            typeof newWebinarData.will_help_best_image === 'object' 
              ? uploadImageToS3(newWebinarData.will_help_best_image, "webinar/assets")
              : duplicateData.will_help_best_image,
            typeof newWebinarData.banner_desktop === 'object' 
              ? uploadImageToS3(newWebinarData.banner_desktop, "webinar/assets")
              : duplicateData.banner_desktop,
            typeof newWebinarData.banner_mobile === 'object' 
              ? uploadImageToS3(newWebinarData.banner_mobile, "webinar/assets")
              : duplicateData.banner_mobile,
            ...newWebinarData.bonus.map((image, index) =>
              typeof image === 'object' ? uploadImageToS3(image, "webinar/bonus") : duplicateData.bonus[index]
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

      console.log("data", data);

      await axios
        .put(`${UPDATE_SINGLE_WEBINAR}/${singleWebinarId}`, data)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            setIsOpenUpdateNewWebinar(false);
            setIsStateChanged(!isStateChanged);
            setLoading(false);
            showToast("updated successfully", "success");
          } else {
            setLoading(false);
            showToast(res.data.msg, "error");
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          showToast(err, "error");
        });
    } catch (err) {
      console.log(err);
      showToast("Error with updating webinar", "error");
      setLoading(false);
    }
  };

  console.log("webinar data", newWebinarData);

  return (
    <>
      <Modal
        isOpen={isOpenUpdateNewWebinar}
        onClose={() => setIsOpenUpdateNewWebinar(false)}
        title="Update Webinar"
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
                min={newWebinarData.date === today ? currentTime : undefined}
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
                min={newWebinarData.date === today ? currentTime : undefined}
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
                Banner for Desktop 1 *
              </Form.Label>
              {newWebinarData.banner_desktop && (
                  <img
                    src={newWebinarData.banner_desktop}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
                Banner for Mobile 1 *
              </Form.Label>
              {newWebinarData.banner_mobile && (
                  <img
                    src={newWebinarData.banner_mobile}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
              {newWebinarData.mentor_image_top && (
                  <img
                    src={newWebinarData.mentor_image_top}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
              {newWebinarData.mentor_image_middle && (
                  <img
                    src={newWebinarData.mentor_image_middle}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
              {newWebinarData.mentor_image_bottom && (
                  <img
                    src={newWebinarData.mentor_image_bottom}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
              {newWebinarData.what_will_change_image && (
                  <img
                    src={newWebinarData.what_will_change_image}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
              {newWebinarData.will_help_best_image && (
                  <img
                    src={newWebinarData.will_help_best_image}
                    alt={`Image`}
                    className="h-20 object-cover"
                  />
                )}
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
                {bonus && (
                  <img
                    src={bonus}
                    alt={`Bonus Image ${index}`}
                    className="h-20 object-cover"
                  />
                )}
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
                checked={newWebinarData.promise}
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
                checked={newWebinarData.faq}
                value={newWebinarData.faq}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="flex justify-end items-center">
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg`}
              onClick={handleClickUpdateNewWebinar}
            >
              Update
            </button>
            <button
              className={`font-semibold text-md ${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} px-6 py-2 rounded-lg ml-10`}
              onClick={() => setIsOpenUpdateNewWebinar(false)}
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

export default UpdateWebinar;
