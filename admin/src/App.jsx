import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import DoctorList from "./pages/Admin/DoctorList";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";

const App = () => {
  const { aToken } = useContext(AdminContext);

  // Check if the admin token is present in local storage
  // If it is, the admin is logged in and we can show the admin dashboard
  // If not, we show the login page
  return aToken ? (
    <div className="bg-[#b5b7b9] min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <SideBar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="Doctor-List" element={<DoctorList />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctors" element={<AddDoctor />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
