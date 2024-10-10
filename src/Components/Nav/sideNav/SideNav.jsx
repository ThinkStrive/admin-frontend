import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../Styles/SideNav.css";
import logo from "../../../assets/logo/logo1.png";
import { adminNavItems } from "../routes/AdminNav";
import { managerNavItems } from "../routes/ManagerNav";
import { userNavItems } from "../routes/UserNav";
import { unAuthenticateNav } from "../routes/UnAuthenticateNav";
import { useTheme } from "../../Store/ThemeContext";

const SideNav = ({ setSideNavClassName }) => {
  const [sideNavActive, setSideNavActive] = useState("dashboard");
  const [navItems, setNavItems] = useState([]);


  const localStorageUserData = JSON.parse(localStorage.getItem("user"));
  // const theme = localStorage.getItem('theme')

  const {theme} = useTheme()

  useEffect(() => {
    if (!localStorageUserData) {
      setNavItems(unAuthenticateNav);
    } else if (localStorageUserData.role === "admin") {
      setNavItems(adminNavItems);
    } else if (localStorageUserData.role === "manager") {
      setNavItems(managerNavItems);
    } else if (localStorageUserData.role === "user") {
      setNavItems(userNavItems);
    }
  }, []);

  
  // logout
  const handleLogOut = async () => {
    localStorage.removeItem("user");
  };

  return (
    <div className={`pb-4 pt-2 flex flex-col justify-between h-full z-2 ${theme === 'light' ? 'shadow-slate-600' : ''} shadow-md rounded-2xl`} >
      <i
        className="fa-solid fa-x absolute font-bold lg:text-xl text-md right-2 top-4 mr-4 cursor-pointer sideNav-bars"
        onClick={() => setSideNavClassName("home-sideNav-con")}
      ></i>
      <div>
        <div className="w-full my-4 rounded-md flex items-center justify-center sideNav-logo-con">
          {/* <img src={logo} alt="logo" className="w-40 h-30 cursor-pointer" /> */}
        </div>
        <div className="flex flex-col px-3 py-0 min-h-[70vh] justify-start items-start ">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sideNav-list-item${
                sideNavActive === item.name.toLowerCase() ? "-selected" : ""
              } flex justify-start items-center w-1/2 text-md group`}
              onClick={() => {
                setSideNavActive(item.name.toLowerCase());
                setSideNavClassName("home-sideNav-con");
              }}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <p className="mx-4">{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 mb-5">
        {/* <Link
          to="/settings"
          className={`sideNav-list-item${
            sideNavActive === 'settings' ? "-selected" : ""
          } flex justify-start items-center text-md group`}
          onClick={()=> setSideNavActive('settings')}
        >
          <i className="fa-solid fa-gear"></i>
          <p className="mx-4">Settings</p>
        </Link> */}
        <Link
          to="/auth/login"
          className={`sideNav-list-item${
            sideNavActive === 'logout' ? "-selected" : ""
          } flex justify-start items-center text-md group`}
          onClick={handleLogOut}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <p className="mx-4">Logout</p>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
