import react, { forwardRef, useState, useRef, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import globalState from "../../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";

const MyGroups = ({ currentUserId, width, setActiveTabUnder900 }) => {
  const setNotify = globalState((state) => state.setNotify);
  const [loading, setLoading] = useState(true);
  const [myGroups, setMyGroups] = useState(null);
  const setShowMyGroups = globalState((state) => state.setShowMyGroups);
  const lastMessage = globalState((state) => state.lastMessage);
  const setLastMessage = globalState((state) => state.setLastMessage);
  const setActiveGroup = globalState((state) => state.setActiveGroup);
  const setActiveFriend = globalState((state) => state.setActiveFriend);
  const notifyTimer = useRef();
  const myGroupDivRef = useRef();
  useEffect(() => {
    function hanleClickOutside(e) {
      if (myGroupDivRef.current && !myGroupDivRef.current.contains(e.target)) {
        setShowMyGroups(false);
      }
    }
    document.addEventListener("mousedown", hanleClickOutside);
    return () => {
      document.removeEventListener("mousedown", hanleClickOutside);
    };
  }, []);
  useEffect(() => {
    async function getMyGroups() {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/message/getGroups`);
        if (response.data.success) {
          console.log("response.data.groups: ", response.data.groups.groupIds);
          setMyGroups(response.data.groups.groupIds);
        } else {
          setMyGroups([]);
          setNotify(response.data.message);
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      } catch (error) {
        console.log(error);
        setMyGroups([]);
        setNotify("Something went wrong, please try again later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } finally {
        setLoading(false);
      }
    }
    getMyGroups();
  }, []);
  function addGroup(group) {
    setActiveFriend(null);
    setActiveGroup(group);
  }

  return (
    <dialog className="fixed inset-0 h-[100%] w-[100%] z-50 flex justify-center items-center bg-black bg-opacity-60">
      <div ref={myGroupDivRef} className={`relative ${width > 550 ? "h-[550px] w-[400px]" : "h-full w-full"} bg-white rounded-md`}>
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => setShowMyGroups(null)}
          className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          } transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
        />
        <div className="flex justify-center items-center  ">
          <h1 className="border-b-2 border-zinc-300 h-[50px] text-lg w-full flex justify-center items-center">My Groups</h1>
        </div>
        <div className={` ${width > 550 ? "h-[500px]" : "h-[90%]"} ${width > 460 ? "px-2" : "px-1"} overflow-y-auto scrollbar-thin `}>
          {!loading &&
            myGroups &&
            myGroups.length > 0 &&
            myGroups.map((e, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    addGroup(e);
                    setShowMyGroups(null);
                    if (width < 900) setActiveTabUnder900("Messages");
                  }}
                  className={`relative  ${
                    width > 460 ? " h-[70px]" : " h-[86px]"
                  } mb-1 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-2 w-full flex items-center`}
                >
                  <div className="flex justify-between w-full">
                    <div className="flex">
                      <div className="relative w-[50px] h-[50px] cursor-pointer rounded-full group">
                        <img src={e.groupAvatar} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                        <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center">
                          <p className="font-bold text-[16px] cursor-pointer text-black hover:underline transition duration-300 ">
                            {e.groupName ? (e.groupName.length > 19 ? e.groupName.slice(0, 19) + ".." : e.groupName) : ""}
                          </p>
                          <FontAwesomeIcon icon={faCircleCheck} className="text-blue-700 ml-2 mt-1 text-[22px]" />
                        </div>
                        <p className="text-[14px] text-zinc-700">{e.totalGroupMemberCount} members</p>
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    <button className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-sm hover:opacity-80 text-white px-2 py-1 rounded-md">Message</button>
                  </div> */}
                </div>
              );
            })}
          {!loading && myGroups && myGroups.length === 0 && <div className="text-center text-zinc-500 h-[380px] flex items-center justify-center">No Groups found</div>}
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

export default MyGroups;
