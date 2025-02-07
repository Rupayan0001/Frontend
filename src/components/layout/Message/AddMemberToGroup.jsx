import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../lib/axios";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import globalState from "../../../lib/globalState";
// import { faXmark } from '@fortawesome/free-regular-svg-icons'

const AddMemberToGroup = ({ width, activeGroup, setAddGroupMember }) => {
  const [tempPic, setTempPic] = useState();
  const [groupName, setGroupName] = useState("");
  // const [enterGroupPic, setEnterGroupPic] = useState(false);
  const [groupDescription, setGroupDescription] = useState("");
  const [mainGroupPic, setMainGroupPic] = useState(null);
  const [disable, setDisable] = useState(true);
  //   const [membersAdded, setMembersAdded] = useState(false);
  const [members, setMembers] = useState([]);
  const setNotify = globalState((state) => state.setNotify);
  const setCreateGroup = globalState((state) => state.setCreateGroup);
  const setGroups = globalState((state) => state.setGroups);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const socketHolder = globalState((state) => state.socketHolder);
  const [loading, setLoading] = useState(true);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [friendsList, setFriendsList] = useState([]);
  const [newMembers, setNewMembers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const groupPicInput = useRef();
  const notifyTimer = useRef();
  const createGroupRef = useRef();
  //   const newMembersRef = useRef([]);
  async function handleGroupPicSet(e) {
    const file = e.target.files[0];
    if (file) {
      setMainGroupPic(file);
      setTempPic(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    getFriendsList();
  }, []);
  async function getFriendsList() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setFriendListLoading(true);
      const response = await axiosInstance.get(`/user/getAllFriends`);
      if (response.data.friends) {
        setFriendsList(response.data.friends);
        setFriendListLoading(false);
      } else {
        throw Error;
      }
    } catch (error) {
      setFriendListLoading(false);
      setNotify("Could not get friends list, please try later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  function handleDisable() {
    if (groupName.trim().length >= 1 && mainGroupPic) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }

  useEffect(() => {
    handleDisable();
  }, [groupName, mainGroupPic]);
  // useEffect(() => {
  //   function handleEnterPress(e) {
  //     if (!disable && membersAdded && e.key === "Enter") {
  //       createGroup();
  //     } else if (disable && !membersAdded && e.key === "Enter") {
  //       handleMembersAdded();
  //     }
  //   }
  //   document.addEventListener("keyup", handleEnterPress);
  //   return () => {
  //     document.removeEventListener("keyup", handleEnterPress);
  //   };
  // }, [disable, membersAdded, members]);
  useEffect(() => {
    function hanleClickOutside(e) {
      if (createGroupRef.current && !createGroupRef.current.contains(e.target)) {
        setCreateGroup(false);
      }
    }
    document.addEventListener("mousedown", hanleClickOutside);
    return () => {
      document.removeEventListener("mousedown", hanleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (groupMembers && groupMembers?.length > 0) {
      setMembers((members) => {
        const allMembers = new Set(members);
        groupMembers.forEach((e) => allMembers.add(e));
        return [...allMembers];
      });
    }
  }, [groupMembers]);
  useEffect(() => {
    async function getgroupMembers() {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      try {
        // setLoading(true);
        const response = await axiosInstance.get(`/message/getGroupMembers/${activeGroup._id}`);
        if (response.data.success) {
          setGroupMembers(response.data.groupMembers.groupMembersId.map((e) => e._id));
        } else {
          setGroupMembers([]);
          setNotify(response.data.message);
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      } catch (error) {
        setGroupMembers([]);
        setNotify("Could not get group members data, please add later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } finally {
        // setLoading(false);
      }
    }
    if (activeGroup) {
      getgroupMembers();
    }
  }, [activeGroup]);

  function handleSelect(id) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    // if (members.includes(id)) {
    //   setNotify("Already added");
    //   notifyTimer.current = setTimeout(() => {
    //     setNotify(null);
    //   }, 5 * 1000);
    // }
    if (!newMembers.includes(id) && !members.includes(id)) {
      setNewMembers((members) => [...members, id]);
    } else if (newMembers.includes(id)) {
      setNewMembers((members) => members.filter((e) => e !== id));
    }
  }
  async function handleMembersAdded() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (newMembers.length === 0) {
      return;
      //   setNotify("Select at least 1 friend.");
      //   notifyTimer.current = setTimeout(() => {
      //     setNotify(null);
      //   }, 5 * 1000);
      //   return;
    }
    try {
      const response = await axiosInstance.put(`message/addGroupMember/${activeGroup._id}`, { newMembers });
      if (response.data.success) {
        setAddGroupMember(null);
        setNotify("Members added successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "groupMemberAdd",
              payload: {
                userId: loggedInUser._id,
                members: newMembers,
                groupAdminName: loggedInUser.name,
                profilePic: loggedInUser.profilePic,
                groupName: activeGroup.groupName,
                groupId: activeGroup._id,
              },
            })
          );
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (error.response.data.message) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
  }

  // if (friendListLoading) {
  // return (

  // );
  // }
  return (
    <dialog className="fixed inset-0 w-[100%] h-[100%] bg-black bg-opacity-70 z-10 flex justify-center items-center">
      <div ref={createGroupRef} className={`relative ${width > 550 ? " h-[540px] w-[400px]" : "h-full w-full"} relative bg-slate-900 p-2 rounded-lg`}>
        <FontAwesomeIcon
          onClick={() => {
            setCreateGroup(false);
            setAddGroupMember(false);
          }}
          icon={width > 550 ? faXmark : faArrowLeft}
          className={`w-[25px] h-[25px] p-2 absolute ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          }  hover:bg-slate-600 text-white font-bold transition duration-300 rounded-full cursor-pointer`}
        />

        <div className="h-full w-full flex flex-col items-center">
          <h1 className="border-b-2 border-slate-500 w-full pb-4 text-center mb-4 text-white text-[20px]">Add Members</h1>
          <div className="w-[100%] relative h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">
            {!friendListLoading &&
              friendsList &&
              friendsList.length > 0 &&
              friendsList.map((e, i) => {
                const existingMember = members.includes(e.friendId._id);
                const newMember = newMembers.includes(e.friendId._id);
                return (
                  <div
                    key={i}
                    onClick={() => {
                      handleSelect(e.friendId._id);
                    }}
                    className={`flex relative items-center w-full text-white h-[80px] cursor-pointer hover:bg-slate-600 rounded-lg px-4 transition duration-200 mt-2`}
                  >
                    <img src={e.friendId.profilePic} className="w-[50px] h-[50px] shadow-sm shadow-zinc-300 rounded-full" alt="" />
                    <div className="ml-4 w-full">
                      <div className="flex justify-between items-center">
                        {<h1 className="text-white text-[14px] font-bold">{e.friendId.name.length > 26 ? e.friendId.name.slice(0, 26) + "..." : e.friendId.name}</h1>}
                        {!existingMember && !newMember && (
                          <FontAwesomeIcon className={`w-[25px] h-[25px] hover:bg-slate-600 transition duration-300 cursor-pointer`} icon={faSquare} />
                        )}
                        {(existingMember || newMember) && (
                          <FontAwesomeIcon
                            className={`w-[25px] h-[25px] ${existingMember && "text-slate-500"} ${
                              newMember && "text-white"
                            } hover:bg-slate-600 transition duration-300 cursor-pointer`}
                            icon={faSquareCheck}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            {!friendListLoading && friendsList && friendsList.length === 0 && (
              <div className="h-[70%] flex items-center justify-center">
                <p className="text-white">No friend found</p>
              </div>
            )}
            {friendListLoading && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                <p className="spinOnButton h-[30px] w-[30px]"></p>
              </div>
            )}
          </div>
          <div className="w-full flex justify-end items-center">
            <button
              onClick={handleMembersAdded}
              className={`h-[35px] w-[100px] mb-2 rounded-md ${
                newMembers.length > 0 ? "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600" : "bg-gradient-to-b from-blue-600 to-blue-500"
              } hover:opacity-80 flex justify-center items-center text-white text-[15px] font-bold`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AddMemberToGroup;
