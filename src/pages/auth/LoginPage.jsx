import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import Input from "../../components/layout/Input";
import "./../../styles/SignUpPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../lib/globalState";
import bg from "../../assets/images/215958.jpg";
import Notify from "../../components/layout/Notify";

const LoginPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [type, setType] = useState("password");
  const setIsAuthenticated = globalState((state) => state.setIsAuthenticated);
  const setIsLoggedOut = globalState((state) => state.setIsLoggedOut);
  const setLogOut = globalState((state) => state.setLogOut);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const [width, setWidth] = useState(window.innerWidth);
  const [passwordValue, setPasswordValue] = useState("");
  const [emailvalue, setEmailValue] = useState("");
  const email = useRef();
  const password = useRef();
  const notifyTimer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (emailvalue && passwordValue) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [emailvalue, passwordValue]);

  useEffect(() => {
    setIsLoggedOut(null);
    setLogOut(null);
    function resize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    const hendleKeyDown = (e) => {
      if (e.key === "Enter") {
        login();
      }
    };
    document.addEventListener("keydown", hendleKeyDown);
    return () => {
      document.removeEventListener("keydown", hendleKeyDown);
    };
  }, [emailvalue, passwordValue]);

  async function login() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setEmailError("");
    setPasswordError("");
    if (emailvalue.trim() === "") {
      setEmailError("Please enter your email or mobile no");
      return;
    }
    if (passwordValue.trim() === "") {
      setPasswordError("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email: emailvalue,
        password: passwordValue,
      });
      if (response.data.message === "Logged in successfully") {
        if (response.data.message === "Logged in successfully" && response.data.sendUser._id) {
          setIsAuthenticated(true);
          navigate("/home");
        }
      }
    } catch (error) {
      if (error.response.data.message === "User not found") {
        setNotify("User not found");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      if (error.response.data.message === "Invalid credentials") {
        setTimeout(() => {
          setPasswordError("Invalid credentials");
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="relative inter w-full h-[100vh] bg-white flex flex-col justify-center items-center">
        {notify && width > 450 && <Notify page="Home" width={width} notify={notify} />}
        {notify && width <= 450 && (
          <div className="absolute w-[100%] bottom-10 flex justify-center">
            <Notify page="Home" width={width} notify={notify} />
          </div>
        )}
        {/* <Link to="/signup">
          <p
            className={`absolute top-2 ${
              width < 550 ? "right-1" : "right-2"
            } cursor-pointer rounded-lg hover:opacity-70 text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-center`}
          >
            Create an account?
          </p>
        </Link> */}

        <div className={` ${width > 768 ? "w-[400px] h-[470px] outsideLoginPage px-5" : "w-[100vw] px-2"} bg-white  py-10   rounded-md`}>
          <div className="">
            <div
              className={`logoHead ${
                width > 768 ? "mt-[40px] mb-[20px] text-3xl" : "mb-[20px] text-3xl"
              } font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 `}
            >
              Renokon
            </div>
            <div>
              <Input
                placeholder="Enter your email or mobile no"
                maxLength={100}
                paddingRight={width > 500 ? "40px" : "30px"}
                ref={email}
                value={emailvalue}
                onChange={() => setEmailValue(email.current.value)}
                inputError={emailError}
              />
              <div className="relative">
                <Input
                  placeholder="Enter your password"
                  maxLength={100}
                  ref={password}
                  value={passwordValue}
                  onChange={() => setPasswordValue(password.current.value)}
                  type={type}
                  inputError={passwordError}
                />
                {type === "password" && <FontAwesomeIcon className="eyeIcon" onClick={() => setType("text")} style={{ cursor: "pointer" }} icon={faEye} />}
                {type === "text" && <FontAwesomeIcon className="eyeIcon" onClick={() => setType("password")} style={{ cursor: "pointer" }} icon={faEyeSlash} />}
              </div>

              {/* <p className='text-sm mt-[20px]'>By signing up, you agree to our <a href="#">Terms</a> ,<a href="#">Privacy Policy</a>  and <a href="#">Cookies Policy</a>  .</p> */}

              <Link to="/forgotPassword">
                <p className="mt-[10px] hover:opacity-80 cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 ">Forgot password?</p>
              </Link>
              <button
                className={` flex justify-center items-center ${
                  disabled ? "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
                } text-white w-full p-2 rounded-lg mt-[20px]`}
                disabled={disabled}
                onClick={login}
              >
                {loading ? <p className="spinButton h-[24px] w-[24px]"></p> : "Log in"}
              </button>
              <Link to="/signup">
                <p className="mt-[20px] hover:opacity-80 cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-center">
                  Don't have an account?
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

{
  /* {width > 768 && (
              <div>
                <h1 className="logoHead text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">Renokon</h1>
                <p className="text-md mt-[10px] text-center">Connect with the world</p>
                <p className={`${width > 500 ? "text-[45px] mt-3" : "text-[40px] mt-3"} text-[#4c4b4b] text-center  enterOTP`}>Log in, let's explore</p>
                <h3 className="text-sm text-center text-[#4c4b4b] mb-[10px] mt-2">It's super fun!</h3>
              </div>
            )} */
}
