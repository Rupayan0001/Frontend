"use client";

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUpload, faEye, faCheckCircle, faChartLine, faUsers, faGlobe, faCog, faXmark } from "@fortawesome/free-solid-svg-icons";
import BusinessTopBar from "../../components/layout/business/topBar";
import globalState from "../../lib/globalState";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import Notify from "../../components/layout/Notify";

const CreateAd = () => {
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [adImage, setAdImage] = useState(null);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("7");
  const [targetAudience, setTargetAudience] = useState("General");
  const [adType, setAdType] = useState("Display");
  const [preview, setPreview] = useState(null);
  const [geoLocation, setGeoLocation] = useState("Global");
  const [adPlatform, setAdPlatform] = useState("All Platforms");
  const [learnImage, setLearnImage] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setNotify = globalState((state) => state.setNotify);
  const notify = globalState((state) => state.notify);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const [noProfile, setNoProfile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [websiteURL, setWebsiteURL] = useState("");
  const [ageGroup, setAgeGroup] = useState("18-25");
  const [gender, setGender] = useState("All");
  const [device, setDevice] = useState("All");

  const titleRef = useRef();
  const descriptionRef = useRef();
  const adImageRef = useRef();
  const notifyTimer = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAdImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    response();
    getBusinessProfile();
    return () => {};
  }, []);
  const response = async () => {
    let result = null;
    try {
      result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setLoading(false);
    } catch (err) {
      if (!result.data.user) {
        navigate("/login");
      }
    }
  };

  const getBusinessProfile = async () => {
    try {
      const response = await axiosInstance.get(`/business/getProfile`);
      if (response.data.success) {
        setBusinessProfile(response.data.businessProfile);
      } else if (response.data.noProfile) {
        setNoProfile(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
    };
  }, []);

  const handleAdSubmit = async () => {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (!adTitle.trim() || !adDescription.trim() || !adImage || !budget || !duration || !targetAudience || !geoLocation) {
      setNotify("All fields are required");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    if (budget < 100) {
      setNotify("Minimum Budget should be $100");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }

    try {
      setLoading(true);

      // Create FormData for Image Upload
      const formData = new FormData();
      formData.append("title", adTitle);
      formData.append("description", adDescription);
      formData.append("image", adImage);
      formData.append("budget", budget);
      formData.append("duration", duration);
      formData.append("targetAudience", targetAudience);
      formData.append("geoLocation", geoLocation);
      formData.append("businessProfileId", businessProfile?._id);
      formData.append("url", websiteURL);
      formData.append("gender", gender);
      formData.append("ageGroup", ageGroup);
      formData.append("device", device);

      const response = await axiosInstance.post("/business/ads/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("response: ", response.data);

      if (response.data.success) {
        alert("success");
        // navigate("/ads/manage");
      } else {
        setNotify(response.data.message || "Failed to create ad");
      }
    } catch (error) {
      console.error("Ad submission error:", error);
      setNotify(error.response.data.message || "Failed to create the ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full inter relative bg-gray-50">
      {notify && windowWidth > 450 && <Notify page="Home" reference={notifyTimer} width={windowWidth} notify={notify} />}
      {notify && windowWidth <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify page="Home" reference={notifyTimer} width={windowWidth} notify={notify} />
        </div>
      )}
      {learnImage && (
        <dialog className="fixed inset-0 z-10 w-[100%] h-[100%] bg-black bg-opacity-60 z-20 flex justify-center items-center">
          <div className="h-[250px] w-[500px] rounded-xl relative bg-white rounded-xl shadow-xl text-[20px]">
            <FontAwesomeIcon
              onClick={() => setLearnImage(null)}
              icon={faXmark}
              className="absolute top-1 right-1 w-[25px] h-[25px] bg-white p-2 hover:bg-zinc-300 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer"
            />
            <h1 className="border-b-2 border-gray-300 pt-4 pb-2 mb-8 text-center w-full">Points to Remember</h1>
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-center text-xl">Image is the most important part of your ad to get the attention of your target audience</p>
              <p className="font-semibold text-center mt-6 text-xl">Upload a high quality image that describes your ad and your brand</p>
            </div>
          </div>
        </dialog>
      )}
      <BusinessTopBar loggedInUser={loggedInUser} businessProfile={businessProfile} windowWidth={windowWidth} />
      <div className="p-2 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-[80vw] mt-4 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Let's create <span className=" cursor-pointer font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"> a world class ad</span>
          </h2>
          <p className="text-gray-600 text-sm mb-6">Enter the details to create your ad, and live the rest on us</p>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-md font-semibold">Ad Title</label>
              <input
                type="text"
                className="w-full p-2 border outline-blue-700 rounded-md mt-1"
                placeholder="Enter a short and catchy ad title"
                ref={titleRef}
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                maxLength={60}
              />
              <p className="absolute right-2 bottom-2 text-black">{titleRef.current?.value.length || 0}/60</p>
            </div>

            <div className="relative">
              <label className="text-md font-semibold">Description</label>
              <textarea
                className="w-full p-2 border outline-blue-700 resize-none rounded-md mt-1"
                placeholder="Describe your product or service in few lines, keep it short"
                value={adDescription}
                ref={descriptionRef}
                onChange={(e) => setAdDescription(e.target.value)}
                maxLength={200}
              />
              <p className="absolute right-2 bottom-2 text-black">{descriptionRef.current?.value.length || 0}/200</p>
            </div>

            <div>
              <label className="text-md font-semibold">
                Upload Ad Image{" "}
                <button
                  onClick={() => setLearnImage(true)}
                  className="cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover-opacity-80"
                >
                  click to learn more
                </button>
              </label>

              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={adImageRef} />
              <div className="flex items-center justify-center mt-1">
                <p
                  onClick={() => adImageRef.current.click()}
                  className="cursor-pointer w-[300px] h-[400px] relative bg-slate-100 text-slate-600 rounded-lg flex justify-center items-center transition duration-200 hover:bg-slate-200"
                >
                  {!adImage && <FontAwesomeIcon icon={faUpload} className=" text-4xl text-blue-700" />}
                  {adImage && <img src={preview} alt="Ad Preview" className="rounded-lg w-full h-full" />}
                  {adImage && (
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="absolute top-1 right-1 w-[15px] h-[15px] bg-white p-3 hover:bg-zinc-300 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer"
                    />
                  )}
                </p>
              </div>
            </div>

            <div className="flex w-full h-[70px]  justify-between items-center">
              <div className="">
                <label className="text-md font-semibold">Budget (USD)</label>
                <input
                  type="number"
                  className=" p-2 border w-full mr-4 outline-blue-700 rounded-md "
                  placeholder="Enter budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div>
                <label className="text-md font-semibold">Website URL</label>
                <input
                  type="text"
                  className=" p-2 border w-full mr-4 outline-blue-700 rounded-md "
                  value={websiteURL}
                  onChange={(e) => setWebsiteURL(e.target.value)}
                  placeholder="Enter your Website URL"
                />
              </div>
              <div>
                <label className="text-md font-semibold">Target Audience</label>
                <select className=" p-2  w-full mr-4 outline-blue-700 border rounded-md" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
                  <option value="General">General</option>
                  <option value="Tech Enthusiasts">Tech Enthusiasts</option>
                  <option value="Business Professionals">Business Professionals</option>
                  <option value="Young Adults">Young Adults</option>
                  <option value="Students">Students</option>
                  <option value="Parents">Parents</option>
                  <option value="Gamers">Gamers</option>
                  <option value="Fitness Enthusiasts">Fitness Enthusiasts</option>
                  <option value="Travelers">Travelers</option>
                  <option value="Investors">Investors</option>
                  <option value="Luxury Shoppers">Luxury Shoppers</option>
                  <option value="Startup Founders">Startup Founders</option>
                  <option value="Job Seekers">Job Seekers</option>
                </select>
              </div>
            </div>
            <div className="flex w-full  justify-between items-center">
              <div>
                <label className="text-md font-semibold">Location</label>
                <select className=" p-2  w-full outline-blue-700 border rounded-md" value={geoLocation} onChange={(e) => setGeoLocation(e.target.value)}>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Indore">Indore</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Surat">Surat</option>
                  <option value="Chandigarh">Chandigarh</option>
                </select>
              </div>
              <div>
                <label className="text-md font-semibold">Age Group</label>
                <select className=" p-2  w-full outline-blue-700 border rounded-md" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                  {/* <option value={"14-18+"}>14-18</option> */}
                  <option value={"18-25"}>18-25</option>
                  <option value={"26-35"}>26-35</option>
                  <option value={"36-45"}>36-45</option>
                  <option value={"45+"}>45+</option>
                </select>
              </div>
              <div>
                <label className="text-md font-semibold">Gender</label>
                <select className=" p-2  w-full outline-blue-700 border rounded-md" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value={"Everyone"}>Everyone</option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </select>
              </div>
              <div>
                <label className="text-md font-semibold">Device</label>
                <select className=" p-2  w-full outline-blue-700 border rounded-md" value={device} onChange={(e) => setDevice(e.target.value)}>
                  <option value={"All"}>All</option>
                  <option value={"Desktop"}>Desktop</option>
                  <option value={"Mobile"}>Mobile</option>
                </select>
              </div>
              <div>
                <label className="text-md font-semibold">Duration</label>
                <select className=" p-2  w-full outline-blue-700 border rounded-md" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value={"7"}>7 days</option>
                  <option value={"14"}>14 days</option>
                  <option value={"30"}>30 days</option>
                  <option value={"60"}>60 days</option>
                  <option value={"90"}>90 days</option>
                  <option value={"180"}>180 days</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAdSubmit}
              className="w-full bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover:opacity-90 transition duration-100 text-white py-2 rounded-md flex items-center justify-center"
            >
              {loading ? (
                <p className="spinOnButton h-[24px] w-[24px]"></p>
              ) : (
                <>
                  {" "}
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAd;
