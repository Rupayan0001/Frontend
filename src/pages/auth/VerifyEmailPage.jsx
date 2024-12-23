import React, { useRef, useState, useEffect } from 'react'
import Input from '../../components/layout/Input'
import './../../styles/SignUpPage.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../lib/axios'


const VerifyEmailPage = () => {
    const timer = useRef();
    const interval = useRef();

    const [disableButton, setDisableButton] = useState(true)
    const [showTime, setShowTime] = useState(60);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"))
    // console.log("user", user);
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

    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true);
    const [otpError, setOtpError] = useState("");

    const otp = useRef();

    function handleChange() {
        if (otp.current.value.trim() !== "") {
            setDisabled(false);
        }
        else {
            setDisabled(true);
        }
    }
    async function signUp() {
        setOtpError("");
        if (otp.current.value.trim().length < 6) {
            setOtpError("Please enter a valid six digit otp")
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.post("/auth/verify_email_mobile", {
                emailOtp: otp.current.value,
                userId: user.id
            })

            if (response.data.message === "Email verified successfully") {
                console.log("done");
                navigate("/login");
            }

        }
        catch (error) {
            setOtpError("Invalid OTP")
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        timer.current = setTimeout(() => {
            setDisableButton(false)
        }, 60 * 1000)

        interval.current = setInterval(() => {
            setShowTime((prev) => {
                if (prev === 1) {
                    clearInterval(interval.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000)

        return () => {
            clearTimeout(timer.current);
            clearInterval(interval.current);
        }

    }, [])
    async function resendOTP() {
        if (!disableButton) {
            try {
                const response = await axiosInstance.post("/auth/resendOTP", {
                    user: user,
                })
                // console.log(response.data.message);
                setOtpError(response.data.message);
            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div className='w-full min-h-screen bg-white flex justify-center items-center font-roboto'>
            <div className='w-[400px] mb-5 bg-white px-5 py-10 mt-5 outsideVerifyPage rounded-md'>
                <div className='border-0'>
                    <h1 className='logoHead text-5xl font-bold text-center text-[#6A0DAD]'>Unlinked</h1>
                    <p className='text-md mt-[10px] text-center'>Connect with the world</p>
                    <p className='text-sm text-[#4c4b4b] text-center mt-5 enterOTP'>Enter the otp sent to your email</p>
                    <h3 className='text-sm text-center text-[#4c4b4b] mb-[6px] mt-2'>It's super easy!</h3>
                    <Input paddingRight="20px" placeholder="Enter the six digit otp received on your email" maxLength={6} ref={otp} onChange={handleChange} inputError={otpError} />
                    <div className='flex justify-between'>
                        <button onClick={resendOTP} disabled={disableButton} className={`transition  duration-300 ${disableButton ? "text-zinc-700 cursor-not-allowed" : "text-blue-600 cursor-pointer"} `}>Resend otp </button>
                        {disableButton && <div className='text-sm  text-[#4c4b4b]'>{showTime} sec</div>}

                    </div>

                    <p className='text-sm mt-[20px]'>By signing up, you agree to our <a href="#">Terms</a> ,<a href="#">Privacy Policy</a>  and <a href="#">Cookies Policy</a>  .</p>
                    <button className={`${disabled ? "bg-[#3DAAE3]" : "bg-[#0077B5]"} flex justify-center items-center text-white w-full p-2 rounded-lg mt-[20px]`} disabled={disabled} onClick={signUp}>{loading ? <p className='spinOnButton h-[25px] w-[25px]'></p> : "Verify"}</button>
                    <Link to="/login"><p className='mt-[20px] cursor-pointer text-blue-600 text-center'>Already have an account?</p></Link>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPage;
