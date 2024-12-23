import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/layout/Input'
import './../../styles/SignUpPage.css'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUpPage = () => {
    const [nameError, setNameError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("password");
    const [disabled, setDisabled] = useState(true);
    const navigate = useNavigate();
    const name = useRef();
    const username = useRef();
    const mobile = useRef();
    const email = useRef();
    const password = useRef();


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                signUp();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, []);



    function handleChange() {
        if (
            name.current.value.trim() !== "" &&
            username.current.value.trim() !== "" &&
            mobile.current.value.trim() !== "" &&
            email.current.value.trim() !== "" &&
            password.current.value.trim() !== ""
        ) {
            // console.log("Fired!!!");
            setDisabled(false);

        }

        else {
            // console.log("False")
            setDisabled(true);
            return;
        }
    }
    async function signUp() {

        setNameError("");
        setMobileError("");
        setPasswordError("");
        setUsernameError("");
        setEmailError("");

        if (!name.current.value.trim().includes(" ")) {
            setNameError("Please enter your full name")
        }
        if (mobile.current.value.trim().length < 10) {
            setMobileError("Please enter a valid mobile number")
        }
        if (username.current.value.trim() === "") {
            setUsernameError("Please enter a valid username")
        }
        if (email.current.value.trim() === "") {
            setEmailError("Please enter a valid email address")
        }
        if (password.current.value.trim() === "") {
            setPasswordError("Please enter a valid password")
            return;
        }




        try {
            setLoading(true);
            const response = await axiosInstance.post("/auth/signup", {
                name: name.current.value,
                username: username.current.value,
                mobile: mobile.current.value,
                email: email.current.value,
                password: password.current.value
            })
            if (response.data.message === "Verification email sent successfully") {
                console.log("user", response.data.user);
                localStorage.setItem("user", JSON.stringify({ id: response.data.user._id, name: response.data.user.name, email: response.data.user.email }))
                navigate("/verifyEmail");
            }

        }
        catch (error) {
            console.log(error.response.data.message)
            if (error.response.data.message === 'Password must contain atleast one special character, one number, one lowercase character, one uppercase character and has to be atleast 8 characters long') {
                setPasswordError("Password must contain atleast one special character, one number, one lowercase character, one uppercase character and has to be atleast 8 characters long")
            };
            if (error.response.data.message === "Invalid email address") {
                setEmailError("Invalid email address");
            }
            if (error.response.data.message === "User already exists") {
                setEmailError("User already exists, please login");
            }
            if (error.response.data.message === "Please enter a valid mobile number") {
                setMobileError("Please enter a valid mobile number");
            }
            if (error.response.data.message === "Username not available, use different username") {
                setUsernameError("Username not available, use different username");
            }

        }
        finally{
            setLoading(false);
        }
    }


    return (
        <div className='w-full min-h-screen bg-white flex justify-center font-roboto'>
            <div className='w-[400px] mb-5 bg-white px-8 py-10 mt-5 outside rounded-md'>
                <div className='border-0'>
                    <h1 className='logoHead text-5xl font-bold text-center text-[#6A0DAD]'>Unlinked</h1>
                    <p className='text-md mt-[10px] text-center'>Connect with the world</p>
                    <p className='text-sm text-[#4c4b4b] text-center mt-5 create'>Create a new account</p>
                    <h3 className='text-sm text-center text-[#4c4b4b] mb-[10px] mt-2'>It's super easy!</h3>
                    <Input placeholder="Enter your name" maxLength={100} ref={name} onChange={handleChange} inputError={nameError} />
                    <Input placeholder="Enter your username" maxLength={100} ref={username} onChange={handleChange} inputError={usernameError} />
                    <Input placeholder="Enter your mobile no" maxLength={13} ref={mobile} onChange={handleChange} inputError={mobileError} />
                    <Input placeholder="Enter your email" maxLength={100} ref={email} onChange={handleChange} inputError={emailError} />
                    <div className='relative'>
                        <Input placeholder="Enter your password" maxLength={100} ref={password} onChange={handleChange} type={type} inputError={passwordError} />
                        {type === "password" ? (<FontAwesomeIcon icon={faEye} onClick={() => setType("text")} className='eyeIcon cursor-pointer' />) : (<FontAwesomeIcon onClick={() => setType("password")} icon={faEyeSlash} className='eyeIcon cursor-pointer' />)}

                    </div>
                    <p className='text-md mt-[20px]'>By signing up, you agree to our <a className='links' href="#">Terms,</a> <a className='links' href="#">Privacy Policy</a>  and <a className='links' href="#">Cookies Policy</a>  .</p>
                    <button className={`${disabled ? "bg-[#3DAAE3] cursor-not-allowed " : "bg-[#0077B5]"} flex justify-center items-center text-white w-full p-2 rounded-lg mt-[20px]`} disabled={disabled} onClick={signUp}>{loading ? <p className='spinOnButton h-[25px] w-[25px]'></p> : "Sign Up"}</button>
                    <Link to="/login"><p className='mt-[20px] cursor-pointer text-blue-600 text-center'>Already have an account?</p></Link>
                    {/* <p className='mt-[20px] cursor-pointer text-blue-600 text-center'>Already have an account?</p> */}
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;
