import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 pb-10">
        <p>
          CONTACT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col justify-center gap-10  md:flex-row mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]  "
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start ">
          <p className="font-semibold text-lg text-gray-700"> OUR OFFICE</p>
          <p className="text-gray-500 text-[15px]">
            123 HealthCare Avenue, Near City Center, Pune <br /> – 411001,
            Maharashtra, India
          </p>
          <br />
          <p className="text-gray-500 text-[15px]">📱 Phone: +91-98765-43210</p>
          <br />
          <p className="text-gray-500 text-[15px]">
            ☎️ Emergency: 102 / 108 (24x7)
          </p>
          <br />
          <p className="text-gray-500 text-[15px]">
            📧 Email: contact@Priscripto.com
          </p>
          <br />
          <p className="text-gray-500 text-[15px]">
            🌐 Website: www.Priscripto.com
          </p>
          <br />
          <b className="font-semibold text-lg text-gray-700 mb-3">
            🕒 Working Hours:
          </b>
          <p className="text-gray-500 text-[15px]">
            Monday to Saturday: 9:00 AM – 8:00 PM <br />
            Sunday: 10:00 AM – 2:00 PM <br /> Emergency Services: Available 24/7
          </p>

          <button className="border border-black rounded-md px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 mt-5">
            Explore Job{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
