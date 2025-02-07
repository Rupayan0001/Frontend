import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultProfile from "../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import globalState from "../../lib/globalState.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BarChartComponent from "../../components/layout/BarChartComponent.jsx";
import PiechartComponent from "../../components/layout/PiechartComponent.jsx";
import AdPerformanceChart from "../../components/layout/AdPerformanceChart.jsx";

const BusinessProfileLanding = () => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    response();
    return () => {};
  }, []);
  const response = async () => {
    let result = null;
    try {
      result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setLoading(false);
    } catch (err) {}
  };

  //    resize habdler
  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className="h-full w-full inter">
      <div className="bg-white absolute top-0 w-full h-[70px] px-4 flex justify-between items-center">
        <h1
          onClick={() => window.location.reload()}
          className="logoHead cursor-pointer text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
        >
          Renokon Business
        </h1>
        <div className="flex items-center justify-center ">
          <Link to="/create-business-account">
            <button className="text-white hover:opacity-90 transition duration-200 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-full px-4 py-2">
              Create account
            </button>
          </Link>
          <img
            src={loggedInUser?.profilePic || defaultProfile}
            // onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
            className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"} object-cover ml-6 mb-1 cursor-pointer rounded-full`}
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-center items-center h-[100vh] bg-gray-50">
        <div className="w-[90vw] mt-8 text-center bg-white p-10 rounded-lg shadow-xl">
          <h1 className="text-gray-800 text-4xl font-bold mb-6">
            Scale Your Business with <span className="text-blue-600">Renokon</span>
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            More than <span className="font-semibold">8 million businesses</span> are growing with Renokon.
          </p>
          <p className="text-gray-600 text-lg mb-2">
            🚀 <span className="font-semibold">50% extra credits</span> for the first month!
          </p>
          <p className="text-gray-600 text-lg mb-2">
            💰 <span className="font-semibold">200% more sales</span> for businesses like yours.
          </p>

          <p className="text-gray-600 text-lg mb-2">
            🌍 <span className="font-semibold">50+ million registered users</span> ready to engage.
          </p>
          <p className="text-gray-600 text-lg mb-2">
            <FontAwesomeIcon icon={faDollarSign} /> <span className="font-semibold">320+ million dollars </span>sales generated in last 6 months
          </p>

          {/* <p className="text-gray-600 text-lg mb-6">
          🛍 Sell on Renokon Marketplace with a <span className="font-semibold">flat 15% revenue sharing</span>.
        </p> */}

          <div className="mt-8">
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-5xl font-semibold mb-4">You don't have a business profile</p>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-2xl font-semibold mb-6">Let's create one today!</p>
          </div>
          <Link to="/create-business-account">
            <button className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white px-6 py-3 text-lg rounded-full font-semibold shadow-lg transition transform hover:opacity-90">
              Create My Profile
            </button>
          </Link>
        </div>
      </div>
      <main className="p-8">
        <div className="grid grid-cols-2 gap-6 mt-6">
          <BarChartComponent />
          <PiechartComponent />
        </div>
        <AdPerformanceChart />
      </main>
      <footer className="mt-10 bg-gray-900 text-white py-6 text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold">Partner with Us</h3>
          <p className="text-gray-400 text-sm mt-2">Grow your business with our data-driven ad insights, targeted marketing solutions and Ecommerce platform.</p>
          <div className="mt-4">
            <a href="mailto:renokon.team@gmail.com">
              <button className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Contact Us</button>
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-4">© 2025 Renokon. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessProfileLanding;
