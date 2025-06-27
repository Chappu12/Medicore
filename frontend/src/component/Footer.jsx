import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 sm:gap-0 my-10 mt-40 text-sm">
        {/*-------Left Section --------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6 text-sm">
            Our hospital is committed to providing exceptional healthcare
            services with compassion and care.
            <br />
            From emergency care to specialized treatments, we ensure every
            patient receives personalized attention.
            <br />
            Equipped with modern facilities and expert medical staff, we strive
            to improve health and well-being for all.
          </p>
        </div>
        {/*-------Center Section --------- */}
        <div>
          <p className="text-xl font-medium text-gray-800 mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600 leading-6 text-sm">
            <a href="/">
              <li>Home</li>
            </a>
            <a href="/about">
              {" "}
              <li>About Us </li>
            </a>
            <a href="/contact">
              {" "}
              <li>Contact us </li>
            </a>
            <a href="/">
              {" "}
              <li>Privacy Policy</li>
            </a>
            <a href="/">
              <li>Terms of Service</li>
            </a>
          </ul>
        </div>
        {/*-------Right Section --------- */}
        <div>
          <p className="text-xl font-medium text-gray-800 mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-2 text-gray-600 leading-6 text-sm">
            <li>+1-800-123-4567</li>
            <li>contact@cityhospital.com</li>
          </ul>
        </div>
      </div>
      <div>
        {/* ------CopyRIght Text ---------- */}
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2025 Priscripto - All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
