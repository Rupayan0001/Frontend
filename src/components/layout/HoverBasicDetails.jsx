import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const HoverBasicDetails = ({ userId, currentUserId }) => {
  const turnDetailsTimer = useRef();
  const [basicUserProfile, setBasicUserProfile] = useState(null);
  const storeId = globalState((state) => state.storeId);
  const setStoreId = globalState((state) => state.setStoreId);
  const setNotify = globalState((state) => state.setNotify);
  const showIdDetails = globalState((state) => state.showIdDetails);
  const setShowIdDetails = globalState((state) => state.setShowIdDetails);
  const enterDialogHover = globalState((state) => state.enterDialogHover);
  const socketHolder = globalState((state) => state.socketHolder);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const [following, setFollowing] = useState(false);
  const [sameUser, setNotSameUser] = useState(false);
  const [followingText, setFollowingText] = useState("Following");
  const notifyTimer = useRef();
  const holdUserId = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      turnOnDetails(userId);
      setStoreId(userId);
    } else {
      turnOffDetails();
    }
    function turnOnDetails(userId) {
      clearTimeout(turnDetailsTimer.current);
      setBasicUserProfile(null);
      showProfileDetails(userId);
    }
    return () => {
      clearTimeout(turnDetailsTimer.current);
    };
  }, [userId]);
  async function showProfileDetails(userId) {
    try {
      const response = await axiosInstance.get(`/user/basicUserProfile/${userId}/${currentUserId}`);
      setBasicUserProfile(response.data.user);
      setFollowing(response.data.isFollowing);
      setNotSameUser(response.data.isSameUser);
    } catch (error) {}
  }

  function turnOffDetails() {
    turnDetailsTimer.current = setTimeout(() => {
      setBasicUserProfile(null);
      setShowIdDetails(null);
      setStoreId(null);
    }, 400);
  }

  function enterIntoDetailes() {
    clearTimeout(turnDetailsTimer.current);
    if (enterDialogHover) {
      clearTimeout(enterDialogHover.current);
    }
  }

  async function followUser(followId) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/user/${followId}/followUser`);
      if (response.data.message === "following") {
        setFollowing(true);
        setNotify(`You are following ${basicUserProfile.name}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "follow",
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
      setNotify("Failed to follow, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  async function unFollowUser(unFollowId) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/user/${unFollowId}/unFollowUser`);
      if (response.data.message === "unfollowed") {
        setFollowing(false);
        setNotify(`You unfollowed ${basicUserProfile.name}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setNotify("Failed to unfollow, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  if (!basicUserProfile) return <></>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => enterIntoDetailes()}
      onMouseLeave={() => turnOffDetails()}
      className="absolute w-[350px] basicProfile z-30 top-16 left-0 bg-white rounded-lg px-4 py-4"
    >
      <div className="relative">
        <div className="flex justify-between items-top ">
          <div className="">
            <Link to={`/userProfile/${storeId}`}>
              <div className="relative w-[70px] h-[70px] cursor-pointer mr-4 group">
                <img src={basicUserProfile.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
              </div>
            </Link>
            <Link to={`/userProfile/${storeId}`}>
              <div className="mt-2 ">
                <div className="flex items-center">
                  <p className="font-bold text-[20px] cursor-pointer text-black hover:underline transition duration-300 ">{basicUserProfile.name}</p>
                  <FontAwesomeIcon icon={faCircleCheck} className="text-blue-700  ml-2 mt-1 text-[22px]" />
                </div>
                <p className="text-[14px] text-zinc-700">{basicUserProfile.username}</p>
              </div>
            </Link>
          </div>
          {!sameUser && (
            <>
              {!following && (
                <button
                  onClick={() => followUser(storeId)}
                  className="absolute top-0 right-0 px-6 py-[7px] ml-0 rounded-lg font-bold  hover:opacity-90 transition duration-200 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white"
                >
                  Follow
                </button>
              )}
              {following && (
                <button
                  onClick={() => unFollowUser(storeId)}
                  onMouseEnter={() => setFollowingText("Unfollow")}
                  onMouseLeave={() => setFollowingText("Following")}
                  className={`absolute top-0 right-0  px-6 py-[7px] ml-0 rounded-lg hover:opacity-90 transition duration-200 font-bold  bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white`}
                >
                  {followingText}
                </button>
              )}
            </>
          )}
        </div>

        <div className="text-black mt-2">{basicUserProfile.headline ? basicUserProfile.headline : ""}</div>
        <div className="flex justify-between items-center mt-2 ">
          <div className="flex items-center">
            <div className="mr-2 text-bold  transition duration-100">
              {basicUserProfile.followerCount} <span className="text-zinc-500">Followers</span>
            </div>
          </div>
          <div className="flex items-center mr-2 ">
            <div className="mr-0 text-bold  transition duration-100">
              {basicUserProfile.followingCount} <span className="text-zinc-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HoverBasicDetails;
