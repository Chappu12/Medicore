import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  // Function to fetch all doctors

  useEffect(() => {
    getAllDoctors();
  }, [aToken]);
  return (
    <div className="m-5  max-h-screen overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors List</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-lg max-w-56 overflow-hidden cursor-pointer group bg-white shadow-md hover:shadow-lg transition-all duration-500  gap-2 p-2"
            key={item.id || index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-primary transition-all duration-500"
              src={item.imageUrl}
              alt="img not found"
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <input
                  onChange={() => changeAvailability(item.id)}
                  className="bg-primary"
                  type="checkbox"
                  checked={item.available}
                />
                <p>Avialable</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
