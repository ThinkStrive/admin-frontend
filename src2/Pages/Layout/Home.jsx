// others
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  tailSideNavBackgroundColor,
} from "../../Styles/Color";

// Styles
import "../../Styles/Home.css";
import Dashboard from "../../Components/Main/Dashboard";
import Users from "../../Components/Main/Users";
import SideNav from "../../Components/Nav/sideNav/SideNav";
import { useTheme } from "../../Components/Store/ThemeContext";
import Payments from "../../Components/Main/Payments";

// JSX Components
const Home = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      navigate("/dashboard");
    }else{
      navigate("/dashboard")
    }
  }, []);

  const [sideNavClassName, setSideNavClassName] = useState("home-sideNav-con");

  const {theme} = useTheme()

  return (
    <div
      className={`flex h-screen w-screen shadow-2xl rounded-2xl `}
    >
      <div className={`h-screen ${sideNavClassName} z-20`}>
          <SideNav setSideNavClassName={setSideNavClassName} />
      </div>

      <div className={`home-main-con ${theme === 'light' ? 'bg-[#F4F6F7]' : 'bg-[#343434]' } w-full py-3 px-3`} >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
