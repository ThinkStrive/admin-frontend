// Others
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { tailSideNavBackgroundColor } from "../../Styles/Color";

// Styles
import "../../Styles/Home.css";
import Dashboard from "../../Components/Main/Dashboard";
import Users from "../../Components/Main/Users";
import Feedback from "../../Components/Main/Feedback.jsx";
import SideNav from "../../Components/Nav/sideNav/SideNav";
import { useTheme } from "../../Components/Store/ThemeContext";
import Payments from "../../Components/Main/Payments";
import History from "../../Components/Main/History.jsx";



// JSX Components
const Home = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [sideNavClassName, setSideNavClassName] = useState("home-sideNav-con");
  const [isSideNavOpen, setIsSideNavOpen] = useState(true); // New state for sidebar

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
    setSideNavClassName(isSideNavOpen ? "home-sideNav-con" : "home-sideNav-con-open");
  };

  return (
    <div className="flex h-screen w-screen rounded-2xl">
      {/* Hamburger Menu Button */}
      <button
        className={`hamburger-button p-2 m-2 rounded-lg md:hidden`}
        onClick={toggleSideNav}
      >
        &#9776;
      </button>

      {/* Sidebar */}
      <div className={`h-screen ${sideNavClassName} z-20`}>
        <SideNav toggleSideNav={toggleSideNav} setSideNavClassName={setSideNavClassName} />
      </div>

      {/* Main Content */}
      <div
        className={`home-main-con ${
          theme === "light" ? "bg-[#F4F6F7]" : "bg-[#343434]"
        } w-full py-3 px-3 h-[100vh] overflow-y-auto`}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/history" element={<History/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
