import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();

  const navigate = useNavigate();
  const [FilterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality && doctors.length > 0) {
      setFilterDoc(
        doctors.filter((doc) => doc.speciality.toLowerCase() === speciality.toLowerCase())
      );
    } else {
      setFilterDoc(doctors); // show all if no filter applied
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]); // ya donhi made changes hotil tevhach apply filter call honar

  return (
    <div className="ml-8 mr-8">
      <p className="text-gray-600">Browse Through The Doctors Specialist</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""
            }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600  ${showFilter ? "flex" : "hidden sm:flex"
            }`}
        >
          <p
            onClick={() =>
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "General physician"
              ? "bg-indigo-300 text-black"
              : ""
              }`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-300 text-black" : ""
              }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-300 text-black" : ""
              }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatrician"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatrician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Pediatrician" ? "bg-indigo-300 text-black" : ""
              }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-300 text-black" : ""
              }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-400 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist"
              ? "bg-indigo-300 text-black"
              : ""
              }`}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {FilterDoc.map((items, index) => (
            <div
              onClick={() => navigate(`/appointment/${items.id}`)}
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-5 "
            >
              <img className="bg-blue-300" src={items.imageUrl} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                  <p>Avilable</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">
                  {items.name}
                </p>
                <p className="text-gray-600 text-sm">{items.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
