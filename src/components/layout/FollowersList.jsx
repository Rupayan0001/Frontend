import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios'
import userProfilePicStore from '../../lib/userProfilePicStore.js';
import HoverBasicDetails from './HoverBasicDetails.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';


const FollowersList = forwardRef(({ userId, tabName, currentUserId, user_name }, ref) => {
    // const setSelectedTab = userProfilePicStore((state) => state.setSelected);
    const [data, setData] = useState([]);
    // const [showIdDetails, setShowIdDetails] = useState(null);
    const setStoreId = userProfilePicStore((state) => state.setStoreId);
    const setCloseModal = userProfilePicStore((state) => state.setCloseModal);
    const showIdDetails = userProfilePicStore((state) => state.showIdDetails);
    const setShowIdDetails = userProfilePicStore((state) => state.setShowIdDetails);
    const setEnterDialogHover = userProfilePicStore((state) => state.setEnterDialogHover);
    const [loading, setLoading] = useState(true);


    // const setNotify = userProfilePicStore((state) => state.setNotify);
    // const notifyTimer = useRef();
    const navigate = useNavigate();
    const thisId = useRef();
    const outSideRef = useRef();
    const dialogHoverTimer = useRef();
    thisId.current = tabName === "Followers" ? "followerId" : "followingId";
    useEffect(() => {
        async function getFollowersList() {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/user/${userId}/${tabName === "Followers" ? "getFollowers" : "getFollowing"}`);
                setData(response.data);
                setLoading(false);
                console.log("response.data: ", response.data)
            }

            catch (error) {
                console.log(error)
            }
        }
        getFollowersList()

        return () => {
            setData([]);
        }

    }, [])

    async function followUser(followId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put(`/user/${followId}/followUser`)
            if (response.data.message === "following") {
                console.log("response.data.message: ", response.data.message)
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
    function idDetails(id) {
        console.log("firing:..........", id)
        if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
        setShowIdDetails(id);
        setStoreId(id);
    }
    function doNullId() {
        if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
        dialogHoverTimer.current = setTimeout(() => {
            setShowIdDetails(null)
        }, 400)
        setEnterDialogHover(dialogHoverTimer);
    }

    return (
        <dialog ref={outSideRef} className='fixed inset-0 w-[100%] h-[100%] bg-black bg-opacity-60 z-50 flex justify-center items-center'>
            <div ref={ref} className=' relative h-[270px] w-[440px] bg-white rounded-md'>
                <FontAwesomeIcon icon={faXmark} onClick={() => setCloseModal(true)} className='absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 top-1 right-1 transition duration-300 rounded-full top-0 right-0 cursor-pointer' />
                <div className='border-b-2 border-zinc-300 h-[50px] text-lg w-full flex justify-center items-center'>{tabName}</div>
                <div className={`flex h-[380px] mt-2 px-4 flex-col ${data.length > 5 ? "overflow-y-scroll" : ""}`}>
                    {data && data.length > 0 && data.map((e, i) =>
                        <div key={i} className='relative h-[70px] mt-0 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-2 w-full flex items-center'>
                            <div className='flex'>
                                <div onClick={() => navigate(`/userProfile/${e[thisId.current]}`)} onMouseEnter={() => idDetails(e[thisId.current])} onMouseLeave={doNullId} className="relative w-[50px] h-[50px] cursor-pointer rounded-full group">
                                    <img src={e.followingPersonProfilePic ? e.followingPersonProfilePic : e.followerPersonProfilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                                    <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                                </div>
                                {/* <img src={e.followingPersonProfilePic ? e.followingPersonProfilePic : e.followerProfilePic} onClick={() => navigate(`/userProfile/${e[thisId.current]}`)} onMouseEnter={() => idDetails(e[thisId.current])} onMouseLeave={() => setShowIdDetails(null)} className='w-[50px] h-[50px] object-cover rounded-full' /> */}
                                <div className='ml-2'>
                                    <div className='flex items-center'>
                                        <p className='font-bold text-[16px] cursor-pointer text-black hover:underline transition duration-300 ' onClick={() => navigate(`/userProfile/${e[thisId.current]}`)} onMouseEnter={() => idDetails(e[thisId.current])} onMouseLeave={doNullId}>{e.followingName ? e.followingName : e.followerName}</p>
                                        <FontAwesomeIcon icon={faCircleCheck} className='text-[#6A0DAD] ml-2 mt-1 text-[22px]' />
                                    </div>
                                    {e[thisId.current] === showIdDetails && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}

                                    <p className='text-[14px] text-zinc-700'>{e.followingUsername ? e.followingUsername : e.followerUsername}</p>
                                </div>
                            </div>

                            {/* {console.log("e.thisId.current: ", e[thisId.current])} */}
                            {/* {e.thisId.current!== currentUserId && <>
                            {!following &&
                                <button onClick={() => followUser(e.thisId.current)} className='absolute top-0 right-0 px-6 py-2 ml-0 rounded-lg bg-[#6A0DAD] text-white'>Follow</button>}
                            {following &&
                                <button onClick={() => unFollowUser(e.thisId.current)} className='absolute top-0 right-0 px-6 py-2 ml-0 rounded-lg bg-[#6A0DAD] text-white'>Unfollow</button>}
                        </>} */}
                            {e[thisId.current] === currentUserId && <div className='absolute top-3 right-2 px-6 py-1 ml-0 rounded-lg bg-[#6A0DAD] text-white'>You</div>}

                        </div>)}
                    {!loading && data && data.length === 0 && <div className=' h-[380px] text-zinc-500 w-full flex items-center justify-center'>
                        {userId === currentUserId && <>
                            {tabName === "Following" && "You are not following anyone"}
                            {tabName === "Followers" && "You do not have any followers yet"}
                        </>}
                        {userId !== currentUserId && <>
                            {tabName === "Following" && `${user_name.split(" ")[0]} is not following anyone`}
                            {tabName === "Followers" && `${user_name.split(" ")[0]} do not have any followers yet`}
                        </>}
                    </div>}
                    {loading && <div className=' mt-2 text-zinc-500 w-full flex justify-center'><p className='spinOnButton h-[25px] w-[25px]'></p></div>}
                </div>
            </div>
        </dialog>
    )
});

export default FollowersList
