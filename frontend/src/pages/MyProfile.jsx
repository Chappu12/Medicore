import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const {
    userData,
    setUserData,
    token,
    backendUrl,
    loadUserData,
    loading,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(true);
  const [image, setImage] = useState(false);

  if (loading || !userData) {
    return (
      <div className="text-center text-lg font-medium mt-10">
        Loading profile...
      </div>
    );
  }

  const updateUserProfileData = async () => {
    if (!userData) {
      toast.error("User data not loaded yet.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", userData.id);
      formData.append("name", userData.name);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("email", userData.email);
      formData.append("contactNumber", userData.contactNumber);
      formData.append("emergencyContact", userData.emergencyContact);
      formData.append("address", userData.address);
      if (userData.password) formData.append("password", userData.password);
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await loadUserData(); // Load fresh data directly from backend
      toast.success("Profile updated successfully!");
      setIsEdit(false);
    } catch (error) {
      console.error("Error while updating profile:", error);
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong while updating profile"
      );
    }
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm md:text-base mx-auto mt-10 p-5 bg-stone-200 rounded-lg shadow-md">
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer hover:opacity-90 transition-opacity duration-200">
            <img
              className="w-36 rounded-full object-cover opacity-75"
              src={image ? URL.createObjectURL(image) : userData.imageUrl || assets.user_icon}
              alt="profile"
            />
            {!image && (
              <img
                className="w-10 absolute bottom-20 right-20 hover:opacity-100 opacity-0 transition-opacity duration-200"
                src={assets.upload_icon}
                alt="upload icon"
              />
            )}
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.imageUrl || assets.user_icon} alt="" />
      )}

      {isEdit ? (
        <input
          className="bg-zinc-300 text-2xl font-medium max-w-80 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-2xl text-neutral-800 mt-4">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[2px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email Id:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-100 max-w-52"
              value={userData.contactNumber}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  contactNumber: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-blue-400">{userData.contactNumber}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-100 max-w-52"
              value={userData.address}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-gray-400">{userData.address}</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-52 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}

          <p className="font-medium">Birth Date:</p>
          {isEdit ? (
            <input
              className="max-w-52 bg-gray-100"
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-red-900 hover:text-white transition-colors duration-200"
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
            onClick={() => setIsEdit(true)}
          >
            Edit Information
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
