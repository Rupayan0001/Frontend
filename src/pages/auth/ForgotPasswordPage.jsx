import React, { useRef, useState, useEffect } from "react";
import Input from "../../components/layout/Input";
import "./../../styles/SignUpPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import Notify from "../../components/layout/Notify";
import globalState from "../../lib/globalState";

const ForgotPasswordPage = () => {
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [emailValue, setEmailValue] = useState("");
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);

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
    if (emailValue?.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        reset();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [emailValue]);

  async function reset() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setEmailError("");
    if (emailValue.trim() === "") {
      setEmailError("Please enter a valid email");
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/reset_password", {
        email: emailValue,
      });

      if (response.data.success) {
        localStorage.setItem("passwordReset", "true");
        navigate("/verifyEmail");
      }
    } catch (error) {
      if (error.response.status === 429) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else {
        setEmailError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-[100vh] relative bg-white flex justify-center items-center inter">
      {notify && width > 450 && <Notify page="Home" width={width} notify={notify} />}
      {notify && width <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify page="Home" width={width} notify={notify} />
        </div>
      )}
      <h1
        onClick={() => window.location.reload()}
        className="logoHead absolute top-1 left-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
      >
        Renokon
      </h1>
      <div className={` ${width > 768 ? "w-[400px] h-[470px] outsideLoginPage px-5 pt-[100px]" : "w-[100vw] px-2"} bg-white  rounded-md`}>
        <div className="">
          <div className={`logoHead ${width > 768 ? "my-[20px] text-2xl" : "mb-[25px] text-2xl"} font-bold text-center text-blue-700 `}>Reset Your Password</div>
          <Input paddingRight="20px" placeholder="Enter your email" maxLength={100} value={emailValue} onChange={(e) => setEmailValue(e.target.value)} inputError={emailError} />

          <button
            className={`${
              disabled ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
            } flex justify-center items-center text-white w-full p-2 rounded-lg mt-[20px]`}
            disabled={disabled}
            onClick={reset}
          >
            {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Submit"}
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

export default ForgotPasswordPage;
