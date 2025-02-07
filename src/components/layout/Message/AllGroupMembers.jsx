import react, { forwardRef, useState, useRef, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import globalState from "../../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import delete_notification from "../../../assets/notification_sound/delete_notification.wav";
import DisplayName from "./DisplayName";

const AllGroupMembers = ({ width, setShowAllGroupMembers, setActiveTabUnder900, removeGroupMember, setRemoveGroupMember }) => {
  const setNotify = globalState((state) => state.setNotify);
  const [loading, setLoading] = useState(true);
  const [groupMembers, setGroupMembers] = useState(null);
  const setActiveGroup = globalState((state) => state.setActiveGroup);
  const setActiveFriend = globalState((state) => state.setActiveFriend);
  const activeGroup = globalState((state) => state.activeGroup);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const socketHolder = globalState((state) => state.socketHolder);
  const OnlineGroupMembersCount = globalState((state) => state.OnlineGroupMembersCount);
  const activeGroup_OnlineMembers = globalState((state) => state.activeGroup_OnlineMembers);
  const notifyTimer = useRef();
  const myGroupDivRef = useRef();
  const deleteSoundRef = useRef();
  useEffect(() => {
    function hanleClickOutside(e) {
      if (myGroupDivRef.current && !myGroupDivRef.current.contains(e.target)) {
        setShowAllGroupMembers(false);
        setRemoveGroupMember(null);
      }
    }
    document.addEventListener("mousedown", hanleClickOutside);
    return () => {
      document.removeEventListener("mousedown", hanleClickOutside);
    };
  }, []);
  useEffect(() => {
    async function getgroupMembers() {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
        socketHolder.send(
          JSON.stringify({
            type: "getOnlineGroupMembers",
            payload: {
              groupId: activeGroup._id,
            },
          })
        );
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/message/getGroupMembers/${activeGroup._id}`);
        if (response.data.success) {
          setGroupMembers(response.data.groupMembers.groupMembersId);
        } else {
          setGroupMembers([]);
          setNotify(response.data.message);
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      } catch (error) {
        console.log(error);
        setGroupMembers([]);
        setNotify("Something went wrong, please try again later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } finally {
        setLoading(false);
      }
    }
    getgroupMembers();
  }, []);
  useEffect(() => {
    console.log("activeGroup_OnlineMembers: ", activeGroup_OnlineMembers);
  }, [activeGroup_OnlineMembers, groupMembers]);
  function addGroup(group) {
    setActiveFriend(null);
    setActiveGroup(group);
  }
  async function handleRemoveGroupMember(id) {
    try {
      const response = await axiosInstance.delete(`/message/deleteGroupMember/${activeGroup._id}/${id}`);
      if (response.data.success) {
        const updated = groupMembers.filter((e) => e._id !== id);
        setGroupMembers(updated);
        setNotify(response.data.message);
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
        socketHolder.send(
          JSON.stringify({
            type: "memberRemove",
            payload: {
              groupId: activeGroup._id,
              removeId: id,
              groupName: activeGroup.groupName,
              groupAdminName: loggedInUser.name,
              groupAvatar: activeGroup.groupAvatar,
            },
          })
        );
      }
    } catch (error) {
      if (error.response.data.message) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      console.log("error:", error);
    }
  }

  return (
    <dialog className="fixed inset-0 h-[100%] w-[100%] z-20 flex justify-center items-center bg-black bg-opacity-60">
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />
      <div ref={myGroupDivRef} className={`relative ${width > 550 ? "h-[550px] w-[400px]" : "h-full w-full"} bg-white rounded-md`}>
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => {
            setShowAllGroupMembers(null);
            setRemoveGroupMember(null);
          }}
          className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          } transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
        />
        <div className="flex justify-center items-center  ">
          <h1 className="border-b-2 border-zinc-300 h-[50px] w-full flex justify-center items-center">
            <DisplayName windowWidth={width} activeEntity={activeGroup} color="#000000" />
          </h1>
        </div>
        <div className={` ${width > 550 ? "h-[500px]" : "h-[90%]"} ${width > 460 ? "px-2" : "px-1"} overflow-y-auto scrollbar-thin `}>
          {!loading &&
            groupMembers &&
            groupMembers.length > 0 &&
            groupMembers.map((e, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (!removeGroupMember && e._id !== loggedInUser._id) {
                      setShowAllGroupMembers(null);
                      setActiveGroup(null);
                      setActiveFriend(e);
                      if (width < 900) setActiveTabUnder900("Messages");
                    }
                  }}
                  className={`relative  ${
                    width > 460 ? " h-[70px]" : " h-[78px]"
                  } mb-1 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-2 w-full flex items-center`}
                >
                  <div className="flex justify-between w-full">
                    <div
                      onClick={() => {
                        if (removeGroupMember && e._id !== loggedInUser._id) {
                          setShowAllGroupMembers(null);
                          setActiveGroup(null);
                          setActiveFriend(e);
                          if (width < 900) setActiveTabUnder900("Messages");
                        }
                      }}
                      className="flex"
                    >
                      <div className="relative w-[45px] h-[45px] cursor-pointer rounded-full group">
                        <img src={e.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                        {activeGroup_OnlineMembers.includes(e._id) && (
                          <div className="absolute bottom-1 right-[-2px] w-[15px] h-[15px] bg-green-500 rounded-full transition duration-200"></div>
                        )}
                        <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center">
                          <p className="font-bold text-[14px] cursor-pointer text-black hover:underline transition duration-300 ">
                            {e.name ? (e.name.length > 19 ? e.name.slice(0, 19) + ".." : e.name) : ""}
                          </p>
                          <FontAwesomeIcon icon={faCircleCheck} className="text-blue-700 ml-2 mt-1 text-[17px]" />
                        </div>
                        <p className="text-[13px] text-zinc-700">{e.username}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    {removeGroupMember && e._id !== loggedInUser._id && (
                      <button
                        onClick={() => handleRemoveGroupMember(e._id)}
                        className="flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-sm hover:opacity-80 text-white w-[80px] h-[35px] rounded-md"
                      >
                        Remove
                        {/* <FontAwesomeIcon icon={faTrashCan} className="mr-2" /> */}
                      </button>
                    )}
                    {e._id === loggedInUser._id && removeGroupMember && (
                      <button className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-sm hover:opacity-80 text-white w-[80px] h-[35px] rounded-md">Admin</button>
                    )}
                    {e._id === loggedInUser._id && !removeGroupMember && (
                      <button className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-sm hover:opacity-80 text-white w-[80px] h-[35px] rounded-md">You</button>
                    )}
                  </div>
                </div>
              );
            })}
          {!loading && groupMembers && groupMembers.length === 0 && <div className="text-center text-zinc-500 h-[380px] flex items-center justify-center">No Groups found</div>}
          {loading && (
            <div className="mt-10 text-zinc-500 w-full flex justify-center">
              <p className="spinOnButton h-[25px] w-[25px]"></p>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};

export default AllGroupMembers;
