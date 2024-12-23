import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../lib/axios'
import userProfilePicStore from '../../lib/userProfilePicStore.js';
import HoverBasicDetails from './HoverBasicDetails.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons';


const FriendsList = forwardRef(({ currentUserId }, ref) => {
    // const setSelectedTab = userProfilePicStore((state) => state.setSelected);
    const [friendsList, setFriendsList] = useState([]);
    const [showIdDetails, setShowIdDetails] = useState(null);
    const setStoreId = userProfilePicStore((state) => state.setStoreId);
    const setCloseModal = userProfilePicStore((state) => state.setCloseModal);
    const [loading, setLoading] = useState(true);
    const [acceptText, setAcceptText] = useState("Accept");
    const [rejectText, setRejectText] = useState("Reject");
    const friendRequests = userProfilePicStore((state) => state.friendRequests);
    const setFriendRequests = userProfilePicStore((state) => state.setFriendRequests);
    const [selectedTab, setSelectedTab] = useState("Friends");
    // const setFriendRequests = userProfilePicStore((state) => state.setFriendRequests);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const setEnterDialogHover = userProfilePicStore((state) => state.setEnterDialogHover);
    const notifyTimer = useRef();
    const navigate = useNavigate();
    const dialogHoverTimer = useRef();
    const outSideRef = useRef();
    // thisId.current = tabName === "Followers" ? "followerId" : "followingId";
    useEffect(() => {
        async function getFriendsList() {
            if (notifyTimer.current) {
                clearTimeout(notifyTimer.current);
                setNotify(null);
            }
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/user/getAllFriends`);
                if (response.data.friends) {
                    setFriendsList(response.data.friends);
                    setLoading(false);
                    console.log("response.data: ", response.data)
                }
                else {
                    throw Error;
                }
            }

            catch (error) {
                console.log(error)
                setNotify("Could not get friends list, please try later")
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
        }
        getFriendsList()

        return () => {
            setFriendsList([]);
        }

    }, [])

    function idDetails(id) {
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

    async function rejectFriendRequest(friendId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.delete(`/user/${friendId}/rejectFriendRequest`);
            if (response.data.message === "Friend request rejected") {
                // setRejectText("Rejected");
                const deletedRequest_updatedList = friendRequests.filter((e, i) => e.friendId._id !== friendId);
                setFriendRequests(deletedRequest_updatedList);
                console.log("friendRequests: ", friendRequests)
                setNotify("Friend request rejected");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
            if (response.data.message === "friend request rejected") {
                throw Error;
            }
        } catch (error) {
            console.log("error: ", error);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)

        }
    }
    async function acceptFriendRequest(friendId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put(`/user/${friendId}/addFriend`);
            if (response.data.message === "Friend request accepted") {
                // setAcceptText("Accepted");
                const acceptedRequest_updatedList = friendRequests.filter((e, i) => e.friendId._id !== friendId);
                setFriendRequests(acceptedRequest_updatedList);
                console.log("friendRequests: ", friendRequests)
                setNotify("Friend request accepted");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
            else {
                throw Error;
            }
        } catch (error) {
            console.log("error: ", error);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)

        }
    }

    { console.log("friendRequests: ", friendRequests) }
    return (
        <dialog ref={outSideRef} className='fixed inset-0 w-[100%] h-[100%] bg-black bg-opacity-60 z-10 flex justify-center items-center'>
            <div ref={ref} className=' relative  h-[470px] w-[440px] bg-white rounded-md'>
                <FontAwesomeIcon icon={faXmark} onClick={() => setCloseModal(true)} className='absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 top-1 right-1 transition duration-300 rounded-full top-0 right-0 cursor-pointer' />
                <div className='border-b-2 border-zinc-300 h-[50px] text-lg w-full flex justify-center items-center'>Friends</div>
                <div className=' h-[50px] w-full flex mt-[3px] justify-between items-center'>
                    <p className={`w-[220px] h-[50px]  flex justify-center items-center ${selectedTab === "Friends" ? "border-b-[4px] font-semibold  border-[#6A0DAD] text-[#6A0DAD]" : "text-zinc-700 border-b-[4px] border-white"} text-[18px]  hover:bg-zinc-200 transition duration-200 cursor-pointer `} onClick={() => setSelectedTab("Friends")} >Friends</p>
                    <div className={`w-[220px] h-[50px] relative flex justify-center items-center ${selectedTab === "Friend Requests" ? "border-b-[4px] font-semibold  border-[#6A0DAD] text-[#6A0DAD]" : "text-zinc-700 border-b-[4px] border-white"} text-[18px]  hover:bg-zinc-200 transition duration-200 cursor-pointer `} onClick={() => setSelectedTab("Friend Requests")} >
                        <p>Friend Requests</p>
                        {friendRequests && <p className='text-[10px] absolute right-[16px] top-[4px] bg-[#6A0DAD] text-white w-[22px] font-bold h-[22px] pt-[1px] flex items-center justify-center rounded-full'>{friendRequests.length > 99 ? "99+" : friendRequests.length}</p>}
                    </div>
                </div>
                {selectedTab === "Friend Requests" && <>
                    {friendRequests && friendRequests.length > 0 &&
                        <div className={`flex h-[380px] mt-0 px-2 flex-col ${friendRequests.length > 3 ? "overflow-y-scroll" : ""}`}>
                            {friendRequests.map((e, i) =>
                                <div key={i} className='relative h-[105px] mt-2 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 py-2 w-full flex flex-col items-center'>
                                    {/* {console.log("friendRequests: ", e)} */}
                                    <div className='flex w-full px-2'>
                                        <div onClick={() => navigate(`/userProfile/${e.friendId._id}`)} onMouseEnter={() => idDetails(e.friendId._id)} onMouseLeave={doNullId} className="relative w-[60px] h-[60px] cursor-pointer rounded-full group">
                                            <img src={e.friendId.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                                            <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                                        </div>
                                        {/* <img src={e.followingPersonProfilePic ? e.followingPersonProfilePic : e.followerProfilePic} onClick={() => navigate(`/userProfile/${e[thisId.current]}`)} onMouseEnter={() => idDetails(e[thisId.current])} onMouseLeave={() => setShowIdDetails(null)} className='w-[50px] h-[50px] object-cover rounded-full' /> */}
                                        <div className='ml-2'>
                                            <div className='flex items-center'>
                                                <p className='font-bold text-[17px] cursor-pointer text-black hover:underline transition duration-300 ' onClick={() => navigate(`/userProfile/${e.friendId._id}`)} onMouseEnter={() => idDetails(e.friendId._id)} onMouseLeave={doNullId}>{e.friendId.name ? e.friendId.name : ""}</p>
                                                <FontAwesomeIcon icon={faCircleCheck} className='text-[#6A0DAD] ml-2 mt-1 text-[22px]' />
                                            </div>
                                            {console.log("e.friendId._id: ", e.friendId._id)}
                                            {e.friendId._id === showIdDetails && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}
                                            <p className='text-[14px] text-zinc-700'>{e.friendId.username ? e.friendId.username : ""}</p>
                                        </div>
                                    </div>
                                    <div className='absolute bottom-2 right-0'>
                                        <button className='px-4 py-[7px] bg-[#6A0DAD] hover:bg-[#6A0BAE] transition duration-200 text-white rounded-lg' onClick={() => rejectFriendRequest(e.friendId._id)}>{rejectText}</button>
                                        <button className='px-4 py-[7px] bg-[#6A0DAD] hover:bg-[#6A0BAE] transition duration-200 ml-6 mr-2 text-white rounded-lg' onClick={() => acceptFriendRequest(e.friendId._id)}>{acceptText}</button>
                                    </div>
                                    {/* mt-2 w-full flex justify-end */}
                                </div>)}

                        </div>}
                    {friendRequests && friendRequests.length === 0 && <div className=' h-[380px] text-zinc-500 w-full flex items-center justify-center'>
                        You don't have any friend requests
                    </div>}
                </>}
                {selectedTab === "Friends" && <>
                    {!loading &&
                        <div className={`flex h-[380px] mt-2 px-2 flex-col ${friendsList && friendsList.length > 5 ? "overflow-y-scroll" : ""}`}>
                            {friendsList && friendsList.length > 0 && friendsList.map((e, i) =>
                                <div key={i} className='relative h-[70px] mt-4 pt-1 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-0 w-full flex flex-col items-center'>
                                    {console.log("friendRequests: ", e)}
                                    <div className='flex w-full px-2'>
                                        {/* <div onClick={() => navigate(`/userProfile/${e.friendId._id}`)} className="relative w-[60px] h-[60px] cursor-pointer rounded-full group"> */}
                                        <img src={e.friendId && e.friendId.profilePic} alt="Profile Image" onClick={() => navigate(`/userProfile/${e.friendId._id}`)} onMouseEnter={() => idDetails(e.friendId._id)} onMouseLeave={doNullId} className="w-[60px] h-[60px] cursor-pointer object-cover rounded-full" />
                                        {/* <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div> */}
                                        {/* </div> */}
                                        <div className='ml-2'>
                                            <div className='flex items-center'>
                                                <p className='font-bold text-[17px] cursor-pointer text-black hover:underline transition duration-300 ' onClick={() => navigate(`/userProfile/${e.friendId._id}`)} onMouseEnter={() => idDetails(e.friendId._id)} onMouseLeave={doNullId}>{e.friendId.name ? e.friendId.name : ""}</p>
                                                <FontAwesomeIcon icon={faCircleCheck} className='text-[#6A0DAD] ml-2 mt-1 text-[22px]' />
                                            </div>
                                            {/* {console.log("e.friendId._id: ", e.friendId._id)} */}
                                            {e.friendId._id === showIdDetails && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}
                                            <p className='text-[14px] text-zinc-700'>{e.friendId.username ? e.friendId.username : ""}</p>
                                        </div>
                                    </div>
                                </div>)}
                            {friendsList && friendsList.length === 0 && <div className=' h-[380px] text-zinc-500 w-full flex items-center justify-center'>
                                You don't have any friends yet
                            </div>}
                        </div>
                    }
                    {loading && <div className=' mt-4 text-zinc-500 w-full flex justify-center'><p className='spinOnButton h-[25px] w-[25px]'></p></div>}
                </>}

            </div>
        </dialog>
    )
});

export default FriendsList;
