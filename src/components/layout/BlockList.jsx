import react, { forwardRef, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import userProfilePicStore from "../../lib/userProfilePicStore";
import HoverBasicDetails from "./HoverBasicDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

const BlockList = forwardRef(({ currentUserId }, ref) => {
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const showIdDetails = userProfilePicStore((state) => state.showIdDetails);
    const setShowIdDetails = userProfilePicStore((state) => state.setShowIdDetails);
    const setStoreId = userProfilePicStore((state) => state.setStoreId);
    const setEnterDialogHover = userProfilePicStore((state) => state.setEnterDialogHover);
    const setCloseModal = userProfilePicStore((state) => state.setCloseModal);
    const closeModal = userProfilePicStore((state) => state.closeModal);
    const [blockList, setBlockList] = useState(null);
    const [loading, setLoading] = useState(true);

    const notifyTimer = useRef();
    const dialogHoverTimer = useRef();
    const navigate = useNavigate();
    useEffect(() => {
        async function getBlockList() {
            if (notifyTimer.current) {
                clearTimeout(notifyTimer.current);
                setNotify(null);
            }
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/user/${currentUserId}/getBlockedUsers`);
                if (response.data.blockedUsers) {
                    setBlockList(response.data.blockedUsers);
                    console.log("blocklists............  ", response.data.blockedUsers)
                }
                else {
                    setNotify(response.data.message);
                    notifyTimer.current = setTimeout(() => {
                        setNotify(null);
                    }, 5 * 1000)
                }
            } catch (error) {
                console.log(error)
                setNotify("Something went wrong, please try again later");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            finally {
                setLoading(false);
            }
        }
        getBlockList();
    }, [])



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
    async function unblockUser(id, name) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put(`/user/${id}/unblockUser/`);
            if (response.data.message === "Unblocked") {
                const deletedUnblockUser = blockList.filter((e, i) => e.blockedUserId._id !== id);
                setBlockList(deletedUnblockUser);
                setNotify(`You have unblocked ${name.split(" ")[0]}'s profile`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            if (response.data.message === "Could not unblock, please try again later") {
                setNotify(response.data.message);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            console.log(response.data);
        } catch (error) {
            console.log(error);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)

        }
    }

    return (
        <dialog className="fixed inset-0 h-[100%] w-[100%] z-50 flex justify-center items-center bg-black bg-opacity-60">
            <div ref={ref} className="relative h-[470px] w-[400px] bg-white rounded-md">
                <FontAwesomeIcon icon={faXmark} onClick={() => setCloseModal(true)} className='absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 top-1 right-1 transition duration-300 rounded-full top-0 right-0 cursor-pointer' />
                <div className="flex justify-center items-center  ">
                    <h1 className='border-b-2 border-zinc-300 h-[50px] text-lg w-full flex justify-center items-center'>Block List</h1>
                </div>
                <div className={`h-[400px] px-4 ${blockList && blockList.length > 5 ? "overflow-y-scroll" : "overflow-y-hidden"} `}>
                    {!loading && blockList && blockList.length > 0 && blockList.map((e, i) => {
                        return (<div key={i} className='relative h-[70px] mt-0 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-2 w-full flex items-center'>
                            <div className='flex'>
                                {console.log(e.blockedUserId)}
                                <div onClick={() => navigate(`/userProfile/${e.blockedUserId._id}`)} onMouseEnter={() => idDetails(e.blockedUserId._id)} onMouseLeave={doNullId} className="relative w-[50px] h-[50px] cursor-pointer rounded-full group">
                                    <img src={e.blockedUserId.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                                    <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                                </div>
                                {/* <img src={e.followingPersonProfilePic ? e.followingPersonProfilePic : e.followerProfilePic} onClick={() => navigate(`/userProfile/${e[thisId.current]}`)} onMouseEnter={() => idDetails(e[thisId.current])} onMouseLeave={() => setShowIdDetails(null)} className='w-[50px] h-[50px] object-cover rounded-full' /> */}
                                <div className='ml-2'>
                                    <div className='flex items-center'>
                                        <p className='font-bold text-[16px] cursor-pointer text-black hover:underline transition duration-300 ' onClick={() => navigate(`/userProfile/${e.blockedUserId._id}`)} onMouseEnter={() => idDetails(e.blockedUserId._id)} onMouseLeave={doNullId}>{e.blockedUserId.name ? e.blockedUserId.name.length > 19? e.blockedUserId.name.slice(0, 19) + ".." : e.blockedUserId.name : ""}</p>
                                        <FontAwesomeIcon icon={faCircleCheck} className='text-[#6A0DAD] ml-2 mt-1 text-[22px]' />
                                    </div>
                                    {e.blockedUserId._id === showIdDetails && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}

                                    <p className='text-[14px] text-zinc-700'>{e.blockedUserId.username ? e.blockedUserId.username : ""}</p>
                                </div>
                                <button onClick={() => unblockUser(e.blockedUserId._id, e.blockedUserId.name)} className='absolute top-3 right-2 px-4 py-2 ml-0 rounded-lg hover:bg-[#6A0DAD] transition duration-200 bg-zinc-800 text-white'>Unblock</button>
                            </div>
                        </div>)
                    })}
                    {!loading && blockList && blockList.length === 0 && <div className='text-center text-zinc-500 h-[380px] flex items-center justify-center'>No user found</div>}
                    {loading && <div className=' mt-4 text-zinc-500 w-full flex justify-center'><p className='spinOnButton h-[25px] w-[25px]'></p></div>}
                </div>

            </div>
        </dialog>
    )
})

export default BlockList;