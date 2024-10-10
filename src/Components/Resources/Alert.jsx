import React from "react";
import { tailThirdBackgroundColor, tailThirdBackgroundColorHover } from "../../Styles/Color";

const Alert = ({ content, onConfirm, onCancel }) => {
  return (
    <div className="info-con">
      <div className="w-[38vw] h-[23vh] rounded-lg bg-white relative px-6 flex flex-col justify-between items-start">
        <i
          className="fa-solid fa-xmark absolute text-3xl top-3 right-6 cursor-pointer"
          onClick={onCancel}
        ></i>
        <h2 className="font-semibold text-lg my-4">{content}</h2>
        <div className="text-center mb-4 py-6 px-0 w-full flex justify-around">
          <button
            variant="primary"
            className={`${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} text-black font-semibold py-2 px-8 rounded-lg`}
            onClick={onConfirm}
          >
            Yes
          </button>

          <button
            variant="primary"
            className={`${tailThirdBackgroundColor} ${tailThirdBackgroundColorHover} text-black font-semibold py-2 px-8 rounded-lg`}
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
