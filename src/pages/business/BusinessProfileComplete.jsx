import { faCamera, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import globalState from "../../lib/globalState.js";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/layout/Input.jsx";
import Notify from "../../components/layout/Notify.jsx";
import { axiosInstance } from "../../lib/axios.js";
import { backIn } from "framer-motion";

const BusinessProfileComplete = () => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [noProfile, setNoProfile] = useState(false);
  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  const notifyTimer = useRef();
  const bannerRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setProfileFile(file);
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBannerFile(file);
    if (file) {
      setBanner(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (bannerFile && profileFile) {
      setDisabled(false);
    } else {
      setDisabled(false);
    }
  }, [bannerFile, profileFile]);

  const handleSubmit = async () => {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (disabled) {
      setNotify("Both images are required");
      notifyTimer.current = setTimeout(() => setNotify(null), 5000);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("coverImage", bannerRef.current.files[0]);
    formData.append("logo", profileRef.current.files[0]);
    formData.append("businessProfileId", businessProfile._id);

    try {
      const response = await axiosInstance.post("/business/uploadProfileImages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (response.data.success) {
        navigate("/ads-manager");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setNotify(error.response?.data?.message || "Error occurred");
      notifyTimer.current = setTimeout(() => setNotify(null), 5000);
    }
  };

  useEffect(() => {
    const getBusinessProfile = async () => {
      try {
        const response = await axiosInstance.get("/business/getProfile");
        if (response.data.success) {
          setBusinessProfile(response.data.businessProfile);
        } else if (response.data.noProfile) {
          setNoProfile(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getBusinessProfile();
  }, []);

  useEffect(() => {
    if (noProfile) {
      navigate("/business-landing");
    }
  }, [noProfile]);

  return (
    <div className="h-[120vh] relative w-full inter">
      {notify && windowWidth > 450 && <Notify page="Home" width={windowWidth} notify={notify} />}
      {notify && windowWidth <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify page="Home" width={windowWidth} notify={notify} />
        </div>
      )}
      <div className={`bg-white w-full z-10 h-[70px] px-4 ${windowWidth > 550 ? "absolute top-0" : ""} flex justify-between items-center`}>
        <h1
          onClick={() => window.location.reload()}
          className="logoHead cursor-pointer text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
        >
          Renokon Business
        </h1>
        <div className="flex items-center justify-center "></div>
      </div>
      <div className={`flex justify-center items-center ${windowWidth > 550 ? "" : "h-full"} bg-gray-50 `}>
        <div
          className={`relative ${windowWidth > 900 && "w-[80vw] px-5 p-10 mt-14 shadow-2xl"} ${windowWidth > 768 && windowWidth <= 900 && "w-[90vw] px-6 p-10 shadow-xl"} ${
            windowWidth <= 768 && "w-[100vw] "
          } bg-white   text-center    rounded-md`}
        >
          <p className={`logoHead ${windowWidth > 768 ? "mt-[10px] mb-[30px] text-5xl" : "mb-[20px] text-3xl"} font-bold text-center text-blue-700 `}>
            {businessProfile?.businessName}
          </p>
          <div className={`${windowWidth > 540 && "flex justify-between items-center"} `}>
            <div
              onClick={() => bannerRef.current.click()}
              className="w-[100%] h-[300px] relative bg-gray-100 transition  cursor-pointer duration-200 rounded-lg flex justify-center items-center"
            >
              <div className="flex flex-col w-full h-full justify-center items-center">
                {!banner && (
                  <button className="editCoverPhoto2 text-md bg-slate-900 text-white hover:bg-slate-800 absolute bottom-6 right-2">
                    <FontAwesomeIcon className="changeCoverPicCameraIcon" icon={faCamera} />
                    <p className="ml-3">Upload Cover Image</p>
                  </button>
                )}
                {banner && <img src={banner} className="w-full h-full object-cover rounded-lg" alt="Banner" />}
                <input type="file" accept="image/*" ref={bannerRef} className="hidden" onChange={handleBannerChange} />
              </div>
            </div>
          </div>
          <div
            className="h-[150px] w-[150px] absolute left-1/2 transform -translate-x-1/2 -mt-16 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer hover:bg-gray-300"
            onClick={() => profileRef.current.click()}
          >
            {logo ? <img src={logo} className="w-full h-full object-cover rounded-full" alt="Logo" /> : <p className="text-slate-800 text-xl">+</p>}
            <input type="file" accept="image/*" ref={profileRef} className="hidden" onChange={handleLogoChange} />
          </div>
          <div className="flex mt-20 justify-end">
            <button
              onClick={handleSubmit}
              className={`flex justify-center items-center ${
                disabled
                  ? "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 cursor-pointer hover:opacity-90"
              } text-white w-[120px] h-[40px] mt-4 text-lg rounded-lg font-semibold transition duration-200`}
            >
              {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Complete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileComplete;
