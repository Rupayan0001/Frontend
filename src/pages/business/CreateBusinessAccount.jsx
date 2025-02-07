import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultProfile from "../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import globalState from "../../lib/globalState.js";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/layout/Input.jsx";
import Notify from "../../components/layout/Notify.jsx";
import { axiosInstance } from "../../lib/axios.js";

const CreateBusinessAccount = () => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [emailError, setEmailError] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [nameError, setNameError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [industryError, setIndustryError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [zipcodeError, setZipcodeError] = useState("");
  const [streetError, setStreetError] = useState("");
  const [cityError, setCityError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [newErrors, setNewErrors] = useState({});
  const [productsError, setProductsError] = useState("");
  const [loading, setloading] = useState(false);

  // State for each input field
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [products, setProducts] = useState("");

  const navigate = useNavigate();
  const notifyTimer = useRef();

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
  function handleNameChange(e) {
    const value = e.target.value.trim();
    setBusinessName(value);
    if (!value) {
      setNameError("Business name is required");
      return;
    } else {
      setNameError("");
    }
  }

  function handleEmailChange(e) {
    setBusinessEmail(e.target.value);
    if (!e.target.value.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setEmailError("Invalid email format");
      return;
    } else {
      setEmailError("");
    }
  }
  function handleNumberChange(e) {
    const value = String(e.target.value);
    setContactNumber(value);
    if (!value || value.length < 10 || value.length > 10) {
      setNumberError("Enter a valid 10-digit phone number");
    } else {
      setNumberError("");
    }
  }
  function handleIndustryChange(e) {
    setIndustry(e.target.value);
    if (!e.target.value.trim()) {
      setIndustryError("Industry is required");
    } else {
      setIndustryError("");
    }
  }
  function handleCountryChange(e) {
    setCountry(e.target.value);
    if (!e.target.value.trim()) {
      setCountryError("Country is required");
    } else {
      setCountryError("");
    }
  }
  function handleZipcodeChange(e) {
    setZipcode(e.target.value);
    if (!e.target.value.match(/^\d{5,6}$/)) {
      setZipcodeError("Enter a valid Zipcode");
    } else {
      setZipcodeError("");
    }
  }
  function handleStreetChange(e) {
    setStreet(e.target.value);
    if (!e.target.value.trim()) {
      setStreetError("Enter a valid city");
    } else {
      setStreetError("");
    }
  }
  function handleProductsChange(e) {
    setProducts(e.target.value);
    if (!e.target.value.trim()) {
      setProductsError("This field is required");
    } else {
      setProductsError("");
    }
  }

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const data = await response.json();

      if (data.address) {
        const address = data.address;
        const city = address.city || address.town || address.village || "Unknown City";
        const country = address.country || "Unknown Country";
        const fullAddress = data.display_name;

        return { city, country, fullAddress };
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getLocation();
        const { latitude, longitude } = position.coords;
        const { city, country, fullAddress } = await reverseGeocode(latitude, longitude);
        if (city && country && fullAddress) {
          setCity(city);
          setCountry(country);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);
  function handleCityChange(e) {
    setCity(e.target.value);
    if (!e.target.value.trim()) {
      setCityError("Enter a valid city");
    } else {
      setCityError("");
    }
  }
  useEffect(() => {
    if (businessEmail && contactNumber && industry && country && zipcode && street && city && products && businessName) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [businessEmail, contactNumber, industry, country, zipcode, street, city, products, businessName]);

  useEffect(() => {
    function handleEnter(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    }
    document.addEventListener("keyup", handleEnter);
    return () => {
      document.removeEventListener("keyup", handleEnter);
    };
  }, [businessEmail, contactNumber, industry, country, zipcode, street, city, products, website, businessName]);
  async function handleSubmit() {
    console.log("fired");
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (disabled) {
      setNotify("All fields are required");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    setloading(true);
    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("email", businessEmail);
    formData.append("phone", contactNumber);
    formData.append("industry", industry);
    formData.append("country", country);
    formData.append("zipcode", zipcode);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("products", products);
    formData.append("website", website);
    try {
      const response = await axiosInstance.post("/business/create", formData);
      console.log("response: ", response.data);
      navigate("/business-profile-complete");
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      if (error.response.data.message) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
  }

  return (
    <div className="h-full relative w-full inter">
      {notify && windowWidth > 450 && <Notify page="Home" width={windowWidth} notify={notify} />}
      {notify && windowWidth <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify page="Home" width={windowWidth} notify={notify} />
        </div>
      )}
      <div className={`bg-white w-full h-[70px] px-4 ${windowWidth > 550 ? "absolute top-0" : ""} flex justify-between items-center`}>
        <h1
          onClick={() => window.location.reload()}
          className="logoHead cursor-pointer text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
        >
          Renokon Business
        </h1>
        <div className="flex items-center justify-center ">
          <img
            src={loggedInUser?.profilePic || defaultProfile}
            // onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
            className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"} object-cover ml-6 mb-1 cursor-pointer rounded-full`}
            alt=""
          />
        </div>
      </div>
      <div className={`flex justify-center items-center ${windowWidth > 550 ? "h-[100vh]" : "h-full"} bg-gray-50 `}>
        <div className={` ${windowWidth > 768 ? "w-[80vw]  shadow-2xl px-5 mt-8" : "w-[100vw] px-6"} bg-white  text-center p-10   rounded-md`}>
          <p className={`logoHead ${windowWidth > 768 ? "mt-[30px] mb-[30px] text-5xl" : "mb-[20px] text-3xl"} font-bold text-center text-blue-700 `}>Business Account</p>
          <div className={`${windowWidth > 540 && "flex flex-wrap justify-between items-center"} `}>
            <div className="h-[80px]">
              <Input placeholder="Enter your business name" value={businessName} onChange={handleNameChange} inputError={nameError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your business email" value={businessEmail} onChange={handleEmailChange} inputError={emailError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your contact no" value={contactNumber} onChange={handleNumberChange} type="number" inputError={numberError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your website" value={website} onChange={(e) => setWebsite(e.target.value)} inputError="" />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your street" value={street} onChange={handleStreetChange} inputError={streetError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your city" value={city} onChange={handleCityChange} inputError={cityError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your zipcode" value={zipcode} onChange={handleZipcodeChange} inputError={zipcodeError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your country" value={country} onChange={handleCountryChange} inputError={countryError} />
            </div>
            <div className="h-[80px]">
              <Input placeholder="Enter your industry" value={industry} onChange={handleIndustryChange} inputError={industryError} />
            </div>
          </div>
          <div className="h-[80px]">
            <Input placeholder="What products or services do you offer?" value={products} onChange={handleProductsChange} inputError={productsError} />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className={`flex justify-center items-center ${
                disabled
                  ? "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 cursor-pointer hover:opacity-90"
              } text-white w-[120px] h-[40px] mt-4 text-lg rounded-lg font-semibold transition duration-200`}
            >
              {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBusinessAccount;
