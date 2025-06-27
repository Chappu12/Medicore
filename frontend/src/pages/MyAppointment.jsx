import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  // Format date as "12-Jan-2025"
  const formatDate = (dateString) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  // Format time from "HH:mm:ss" to "HH:mm AM/PM"
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch all appointments (including cancelled)
  const getUserAppointment = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Appointments fetched successfully");
        setAppointments(data.appointments.reverse());
        // setAppointments(normalizedAppointments);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  // Cancel appointment function
  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    setCancellingId(appointmentId);
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/appointments/cancel/${appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        // Update the appointment status in the UI
        setAppointments(prev => prev.map(appt =>
          appt.id === appointmentId
            ? { ...appt, appointmentCancelled: true }
            : appt
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const handleAddNew = () => navigate("/doctors");

  useEffect(() => {
    if (token) getUserAppointment();
  }, [token]);

  return (
    <div className="m-20">
      <p className="pb-4 font-medium text-zinc-700 border-b flex justify-between items-center text-2xl">
        My Appointments
        <button onClick={handleAddNew} className="text-sm bg-primary text-white px-4 py-2 rounded-full hover:bg-indigo-700">
          + Add Another Appointment
        </button>
      </p>

      {appointments.length > 0 ? (
        appointments.map((item) => (
          <div key={item.id} className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
            <div>
              <img className="w-32 h-32 object-cover bg-indigo-200 rounded-lg"
                src={item.docData.imageUrl} alt="Doctor" />
            </div>

            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address?.line1}</p>
              <p className="text-xs">{item.docData.address?.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                {formatDate(item.slotDate)} | {formatTime(item.slotTime)}
              </p>
              {item.appointmentCancelled && (
                <p className="text-red-500 text-xs mt-1">(Cancelled)</p>
              )}
            </div>

            <div className="flex flex-col gap-3 justify-end">
              {!item.appointmentCancelled && !item.payment && (
                <button className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded-full hover:bg-primary hover:text-white transition-colors duration-200">
                  Pay Online
                </button>
              )}

              {item.appointmentCancelled ? (
                <button className="text-sm sm:min-w-48 py-2 border rounded-full bg-red-100 text-red-600 cursor-default">
                  Appointment Cancelled
                </button>
              ) : cancellingId === item.id ? (
                <button className="text-sm sm:min-w-48 py-2 border rounded-full bg-gray-100 text-gray-500">
                  Cancelling...
                </button>
              ) : (
                <button
                  onClick={() => handleCancel(item.id)}
                  className="text-sm sm:min-w-48 py-2 border rounded-full text-stone-500 hover:bg-red-900 hover:text-white"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 mt-4">No appointments booked yet.</p>
      )}
    </div>
  );
};

export default MyAppointment;