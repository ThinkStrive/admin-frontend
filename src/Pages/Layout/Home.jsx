import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "../../Styles/Home.css";
import Dashboard from "../../Components/Main/Dashboard";
import Users from "../../Components/Main/Users";
import Feedback from "../../Components/Main/Feedback.jsx";
import SideNav from "../../Components/Nav/sideNav/SideNav";
import Payments from "../../Components/Main/Payments";
import History from "../../Components/Main/History.jsx";
import throttle from "../../utils/throttling.js";
import Email from "../../Components/Main/Email.jsx";


const Home = () => {
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  useEffect(() => {
    navigate("/dashboard");
  }, []);


  const handleResize = () =>{
    if(window.innerWidth >= 1024){
      setIsSideNavOpen(true);
    }else{
      setIsSideNavOpen(false);
    }
  };


  // responsive NavBar screen size calculation

  useEffect(()=>{
      
      const throttledResizeHandler = throttle(handleResize,200);
      throttledResizeHandler();

      window.addEventListener("resize",throttledResizeHandler);

      return ()=>{
        window.removeEventListener("resize",throttledResizeHandler);
      }
  },[])

  const toggleSideNav = () => {
    setIsSideNavOpen(prev=> !prev);
  };

  return (
    <div className="flex h-screen w-screen rounded-2xl">
      {/* Hamburger Menu Button */}
      <button
        className={`hamburger-button p-2 m-2 rounded-lg`}
        onClick={toggleSideNav}
      >
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`home-sideNav-container ${
          isSideNavOpen ? "home-sideNav-container-open" : ""
        }`}>
        <SideNav toggleSideNav={toggleSideNav}/>
      </div>

      {/* Main Content */}
      <div
        className={`home-main-container bg-[#F4F6F7] w-full py-3 px-3 h-[100vh] overflow-y-auto`}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/history" element={<History/>} />
          <Route path="/email" element={<Email/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default Home;
