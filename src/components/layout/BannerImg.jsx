import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import globalState from "../../lib/globalState.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCamera, faCheck, faCircleChevronRight, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Purple from "./../../assets/683850.jpg";
import Green from "./../../assets/abstract-green-background-eri47g77a5kldngq.jpg";
import Sky from "./../../assets/professional-photo-background-zb0abc8ysodf81ui.jpg";
import colorDesign from "./../../assets/powerpoint-blue-background-b13vvyd1123j2htd.jpg";
import Blue from "./../../assets/wp8422340.jpg";
import defaultProfilePic from "../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import post_uploaded from "../../assets/notification_sound/post_uploaded.mp3";
import defaultBannerPic from "../../assets/wp2249197.jpg";
import { axiosInstance } from "../../lib/axios";
import colorsArr from "../../lib/ColorsArr.js";
import { AnimatePresence, motion } from "framer-motion";

const BannerImg = ({ loggedInUser, width }) => {
  const uploadCover = useRef();
  const colorDropDown = useRef();
  const coverEditDropDown = useRef();
  const showCoverEditRef = useRef();
  const [showCoverEdit, setShowCoverEdit] = useState(false);
  const [colorBg, SetColorBg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [colorLoading, setColorLoading] = useState(0);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const setShowBannerPicFull = globalState((state) => state.setShowBannerPicFull);
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const notifyTimer = useRef();
  const postUploadedSoundRef = useRef();

  function getUser() {
    if (user) {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUser();
  }, [user]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (user && user._id === loggedInUser._id) {
        if (colorDropDown.current && !colorDropDown.current.contains(e.target)) {
          SetColorBg(false);
        }
        if (coverEditDropDown.current && !coverEditDropDown.current.contains(e.target) && !showCoverEditRef.current.contains(e.target)) {
          setShowCoverEdit(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  function clickOnUpload() {
    uploadCover.current.click();
    setShowCoverEdit(false);
  }

  async function removeCoverPhoto() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put("/user/updateUser", {
        bannerPic: `https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730410078/o1en5o821vhu5crfbeqv.jpg`,
      });
      setShowCoverEdit(false);
      setUser(response.data);
      setNotify("Cover photo removed");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } catch (error) {
      setNotify("Failed to remove cover photo, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  function colorCoverSet() {
    SetColorBg((prev) => !prev);
    setShowCoverEdit(false);
    setColorLoading(1);
  }

  async function uploadColorCover(e) {
    setLoading(true);
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put("/user/updateUser", {
        bannerPic: colorsArr[e],
      });
      SetColorBg((prev) => !prev);
      setUser(response.data);
      if (postUploadedSoundRef.current) {
        postUploadedSoundRef.current.play();
      }
      setNotify("Cover photo uploaded successfully");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } catch (error) {
      setNotify("Failed to upload cover photo, Please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        const formData = new FormData();
        formData.append("bannerPic", file);
        const response = await axiosInstance.put("/user/updateUserBannerpic", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setUser(response.data);
        setLoading(false);
        if (postUploadedSoundRef.current) {
          postUploadedSoundRef.current.play();
        }
        setNotify("Cover photo uploaded successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (err) {
      setNotify("Failed to upload, Please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  return (
    <div className="bannerImg inter">
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      {(!user || loading) && (
        <div
          className={` flex justify-center items-center ${width >= 1280 && "w-[550px] mt-1 "} ${width >= 550 && width < 1280 && " w-[520px] mt-1"} ${
            width < 550 && " w-[100vw] mt-1"
          } h-[200px] rounded-lg overflow-hidden`}
          alt=""
        >
          <div className="spinButton h-[30px] w-[30px]"></div>
        </div>
      )}
      {user && !loading && (
        <img
          src={user.bannerPic}
          onClick={() => setShowBannerPicFull(user.bannerPic)}
          className={`profileBanner ${width >= 1280 && "w-[550px] mt-1 "} ${width >= 550 && width < 1280 && " w-[520px] mt-1"} ${
            width < 550 && " w-[100vw] mt-1"
          } h-[200px] cursor-pointer rounded-lg overflow-hidden`}
          alt=""
        />
      )}
      {user && !loading && loggedInUser._id === user._id && (
        <div className="relative">
          <button className="editCoverPhoto absolute bottom-6 right-2" onClick={() => setShowCoverEdit((prev) => !prev)} ref={showCoverEditRef}>
            <FontAwesomeIcon className="changeCoverPicCameraIcon" icon={faCamera} />
            <p className="ml-3">Edit Cover Photo</p>
          </button>
          <input ref={uploadCover} type="file" accept="image/*" name="bannerPic" className="hidden" onChange={handleFileChange} />
          <AnimatePresence>
            {showCoverEdit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                ref={coverEditDropDown}
                className="editCoverPhotoHiddenButtons absolute top-[-6px] right-2 rounded-md flex flex-col items-center"
              >
                <button className="w-[300px] p-2 rounded-lg text-black" onClick={clickOnUpload}>
                  Upload Cover Photo
                </button>
                <button className="w-[300px] p-2 rounded-lg text-black" onClick={removeCoverPhoto}>
                  Remove Cover Photo
                </button>
                <button className="w-[300px] p-2 rounded-lg text-black" onClick={colorCoverSet}>
                  Color Cover Photos
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {colorBg && (
            <div ref={colorDropDown} className="colorPicker absolute right-2">
              <img
                className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`}
                onClick={() => uploadColorCover("Purple")}
                src={Purple}
                alt=""
              />
              <img
                className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`}
                onClick={() => uploadColorCover("Green")}
                src={Green}
                alt=""
              />
              <img
                className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`}
                onClick={() => uploadColorCover("Sky")}
                src={Sky}
                alt=""
              />
              <img
                className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`}
                onClick={() => uploadColorCover("Blue")}
                src={Blue}
                alt=""
              />
              <img
                className={`transition duration-400 opacity-${colorLoading} ml-2 h-[55px] w-[55px] rounded-full cursor-pointer`}
                onClick={() => uploadColorCover("colorDesign")}
                src={colorDesign}
                alt=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ProfileImg = ({ color, loggedInUser, width }) => {
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  // const [friendText, setFriendText] = useState("");
  const selected = globalState((state) => state.selected);
  const setSelected = globalState((state) => state.setSelected);
  const editProfile = globalState((state) => state.editProfile);
  const setEditProfile = globalState((state) => state.setEditProfile);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const tabSelectedForFollow = globalState((state) => state.tabSelectedForFollow);
  const setTabSelectedForFollow = globalState((state) => state.setTabSelectedForFollow);
  const setConfirmRemoveFriend = globalState((state) => state.setConfirmRemoveFriend);
  const confirmRemoveFriend = globalState((state) => state.confirmRemoveFriend);
  const friendsList = globalState((state) => state.friendsList);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const [editProfileImage, setEditProfileImage] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [friend, setFriend] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [friendRequest, setFriendRequest] = useState("");
  const [sentYouFriendRequest, setSentYouFriendRequest] = useState(false);
  const [rightScrolled, setRightScrolled] = useState(false);
  // const [block, setBlock] = useState(false);

  const [friendRequestLoading, setFriendRequestLoading] = useState(false);
  const [friendRequestCancelLoading, setFriendRequestCancelLoading] = useState(false);

  const block = globalState((state) => state.block);
  const setBlock = globalState((state) => state.setBlock);
  const setSavePost = globalState((state) => state.setSavePost);

  const friendRequests = globalState((state) => state.friendRequests);
  const setFriendRequests = globalState((state) => state.setFriendRequests);
  const showFriends = globalState((state) => state.showFriends);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const setShowProfilePicFull = globalState((state) => state.setShowProfilePicFull);
  const socketHolder = globalState((state) => state.socketHolder);
  const wSFriendRequest = globalState((state) => state.wSFriendRequest);
  const setWSFriendRequest = globalState((state) => state.setWSFriendRequest);

  const notifyTimer = useRef();
  const profilePicEditDropDown = useRef();
  const uploadProfile = useRef();
  const profilePicEditIcon = useRef();
  const postUploadedSoundRef = useRef();
  const buttonContainerRef = useRef(null);
  const { userId } = useParams();

  useEffect(() => {
    async function isMyFriend() {
      try {
        setStatusLoading(true);
        const response = await axiosInstance.get(`/user/${userId}/isMyFriend`);
        if (response.data.message === "Logged in user") {
          setFriendRequests(response.data.friendRequestList);
          setStatusLoading(false);
        } else {
          setFriend(response.data.isMyFriend);
          setSentYouFriendRequest(response.data.friendRequestRecievedStatus);
          setFriendRequest(response.data.friendRequestSentStatus);
          setBlock(response.data.isBlocked);
          setStatusLoading(false);
        }
      } catch (error) {
        setStatusLoading(false);
      }
    }
    isMyFriend();

    return () => {
      setEditProfile(false);
      setWSFriendRequest(null);
    };
  }, [confirmRemoveFriend, block, wSFriendRequest]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (user && user._id === loggedInUser._id) {
        if (profilePicEditDropDown.current && !profilePicEditDropDown.current.contains(e.target) && !profilePicEditIcon.current.contains(e.target)) {
          setEditProfileImage(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleFileChange(e) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const file = e.target.files[0];
      if (!file) {
        throw new Error("Please select a file");
      }
      setPicLoading(true);
      const formData = new FormData();
      formData.append("profilePic", file);
      const response = await axiosInstance.put("/user/updateProfilePic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data);
      setPicLoading(false);
      if (postUploadedSoundRef.current) {
        postUploadedSoundRef.current.play();
      }
      setNotify("Profile photo uploaded");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } catch (err) {
      setPicLoading(false);
      setNotify("Failed to upload profile photo, Please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  function clickOnUpload() {
    uploadProfile.current.click();
    setEditProfileImage(false);
  }
  async function removeCoverPhoto() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setEditProfileImage(false);
      const response = await axiosInstance.put("/user/updateProfilePic", {
        profilePic: `https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730366785/mgjkolqt7js0knlxnjo2.png`,
      });
      setUser(response.data);
      setNotify("Profile photo removed");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } catch (error) {
      setNotify("Failed to remove Profile photo, try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  function handleEdit() {
    setEditProfile(true);
    setSelected("About");
  }
  function saveEdit() {
    setEditProfile("clicked");
  }
  function tabSelected(buttonName) {
    setSavePost(false);
    if (buttonName !== "About") {
      setEditProfile(false);
    }
    setSelected(buttonName);
  }

  async function sendFriendRequest() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setFriendRequestLoading(true);
      const response = await axiosInstance.post(`/user/${userId}/sendFriendRequest`, {});
      if (response.data.message === `Friend request sent`) {
        if (postUploadedSoundRef.current) {
          postUploadedSoundRef.current.play();
        }
        setFriendRequest(true);
        setFriendRequestLoading(false);
        setNotify(`Friend request sent to ${user.name.split(" ")[0]}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "newfriendRequest",
              payload: {
                recipientId: userId,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                senderProfilePic: loggedInUser.profilePic,
              },
            })
          );
        }
      }
    } catch (error) {
      setFriendRequestLoading(false);
      setNotify("Failed to sent friend request, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
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
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "cancelfriendRequest",
              payload: {
                recipientId: userId,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                senderProfilePic: loggedInUser.profilePic,
              },
            })
          );
        }
      }
    } catch (error) {
      setFriendRequestCancelLoading(false);
      setNotify("Failed to cancel friend request, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
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
        if (postUploadedSoundRef.current) {
          postUploadedSoundRef.current.play();
        }
        setFriend(true);
        setNotify("Friend request accepted");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "friendRequestAccepted",
              payload: {
                recipientId: userId,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                senderProfilePic: loggedInUser.profilePic,
              },
            })
          );
        }
      } else {
        throw Error;
      }
    } catch (error) {
      setNotify("Failed to accept friend request, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  return (
    <>
      <div className={`profileSection inter ${width >= 1280 && "w-[550px] "} ${width >= 550 && width < 1280 && " w-[520px]"} ${width < 550 && " w-[100vw]"}`}>
        <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
        <div className={`relative ${user && loggedInUser._id === user._id ? "h-[65px]" : user && user.headline.length > 0 ? "h-[100px]" : "h-[70px]"}  mb-1`}>
          {user && user.profilePic && (
            <div className={` absolute  ${width > 500 ? "left-[8px] top-[-60px]" : "left-[0px] top-[-40px]"}`}>
              <div
                onClick={() => {
                  setShowProfilePicFull(user.profilePic);
                }}
                className={`relative ${width <= 500 ? "w-[80px] h-[80px]" : "w-[110px] h-[110px]"} group`}
              >
                {picLoading && (
                  <div className={`${width <= 500 ? "w-[80px] h-[80px]" : "w-[110px] h-[110px]"} flex justify-center items-center rounded-full p-1 bg-white`}>
                    <p className="spinButton h-[30px] w-[30px]"></p>
                  </div>
                )}
                {!picLoading && (
                  <img src={user.profilePic} className={`${width <= 500 ? "w-[80px] h-[80px]" : "w-[110px] h-[110px]"} object-cover rounded-full p-1 bg-white`} alt="" />
                )}
                <div className="absolute inset-0 bg-zinc-800 bg-opacity-10 rounded-full transition duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"></div>
              </div>
            </div>
          )}
          {user && loggedInUser._id === user._id && (
            <>
              <FontAwesomeIcon
                ref={profilePicEditIcon}
                onClick={() => setEditProfileImage((prev) => !prev)}
                className={`changeProfilePicCameraIcon bg-zinc-100 absolute ${
                  width > 500 ? "left-[83px] top-[8px] text-[20px] p-[8px] " : "left-[58px] top-[9px] text-[16px] p-[6px] "
                }`}
                style={{ color: color }}
                icon={faCamera}
              />

              <input ref={uploadProfile} type="file" accept="image/*" name="profilePic" className="hidden" onChange={handleFileChange} />
              <AnimatePresence>
                {editProfileImage && (
                  <motion.div
                    ref={profilePicEditDropDown}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`editProfilePhotoHiddenButtons absolute ${width > 500 ? "left-[110px] top-[45px]" : "left-[20px] top-[50px]"} rounded-md flex flex-col items-center`}
                  >
                    <button className="w-[280px] p-2 rounded-lg text-black" onClick={clickOnUpload}>
                      Upload Profile Photo
                    </button>
                    <button className="w-[280px] p-2 rounded-lg text-black" onClick={removeCoverPhoto}>
                      Remove Profile Photo
                    </button>
                    {/* <button className='w-[280px] p-2 rounded-lg text-black' onClick={colorCoverSet}>Color Cover Photos</button> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
          {user && loggedInUser._id === user._id && (
            <div className={`absolute ${width > 500 ? "left-[125px] top-[12px]" : "left-[90px] top-[12px]"}`}>
              {width < 400 && <p className={` text-[17px] text-black font-extrabold`}>{user && user.name.length <= 21 ? user.name : user.name.slice(0, 21) + ".."}</p>}
              {width >= 400 && width < 600 && (
                <p className={`${width > 500 ? "text-[20px]" : "text-[17px]"} text-black font-extrabold`}>
                  {user && user.name.length <= 24 ? user.name : user.name.slice(0, 24) + ".."}
                </p>
              )}
              {width >= 600 && <p className={` text-[19px] text-black font-extrabold`}>{user && user.name.length <= 25 ? user.name : user.name.slice(0, 25) + ".."}</p>}
              <p className={`${width > 500 ? "text-[17px]" : "text-[14px]"} text-zinc-800`}>
                {user && user.headline.length > 26 ? user.headline.slice(0, 26) + ".." : user.headline}{" "}
              </p>
            </div>
          )}
          {user && loggedInUser._id !== user._id && (
            <div className={`absolute ${width > 500 ? "left-[120px] top-[12px]" : "left-[90px] top-[8px]"}`}>
              <p className={`${width > 500 ? "text-[20px]" : "text-[17px]"} text-black font-extrabold`}>
                {user && user.name.length <= 26 ? user.name : user.name.slice(0, 26) + ".."}
              </p>
              <p className={`${width > 500 ? "text-[17px]" : "text-[15px]"} text-zinc-800`}>{user && user.headline} </p>
            </div>
          )}
          {user && loggedInUser._id === user._id && (
            <div className="absolute top-4 right-1">
              {!editProfile && (
                <button
                  onClick={handleEdit}
                  className="editProfileButtonBesideLogo  text-[15px] px-[8px] py-[8px] bg-zinc-200 text-black flex items-center rounded-md transition duration-100 hover:bg-zinc-300"
                >
                  <FontAwesomeIcon className={`${width > 500 && "mr-5"}`} style={{ color: color }} icon={faPen} />
                  {width > 500 && <p>Edit Profile</p>}{" "}
                </button>
              )}
              {editProfile && (
                <button
                  onClick={saveEdit}
                  className="saveProfileButtonBesideLogo text-[15px] px-[8px] py-[8px] bg-zinc-200 text-black flex items-center rounded-md transition duration-100 hover:bg-zinc-300"
                >
                  {width > 500 && <p>Save Profile</p>}
                  {width <= 500 && <FontAwesomeIcon className="font-bold text-[20px]" style={{ color: color }} icon={faCheck} />}
                </button>
              )}
            </div>
          )}
          {user && loggedInUser._id !== user._id && (
            <div className="absolute flex items-center bottom-0 right-2">
              {!statusLoading && (
                <>
                  {/* {block && <button onClick={() => unblockUser(user._id, user.name)} className=' bg-zinc-500 text-[15px] font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]'>Unblock</button>} */}
                  {/* {!block && <> */}
                  {!friend && (
                    <>
                      {!sentYouFriendRequest && (
                        <>
                          {!friendRequest && (
                            <button
                              onClick={sendFriendRequest}
                              className={` bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 ${
                                width > 500 ? "text-[14px]" : "text-[12px]"
                              }  font-bold py-[7px] px-[15px] text-white flex items-center rounded-md  hover:opacity-90 transition duration-200 `}
                            >
                              {" "}
                              {friendRequestLoading ? "Sending..." : "Add Friend"}
                            </button>
                          )}
                          {friendRequest && (
                            <button
                              onClick={cancelFriendRequest}
                              className={` bg-gradient-to-r from-blue-900 via-blue-700 to-blue-700 ${
                                width > 500 ? "text-[14px]" : "text-[12px]"
                              } font-bold py-[7px] px-[15px] text-white flex items-center rounded-md hover:opacity-90 transition duration-200 `}
                            >
                              {friendRequestCancelLoading ? "Cancelling..." : "Cancel Request"}
                            </button>
                          )}
                        </>
                      )}
                      {sentYouFriendRequest && (
                        <button
                          onClick={() => acceptFriendRequest(userId)}
                          className={`  bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 ${
                            width > 500 ? "text-[14px]" : "text-[12px]"
                          } font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:opacity-90`}
                        >
                          Accept Request
                        </button>
                      )}
                    </>
                  )}
                  {friend && (
                    <button
                      onClick={() => setConfirmRemoveFriend({ userId, name: user.name.split(" ")[0] })}
                      // onMouseEnter={() => setFriendText("Remove Friend")}
                      // onMouseLeave={() => setFriendText("Your Friend")}
                      className={`hover:opacity-90 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 ${
                        width > 500 ? "text-[14px]" : "text-[12px]"
                      } font-bold py-[7px] px-[15px] text-white flex items-center rounded-md transition duration-200 hover:bg-[#6A0DAD]`}
                    >
                      Your Friend
                    </button>
                  )}
                  {/* </>} */}
                </>
              )}
              {statusLoading && (
                <button
                  className={` hover:opacity-90 animateFriendStatus bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 ${
                    width > 500 ? "text-[14px]" : "text-[12px]"
                  } font-bold w-[100px] h-[36px] text-white flex items-center justify-center rounded-md transition duration-200 `}
                >
                  <p className="spinButton h-[20px] w-[20px]"></p>
                </button>
              )}
              {friend && (
                <Link to={`/message/${user._id}`}>
                  <button
                    className={`ml-4 ${
                      width > 500 ? "text-[15px]" : "text-[13px]"
                    } font-semibold py-[7px] px-[14px] bg-zinc-100 flex items-center  rounded-md transition duration-200 hover:bg-zinc-200`}
                  >
                    <p className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 bg-clip-text text-transparent">Message</p>
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
        <div ref={buttonContainerRef} className={`buttonsForProfile flex items-center max-w-[100%] overflow-x-scroll scrollbar-none  px-2 cursor-grab `}>
          {["Posts"].map((buttonName, i) => (
            <button key={i} className={` ${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => tabSelected(buttonName)}>
              {buttonName}
            </button>
          ))}
          {loggedInUser._id === user._id && (
            <>
              {["Friends"].map((buttonName, i) => (
                <button
                  key={i}
                  className={`flex relative ${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`}
                  onClick={() => setShowFriends(buttonName)}
                >
                  <p>{buttonName}</p>
                  {friendRequests && friendRequests.length > 0 && (
                    <p className="text-[10px] font-bold absolute right-[-5px] top-[-4px] bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[22px] h-[22px] pt-[1px] flex items-center justify-center rounded-full">
                      {friendRequests.length > 99 ? "99+" : friendRequests.length}
                    </p>
                  )}
                </button>
              ))}
            </>
          )}
          {["Followers", "Following"].map((buttonName, i) => (
            <button key={i} className="text-zinc-500" onClick={() => setTabSelectedForFollow(buttonName)}>
              {buttonName}
            </button>
          ))}
          {["About"].map((buttonName, i) => (
            <button key={i} className={`${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => tabSelected(buttonName)}>
              {buttonName}
            </button>
          ))}
          {["Photos", "Videos"].map((buttonName, i) => (
            <button key={i} onClick={() => tabSelected(buttonName)} className={`${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`}>
              {buttonName}
            </button>
          ))}
          {/* {["Saved Posts"].map((buttonName, i) => <button key={i} className={`${selected === buttonName ? "text-[#6A0DAD] border-b-[3px] border-[#6A0DAD]" : "text-zinc-500"}`} onClick={() => tabSelected(buttonName)}>{buttonName}</button>)} */}
        </div>
      </div>
    </>
  );
};

export default BannerImg;
