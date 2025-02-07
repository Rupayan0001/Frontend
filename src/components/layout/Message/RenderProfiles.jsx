import globalState from "../../../lib/globalState.js";
import { lastMessageTimeLogic } from "../../../lib/MessageTime.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import {
  faArrowDown,
  faArrowLeft,
  faBan,
  faCheck,
  faCheckDouble,
  faEllipsisVertical,
  faFilePdf,
  faHeadphones,
  faImage,
  faLocationArrow,
  faLocationDot,
  faMicrophone,
  faPaperPlane,
  faPause,
  faPhone,
  faPhotoFilm,
  faPlay,
  faPlus,
  faSearch,
  faSquareArrowUpRight,
  faTrash,
  faTrashCan,
  faUserXmark,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const RenderMessage = ({ message, isGroup, friendId, windowWidth, loggedInUser }) => {
  let statusIcon = null;
  if (message) {
    if (message.senderId === loggedInUser._id && !isGroup && message.status === "sent") {
      statusIcon = <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2" />;
    } else if (message.senderId === loggedInUser._id && !isGroup && message.status === "delivered") {
      statusIcon = <FontAwesomeIcon icon={faCheckDouble} className="mt-1 mr-2" />;
    } else if (message.senderId === loggedInUser._id && isGroup) {
      statusIcon = <FontAwesomeIcon icon={faCheckDouble} className="mt-1 mr-2" />;
    } else if (message.senderId === message.friendId?._id || (isGroup && message.senderId !== loggedInUser._id)) {
      statusIcon = <FontAwesomeIcon icon={faLocationArrow} className="rotate-180 mt-1 mr-2" />;
    }
  }
  const content = message.content;
  let displayContent = null;

  if (windowWidth < 400) {
    displayContent = content?.length > 18 ? content.slice(0, 18) + "..." : content;
  } else if (windowWidth >= 400 && windowWidth <= 450) {
    displayContent = content?.length > 24 ? content.slice(0, 24) + "..." : content;
  } else if (windowWidth > 450 && windowWidth <= 500) {
    displayContent = content?.length > 28 ? content.slice(0, 28) + "..." : content;
  } else if (windowWidth > 500 && windowWidth <= 600) {
    displayContent = content?.length > 36 ? content.slice(0, 36) + "..." : content;
  } else if (windowWidth > 600 && windowWidth <= 700) {
    displayContent = content?.length > 42 ? content.slice(0, 42) + "..." : content;
  } else if (windowWidth > 700 && windowWidth < 900) {
    displayContent = content?.length > 62 ? content.slice(0, 62) + "..." : content;
  } else if (windowWidth >= 900 && windowWidth < 1024) {
    displayContent = content?.length > 18 ? content.slice(0, 18) + "..." : content;
  } else if (windowWidth >= 1024 && windowWidth <= 1280) {
    displayContent = content?.length > 22 ? content.slice(0, 22) + "..." : content;
  } else if (windowWidth > 1280) {
    displayContent = content?.length > 28 ? content.slice(0, 28) + "..." : content;
  }

  return (
    <div className="max-w-[80%] flex items-center overflow-hidden">
      <p>{statusIcon}</p>
      {message?.content?.length > 0 && <p>{displayContent}</p>}
      {message?.content?.length === 0 && (
        <>
          {message?.imageUrl?.length > 0 && (
            <p>
              {" "}
              Image file <FontAwesomeIcon className="ml-2 text-[14px]" icon={faImage} />{" "}
            </p>
          )}
          {message?.videoUrl?.length > 0 && (
            <p>
              {" "}
              Video file <FontAwesomeIcon className="ml-2 text-[14px]" icon={faVideo} />{" "}
            </p>
          )}
          {message?.audioUrl?.length > 0 && (
            <p>
              {" "}
              Audio file <FontAwesomeIcon className="ml-2 text-[14px]" icon={faHeadphones} />{" "}
            </p>
          )}
          {message?.documentFiles?.length > 0 && (
            <p>
              {" "}
              Document file <FontAwesomeIcon className="ml-2 text-[14px]" icon={faFilePdf} />{" "}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const RenderItem = ({
  e,
  i,
  loggedInUser,
  search,
  unreadMessagesCountForEach,
  setActiveTabUnder900,
  setActiveFriend,
  onlineUsers,
  OnlineGroupMembersCount,
  isTyping,
  setActiveGroup,
  activeFriend,
  activeGroup,
  windowWidth,
  isGroup = false,
}) => {
  const lastMessage = globalState((state) => state.lastMessage);
  const setLastMessage = globalState((state) => state.setLastMessage);
  const setFriendsList = globalState((state) => state.setFriendsList);
  const [profilePicLoaded, setProfilePicLoaded] = useState(false);

  let typingUser = null;
  let liveGroupMemberscount = null;
  if (isGroup) {
    typingUser = isTyping.find((a) => a.groupId === e.groupId._id && a.senderId !== loggedInUser._id && a.groupId);
    liveGroupMemberscount = OnlineGroupMembersCount.find((a) => a.groupId === e.groupId._id)?.count;
  } else if (!isGroup) {
    typingUser = isTyping.find((a) => a.senderId === e.friendId?._id && a.receiverId === loggedInUser._id && !a.groupId);
  }
  const unreadCount = unreadMessagesCountForEach?.find((a) => a.senderId === e.friendId?._id || a.groupId === e.groupId?._id)?.count;
  let name = null;
  if (isGroup) {
    name = e.groupId?.groupName;
  }
  if (!isGroup && e.friends?.length > 0) {
    name = e.friends[0] === loggedInUser.name ? e.friends[1] : e.friends[0];
  } else if (e.friendName) {
    name = e.friendName;
  }

  let displayName = null;

  if (windowWidth < 400) {
    displayName = name?.length > 16 ? name.slice(0, 16) + "..." : name;
  } else if (windowWidth >= 400 && windowWidth < 900) {
    displayName = name?.length > 28 ? name.slice(0, 28) + "..." : name;
  } else if (windowWidth >= 900 && windowWidth < 1024) {
    displayName = name?.length > 20 ? name.slice(0, 20) + "..." : name;
  } else if (windowWidth >= 1024 && windowWidth < 1280) {
    displayName = name?.length > 26 ? name.slice(0, 26) + "..." : name;
  } else if (windowWidth >= 1280) {
    displayName = name?.length > 28 ? name.slice(0, 28) + "..." : name;
  }
  function addToPrevList() {
    const found = lastMessage.find((a) => a.friendId?._id === e.friendId?._id);
    if (found) {
      setFriendsList([]);
      return;
    }
    lastMessage.push(e);
    setLastMessage(lastMessage);
    setFriendsList([]);
  }

  return (
    <div
      key={i}
      onClick={() => {
        if (search) {
          addToPrevList();
        }
        isGroup ? setActiveGroup(e.groupId) : setActiveFriend(e.friendId);
        isGroup ? setActiveFriend(null) : setActiveGroup(null);
        windowWidth < 900 && setActiveTabUnder900("Messages");
      }}
      className={`flex relative items-center w-full text-white h-[80px] ${
        (activeFriend && activeFriend?._id === e.friendId?._id) || (activeGroup && activeGroup?._id === e.groupId?._id) ? "bg-slate-600" : ""
      } cursor-pointer hover:bg-slate-600 rounded-lg px-4 transition duration-200 mt-2`}
    >
      {/*  */}
      {/* {profilePicLoaded && ( */}
      <img
        src={isGroup ? e.groupId?.groupAvatar : e.friendId?.profilePic}
        onLoad={() => setProfilePicLoaded(true)}
        className={`w-[50px] h-[50px] ${profilePicLoaded ? "block" : "hidden"} object-cover shadow-sm shadow-zinc-300 rounded-full`}
        alt=""
      />
      {/* )} */}
      {!profilePicLoaded && <p className="w-[65px] h-[50px] bg-zinc-200 animateFriendStatus rounded-full" alt="" />}
      <div className="ml-4 w-full">
        <div className="flex items-center">
          <h1 className="text-white text-[15px] font-bold">{displayName}</h1>
          {onlineUsers.find((a) => a.userId === e.friendId?._id) && <p className="h-[8px] w-[8px] rounded-full bg-green-400 mt-[1px] mr-2 ml-3" />}
          {liveGroupMemberscount > 0 && (
            <>
              <p className="h-[8px] w-[8px] rounded-full bg-green-400 mt-[1px] mr-1 ml-3" />
              {/* <span className="text-[12px] font-bold  text-green-400">{liveGroupMemberscount}</span> */}
            </>
          )}
        </div>

        {typingUser ? (
          <div className="max-w-[60%] flex items-center overflow-x-hidden">
            <p className="font-bold text-green-400">{isGroup && typingUser.groupId && typingUser.senderName.split(" ")[0]} Typing...</p>
          </div>
        ) : (
          <RenderMessage message={e} isGroup={isGroup} friendId={e.friendId} windowWidth={windowWidth} loggedInUser={loggedInUser} />
        )}
      </div>

      <div className={`absolute ${windowWidth <= 1024 && "right-2"} ${windowWidth > 1024 && "right-2"} bottom-1`}>
        <div className="flex flex-col items-center">
          <p className="text-[11px] mb-1 font-bold text-slate-400">{lastMessageTimeLogic(e?.createdAt)}</p>
          {unreadCount > 0 && (
            <p className="text-white bg-gradient-to-r from-slate-600 to-slate-800 text-[13px] font-bold rounded-full flex justify-center items-center w-[25px] h-[25px] ml-2">
              {unreadCount}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenderItem;
