import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const clearAuth = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
  };

  const loadUserData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      // setUserData(res.data); // ✅ this should update your context or state

      // console.log("Full response from get-profile =", data);
      if (data.success) {
        console.log("Fetched user profile:", data.data);
        setUserData(data.data);
      } else {
        toast.error(data.message || "Failed to load user data");
      }
    } catch (error) {
      console.error("User profile error:", error);
      toast.error("Session expired. Please login again.");
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [token]); // ensures it runs again when token is set

  const loadDoctors = async () => {
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

  useEffect(() => {
    loadDoctors();
  }, []);

  const updateUserProfileData = async () => {
    
    const payload = {
      name: userData.name,
      gender: userData.gender,
      dob: userData.dob,
      address: userData.address,
      contactNumber: userData.contactNumber,
      email: userData.email,
      password: userData.password,
      imageUrl: image ? URL.createObjectURL(image) : userData.imageUrl
    };
    
    if (!userData) {
      toast.error("User data not loaded yet.");
      return;
    }
    
    console.log("Updating with payload:", payload);

    try {
      const res = await axios.post(`${backendUrl}/api/user/update-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update response:", res.data);

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully");
        loadUserData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      if (error.response) {
        console.error("Update error:", error.response.data);
        toast.error(error.response.data.message || "Update failed");
      } else {
        toast.error("Network error, try again");
      }
    }
  };

  useEffect(() => {
    updateUserProfileData();
  }, [token]);

  const value = {
    token,
    setToken: saveToken,
    userData,
    setUserData,
    clearAuth,
    loadUserData,
    loading,
    doctors,
    setDoctors,
    loadDoctors,
    backendUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;