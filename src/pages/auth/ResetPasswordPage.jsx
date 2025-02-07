import React, { useRef, useState, useEffect } from "react";
import Input from "../../components/layout/Input";
import "./../../styles/SignUpPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPasswordPage = () => {
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [type, setType] = useState("password");
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const password = useRef();
  const confirmPassword = useRef();

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
    if (passwordValue.trim().length >= 8) {
      setPasswordError("");
    }
    if (passwordValue.trim().length > 0 && passwordValue.trim().length < 8) {
      setPasswordError("Password must be atleast 8 characters");
    }
    if (confirmPasswordValue.trim() === passwordValue.trim()) {
      setConfirmPasswordError("");
    }
    if (passwordValue.trim() !== "" && confirmPasswordValue.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        resetPassword();
      }
    };
    document.addEventListener("keyup", handleKeyDown);
    return () => {
      document.removeEventListener("keyup", handleKeyDown);
    };
  }, [passwordValue, confirmPasswordValue]);

  async function resetPassword() {
    if (passwordValue.trim().length < 8) {
      setPasswordError("Password must be atleast 8 characters");
      return;
    }
    if (passwordValue.trim() !== confirmPasswordValue.trim()) {
      setConfirmPasswordError("Password and confirm password does not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/enter_new_password", {
        password: passwordValue,
        confirmPassword: confirmPasswordValue,
      });

      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      setPasswordError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-[100vh] relative bg-white flex justify-center items-center inter">
      <h1
        onClick={() => window.location.reload()}
        className="logoHead absolute top-1 left-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
      >
        Renokon
      </h1>
      <div className={` ${width > 768 ? "w-[400px] h-[470px] outsideLoginPage px-5 pt-[80px]" : "w-[100vw] px-2"} bg-white  rounded-md`}>
        <div className="">
          <div
            className={`logoHead ${
              width > 768 ? "my-[20px] text-2xl" : "mb-[25px] text-2xl"
            } font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 `}
          >
            Enter New Password
          </div>
          <div className="relative">
            <Input
              paddingRight="20px"
              placeholder="Enter new password"
              maxLength={100}
              type={type}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              inputError={passwordError}
            />
            {type === "password" && <FontAwesomeIcon className="eyeIcon" onClick={() => setType("text")} style={{ cursor: "pointer" }} icon={faEye} />}
            {type === "text" && <FontAwesomeIcon className="eyeIcon" onClick={() => setType("password")} style={{ cursor: "pointer" }} icon={faEyeSlash} />}
          </div>
          <div className="relative">
            <Input
              paddingRight="20px"
              placeholder="Confirm new password"
              maxLength={100}
              type={type}
              value={confirmPasswordValue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              inputError={confirmPasswordError}
            />
            {type === "password" && <FontAwesomeIcon className="eyeIcon" onClick={() => setType("text")} style={{ cursor: "pointer" }} icon={faEye} />}
            {type === "text" && <FontAwesomeIcon className="eyeIcon" onClick={() => setType("password")} style={{ cursor: "pointer" }} icon={faEyeSlash} />}
          </div>

          <button
            className={`${
              disabled ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
            } flex justify-center items-center text-white w-full p-2 rounded-lg mt-[20px]`}
            disabled={disabled}
            onClick={resetPassword}
          >
            {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Reset Password"}
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

export default ResetPasswordPage;
