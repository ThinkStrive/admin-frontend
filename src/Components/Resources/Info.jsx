import React from "react";
import '../../Styles/Model.css'

const Info = ({ content, onCancel }) => {
  return (
    <div className="info-con">
      <div className="w-[38vw] h-[20vh] rounded-lg bg-white relative px-6 flex justify-center items-center">
        <i
          className="fa-solid fa-xmark absolute text-3xl top-3 right-6 cursor-pointer"
          onClick={onCancel}
        ></i>
        <h2 className="font-semibold text-lg my-4">{content}</h2>
      </div>
    </div>
  );
};

export default Info;
