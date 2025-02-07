import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/layout/Input";
import "./../../styles/SignUpPage.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../lib/globalState";
import Notify from "../../components/layout/Notify";
import { errorMessages } from "../../lib/Errors";

const SignUpPage = () => {
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("password");
  const [disabled, setDisabled] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const [namevalue, setNameValue] = useState("");
  const [usernamevalue, setUsernameValue] = useState("");
  const [mobilevalue, setMobileValue] = useState("");
  const [emailvalue, setEmailValue] = useState("");
  const [passwordvalue, setPasswordValue] = useState("");

  const navigate = useNavigate();
  const notifyTimer = useRef();

  useEffect(() => {
    function resize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const isFormValid = namevalue.trim() && usernamevalue.trim() && mobilevalue.trim() && emailvalue.trim() && passwordvalue.trim();
    setDisabled(!isFormValid);
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        signUp();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [namevalue, usernamevalue, mobilevalue, emailvalue, passwordvalue]);

  async function signUp() {
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
    setNameError("");
    setMobileError("");
    setPasswordError("");
    setUsernameError("");
    setEmailError("");

    if (!/\s/.test(namevalue)) {
      setNameError("Please enter your full name");
    }
    if (namevalue.length > 30) {
      setNameError("Please keep your name under 30 characters");
    }
    if (usernamevalue.trim() === "") {
      setUsernameError("Please enter a valid username");
    }
    if (!/^\d{10}$/.test(mobilevalue)) {
      setMobileError("Please enter a valid 10-digit mobile number");
    }
    if (!/^\S+@\S+\.\S+$/.test(emailvalue)) {
      setEmailError("Invalid email address");
    }
    if (passwordvalue.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/signup", {
        name: namevalue,
        username: usernamevalue,
        mobile: mobilevalue,
        email: emailvalue,
        password: passwordvalue,
      });
      if (response.data.message === "OTP sent successfully") {
        localStorage.setItem("user", JSON.stringify({ id: response.data.user._id, name: response.data.user.name, email: response.data.user.email }));
        navigate("/verifyEmail");
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }

      if (error.response.data.message === errorMessages.signUp.password) {
        setPasswordError(errorMessages.signUp.password);
      }
      if (error.response.data.message === "Invalid email address") {
        setEmailError("Invalid email address");
      }
      if (error.response.data.message === "User already exists") {
        setEmailError("User already exists, please login");
      }
      if (error.response.data.message === errorMessages.signUp.mobile) {
        setMobileError(errorMessages.signUp.mobile);
      }
      if (error.response.data.message === errorMessages.signUp.username) {
        setUsernameError(errorMessages.signUp.username);
      }
      if (error.response.data.message === errorMessages.signUp.name) {
        setNameError(errorMessages.signUp.name);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full inter relative h-[100vh] bg-white flex justify-center items-center">
      {notify && width > 450 && <Notify page="Home" width={width} notify={notify} />}
      {notify && width <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify page="Home" width={width} notify={notify} />
        </div>
      )}
      <h1
        onClick={() => window.location.reload()}
        className="logoHead cursor-pointer absolute top-1 left-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
      >
        Renokon
      </h1>
      <div className={`${width > 768 ? "w-[400px] pb-14 outside px-5" : "w-full px-2 pb-6"} bg-white  rounded-md`}>
        <div className="">
          <div
            className={`logoHead inter ${
              width > 768 ? "mt-[60px] mb-[40px] text-3xl" : "mb-[25px] text-3xl"
            } font-bold text-center text-transparent bg-clip-text  bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 `}
          >
            Sign Up
          </div>
          {/* <h3 className='text-sm text-center text-[#4c4b4b] mb-[10px] mt-2'>It's super easy!</h3> */}
          <Input placeholder="Enter your name" maxLength={100} value={namevalue} onChange={(e) => setNameValue(e.target.value)} inputError={nameError} />
          <Input placeholder="Enter your username" maxLength={100} value={usernamevalue} onChange={(e) => setUsernameValue(e.target.value)} inputError={usernameError} />
          <Input
            placeholder="Enter your mobile no"
            maxLength={13}
            paddingRight="10px"
            value={mobilevalue}
            type="number"
            onChange={(e) => setMobileValue(e.target.value)}
            inputError={mobileError}
          />
          <Input placeholder="Enter your email" maxLength={100} value={emailvalue} onChange={(e) => setEmailValue(e.target.value)} inputError={emailError} />
          <div className="relative">
            <Input
              placeholder="Enter your password"
              maxLength={100}
              value={passwordvalue}
              onChange={(e) => setPasswordValue(e.target.value)}
              type={type}
              inputError={passwordError}
            />
            {type === "password" ? (
              <FontAwesomeIcon icon={faEye} onClick={() => setType("text")} className="eyeIcon cursor-pointer" />
            ) : (
              <FontAwesomeIcon onClick={() => setType("password")} icon={faEyeSlash} className="eyeIcon cursor-pointer" />
            )}
          </div>
          <p className="text-md mt-[20px]">
            By signing up, you agree to our <Link to="/policies">Terms, </Link>
            <Link to="/policies">Privacy Policy </Link>
            and
            <Link to="/policies"> Cookies Policy</Link> .
          </p>
          <button
            className={`${
              disabled ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
            } flex justify-center items-center text-white w-full p-2 rounded-lg mt-[20px]`}
            // disabled={disabled}
            onClick={signUp}
          >
            {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Sign Up"}
          </button>
          <Link to="/login">
            <p className="mt-[20px] hover:opacity-80 cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-center">
              Already have an account?
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
