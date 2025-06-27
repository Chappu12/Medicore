import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 ">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="flex flex-col  gap-20 my-10  md:flex-row ml-10 md:ml-0 justify-center items-center ">
        <img
          className="w-full md:max-w-[360px]  "
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-8 md:w-2/4 text-base text-gray-600 border px-10 md:px-16 py-8 sm:py-16 rounded-lg shadow-lg">
          <p>
            Welcome to Priscripto, a trusted name in healthcare. Established in
            2024, we are committed to delivering world-class medical services
            with compassion, care, and advanced technology.
          </p>
          <p>
            With a team of highly skilled doctors, nurses, and healthcare
            professionals, our hospital provides a wide range of services
            including General Medicine, Surgery, Cardiology, Orthopedics,
            Pediatrics, Obstetrics & Gynecology, Emergency Care, and more.
          </p>
          <b className="text-gray-900">🌟 Our Vision</b>
          <p>
            To be a leading healthcare institution recognized for excellence in
            patient care, medical innovation, and compassionate service —
            creating a healthier tomorrow for our community and beyond.
          </p>
        </div>
      </div>
      <div className="text-center text-2xl pt-10 pb-10 text-gray-500">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10 justify-center items-center ">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4 rounded-lg shadow-lg text-[15px] hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-gray-600 cursor-pointer">
          <b>⚙️ Efficiency</b>
          <p>
            We value your time and health. Our hospital is equipped with
            advanced technology and streamlined processes that ensure fast
            diagnoses, reduced waiting times, and effective treatments — all
            while maintaining the highest standards of safety and care.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4 rounded-lg shadow-lg text-[15px] hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-gray-600 cursor-pointer">
          <b>🕒 Convenience</b>
          <p>
            Your comfort is our priority. With 24/7 emergency services, online
            appointment booking, in-house pharmacy, diagnostic labs, and easily
            accessible locations, we make healthcare hassle-free and always
            within your reach.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-4 rounded-lg shadow-lg text-[15px] hover:bg-primary hover:text-white transition-all duration-300 ease-in-out text-gray-600 cursor-pointer">
          <b>🩺 Specialization</b>
          <p>
            We take pride in our team of expert doctors and healthcare
            professionals specializing in Cardiology, Neurology, Orthopedics,
            Pediatrics, Oncology, and more. Each department is backed by
            cutting-edge technology and years of experience to provide focused
            and personalized care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
