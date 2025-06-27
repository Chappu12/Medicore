import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminProvider = (props) => {
  // State to manage the admin token
  // This token is used to authenticate the admin user
  // jr localstorage made he token asel tr login page open hoyil nhi tr admin la prt login karav lagel
  const [aToken, setAToken] = useState(
    localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : ""
  );
  // const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const [doctors, setDoctors] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  // Function to set the admin token
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors/all`, {
        // headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(data); // assuming backend returns a list directly

    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors");
    }
  };

  // change availability of doctor
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        {
          headers: {
            token,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminProvider;
