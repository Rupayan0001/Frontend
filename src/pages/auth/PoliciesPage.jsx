import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PoliciesPage = () => {
  const [activePolicy, setActivePolicy] = useState("terms");
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function resize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const policies = {
    terms: (
      <div>
        <h2 className="text-xl font-semibold">Terms of Service</h2>
        <p className="text-gray-700 mt-2">
          Welcome to Renokon, a cutting-edge social commerce, online real-money gaming, and messaging platform. By using our services, you agree to our terms. Please read them
          carefully before proceeding.
        </p>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>You must be at least 14 years old to use Renokon.</li>
          <li>Users are responsible for maintaining account credintials safe.</li>
          <li>Misuse, fraudulent activities, or cheating is strictly prohibited.</li>
          <li>Renokon reserves the right to suspend accounts that violate policies.</li>
          <li>All financial transactions are subject to verification.</li>
        </ul>
      </div>
    ),
    privacy: (
      <div>
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <p className="text-gray-700 mt-2">
          We collect user data to provide a seamless experience. Your privacy is our priority. We use encryption and security measures to protect your information.
        </p>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>We collect user data such as name, email, and payment details.</li>
          <li>Data is used for security, personalization, and platform improvement.</li>
          <li>Renokon does not sell or share personal data without consent.</li>
          <li>Users can update or delete their personal information at any time.</li>
        </ul>
      </div>
    ),
    cookies: (
      <div>
        <h2 className="text-xl font-semibold">Cookies Policy</h2>
        <p className="text-gray-700 mt-2">
          Renokon uses cookies to improve functionality and personalize your experience. You can manage cookie preferences in your account settings.
        </p>
        <ul className="list-disc pl-5 mt-3 text-gray-700">
          <li>Authentication cookies help keep you signed in.</li>
          <li>Analytical cookies track platform usage for improvements.</li>
          <li>Users can disable cookies through their browser settings.</li>
          <li>Disabling cookies may impact certain features on Renokon.</li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl inter inter relative mx-auto bg-white shadow-md rounded-lg p-6">
      <h1
        onClick={() => window.location.reload()}
        className="logoHead cursor-pointer absolute top-1 left-1 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
      >
        Renokon
      </h1>
      <div className=" absolute top-1 right-1 text-center">
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-center text-blue-700 my-6">Our Policies</h1>
      <div className={`${width > 500 ? "flex justify-center " : "flex flex-col justify-center "}  mb-6`}>
        <button
          onClick={() => setActivePolicy("terms")}
          className={`px-4 py-2 ${width > 500 ? "mr-2" : "mb-2 "} rounded-md ${activePolicy === "terms" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActivePolicy("privacy")}
          className={`px-4 py-2 ${width > 500 ? "mr-2 " : "mb-2 "}  rounded-md ${activePolicy === "privacy" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActivePolicy("cookies")}
          className={`px-4 py-2 ${width > 500 ? "" : "mb-2 "} rounded-md ${activePolicy === "cookies" ? "bg-blue-700 text-white" : "bg-gray-200 text-black"}`}
        >
          Cookies Policy
        </button>
      </div>
      <div>{policies[activePolicy]}</div>
    </div>
  );
};

export default PoliciesPage;
