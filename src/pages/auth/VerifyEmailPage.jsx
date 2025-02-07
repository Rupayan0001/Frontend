import React, { useRef, useState, useEffect } from "react";
import Input from "../../components/layout/Input";
import "./../../styles/SignUpPage.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState";
import Notify from "../../components/layout/Notify";
import post_uploaded from "../../assets/notification_sound/post_uploaded.mp3";

const VerifyEmailPage = () => {
  const timer = useRef();
  const interval = useRef();
  const notifyTimer = useRef();
  const postUploadedSoundRef = useRef();

  const [disableButton, setDisableButton] = useState(true);
  const [showTime, setShowTime] = useState(60);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const [OTPvalue, setOTPvalue] = useState("");
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [otpError, setOtpError] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const passwordReset = localStorage.getItem("passwordReset");

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
    if (OTPvalue.trim() !== "") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        signUp();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [OTPvalue]);

  async function signUp() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (OTPvalue.trim().length < 6) {
      setOtpError("Please enter a valid six digit otp");
      return;
    }
    try {
      setLoading(true);
      let response;
      if (passwordReset) {
        response = await axiosInstance.post("/auth/verifyOtp", {
          emailOtp: OTPvalue,
        });
      }
      if (!passwordReset) {
        response = await axiosInstance.post("/auth/verify_email_mobile", {
          emailOtp: OTPvalue,
          userId: user.id,
        });
      }

      if (response.data.message === "Email verified successfully" && !passwordReset) {
        navigate("/login");
      }
      if (response.data.message === "Email verified successfully" && passwordReset) {
        localStorage.removeItem("passwordReset");
        navigate("/resetPassword");
      }
    } catch (error) {
      if (error.response.status === 429) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else {
        setOtpError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    timer.current = setTimeout(() => {
      setDisableButton(false);
    }, 60 * 1000);

    interval.current = setInterval(() => {
      setShowTime((prev) => {
        if (prev === 1) {
          clearInterval(interval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer.current);
      clearInterval(interval.current);
    };
  }, []);
  async function resendOTP() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (!disableButton) {
      try {
        const response = await axiosInstance.post("/auth/resendOTP", {
          user: user,
        });
        if (response.data.success) {
          setNotify(response.data.message);
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      } catch (error) {
        setNotify("Please try again later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
  }

  return (
    <div className="w-full h-[100vh] inter relative bg-white flex justify-center items-center">
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
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
      <div className={` ${width > 768 ? "w-[400px] h-[470px] outsideLoginPage px-5 pt-[80px]" : "w-[100vw] px-2"} bg-white  rounded-md`}>
        <div className="">
          <div
            className={`logoHead ${
              width > 768 ? "my-[20px] text-2xl" : "mb-[25px] text-2xl"
            } font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600" `}
          >
            Verify Your Email
          </div>
          <Input
            paddingRight="20px"
            placeholder="Enter the six digit otp received on your email"
            maxLength={6}
            value={OTPvalue}
            onChange={(e) => setOTPvalue(e.target.value)}
            inputError={otpError}
          />
          <div className="flex justify-between">
            <button
              onClick={resendOTP}
              disabled={disableButton}
              className={`transition  duration-300 ${disableButton ? "text-zinc-700 cursor-not-allowed" : "text-blue-600 cursor-pointer"} `}
            >
              Resend otp{" "}
            </button>
            {disableButton && <div className="text-sm  text-[#4c4b4b]">{showTime} sec</div>}
          </div>

          <button
            className={`${
              disabled ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
            } flex justify-center items-center text-white w-full p-2 rounded-lg mt-[20px]`}
            disabled={disabled}
            onClick={signUp}
          >
            {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Verify"}
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

export default VerifyEmailPage;
