import React, { useState, useRef, forwardRef } from 'react'
import userProfilePicStore from '../../lib/userProfilePicStore'
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faUserSlash, faRightFromBracket, faUser, faGear } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../lib/axios';
// import { faUser } from '@fortawesome/free-regular-svg-icons';


const TopbarRightDropdown = forwardRef(({ pageName }, ref) => {
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const setOpenBlockList = userProfilePicStore((state) => state.setOpenBlockList);
    const setOpenProfileDropdown = userProfilePicStore((state) => state.setOpenProfileDropdown);
    const setSavePost = userProfilePicStore((state) => state.setSavePost);
    const setSelected = userProfilePicStore((state) => state.setSelected);

    const setLogOut = userProfilePicStore((state) => state.setLogOut);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const navigate = useNavigate();
    const notifyTimer = useRef();
    function goToProfile() {
        navigate(`/userProfile/${loggedInUser._id}`);
        setOpenProfileDropdown(false);
    }

    function showBlockedUsers() {
        setOpenBlockList(true);
        setOpenProfileDropdown(false);
    }
    async function logout() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenProfileDropdown(false);
        try {
            // console.log("logging out")
            setLogOut(true);
            const response = await axiosInstance.post("/auth/logout");
            if (response.data.message === "Logged out successfully") {
                localStorage.removeItem("user");
                navigate("/login");
                window.location.reload();
            }
        } catch (error) {
            console.log(error)
            setNotify("Error logging you out, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
        finally {
            setLogOut(null);
        }

    }
    function showSavedPosts() {
        setSavePost(true);
        setSelected("");
        setOpenProfileDropdown(false);
    }

    return (

        <div ref={ref} className='absolute top-[6px] right-[0px] commentEditDropdown z-20  p-2 bg-white rounded-md shadow-lg w-max'>
            <div onClick={goToProfile} className='text-black hover:bg-zinc-200 px-2 z-90 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-200 rounded-md cursor-pointer'><img src={loggedInUser.profilePic} className='w-[30px] h-[30px] ml-[-4px] rounded-full mr-3' alt="" /> {loggedInUser.name}</div>
            {pageName === "Profile" &&
                <div onClick={showSavedPosts} className='text-black hover:bg-zinc-200 px-2 z-90 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon icon={faBookmark} className='text-[20px] ml-[1px] rounded-full mr-4' />Your saved posts</div>
            }
            <div onClick={showBlockedUsers} className='text-black hover:bg-zinc-200 px-2 z-90 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon icon={faUserSlash} className='text-[20px] ml-[-3px] rounded-full mr-3' /> Blocked users </div>
            <div className='text-black hover:bg-zinc-200 px-2 z-90 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-4 text-xl' icon={faGear} />  Settings</div>
            <div onClick={() => logout()} className='text-black hover:bg-zinc-200 px-2 z-90 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-4 ml-[1px] text-xl' icon={faRightFromBracket} />  Log Out</div>

        </div>

    )
})

export default TopbarRightDropdown;