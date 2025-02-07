import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../../lib/axios";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import globalState from "../../../lib/globalState";
// import { faXmark } from '@fortawesome/free-regular-svg-icons'

const CreateGroup = ({ width }) => {
  const [tempPic, setTempPic] = useState();
  const [groupName, setGroupName] = useState("");
  // const [enterGroupPic, setEnterGroupPic] = useState(false);
  const [groupDescription, setGroupDescription] = useState("");
  const [mainGroupPic, setMainGroupPic] = useState(null);
  const [disable, setDisable] = useState(true);
  const [membersAdded, setMembersAdded] = useState(false);
  const [members, setMembers] = useState([]);
  const setNotify = globalState((state) => state.setNotify);
  const setCreateGroup = globalState((state) => state.setCreateGroup);
  const setGroups = globalState((state) => state.setGroups);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const socketHolder = globalState((state) => state.socketHolder);
  const [loading, setLoading] = useState(false);
  const [friendListLoading, setFriendListLoading] = useState(false);
  const [friendsList, setFriendsList] = useState([]);

  const groupPicInput = useRef();
  const notifyTimer = useRef();
  const createGroupRef = useRef();
  const groupNameRef = useRef();
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
  // useEffect(() => {
  //   function hanleClickOutside(e) {
  //     if (createGroupRef.current && !createGroupRef.current.contains(e.target)) {
  //       setCreateGroup(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", hanleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", hanleClickOutside);
  //   };
  // }, []);
  async function createGroup() {
    if (groupName === "" || !mainGroupPic) return;
    if (disable) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("groupDescription", groupDescription);
    formData.append("groupPic", mainGroupPic);
    members.push(loggedInUser._id);
    formData.append("groupMembers", JSON.stringify(members));
    try {
      const response = await axiosInstance.post(`message/createGroup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setLoading(false);
        setCreateGroup(false);
        setNotify("Group created successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "groupCreated",
              payload: {
                userId: loggedInUser._id,
                members: members,
                id: response.data.group._id,
                groupAdminName: loggedInUser.name,
                profilePic: loggedInUser.profilePic,
                groupName: groupName,
              },
            })
          );
        }
      }
    } catch (error) {
      setNotify("Failed to create group, try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  function handleSelect(id) {
    if (members.includes(id)) {
      setMembers(members.filter((e) => e !== id));
    } else {
      setMembers([...members, id]);
    }
  }
  function handleMembersAdded() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (members.length < 2) {
      setNotify("Please select at least 2 members to create a group.");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    setMembersAdded(true);
  }

  return (
    <dialog className="fixed inset-0 w-[100%] h-[100%] bg-black bg-opacity-70 z-10 flex justify-center items-center">
      <div ref={createGroupRef} className={`relative ${width > 550 ? " h-[540px] w-[400px]" : "h-full w-full"} relative bg-slate-900 p-2 rounded-lg`}>
        <FontAwesomeIcon
          onClick={() => setCreateGroup(false)}
          icon={width > 550 ? faXmark : faArrowLeft}
          className={`w-[25px] h-[25px] p-2 absolute ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          }  hover:bg-slate-600 text-white font-bold transition duration-300 rounded-full cursor-pointer`}
        />
        {!membersAdded && (
          <div className="h-full w-full flex flex-col items-center">
            <h1 className="border-b-2 border-slate-500 w-full pb-4 text-center mb-4 text-white text-[20px]">Add Members</h1>
            <div className="w-[100%] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">
              {!friendListLoading &&
                friendsList &&
                friendsList.length > 0 &&
                friendsList.map((e, i) => {
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
                          {!members.includes(e.friendId._id) && (
                            <FontAwesomeIcon className={`w-[25px] h-[25px] hover:bg-slate-600 transition duration-300 cursor-pointer`} icon={faSquare} />
                          )}
                          {members.includes(e.friendId._id) && (
                            <FontAwesomeIcon className={`w-[25px] h-[25px] hover:bg-slate-600 transition duration-300 cursor-pointer`} icon={faSquareCheck} />
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
                <div className="h-screen flex justify-center items-center">
                  <p className="spinOnButton h-[30px] w-[30px]"></p>
                </div>
              )}
            </div>
            <div className="w-full flex justify-end items-center">
              <button
                onClick={handleMembersAdded}
                className="h-[35px] w-[100px] mb-2 rounded-md bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover:opacity-80 flex justify-center items-center text-white text-[15px] font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {membersAdded && (
          <div className="h-full w-full flex flex-col items-center">
            <h1 className="border-b-2 border-slate-500 w-full pb-4 mb-4 h-[50px] flex justify-center items-center text-white text-[20px]">Create Group</h1>
            {/* <img src={ } className='' /> */}
            <div className="w-[80%] mt-6">
              <div className="mb-2 flex justify-center items-center">
                <input
                  type="file"
                  ref={groupPicInput}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleGroupPicSet(e);
                  }}
                />
                {!tempPic && (
                  <div className="relative">
                    <img
                      onClick={() => groupPicInput.current.click()}
                      src={`https://res.cloudinary.com/dkuxqgbvt/image/upload/v1730366785/mgjkolqt7js0knlxnjo2.png`}
                      alt=""
                      className="w-[100px] h-[100px] rounded-full"
                    />
                    <FontAwesomeIcon
                      onClick={() => groupPicInput.current.click()}
                      className={`changeProfilePicCameraIcon w-[20px] h-[20px] absolute bottom-1 right-[-8px] bg-zinc-200 hover:bg-zinc-300 transition duration-300 p-2 rounded-full flex justify-center items-center bg-zinc-100 absolute`}
                      icon={faCamera}
                    />
                  </div>
                )}
                {tempPic && (
                  <div className="relative">
                    <img onClick={() => groupPicInput.current.click()} src={tempPic} alt="" className="w-[100px] h-[100px] rounded-full" />
                    <FontAwesomeIcon
                      onClick={() => groupPicInput.current.click()}
                      className={`changeProfilePicCameraIcon w-[20px] h-[20px] absolute bottom-1 right-[-8px] bg-zinc-200 hover:bg-zinc-300 transition duration-300 p-2 rounded-full flex justify-center items-center bg-zinc-100 absolute`}
                      icon={faCamera}
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                  type="text"
                  ref={groupNameRef}
                  maxLength={30}
                  className="w-full h-[40px] outline-slate-400 rounded-lg p-2 pr-[80px] mt-4 bg-slate-800 text-white"
                  placeholder="Group Name"
                />
                <p className="absolute right-2 bottom-2 text-white">{groupNameRef.current?.value.length || 0}/30</p>
              </div>
              <textarea
                value={groupDescription}
                onChange={(e) => {
                  setGroupDescription(e.target.value);
                }}
                type="text"
                className="w-full h-[100px] outline-slate-400 rounded-lg p-2 mt-4 bg-slate-800 text-white resize-none"
                placeholder="Group Description"
              />

              <button
                onClick={createGroup}
                className={`h-[40px] w-full mt-2 rounded-md ${
                  disable ? "bg-slate-800" : "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 hover:opacity-80"
                }   flex justify-center items-center text-white text-[15px] font-bold`}
              >
                {loading ? <p className="spinOnButton h-[25px] w-[25px]"></p> : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default CreateGroup;
