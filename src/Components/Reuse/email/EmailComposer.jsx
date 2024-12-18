import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSnackbar } from "notistack";


const EmailComposer = ({ onSend , status }) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = ()=>{
    if(!subject.trim() || !body.trim()){
      enqueueSnackbar("Both subject and body required to send an email",{variant:"error"});
      return;
    }
    // making api call
    onSend({subject,body});
  }

  return (
    <div>
      <div>
        <input
          type="text"
          className="w-full mb-2 p-2 border-2 rounded-md border-orange-600 outline-none"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div className="bg-orange-200">
        <ReactQuill value={body} onChange={setBody} theme="snow" />
      </div>
        <div className="flex mt-3">
        <p className="pr-1"><span className="text-base font-semibold text-red-500 px-1">*Note*</span>Currently sending emails to</p>  { (status === "all") ? <p><span className="pr-1 font-semibold text-orange-700">All</span>registered users...</p>: (status === "active") ? <p>all<span className="px-1 font-semibold text-orange-700">Active</span>users on the platform...</p> : (status === "daily" || status === "weekly" || status === "monthly") ? <p>all<span className="px-1 font-semibold text-orange-700">{status}</span>plan users...</p> : ""}
        </div>
      <div className="flex justify-center mt-3">
        <button className="bg-orange-700 text-slate-100 w-2/6 md:w-1/5 py-2 rounded-md hover:bg-orange-950 transition-all duration-200"
        onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default EmailComposer;
