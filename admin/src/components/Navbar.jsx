import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    navigate("/");
    // Clear the admin token from local storage and state
    aToken && setAToken("");
    aToken && localStorage.removeItem("adminToken");
  };
  return (
    <div className="flex justify-between items-center px-4  sm:px-10 py-3 border-b bg-[#d4d4d8] shadow-lg">
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="logo not found"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Log out
      </button>
    </div>
  );
};

export default Navbar;
