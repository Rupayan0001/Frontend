import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios';
import userProfilePicStore from '../../lib/userProfilePicStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


const HoverBasicDetails = ({ userId, currentUserId }) => {
    // const storeId = useRef();
    // storeId.current = userId;
    // console.log("userId: ", userId)
    const turnDetailsTimer = useRef();
    const [basicUserProfile, setBasicUserProfile] = useState(null);
    const storeId = userProfilePicStore((state) => state.storeId);
    const setStoreId = userProfilePicStore((state) => state.setStoreId);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const showIdDetails = userProfilePicStore((state) => state.showIdDetails);
    const setShowIdDetails = userProfilePicStore((state) => state.setShowIdDetails);
    const enterDialogHover = userProfilePicStore((state) => state.enterDialogHover);
    const [following, setFollowing] = useState(false)
    const [sameUser, setNotSameUser] = useState(false)
    const [followingText, setFollowingText] = useState("Following");
    const notifyTimer = useRef();
    const holdUserId = useRef()
    const navigate = useNavigate();

    useEffect(() => {
        // console.log("userId from hover firing: ", userId);
        if (userId) {
            turnOnDetails(userId);
            setStoreId(userId);

        }
        else {
            // console.log("firing........... turnm of")
            turnOffDetails();
        }
        function turnOnDetails(userId) {
            // console.log("storeId: ", storeId)
            clearTimeout(turnDetailsTimer.current);
            setBasicUserProfile(null);
            showProfileDetails(userId);
        }
        function turnOffDetails() {
            setShowIdDetails(null);
            turnDetailsTimer.current = setTimeout(() => {
                setBasicUserProfile(null);
                // storeId.current = null;
                setStoreId(null);
                // console.log("storeId: ", storeId)

            }, 400)
        }
    }, [userId])
    async function showProfileDetails(userId) {
        try {
            const response = await axiosInstance.get(`/user/basicUserProfile/${userId}/${currentUserId}`);
            // console.log("response.data: ", response.data)
            setBasicUserProfile(response.data.user);
            setFollowing(response.data.isFollowing);
            setNotSameUser(response.data.isSameUser);
        } catch (error) {
            console.log(error);
            // setNotify("Notification turned off for this post");
            // setTimeout(() => {
            //     setNotify(null);
            // }, 5 * 1000)
            // setOpenEditor(null);
        }
    }

    function turnOffDetails() {
        setShowIdDetails(null);
        turnDetailsTimer.current = setTimeout(() => {
            setBasicUserProfile(null);
            setStoreId(null);
        }, 400)
    }

    function enterIntoDetailes() {
        clearTimeout(turnDetailsTimer.current);
        if (enterDialogHover) {
            clearTimeout(enterDialogHover.current);

        }
        // console.log("storeId: ", storeId)
    }

    async function followUser(followId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            console.log("followId: ", followId)
            const response = await axiosInstance.put(`/user/${followId}/followUser`)
            if (response.data.message === "following") {
                // console.log("response.data.message: ", response.data.message)
                setFollowing(true);
                setNotify(`You are following ${basicUserProfile.name}`)
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
        } catch (error) {
            console.log(error)
            setNotify("Something went wrong, please try again later")
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }
    async function unFollowUser(unFollowId) {
        console.log("UnfollowId: ", unFollowId)
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put(`/user/${unFollowId}/unFollowUser`)
            if (response.data.message === "unfollowed") {
                console.log("response.data.message: ", response.data.message)
                setFollowing(false);
                setNotify(`You unfollowed ${basicUserProfile.name}`)
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
        } catch (error) {
            console.log(error)
            setNotify("Something went wrong, please try again later")
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }
    // useEffect(()=>{

    // },[following])

    if (!basicUserProfile) return <></>;
    return (
        <div onMouseEnter={() => enterIntoDetailes()} onMouseLeave={() => turnOffDetails()} className='absolute w-[350px] basicProfile z-30 top-16 left-0 bg-white rounded-lg px-4 py-4'>
            <div className='relative'>
                <div className='flex justify-between items-top '>
                    {/* <Link to={`/userProfile/${storeId}`}> */}
                    <div className=''>
                        <div onClick={() => navigate(`/userProfile/${storeId}`)} className="relative w-[70px] h-[70px] cursor-pointer mr-4 group">
                            <img src={basicUserProfile.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                            <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                        </div>

                        {/* <img src={basicUserProfile.profilePic} className='w-[70px] h-[70px] cursor-pointer mr-4 rounded-full' /> */}
                        <div className='mt-2'>
                            <div className='flex items-center'>

                                <p onClick={() => navigate(`/userProfile/${storeId}`)} className='font-bold text-[20px] cursor-pointer text-black hover:underline transition duration-300 '>{basicUserProfile.name}</p>
                                <FontAwesomeIcon icon={faCircleCheck} className='text-[#6A0DAD] ml-2 mt-1 text-[22px]' />
                            </div>
                            <p className='text-[14px] text-zinc-700'>{basicUserProfile.username}</p>
                        </div>

                    </div>
                    {!sameUser && <>
                        {!following &&
                            <button onClick={() => followUser(storeId)} className='absolute top-0 right-0 px-6 py-2 ml-0 rounded-lg bg-[#6A0DAD] text-white'>Follow</button>}
                        {following &&
                            <button onClick={() => unFollowUser(storeId)} onMouseEnter={() => setFollowingText("Unfollow")} onMouseLeave={() => setFollowingText("Following")} className={`absolute top-0 right-0 px-6 py-2 ml-0 rounded-lg transition duration-400 hover:bg-black bg-[#6A0DAD] text-white`}>{followingText}</button>}
                    </>}
                    {/* </Link> */}
                    {/* <div className='flex flex-col items-center'> */}

                    {/* <button className='px-6 py-2 mt-2 rounded-lg bg-white text-[#6A0DAD] hover:bg-zinc-300 transition duration-200'>Message</button> */}
                    {/* </div> */}
                </div>

                <div className='text-black mt-2'>{basicUserProfile.headline ? basicUserProfile.headline : ""}</div>
                <div className='flex justify-between items-center mt-2 '>
                    <div className='flex items-center'>
                        <div className='mr-2 text-bold  transition duration-100'>{basicUserProfile.followerCount}  <span className='text-zinc-500'>Followers</span></div>
                        {/* underlineStyle cursor-pointer will add the underline and onClick logic later */}
                    </div>
                    <div className='flex items-center mr-2 '>
                        <div className='mr-0 text-bold  transition duration-100'>{basicUserProfile.followingCount} <span className='text-zinc-500'>Following</span></div>

                    </div>
                </div>
                {/* <div className='flex mt-2 items-center'>

                </div> */}
            </div>
        </div>
    )
}

export default HoverBasicDetails
