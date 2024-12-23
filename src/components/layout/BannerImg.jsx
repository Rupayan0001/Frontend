import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import userProfilePicStore from '../../lib/userProfilePicStore.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faCamera, faCheck, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import Purple from "./../../assets/683850.jpg"
import Green from "./../../assets/abstract-green-background-eri47g77a5kldngq.jpg"
import Sky from "./../../assets/professional-photo-background-zb0abc8ysodf81ui.jpg"
import colorDesign from "./../../assets/powerpoint-blue-background-b13vvyd1123j2htd.jpg"
import Blue from "./../../assets/wp8422340.jpg"
import defaultProfilePic from "../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import defaultBannerPic from "../../assets/wp2249197.jpg";
// import WritePost from '../components/layout/WritePost';
import { axiosInstance } from '../../lib/axios';
import colorsArr from '../../lib/ColorsArr.js';

const BannerImg = ({ loggedInUser }) => {
    const uploadCover = useRef();
    const colorDropDown = useRef();
    const coverEditDropDown = useRef();
    const showCoverEditRef = useRef();
    // const uploadColorCoversRef = useRef();
    const [showCoverEdit, setShowCoverEdit] = useState(false);
    // const [coverImage, setCoverImage] = useState(defaultBannerPic);
    const [colorBg, SetColorBg] = useState(false);
    const [loading, setLoading] = useState(true);
    const [colorLoading, setColorLoading] = useState(0);
    const notify = userProfilePicStore((state) => state.notify);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    // const [user, setUser] = useState(null);
    const user = userProfilePicStore((state) => state.user);
    const setUser = userProfilePicStore((state) => state.setUser);
    const notifyTimer = useRef();
    // const { userId } = useParams();

    // async function getUser() {
    //     setLoading(true);

    //     try {
    //         const response = await axiosInstance.get(`/user/userProfile/${userId}`)
    //         if (response) {
    //             setUser(response.data);
    //             setLoading(false);
    //             // setCoverImage(response.data.bannerPic);
    //         }
    //     } catch (error) {
    //         console.log("error")
    //     }
    // }
    // console.log(coverImage)


    // const id = JSON.parse(localStorage.getItem("user"))
    function getUser() {
        if (user) {
            setLoading(false);
        }
    }
    useEffect(() => {
        getUser();
    }, [user]);
    useEffect(() => {
        // getUser();
        const handleClickOutside = (e) => {
            if (user && user._id === loggedInUser._id) {
                // console.log("fires ")
                if (colorDropDown.current && !colorDropDown.current.contains(e.target)) {
                    SetColorBg(false);
                }
                if (coverEditDropDown.current && !coverEditDropDown.current.contains(e.target) && !showCoverEditRef.current.contains(e.target)) {
                    setShowCoverEdit(false)
                }
                // if (!coverEditDropDown.current && showCoverEditRef.current.contains(e.target)) {
                //     setShowCoverEdit(true)
                // }

            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            // setUser(null);
        }
    }, [])
    function clickOnUpload() {
        uploadCover.current.click()

    }

    async function removeCoverPhoto() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put("/user/updateUser", {
                bannerPic: `https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730410078/o1en5o821vhu5crfbeqv.jpg`
            })
            // console.log(`File uploaded successfully!`, response);
            setShowCoverEdit(prev => !prev);
            setUser(response.data);
            setNotify("Cover photo removed");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
            // setCoverImage(response.data.bannerPic);
            // console.log("Success")
        } catch (error) {
            console.log(error)
            console.log("Failed")
        }

    }
    function colorCoverSet() {
        SetColorBg(prev => !prev)
        setShowCoverEdit(prev => !prev);
        setColorLoading(1)
        // setTimeout(() => {
        //     // console.log("fired")
        // }, 1000)
    }

    async function uploadColorCover(e) {
        //   const ind = Object.keys(colorsArr)
        // console.log("Success", colorsArr[e])
        setLoading(true);
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put("/user/updateUser", {
                bannerPic: colorsArr[e]
            })
            // console.log(`File uploaded successfully!`, response);
            SetColorBg(prev => !prev);
            setUser(response.data);
            setNotify("Cover photo uploaded successfully");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
            // setOpenEditor(null);
        } catch (error) {
            setNotify("Something went wrong, Please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
            // setOpenEditor(null);
            // console.log("Failed")
        }
        finally {
            setLoading(false);
        }
        // setCoverImage(`https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730316740/e33wujrdzznfosux8iiw.png`);

    }
    // SetColorBg(false);


    async function handleFileChange(e) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const file = e.target.files[0];
            if (file) {
                setLoading(true);
                setShowCoverEdit(prev => !prev);
                const formData = new FormData();
                formData.append("bannerPic", file);
                const response = await axiosInstance.put("/user/updateUserBannerpic", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                // console.log(`File uploaded successfully!`, response.data); 
                setUser(response.data);
                // setCoverImage(response.data.bannerPic);
                setLoading(false);
                setNotify("Cover photo uploaded successfully");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
                // setOpenEditor(null);
            }
        }
        catch (err) {
            // alert(err)
            console.log(err)
            setNotify("Something went wrong, Please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
            // setOpenEditor(null);
        }
    }
    // console.log("src: ", src)
    return (
        <div className='bannerImg'>
            {(!user || loading) && <div className={` flex justify-center items-center w-[550px] h-[200px] rounded-lg overflow-hidden`} alt="" ><div className='spinOnButton h-[30px] w-[30px]'></div></div>}
            {user && !loading && <img src={user.bannerPic} className={`profileBanner w-[550px] h-[200px] rounded-lg overflow-hidden`} alt="" />}
            {user && !loading && loggedInUser._id === user._id &&
                <div className='position-relative'>
                    <button className='editCoverPhoto' onClick={() => setShowCoverEdit(prev => !prev)} ref={showCoverEditRef} ><FontAwesomeIcon className='changeCoverPicCameraIcon' icon={faCamera} /><p className='ml-3'>Edit Cover Photo</p></button>
                    {showCoverEdit && <div ref={coverEditDropDown} className='editCoverPhotoHiddenButtons rounded-md flex flex-col items-center'>
                        <input ref={uploadCover} type="file" accept='image/*' name="bannerPic" className='hidden' onChange={handleFileChange} />
                        <button className='w-[300px] p-2 rounded-lg text-black' onClick={clickOnUpload} >Upload Cover Photo</button>
                        <button className='w-[300px] p-2 rounded-lg text-black' onClick={removeCoverPhoto} >Remove Cover Photo</button>
                        <button className='w-[300px] p-2 rounded-lg text-black' onClick={colorCoverSet}>Color Cover Photos</button>
                    </div>}
                    {colorBg && <div ref={colorDropDown} className='colorPicker'>

                        {/* <input ref={uploadColorCoversRef} type="file" accept='image/*' className='hidden' onChange={handleFileChange} /> */}
                        {/* {[Purple, Green, Sky, Blue].map((e, i) =>} */}

                        <img className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`} onClick={() => uploadColorCover("Purple")} src={Purple} alt="" />
                        <img className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`} onClick={() => uploadColorCover("Green")} src={Green} alt="" />
                        <img className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`} onClick={() => uploadColorCover("Sky")} src={Sky} alt="" />
                        <img className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`} onClick={() => uploadColorCover("Blue")} src={Blue} alt="" />
                        <img className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`} onClick={() => uploadColorCover("colorDesign")} src={colorDesign} alt="" />
                    </div>}
                </div>}
        </div>
    )
}

export const ProfileImg = ({ color, loggedInUser, }) => {
    const user = userProfilePicStore((state) => state.user);
    const setUser = userProfilePicStore((state) => state.setUser);
    const [loading, setLoading] = useState(true);
    // const [profilePic, setProfilePic] = useState(null);
    // const [selected, setSelected] = useState("Posts")
    const selected = userProfilePicStore((state) => state.selected);
    const setSelected = userProfilePicStore((state) => state.setSelected);
    const editProfile = userProfilePicStore((state) => state.editProfile);
    const setEditProfile = userProfilePicStore((state) => state.setEditProfile);
    const setLoggedInUser = userProfilePicStore((state) => state.setLoggedInUser);
    const tabSelectedForFollow = userProfilePicStore((state) => state.tabSelectedForFollow);
    const setTabSelectedForFollow = userProfilePicStore((state) => state.setTabSelectedForFollow);
    const friendsList = userProfilePicStore((state) => state.friendsList);
    const notify = userProfilePicStore((state) => state.notify);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const [editProfileImage, setEditProfileImage] = useState(false);

    const [friend, setFriend] = useState(false);
    const [statusLoading, setStatusLoading] = useState(true);
    const [friendRequest, setFriendRequest] = useState("");
    const [sentYouFriendRequest, setSentYouFriendRequest] = useState(false);
    // const [block, setBlock] = useState(false);

    const [friendRequestLoading, setFriendRequestLoading] = useState(false);
    const [friendRequestCancelLoading, setFriendRequestCancelLoading] = useState(false);

    const block = userProfilePicStore((state) => state.block);
    const setBlock = userProfilePicStore((state) => state.setBlock);
    const setSavePost = userProfilePicStore((state) => state.setSavePost);

    const friendRequests = userProfilePicStore((state) => state.friendRequests);
    const setFriendRequests = userProfilePicStore((state) => state.setFriendRequests);
    const showFriends = userProfilePicStore((state) => state.showFriends);
    const setShowFriends = userProfilePicStore((state) => state.setShowFriends);

    const notifyTimer = useRef();
    const profilePicEditDropDown = useRef();
    const uploadProfile = useRef();
    const profilePicEditIcon = useRef();
    const { userId } = useParams();
    // console.log("friendRequestStatus: ", friendRequestStatus, "friendRequest: ", friendRequest)


    useEffect(() => {
        // console.log("Mounted .........", friendRequests)
        // if (friendRequests && friendRequests.length > 0) {
        //     friendRequests.find(e => e.friendId === userId) ? setSenYouFriendRequest(true) : setSenYouFriendRequest(false);
        //     console.log("senYouFriendRequest: ", senYouFriendRequest)
        // }
        // console.log("friendsList: ", friendsList)

        async function isMyFriend() {
            try {
                setStatusLoading(true);
                const response = await axiosInstance.get(`/user/${userId}/isMyFriend`);
                if (response.data.message === "Logged in user") {
                    setFriendRequests(response.data.friendRequestList);
                    setStatusLoading(false);
                    console.log("response: ", response.data);

                }
                else {
                    setFriend(response.data.isMyFriend);
                    setSentYouFriendRequest(response.data.friendRequestRecievedStatus);
                    setFriendRequest(response.data.friendRequestSentStatus);
                    setBlock(response.data.isBlocked);
                    setStatusLoading(false);
                    console.log("response: ", response.data);

                }
            } catch (error) {
                console.log("error: ", error)
            }
        }
        isMyFriend();
        // if (friendsList && friendsList.length > 0) {
        //     friendsList.find(e => e.friendId === userId) ? setFriend(true) : setFriend(false);
        // }
        function handleClickOutside(e) {
            if (user && user._id === loggedInUser._id) {
                if (profilePicEditDropDown.current && !profilePicEditDropDown.current.contains(e.target) && !profilePicEditIcon.current.contains(e.target)) {
                    // console.log("fire fromn profile")
                    setEditProfileImage(false);
                }
                // if (!profilePicEditDropDown.current && profilePicEditIcon.current.contains(e.target)) {
                //     setEditProfileImage(true);
                // }
            }


        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            // console.log("Unmouted .....", friendRequests)
        }
    }, [])
    // useEffect(() => {
    //     setFriendRequest(friendRequestStatus)


    // }, [friendRequestStatus])

    async function handleFileChange(e) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            // console.log()
            const file = e.target.files[0];
            if (!file) {
                // setEditProfileImage(prev => !prev);
                throw new Error("Please select a file");
            }
            setEditProfileImage(prev => !prev);
            // console.log("Process started");
            const formData = new FormData();
            formData.append("profilePic", file);
            const response = await axiosInstance.put("/user/updateProfilePic", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            // console.log(`File uploaded successfully!`, response);
            setUser(response.data);
            // setLoggedInUser(response.data);
            // {console.log("loggedInUser froom leftbar: ", loggedInUser)}
            setNotify("CoveProfile photo uploaded");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
        }

        catch (err) {
            setNotify("Something went wrong, Please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
        }
    }


    function clickOnUpload() {
        uploadProfile.current.click();
    }
    async function removeCoverPhoto() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            setEditProfileImage(prev => !prev);
            // const response = await axiosInstance.put("/user/updateUser", {
            //     profilePic: `https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730366785/mgjkolqt7js0knlxnjo2.png`
            // })
            const response = await axiosInstance.put("/user/updateProfilePic", {
                profilePic: `https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730366785/mgjkolqt7js0knlxnjo2.png`
            })
            // console.log(`File uploaded successfully!`, response);
            setUser(response.data);
            // setLoggedInUser(response.data);
            setNotify("Profile photo removed");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
            // console.log("Success")
        } catch (error) {
            console.log(error)
            // console.log("Failed")
        }
    }
    function showImage() {

    }
    function handleEdit() {
        // console.log(editProfile);
        setEditProfile(true);
        setSelected("About");
    }
    function saveEdit() {

        setEditProfile("clicked");
        // setSelected("Posts");
    }
    function tabSelected(buttonName) {
        setSavePost(false);
        if (buttonName !== "About") {
            setEditProfile(false);
        }

        setSelected(buttonName)
    }

    async function sendFriendRequest() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            // console.log("sending ...", userId)
            setFriendRequestLoading(true);
            const response = await axiosInstance.post(`/user/${userId}/sendFriendRequest`, {

            });
            if (response.data.message === `Friend request sent`) {
                setFriendRequest(true);
                setFriendRequestLoading(false);
                setNotify(`Friend request sent to ${user.name.split(" ")[0]}`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
        } catch (error) {
            console.log("error: ", error);
            setFriendRequestLoading(false);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
        }
    }
    // console.log("usder: ", user.name.split(" ")[0]);
    async function cancelFriendRequest() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            setFriendRequestCancelLoading(true);
            const response = await axiosInstance.put(`/user/${userId}/cancelFriendRequest`);
            if (response.data.message === "Friend request cancelled") {
                setFriendRequest(false);
                setFriendRequestCancelLoading(false);
                setFriendRequest(false);
                setNotify("Friend request cancelled");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
        } catch (error) {
            console.log("error: ", error);
            setFriendRequestCancelLoading(false);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
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
                setFriend(true);
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

    async function removeFriend(id) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.delete(`/user/${id}/removeFriend`);
            console.log(response.data.message === "Removed friend")
            if (response.data.message === `Removed friend`) {
                setFriend(false);
                setSentYouFriendRequest(false);
                setNotify(`Removed ${user.name.split(" ")[0]} from your friendlist`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
        } catch (error) {
            console.log("error: ", error);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }


    return (
        <>
            <div className='profileSection '>
                <div className='relative h-[80px] mb-2'>
                    {user && user.profilePic && <div className=' absolute left-[8px] top-[-60px]'>
                        <div className='relative h-[110px] w-[110px] group'>
                            <img src={user.profilePic} onClick={showImage} className=' w-[110px] h-[110px] object-cover rounded-full p-1 bg-white' alt="" />
                            <div className='absolute inset-0 bg-zinc-800 bg-opacity-10 rounded-full transition duration-200 opacity-0 group-hover:opacity-100 cursor-pointer'></div>
                        </div>
                    </div>}
                    {user && loggedInUser._id === user._id &&
                        <>
                            <FontAwesomeIcon ref={profilePicEditIcon} onClick={() => setEditProfileImage(prev => !prev)} className='changeProfilePicCameraIcon' style={{ color: color }} icon={faCamera} />

                            {editProfileImage && <div ref={profilePicEditDropDown} className='editProfilePhotoHiddenButtons rounded-md flex flex-col items-center'>
                                <input ref={uploadProfile} type="file" accept='image/*' name="profilePic" className='hidden' onChange={handleFileChange} />
                                <button className='w-[280px] p-2 rounded-lg text-black' onClick={clickOnUpload} >Upload Profile Photo</button>
                                <button className='w-[280px] p-2 rounded-lg text-black' onClick={removeCoverPhoto} >Remove Profile Photo</button>
                                {/* <button className='w-[280px] p-2 rounded-lg text-black' onClick={colorCoverSet}>Color Cover Photos</button> */}
                            </div>}
                        </>
                    }
                    {user && loggedInUser._id === user._id &&
                        <div className='absolute top-[12px] left-[125px]'>
                            <p className='text-[20px] text-black font-extrabold'>{user && user.name}</p>
                            <p className='text-md text-zinc-800'>{user && user.headline} </p>
                        </div>
                    }
                    {user && loggedInUser._id !== user._id &&
                        <div className='absolute top-[12px] left-[120px]'>
                            <p className='text-[20px] text-black font-extrabold'>{user && user.name.length <= 22 ? user.name : user.name.slice(0, 22) + ".."}</p>
                            <p className='text-md text-zinc-800'>{user && user.headline} </p>
                        </div>
                    }
                    {user && loggedInUser._id === user._id &&
                        <div className='absolute top-4 right-1'>
                            {!editProfile && <button onClick={handleEdit} className='editProfileButtonBesideLogo flex items-center rounded-md transition duration-100 hover:bg-zinc-400'><FontAwesomeIcon className='mr-5' style={{ color: color }} icon={faPen} /><p>Edit Profile</p> </button>}
                            {editProfile && <button onClick={saveEdit} className='saveProfileButtonBesideLogo flex items-center rounded-md transition duration-100 hover:bg-zinc-900'> <p>Save Profile</p> <FontAwesomeIcon className='ml-4 font-bold text-[20px]' style={{ color: color }} icon={faCheck} /> </button>}
                        </div>
                    }
                    {user && loggedInUser._id !== user._id &&
                        <div className='absolute flex items-center top-4 right-1'>
                            {!statusLoading && <>
                                {/* {block && <button onClick={() => unblockUser(user._id, user.name)} className=' bg-zinc-500 text-[15px] font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'>Unblock</button>} */}
                                {/* {!block && <> */}
                                {!friend && <>
                                    {!sentYouFriendRequest && <>
                                        {!friendRequest && <button onClick={sendFriendRequest} className=' bg-[#6A0DAD] text-[15px] font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'> {friendRequestLoading ? "Sending..." : "Add Friend"}</button>}
                                        {friendRequest && <button onClick={cancelFriendRequest} className=' bg-[#6A0DAD] text-[15px] font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'>{friendRequestCancelLoading ? "Cancelling..." : "Cancel Request"}</button>}

                                    </>}
                                    {sentYouFriendRequest && <button onClick={() => acceptFriendRequest(userId)} className=' bg-[#6A0DAD] text-[15px] font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'>Accept Request</button>}

                                </>}
                                {friend && <button onClick={() => removeFriend(userId)} className=' bg-[#6A0DAD] text-[15px] font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'>Your Friend</button>}
                                {/* </>} */}
                            </>}
                            {statusLoading && <button className=' bg-[#6A0DAD] text-[15px] font-bold w-[100px] h-[35px] text-white flex items-center justify-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'><p className='spinOnButton h-[25px] w-[25px]'></p></button>}
                            <button onClick={handleEdit} className='ml-4 text-[15px] font-semibold py-[7px] px-[14px] text-[#6A0DAD] flex items-center bg-zinc-200 rounded-md transition duration-200 hover:bg-zinc-300'>Message</button>
                        </div>
                    }

                </div>
                <div className='buttonsForProfile cursor-grab relative max-w-[550px] overflow-hidden border-t-2 border-zinc-300'>
                    {["Posts", "Photos", "Videos"].map((buttonName, i) => <button key={i} className={`${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => tabSelected(buttonName)}>{buttonName}</button>)}
                    {loggedInUser._id === user._id && <>
                        {["Friends"].map((buttonName, i) => <button key={i} className={`flex relative ${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => setShowFriends(buttonName)}>
                            <p>{buttonName}</p>
                            {friendRequests && friendRequests.length > 0 &&
                                <p className='text-[10px] absolute right-[-5px] top-[-4px] bg-[#6A0DAD] text-white w-[22px] h-[22px] pt-[1px] flex items-center justify-center rounded-full'>
                                    {friendRequests.length > 99 ? "99+" : friendRequests.length}
                                </p>}
                        </button>)}
                    </>}
                    {["About"].map((buttonName, i) => <button key={i} className={`${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => tabSelected(buttonName)}>{buttonName}</button>)}
                    <FontAwesomeIcon icon={faCircleChevronRight} className='absolute right-0 top-[4] text-lg'/>
                    {["Followers", "Following"].map((buttonName, i) => <button key={i} className="text-zinc-500" onClick={() => setTabSelectedForFollow(buttonName)}>{buttonName}</button>)}
                    {/* {["Saved Posts"].map((buttonName, i) => <button key={i} className={`${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => tabSelected(buttonName)}>{buttonName}</button>)} */}
                </div>

            </div>
        </>
    )
}

export default BannerImg;

// : <img src={logo} className='profileLogo w-[120px] h-[120px] rounded-full p-1 bg-white' alt="" />
// onClick={() => setEditProfileImage(prev => !prev)}