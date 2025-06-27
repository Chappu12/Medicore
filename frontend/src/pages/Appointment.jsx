import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets_frontend/assets";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, backendUrl, token } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);

  // Format date as "12-Jul-2023"
  const formatDisplayDate = (date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  // Convert 12-hour to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}:00`;
  };

  // Initialize doctor data and dates
  useEffect(() => {
    if (doctors.length) {
      const doctor = doctors.find(doc => doc.id == docId);
      if (!doctor) {
        toast.error("Doctor not found");
        navigate("/");
        return;
      }
      setDocInfo(doctor);

      // Generate next 7 days
      const today = new Date();
      const next7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
      });
      setDates(next7Days);
      setSelectedDate(next7Days[0]);
    }
  }, [doctors, docId]);

  // Fetch available slots
  const fetchAvailableSlots = async (date) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await axios.get(
        `${backendUrl}/api/doctors/${docId}/slots`,
        {
          params: { date: dateStr },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      // Convert backend times to 12-hour format
      const slots = response.data.map(time => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });

      setAvailableSlots(slots);
    } catch (error) {
      console.error("Slot fetch error:", error);
      setAvailableSlots([]);
      toast.error("Failed to load available slots. Please try again.");
    }
  };

  // Fetch slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const bookAppointment = async () => {
    if (!selectedTime) {
      toast.warn("Please select a time slot");
      return;
    }

    if (!token) {
      toast.warn("Please login to book appointment");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const time24hr = convertTo24Hour(selectedTime);

      const { data } = await axios.post(
        `${backendUrl}/api/appointments/book`,
        {
          doctorId: docId,
          slotDate: dateStr,
          slotTime: time24hr
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Appointment booked successfully!");
        // Refresh slots after booking
        await fetchAvailableSlots(selectedDate);
        navigate("/My-Appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto ">
      {/* Doctor Info Section with Image */}
      {docInfo && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex gap-4">
            {/* Doctor Image */}
            <div className="md:w-1/5 bg-primary rounded-md">
              <img
                src={docInfo.imageUrl}
                alt={`Dr. ${docInfo.name}`}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>

            {/* Doctor Details */}
            <div className="p-6 md:w-2/3 border-l-4 border-primary text-black rounded-lg">
              <h2 className="flex text-2xl font-bold mb-2 gap-2">{docInfo.name}
                <span className="flex"><img src={assets.verified_icon} alt="" /></span>
              </h2>
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {docInfo.speciality}
                </span>
                <span className="ml-2 text-gray-600">{docInfo.degree}</span>
              </div>
              <p className="mb-4 text-gray-700">{docInfo.about}</p>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Fee: ${docInfo.fees}</p>
                <p className="text-gray-600">{docInfo.experience} years experience</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Select Date</h3>
        <div className="flex overflow-x-auto gap-2 pb-2">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-lg min-w-32 ${selectedDate?.getDate() === date.getDate()
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              <div className="font-medium">{formatDisplayDate(date)}</div>
              <div className="text-sm">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Available Time Slots</h3>
        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableSlots.map((time, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg ${time === selectedTime
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No available slots for this date</p>
        )}
      </div>

      {/* Booking Button */}
      <button
        onClick={bookAppointment}
        disabled={loading || !selectedTime}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${loading || !selectedTime
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-blue-700"
          }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : "Book Appointment"}
      </button>
    </div>
  );
};

export default Appointment;