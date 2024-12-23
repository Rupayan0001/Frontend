import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios';
import Input from '../../components/layout/Input'
import './../../styles/SignUpPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import userProfilePicStore from '../../lib/userProfilePicStore';

const LoginPage = () => {
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [type, setType] = useState("password");
  const setIsAuthenticated = userProfilePicStore((state) => state.setIsAuthenticated)
  const notify = userProfilePicStore((state) => state.notify);
  const setNotify = userProfilePicStore((state) => state.setNotify);
  const email = useRef();
  const password = useRef();
  const notifyTimer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const hendleKeyDown = (e) => {
      if (e.key === "Enter") {
        login();
      }
    }
    document.addEventListener("keydown", hendleKeyDown);
    return () => {
      document.removeEventListener("keydown", hendleKeyDown);
    }
  }, []);

  function handleChange() {
    if (email.current.value.trim() !== "" && password.current.value.trim() !== "") {

      setDisabled(false);
    }
    else {

      setDisabled(true);
    }
  }
  async function login() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }

    setEmailError("");
    setPasswordError("");
    if (email.current.value.trim() === "") {
      setEmailError("Please enter your email or mobile no");
      return;
    }
    if (password.current.value.trim() === "") {
      // password.current.focus();
      setPasswordError("Please enter your password");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email: email.current.value,
        password: password.current.value
      });
      if (response.data.message === "Logged in successfully") {
        if (response.data.message === "Logged in successfully" && response.data.sendUser._id) {
          setIsAuthenticated(true);
          navigate("/home");
        }
      }
    } catch (error) {
      // console.log(error)
      if (error.response.data.message === "User not found") {
        setTimeout(() => {
          setEmailError("User not found");
        }, 500)
      }
      if (error.response.data.message === "Invalid credentials") {
        setTimeout(() => {
          setPasswordError("Invalid credentials");
        }, 500)
      }
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <>
      <div className='relative w-full min-h-screen bg-white flex flex-col justify-center items-center font-roboto'>
        {notify && <div className='absolute giveShadow left-6 bottom-10 z-50 bg-zinc-900 px-5 py-3 text-white rounded-lg'>
          {notify} <button className='cursor-pointer hover:bg-zinc-700 transition duration-200 border-0 px-2 py-1 ml-2 bg-zinc-800 rounded-md font-semibold text-[15px]' onClick={() => window.location.reload()}>Reload</button>
        </div>}
        <div className='w-[400px] mb-5 bg-white px-5 py-10 mt-5 outsideLoginPage rounded-md'>
          <div className='border-0'>
            <h1 className='logoHead text-5xl font-bold text-center text-[#6A0DAD]'>Unlinked</h1>
            <p className='text-md mt-[10px] text-center'>Connect with the world</p>
            <p className='text-sm text-[#4c4b4b] text-center mt-5 enterOTP'>Log in, let's explore</p>
            <h3 className='text-sm text-center text-[#4c4b4b] mb-[10px] mt-2'>It's super fun!</h3>
            <Input placeholder="Enter your email or mobile no" maxLength={100} ref={email} onChange={handleChange} inputError={emailError} />
            <div className='relative'>
              <Input placeholder="Enter your password" maxLength={100} ref={password} onChange={handleChange} type={type} inputError={passwordError} />
              {type === "password" && <FontAwesomeIcon className='eyeIcon' onClick={() => setType("text")} style={{ cursor: "pointer" }} icon={faEye} />}
              {type === "text" && <FontAwesomeIcon className='eyeIcon' onClick={() => setType("password")} style={{ cursor: "pointer" }} icon={faEyeSlash} />}

            </div>

            {/* <p className='text-sm mt-[20px]'>By signing up, you agree to our <a href="#">Terms</a> ,<a href="#">Privacy Policy</a>  and <a href="#">Cookies Policy</a>  .</p> */}
        {/* <Link to="/signup"><p className='mt-[10px] cursor-pointer text-[#6A0DAD] text-left'>Forgot password?</p></Link> */}
            <button className={` flex justify-center items-center ${disabled ? "bg-[#8127C2] " : "bg-[#6A0DAD;]"} text-white w-full p-2 rounded-lg mt-[20px]`} disabled={disabled} onClick={login}>{loading ? <p className='spinOnButton h-[25px] w-[25px]'></p> : "Log in"}</button>
            <Link to="/signup"><p className='mt-[20px] cursor-pointer text-[#6A0DAD] text-center'>Don't have an account?</p></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
