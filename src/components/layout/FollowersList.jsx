import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState.js";
import HoverBasicDetails from "./HoverBasicDetails.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import UserListSkeleton from "./UserListSkeleton.jsx";
import { AnimatePresence, motion } from "framer-motion";

const FollowersList = forwardRef(({ userId, tabName, currentUserId, user_name, width }, ref) => {
  const [data, setData] = useState([]);
  const setStoreId = globalState((state) => state.setStoreId);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const showIdDetails = globalState((state) => state.showIdDetails);
  const setShowIdDetails = globalState((state) => state.setShowIdDetails);
  const setEnterDialogHover = globalState((state) => state.setEnterDialogHover);
  const [loading, setLoading] = useState(true);
  const setNotify = globalState((state) => state.setNotify);

  const notifyTimer = useRef();
  const navigate = useNavigate();
  const thisId = useRef();
  const outSideRef = useRef();
  const dialogHoverTimer = useRef();
  thisId.current = tabName === "Followers" ? "followerId" : "followingId";
  useEffect(() => {
    async function getFollowersList() {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/${userId}/${tabName === "Followers" ? "getFollowers" : "getFollowing"}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setNotify("Failed to get followers, please try again later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
    getFollowersList();

    return () => {
      setData([]);
    };
  }, []);

  async function followUser(followId) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/user/${followId}/followUser`);
      if (response.data.message === "following") {
        console.log("response.data.message: ", response.data.message);
        setFollowing(true);
        setNotify(`You are following ${basicUserProfile.name}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      console.log(error);
      setNotify("Something went wrong, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  async function unFollowUser(unFollowId) {
    console.log("UnfollowId: ", unFollowId);
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/user/${unFollowId}/unFollowUser`);
      if (response.data.message === "unfollowed") {
        console.log("response.data.message: ", response.data.message);
        setFollowing(false);
        setNotify(`You unfollowed ${basicUserProfile.name}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      console.log(error);
      setNotify("Something went wrong, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  function idDetails(id) {
    console.log("firing:..........", id);
    if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
    setShowIdDetails(id);
    setStoreId(id);
  }
  function doNullId() {
    if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
    dialogHoverTimer.current = setTimeout(() => {
      setShowIdDetails(null);
    }, 400);
    setEnterDialogHover(dialogHoverTimer);
  }

  return (
    <dialog ref={outSideRef} className="fixed inset-0 w-[100%] h-[100%] bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div ref={ref} className={` relative ${width > 550 ? "h-[570px] w-[440px]" : "h-full w-full"}  bg-white rounded-md`}>
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => setCloseModal(true)}
          className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          }  transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
        />
        <div className="border-b-2 border-zinc-300 h-[50px] font-semibold text-lg w-full flex justify-center items-center">{tabName}</div>
        <div className={`flex h-[380px] mt-2 ${width < 430 ? "px-0" : "px-4"} flex-col ${data.length > 5 ? "overflow-y-scroll" : ""}`}>
          {data &&
            data.length > 0 &&
            data.map((e, i) => {
              let name_of_user = e.followingName ? e.followingName : e.followerName;
              name_of_user.length > 21 ? (name_of_user = name_of_user.slice(0, 21) + "...") : name_of_user;
              // width <= 430 ? name_of_user = name_of_user.slice(0, 12) + "..." : name_of_user
              return (
                <Link to={`/userProfile/${e[thisId.current]}`} key={i}>
                  <div className="relative h-[70px] mt-0 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-2 w-full flex items-center">
                    <div className="flex">
                      <div className="relative w-[50px] h-[50px] cursor-pointer rounded-full group">
                        <img
                          src={e.followingPersonProfilePic ? e.followingPersonProfilePic : e.followerPersonProfilePic}
                          alt="Profile Image"
                          className="w-full h-full object-cover rounded-full"
                        />
                        <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center">
                          <p className="font-bold text-[16px] cursor-pointer text-black hover:underline transition duration-300 ">{name_of_user}</p>
                          <FontAwesomeIcon icon={faCircleCheck} className="text-blue-700 ml-2 mt-1 text-[22px]" />
                        </div>
                        {/* <AnimatePresence>{e[thisId.current] === showIdDetails && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}</AnimatePresence> */}

                        <p className="text-[14px] text-zinc-700">{e.followingUsername ? e.followingUsername : e.followerUsername}</p>
                      </div>
                    </div>
                    {e[thisId.current] === currentUserId && (
                      <div
                        className={`absolute ${
                          width < 430 ? "top-12" : "top-3"
                        }  right-2 px-6 py-1 ml-0 rounded-lg hover:opacity-90 transition duration-200 font-bold  bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white`}
                      >
                        You
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          {!loading && data && data.length === 0 && (
            <div className=" h-[380px] text-zinc-500 w-full flex items-center justify-center">
              {userId === currentUserId && (
                <>
                  {tabName === "Following" && "You are not following anyone"}
                  {tabName === "Followers" && "You do not have any followers yet"}
                </>
              )}
              {userId !== currentUserId && (
                <>
                  {tabName === "Following" && `${user_name.split(" ")[0]} is not following anyone`}
                  {tabName === "Followers" && `${user_name.split(" ")[0]} do not have any followers yet`}
                </>
              )}
            </div>
          )}
          {loading && (
            <div className="h-full flex justify-center items-center">
              <p className="spinOnButton h-[30px] w-[30px]"></p>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
});

export default FollowersList;
