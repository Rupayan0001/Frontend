import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState.js";
import HoverBasicDetails from "./HoverBasicDetails.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck, faTimes, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import UserListSkeleton from "./UserListSkeleton.jsx";
import ProfileCard from "./ProfileCard.jsx";
import { AnimatePresence } from "framer-motion";

const FriendsList = forwardRef(({ currentUserId, width }, ref) => {
  // const setSelectedTab = globalState((state) => state.setSelected);
  const [friendsList, setFriendsList] = useState([]);
  // const [showIdDetails, setShowIdDetails] = useState(null);
  const showIdDetails = globalState((state) => state.showIdDetails);
  const setShowIdDetails = globalState((state) => state.setShowIdDetails);
  const setStoreId = globalState((state) => state.setStoreId);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const [loading, setLoading] = useState(true);
  const [acceptText, setAcceptText] = useState("Accept");
  const [rejectText, setRejectText] = useState("Reject");
  const [friendSearchLoading, setFriendSearchLoading] = useState(false);
  const friendRequests = globalState((state) => state.friendRequests);
  const setFriendRequests = globalState((state) => state.setFriendRequests);
  const [selectedTab, setSelectedTab] = useState("Friends");
  // const setFriendRequests = globalState((state) => state.setFriendRequests);
  const setNotify = globalState((state) => state.setNotify);
  const setEnterDialogHover = globalState((state) => state.setEnterDialogHover);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const socketHolder = globalState((state) => state.socketHolder);
  const onlineFriends = globalState((state) => state.onlineFriends);
  const setOnlineFriends = globalState((state) => state.setOnlineFriends);
  const [noFriend, setNoFriend] = useState(false);
  const [usersListsSet, setUsersListsSet] = useState(null);
  const notifyTimer = useRef();
  const navigate = useNavigate();
  const dialogHoverTimer = useRef();
  const outSideRef = useRef();
  const myFriendsListRef = useRef();
  const friendSearchInputRef = useRef();

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
          myFriendsListRef.current = response.data.friends;
          const ids = response.data.friends.map((e) => e.friendId._id);
          if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
            socketHolder.send(
              JSON.stringify({
                type: "getAllOnlineFriends",
                payload: {
                  ids,
                },
              })
            );
          }
          setLoading(false);
        } else {
          throw Error;
        }
      } catch (error) {
        setNotify("Could not get friends list, please try later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }

    async function friendRequests() {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/${loggedInUser._id}/isMyFriend`);
        if (response.data.message === "Logged in user") {
          setFriendRequests(response.data.friendRequestList);
          setLoading(false);
          const ids = response.data.friendRequestList.map((e) => e.friendId._id);
          if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
            socketHolder.send(
              JSON.stringify({
                type: "getAllOnlineFriends",
                payload: {
                  ids,
                },
              })
            );
          }
        }
      } catch (error) {
        setLoading(false);
      }
    }
    if (selectedTab === "Friends") {
      getFriendsList();
      friendRequests();
    }
    if (selectedTab === "Friend Requests") {
      friendRequests();
    }
    return () => {
      console.log("set to null");
      setUsersListsSet(null);
      setOnlineFriends([]);
      setFriendsList([]);
      setFriendRequests([]);
    };
  }, [selectedTab]);

  useEffect(() => {
    console.log("onlineFriends: ", onlineFriends);
    if (onlineFriends) {
      const onlineLists = new Set(onlineFriends);
      setUsersListsSet(onlineLists);
    }
  }, [onlineFriends]);

  useEffect(() => {
    return () => {
      setShowFriends(null);
    };
  }, []);

  async function rejectFriendRequest(friendId) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.delete(`/user/${friendId}/rejectFriendRequest`);
      if (response.data.message === "Friend request rejected") {
        const deletedRequest_updatedList = friendRequests.filter((e, i) => e.friendId._id !== friendId);
        setFriendRequests(deletedRequest_updatedList);
        setNotify("Friend request rejected");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      if (response.data.message === "friend request rejected") {
        throw Error;
      }
    } catch (error) {
      setNotify("Failed to reject friend request, please try again later");
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
        const acceptedRequest_updatedList = friendRequests.filter((e, i) => e.friendId._id !== friendId);
        setFriendRequests(acceptedRequest_updatedList);
        setNotify("Friend request accepted");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "friendRequestAccepted",
              payload: {
                recipientId: friendId,
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
  async function handleFriendSearch(e) {
    const searchValue = e.target.value.trim();
    if (searchValue === "") {
      setFriendsList(myFriendsListRef.current);
      setNoFriend(false);
      return;
    }
    try {
      setFriendSearchLoading(true);
      const response = await axiosInstance.get(`/user/searchFriends/${searchValue}`);
      setFriendSearchLoading(false);
      if (response.data.length >= 1) {
        setNoFriend(false);
        setFriendsList(response.data);
      }
      if (response.data.length === 0) {
        setNoFriend(true);
      }
    } catch (error) {
      setFriendSearchLoading(false);
      setFriendsList([]);
      setNoFriend(true);
    }
  }
  function goBackToFriends() {
    setFriendsList(myFriendsListRef.current);
    friendSearchInputRef.current.value = "";
    setNoFriend(false);
  }
  return (
    <dialog className="fixed inset-0 w-[100%] h-[100%] bg-black bg-opacity-60 z-20 flex justify-center items-center">
      <div ref={ref} className={` relative ${width > 550 ? "h-[570px] w-[440px]" : "h-[100%] w-[100%]"}  bg-white rounded-md`}>
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => setShowFriends(false)}
          className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          }  transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
        />
        <div className={`border-b-2 border-zinc-300 font-semibold w-full flex justify-center h-[50px] text-lg items-center `}>Friends</div>
        <div className=" h-[50px] w-full flex mt-[3px] relative justify-between items-center">
          <p
            className={` flex justify-center ${width > 550 ? "h-[50px] text-lg items-center w-[220px]" : " h-[50px] text-md items-center w-[50%]"} ${
              selectedTab === "Friends" ? "border-b-[4px] font-semibold  border-blue-700 text-blue-700" : "text-zinc-700 border-b-[4px] border-white"
            }  hover:bg-zinc-200 transition duration-200 cursor-pointer `}
            onClick={() => setSelectedTab("Friends")}
          >
            Friends
          </p>
          <p
            className={` flex justify-center ${width > 550 ? "h-[50px] text-lg items-center w-[220px]" : " h-[50px] text-md items-center w-[50%]"} ${
              selectedTab === "Friend Requests" ? "border-b-[4px] font-semibold  border-blue-700 text-blue-700" : "text-zinc-700 border-b-[4px] border-white"
            }  hover:bg-zinc-200 transition duration-200 cursor-pointer `}
            onClick={() => setSelectedTab("Friend Requests")}
          >
            Friend Requests
          </p>
          {friendRequests && (
            <p
              className={`text-[10px] absolute ${
                width > 550 ? "right-[14px] top-[4px]" : "right-[2px] top-[2px]"
              }  bg-blue-700 text-white w-[22px] font-bold h-[22px] pt-[1px] flex items-center justify-center rounded-full`}
            >
              {friendRequests.length > 99 ? "99+" : friendRequests.length}
            </p>
          )}
        </div>
        {selectedTab === "Friend Requests" && (
          <>
            {!loading && friendRequests && friendRequests.length > 0 && (
              <div className={`flex h-[380px] mt-0 px-2 flex-col overflow-y-auto`}>
                {friendRequests.map((e, i) => {
                  const status = usersListsSet.has(e.friendId._id);
                  return (
                    <div key={i} className="relative h-[105px] mt-2 cursor-pointer rounded-md transition duration-200 ml-0 py-2 w-full flex flex-col items-center">
                      <div onClick={() => navigate(`/userProfile/${e.friendId._id}`)} className="flex w-full px-2">
                        <div className="relative w-[60px] h-[60px] cursor-pointer rounded-full group">
                          <img src={e.friendId.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                          {status && <div className="absolute bottom-1 right-[0px] w-[15px] h-[15px] bg-green-500 rounded-full transition duration-200"></div>}
                          <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                        </div>
                        <div className="ml-2">
                          <div className="flex items-center">
                            <p className="font-bold text-[17px] cursor-pointer text-black hover:underline transition duration-300 ">{e.friendId.name ? e.friendId.name : ""}</p>
                            <FontAwesomeIcon icon={faCircleCheck} className="text-blue-700 ml-2 mt-1 text-[22px]" />
                          </div>
                          <p className="text-[14px] text-zinc-700">{e.friendId.username ? e.friendId.username : ""}</p>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-0">
                        <button
                          className="px-5 py-[4px] hover:opacity-90 bg-gradient-to-r from-zinc-700 via-slate-700 to-slate-700 font-bold transition duration-200 text-white rounded-md"
                          onClick={() => rejectFriendRequest(e.friendId._id)}
                        >
                          {rejectText}
                        </button>
                        <button
                          className="px-5 py-[4px] hover:opacity-90 bg-gradient-to-r from-blue-800 via-blue-700 font-bold to-blue-600 transition duration-200 ml-6 mr-2 text-white rounded-md"
                          onClick={() => acceptFriendRequest(e.friendId._id)}
                        >
                          {acceptText}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!loading && friendRequests && friendRequests.length === 0 && (
              <div className=" h-[380px] text-zinc-500 w-full flex items-center justify-center">You don't have any friend requests</div>
            )}
            {loading && (
              <div className="h-screen flex justify-center items-center">
                <p className="spinOnButton h-[30px] w-[30px]"></p>
              </div>
            )}
          </>
        )}
        {selectedTab === "Friends" && (
          <>
            {!loading && (
              <div className={`flex h-[380px] mt-2 px-2 flex-col overflow-y-auto`}>
                <div className="relative w-full flex justify-between items-center">
                  {width > 550 && (
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      onClick={goBackToFriends}
                      className={` w-[20px] h-[20px] p-2 hover:bg-zinc-200 text-black transition duration-300 rounded-full top-2  cursor-pointer`}
                    />
                  )}
                  <input
                    type="text"
                    ref={friendSearchInputRef}
                    onChange={handleFriendSearch}
                    placeholder="Search friends"
                    className="w-full h-[40px] border-2 outline-blue-600 border-zinc-300 rounded-lg px-2"
                  />
                  {width <= 550 && (
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      onClick={goBackToFriends}
                      className={` w-[25px] h-[25px] ml-2 hover:bg-zinc-200 text-zinc-800 transition duration-300 rounded-full  cursor-pointer`}
                    />
                  )}
                </div>
                {noFriend && <div className=" h-[380px] text-zinc-500 w-full flex items-center justify-center">No friend found</div>}
                {!noFriend &&
                  friendsList &&
                  friendsList.length > 0 &&
                  friendsList.map((e, i) => {
                    const status = usersListsSet.has(e.friendId._id);
                    console.log("status: ", status);
                    return (
                      <div key={i} className="relative">
                        <Link to={`/userProfile/${e.friendId._id}`}>
                          <ProfileCard profilePic={e.friendId.profilePic} id={e.friendId._id} status={status} name={e.friendId.name} username={e.friendId.username} width={width} />
                        </Link>
                      </div>
                    );
                  })}
                {/* {friendsList && friendsList.length === 0 && <div className=' h-[380px] text-zinc-500 w-full flex items-center justify-center'>
                                You don't have any friends yet
                            </div>} */}
              </div>
            )}
            {loading && (
              <div className="h-full flex justify-center items-center">
                <p className="spinOnButton h-[30px] w-[30px]"></p>
              </div>
            )}
          </>
        )}
      </div>
    </dialog>
  );
});

export default FriendsList;

{
  /* <div className={`relative ${width > 550 ? "h-[70px] mt-4" : "h-[70px] mt-3"}  pt-1 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-0 w-full flex flex-col items-center`}>
                                        <div className='flex w-full px-2'>
                                            <img src={e.friendId && e.friendId.profilePic} alt="Profile Image" onMouseEnter={() => idDetails(e.friendId._id)} onMouseLeave={doNullId} className={`${width > 550 ? "w-[60px] h-[60px]" : "w-[50px] h-[50px]"} cursor-pointer object-cover rounded-full`} />
                                            <div className='ml-2'>
                                                <div className='flex items-center'>
                                                    <p className={`font-bold ${width > 550 ? "text-[17px]" : "text-[15px]"} cursor-pointer text-black hover:underline transition duration-300 `} onMouseEnter={() => idDetails(e.friendId._id)} onMouseLeave={doNullId}>{e.friendId.name ? e.friendId.name : ""}</p>
                                                    <FontAwesomeIcon icon={faCircleCheck} className={`text-blue-700 ml-2 mt-1 ${width > 550 ? "text-[22px]" : "text-[19px]"} `} />
                                                </div>
                                                {e.friendId._id === showIdDetails && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}
                                                <p className={`${width > 550 ? "text-[14px]" : "text-[14px]"} text-zinc-700`}>{e.friendId.username ? e.friendId.username : ""}</p>
                                            </div>
                                        </div>
                                    </div> */
}
