import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/MessagePage.css";
import ReactPlayer from "react-player";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePrev from "../hooks/usePrev";
import {
  faArrowDown,
  faArrowLeft,
  faBan,
  faCheck,
  faCheckDouble,
  faCircleXmark,
  faEllipsisVertical,
  faFileLines,
  faFilePdf,
  faHeadphones,
  faLocationArrow,
  faLocationDot,
  faMicrophone,
  faMinus,
  faPaperPlane,
  faPause,
  faPhone,
  faPhotoFilm,
  faPlay,
  faPlus,
  faSearch,
  faSquareArrowUpRight,
  faStopCircle,
  faTrash,
  faTrashCan,
  faUserGroup,
  faUserMinus,
  faUserPlus,
  faUsersLine,
  faUserXmark,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Topbar from "../components/layout/Topbar";
import SearchBox from "../components/layout/SearchBox.jsx";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown.jsx";
import { faFile, faImage, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import DefaultProfilePic from "../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import group_created from "../../src/assets/notification_sound/post_uploaded.mp3";
import chatBg from "../assets/Desktop.png";
import { AnimatePresence, motion } from "framer-motion";
import Incoming_message_notification from "../assets/notification_sound/Incoming_message_notification.wav";
import outgoing_message_notification from "../assets/notification_sound/outgoing_message_notification.wav";
import delete_notification from "../assets/notification_sound/delete_notification.wav";
import { lastSeenTimeLogic, messageDateGroupLogic, lastMessageTimeLogic } from "../lib/MessageTime.js";
import Confirmation from "../components/layout/Confirmation.jsx";
import Logout from "../components/layout/Logout.jsx";
import Notify from "../components/layout/Notify.jsx";
import CreateGroup from "../components/layout/Message/CreateGroup.jsx";
import MessageComponent from "../components/layout/Message/MessageComponent.jsx";
import renderItem from "../components/layout/Message/RenderProfiles.jsx";
import RenderItem from "../components/layout/Message/RenderProfiles.jsx";
import FriendsList from "../components/layout/FriendsList.jsx";
import Notification from "../components/layout/Notification.jsx";
import MyGroups from "../components/layout/Message/MyGroups.jsx";
import AllGroupMembers from "../components/layout/Message/AllGroupMembers.jsx";
import DisplayName from "../components/layout/Message/DisplayName.jsx";
import BlockList from "../components/layout/BlockList.jsx";
import AddMemberToGroup from "../components/layout/Message/AddMemberToGroup.jsx";
import VideoPlayer from "../components/layout/VideoPlayer.jsx";
import VoiceRecorder from "../components/layout/Message/VoiceRecorder.jsx";

const MessagePage = () => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setTotalUnreadMessages = globalState((state) => state.setTotalUnreadMessages);
  const totalUnreadMessages = globalState((state) => state.totalUnreadMessages);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const changeWidth = globalState((state) => state.changeWidth);
  const setNotify = globalState((state) => state.setNotify);
  const notify = globalState((state) => state.notify);
  const selected = globalState((state) => state.selected);
  const setSelected = globalState((state) => state.setSelected);
  const logOut = globalState((state) => state.logOut);
  const setLogOut = globalState((state) => state.setLogOut);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const deleteAllMessagesConfirmation = globalState((state) => state.deleteAllMessagesConfirmation);
  const setDeleteAllMessagesConfirmation = globalState((state) => state.setDeleteAllMessagesConfirmation);
  const confirmRemoveFriend = globalState((state) => state.confirmRemoveFriend);
  const setConfirmRemoveFriend = globalState((state) => state.setConfirmRemoveFriend);
  const profileBlock = globalState((state) => state.profileBlock);
  const setProfileBlock = globalState((state) => state.setProfileBlock);
  const setCreateGroup = globalState((state) => state.setCreateGroup);
  const createGroup = globalState((state) => state.createGroup);
  const groups = globalState((state) => state.groups);
  const setGroups = globalState((state) => state.setGroups);
  const increaseTotalUnreadMessages = globalState((state) => state.increaseTotalUnreadMessages);
  const showImage = globalState((state) => state.showImage);
  const setShowImage = globalState((state) => state.setShowImage);
  const lastMessage = globalState((state) => state.lastMessage);
  const setLastMessage = globalState((state) => state.setLastMessage);
  // const isTyping = globalState((state) => state.isTyping);
  // const setIsTyping = globalState((state) => state.setIsTyping);
  const activeGroup = globalState((state) => state.activeGroup);
  const setActiveGroup = globalState((state) => state.setActiveGroup);
  const showFriends = globalState((state) => state.showFriends);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const friendsList = globalState((state) => state.friendsList);
  const setFriendsList = globalState((state) => state.setFriendsList);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  const showMyGroups = globalState((state) => state.showMyGroups);
  const setShowMyGroups = globalState((state) => state.setShowMyGroups);
  const activeFriend = globalState((state) => state.activeFriend);
  const setActiveFriend = globalState((state) => state.setActiveFriend);
  const setConfirmLeaveGroup = globalState((state) => state.setConfirmLeaveGroup);
  const confirmLeaveGroup = globalState((state) => state.confirmLeaveGroup);
  const openBlockList = globalState((state) => state.openBlockList);
  const OnlineGroupMembersCount = globalState((state) => state.OnlineGroupMembersCount);
  const addTolOnlineGroupMembersCount = globalState((state) => state.addTolOnlineGroupMembersCount);
  const newGroupAsActive = globalState((state) => state.newGroupAsActive);
  const setNewGroupAsActive = globalState((state) => state.setNewGroupAsActive);
  const setActiveGroup_OnlineMembers = globalState((state) => state.setActiveGroup_OnlineMembers);
  const setOnlineFriends = globalState((state) => state.setOnlineFriends);
  const voiceRecord = globalState((state) => state.voiceRecord);
  const setIsLoggedOut = globalState((state) => state.setIsLoggedOut);
  const [loading, setLoading] = useState(true);
  const [openSearch, setOpenSearch] = useState(false);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("Messages");
  // const [activeFriend, setActiveFriend] = useState(null);
  const [takeToBottom, setTakeToBottom] = useState(false);
  const [iAmYourActiveFriend, setIAmYourActiveFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [noFriendMessage, setNoFriendMessage] = useState("Start a conversation");

  // const [friendsList, setFriendsList] = useState([]);
  const [isTyping, setIsTyping] = useState([]);
  const [deleteGroup, setDeleteGroup] = useState(null);
  const [uploadFiles, setUploadFiles] = useState(false);
  const [uploadingMediaIds, setUploadingMediaIds] = useState([]);
  const [audioRecording, setAudioRecording] = useState(null);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const [editMessage, setEditMessage] = useState(false);
  const [removeGroupMember, setRemoveGroupMember] = useState(null);
  // const [activeGroup, setActiveGroup] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTabUnder900, setActiveTabUnder900] = useState("Friends");
  const [activeFriendMessagesLoading, setActiveFriendMessagesLoading] = useState(false);
  const [friendFindNotActive, setFriendFindNotActive] = useState(false);
  const [messageInputActive, setMessageInputActive] = useState(false);
  // const [showImage, setShowImage] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [calling, setCalling] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [localVideo, setLocalVideo] = useState(null);
  // const [peerConnectionHold, setPeerConnectionHold] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const [friendStream, setFriendStream] = useState(null);
  const [chatBottom, setChatBotom] = useState(false);
  const [unreadMessagesCountForEach, setUnreadMessagesCountForEach] = useState([]);
  const [openMenuDropDown, setOpenMenuDropdown] = useState(false);
  const [friendSearchLoading, setFriendSearchLoading] = useState(false);
  const [showAllGroupMembers, setShowAllGroupMembers] = useState(false);
  const [addGroupMember, setAddGroupMember] = useState(null);

  // const [showMyGroups, setShowMyGroups] = useState(false);

  // const [createGroup, setCreateGroup] = useState(false)

  const navigate = useNavigate();
  const { friendId } = useParams();

  const prevActive = usePrev(activeFriend ? "Friend" : activeGroup ? "Group" : null);
  const messageBarSearchRef = useRef();
  const friendsFindInputRef = useRef();
  const messageInputRef = useRef();
  const inputMessage = useRef();
  const socketRef = useRef();
  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const inputTimer = useRef();
  const messageBoxRef = useRef();
  const chatBoxRef = useRef();
  const fileInput = useRef();
  const photosInput = useRef();
  const videosInput = useRef();
  const audioInput = useRef();
  const uploadContainers = useRef();
  const addMediaRef = useRef();
  const modalImageRef = useRef();
  const rememberMyFriendList = useRef();
  const profileEditModalRef = useRef();
  const profileEditIconRef = useRef();
  const myCallMedia = useRef();
  const myVideoRef = useRef();
  const friendVideoRef = useRef();
  const peerConnectionHold = useRef();
  const messagesRef = useRef();
  const pageLoading = useRef();
  const openMenuDropDownRef = useRef();
  const openMenuDropDownDotsRef = useRef();
  const oldActiveId = useRef();
  const incomingMessageSoundRef = useRef();
  const outgoingMessageSoundRef = useRef();
  const deleteSoundRef = useRef();
  const friendListsRef = useRef();
  const lastMessageRef = useRef();
  const groupCreatedSoundRef = useRef();
  const blockListsRef = useRef();

  // const friendStream = useRef();

  // Getting logged in user and setting active to null on unmount
  useEffect(() => {
    setLoading(true);
    setSelected("Messages");
    fetchTotalUnreadMessages();
    getLoggedInUser();
    unreadMessagesCountForEachFunc();

    async function getLoggedInUser() {
      if (pageLoading.current) {
        clearTimeout(pageLoading.current);
      }
      const response = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(response.data.user);
    }
    return () => {
      setMessages([]);
      setNotifyClicked(null);
      if (socketRef.current && loggedInUser) {
        socketRef.current.send(
          JSON.stringify({
            type: "myActiveFriend",
            payload: {
              senderId: loggedInUser._id.toString(),
              receiverId: null,
              type: prevActive,
            },
          })
        );
      }
    };
  }, []);

  // Resize handler
  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  async function getSpecificGroup(groupId) {
    try {
      const response = await axiosInstance.get(`/message/getSpecificGroup/${groupId}`);
      if (response.data.success) {
        setNewGroupAsActive(null);
        setActiveGroup(response.data.group);
        if (windowWidth <= 900) {
          setActiveTabUnder900("Messages");
        }
      }
    } catch (error) {
      setActiveFriend(null);
      setActiveGroup(null);
      setNewGroupAsActive(null);
      if (windowWidth <= 900) {
        setActiveTabUnder900("Friends");
      }
      setNotify("Group not found");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  useEffect(() => {
    if (newGroupAsActive) {
      const found = lastMessageRef.current?.find((e) => e.groupId?._id === newGroupAsActive);
      if (found) {
        setActiveGroup(found.groupId);
        setNewGroupAsActive(null);
        if (windowWidth < 900) {
          setActiveTabUnder900("Messages");
        }
      } else if (!found) {
        getSpecificGroup(newGroupAsActive);
      }
      setActiveFriend(null);
    }
  }, [newGroupAsActive, windowWidth]);

  async function getLastMessages() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (pageLoading.current) {
      clearTimeout(pageLoading.current);
    }
    try {
      setLoading(true);
      const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
      let listOfLastMessage = responseForRecentMessages.data.lastMessages;
      if (listOfLastMessage) {
        setLastMessage(listOfLastMessage);
        setLoading(false);
      } else {
        throw Error;
      }
    } catch (error) {
      setLoading(false);
      setNotify("Could not get friends list, please try later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  useEffect(() => {
    if (voiceRecord) {
      handleMediaInputChange(voiceRecord, "audio");
    }
  }, [voiceRecord]);

  async function unreadMessagesCountForEachFunc() {
    try {
      const response = await axiosInstance.get(`/message/unreadMessagesCountForEach`);
      setUnreadMessagesCountForEach(response.data.unreadMessagesCount);
    } catch (error) {
      setUnreadMessagesCountForEach([]);
    }
  }
  useEffect(() => {
    unreadMessagesCountForEachFunc();
  }, [totalUnreadMessages]);

  // getting active friend messages
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.value = "";
    }
    async function getMessages() {
      try {
        // usePrev(activeFriend);
        setActiveFriendMessagesLoading(true);
        const response = await axiosInstance.get(`/message/getMessages`, {
          params: {
            senderId: activeFriend._id,
          },
        });
        setMessages([...response.data.messages]);
        messagesRef.current = response.data.messages;
        setActiveFriendMessagesLoading(false);
        const unreadMessageIds = [];
        response.data.messages.forEach((e) => {
          if (e.receiverId === loggedInUser._id && e.status === "sent") {
            unreadMessageIds.push(e._id);
          }
        });
        socketRef.current.send(
          JSON.stringify({
            type: "messageSeen",
            payload: {
              messageId: unreadMessageIds,
              senderId: activeFriend._id,
              receiverId: loggedInUser._id,
            },
          })
        );
        socketRef.current.send(
          JSON.stringify({
            type: "myActiveFriend",
            payload: {
              senderId: loggedInUser._id.toString(),
              receiverId: activeFriend._id,
              type: "Friend",
            },
          })
        );
      } catch (error) {
        setNotify(`Failed to get messages`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
    // need work above
    async function getMessagesForActiveGroup() {
      try {
        setActiveFriendMessagesLoading(true);
        const response = await axiosInstance.get(`/message/getGroupMessages/${activeGroup._id}`);
        setMessages([...response.data.messages]);
        messagesRef.current = response.data.messages;
        setActiveFriendMessagesLoading(false);
        const unreadMessageIds = [];
        response.data.messages.forEach((e) => {
          if (e.groupId === activeGroup._id && e.seenBy.includes(loggedInUser._id) === false) {
            unreadMessageIds.push(e._id);
          }
        });
        socketRef.current.send(
          JSON.stringify({
            type: "messageSeenGroup",
            payload: {
              messageId: unreadMessageIds,
              senderId: loggedInUser._id,
              groupId: activeGroup._id,
            },
          })
        );
        socketRef.current.send(
          JSON.stringify({
            type: "myActiveFriend",
            payload: {
              senderId: loggedInUser._id.toString(),
              receiverId: activeGroup._id,
              type: "Group",
            },
          })
        );
      } catch (error) {
        setNotify(`Failed to get messages`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
    if (activeFriend) {
      getMessages();
    } else if (activeGroup) {
      getMessagesForActiveGroup();
    } else if (!activeFriend && !activeGroup && socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "myActiveFriend",
          payload: {
            senderId: loggedInUser?._id.toString(),
            receiverId: null,
            type: prevActive,
          },
        })
      );
    }

    return () => {
      if (socketRef.current) {
        // socketRef.current.send(
        //   JSON.stringify({
        //     type: "myActiveFriend",
        //     payload: {
        //       senderId: loggedInUser._id.toString(),
        //       receiverId: null,
        //     },
        //   })
        // );
        socketRef.current.send(
          JSON.stringify({
            type: "typing",
            payload: {
              senderId: loggedInUser._id,
              senderName: loggedInUser.name.split(" ")[0],
              receiverId: null,
              groupId: null,
              isTyping: false,
            },
          })
        );
      }
    };
  }, [activeFriend, activeGroup, loggedInUser]);

  // Websocket connection handler
  useEffect(() => {
    if (!loggedInUser) return;
    if (!socketHolder) {
      connectSocket();
      return;
    }
    const socket = socketHolder;
    socketRef.current = socket;

    socket.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "text" || data.type === "file" || data.type === "audio" || data.type === "video" || data.type === "image") {
        if (data.payload.randomId) {
          setUploadingMediaIds((prev) => prev.filter((e) => e !== data.payload.randomId));
          const ind = messagesRef.current.findIndex((e) => e.id == data.payload.randomId);
          if (ind >= 0) {
            messagesRef.current.splice(ind, 1);
            setMessages(messagesRef.current);
          }
        }
        if (data.payload.receiverId === loggedInUser._id && data.payload.status === "sent") {
          increaseTotalUnreadMessages();
        }
        if (data.type === "online_friends") {
          setOnlineFriends(data.payload.onlineFriends);
        }
        if (data.payload.groupId !== null && data.payload.seenBy.includes(loggedInUser._id) === false) {
          increaseTotalUnreadMessages();
        }
        if (activeFriend && loggedInUser._id === data.payload.senderId) {
          const audioElement = outgoingMessageSoundRef.current;
          if (audioElement) {
            if (!incomingMessageSoundRef.current.paused) {
              incomingMessageSoundRef.current.pause();
              incomingMessageSoundRef.current.currentTime = 0;
            }
            audioElement.currentTime = 0;
            if (!audioElement.paused) {
              audioElement.pause();
              audioElement.currentTime = 0;
            }
            audioElement.play(); // Play the sound
          }
          setMessages((prev) => [...prev, data.payload]);
        } else if (activeFriend && activeFriend._id === data.payload.senderId && loggedInUser._id === data.payload.receiverId) {
          const audioElement2 = incomingMessageSoundRef.current;
          if (audioElement2 && outgoingMessageSoundRef.current.paused) {
            audioElement2.currentTime = 0;
            if (!audioElement2.paused) {
              audioElement2.pause();
              audioElement2.currentTime = 0;
            }
            audioElement2.play();
          }
          setMessages((prev) => [...prev, data.payload]);
        } else if (activeGroup && activeGroup._id === data.payload.groupId && loggedInUser._id === data.payload.senderId) {
          const audioElement = outgoingMessageSoundRef.current;
          if (audioElement) {
            if (!incomingMessageSoundRef.current.paused) {
              incomingMessageSoundRef.current.pause();
              incomingMessageSoundRef.current.currentTime = 0;
            }
            audioElement.currentTime = 0;
            if (!audioElement.paused) {
              audioElement.pause();
              audioElement.currentTime = 0;
            }
            audioElement.play();
          }
          setMessages((prev) => [...prev, data.payload]);
        } else if (activeGroup && activeGroup._id === data.payload.groupId && loggedInUser._id !== data.payload.senderId) {
          const audioElement2 = incomingMessageSoundRef.current;
          if (audioElement2 && outgoingMessageSoundRef.current.paused) {
            audioElement2.currentTime = 0;
            if (!audioElement2.paused) {
              audioElement2.pause();
              audioElement2.currentTime = 0;
            }
            audioElement2.play();
          }
          setMessages((prev) => [...prev, data.payload]);
        }

        const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
        setLastMessage(responseForRecentMessages.data.lastMessages);
      }
      if (data.type === "notification") {
        addNotification(data.payload);
        if (data.payload.type === "groupMemberRemoved" || data.payload.type === "groupDeleted") {
          if (activeGroup?._id === data.groupId) {
            if (windowWidth < 900) {
              setActiveTabUnder900("Friends");
            }
            if (openProfileModal) {
              setOpenProfileModal(false);
            }
            setMessages([]);
            setActiveGroup(null);
          }
          const updated = lastMessage.filter((e) => e.groupId?._id !== data.groupId);
          setLastMessage(updated);
        }
        if (data.payload.type === "blockFriend" || data.payload.type === "removeFriend") {
          if (loggedInUser._id !== data.payload.sender) {
            const updated = lastMessage.filter((e) => e.friendId?._id !== data.payload.sender);
            setLastMessage(updated);
          }
          if (activeFriend?._id === data.payload.sender) {
            if (windowWidth < 900) {
              setActiveTabUnder900("Friends");
            }
            if (openProfileModal) {
              setOpenProfileModal(false);
            }
            setMessages([]);
            setActiveFriend(null);
          }
        }
      }
      if (data.type === "total_Group_Members") {
        addTolOnlineGroupMembersCount(data.payload);
      }
      if (data.type === "newGroup_added_Me") {
        socketRef.current.send(
          JSON.stringify({
            type: "groupCreated",
            payload: {
              userId: loggedInUser._id,
            },
          })
        );
      }
      if (data.type === "typing") {
        if (data.payload.isTyping === false) {
          const ind = isTyping.findIndex(
            (e) => e.senderId === data.payload.senderId && (e.receiverId === data.payload.receiverId || e.groupId === data.payload.groupId) && e.isTyping === true
          );
          isTyping.splice(ind, 1);
          const newArr = [...isTyping];
          setIsTyping(newArr);
        }
        if (data.payload.isTyping) {
          const ind = isTyping.findIndex(
            (e) => e.senderId === data.payload.senderId && (e.receiverId === data.payload.receiverId || e.groupId === data.payload.groupId) && e.isTyping === true
          );
          if (ind < 0) {
            setIsTyping((prev) => [...prev, data.payload]);
          }
        }
      }
      if (data.type === "statusUpdate") {
        if (data.payload.status === false) {
          const filteredArr = onlineUsers.filter((user) => user.userId !== data.payload.userId);
          setOnlineUsers(filteredArr);
        }
        if (data.payload.status === true) {
          setOnlineUsers([...onlineUsers, data.payload]);
        }
      }
      if (data.type === "messageSeen") {
        if (activeFriend?._id === data.payload.receiverId) {
          data.payload.messageId.forEach((messageId) => {
            const index = messagesRef.current.findIndex((e, i) => e?._id === messageId);
            if (index >= 0) {
              const newArr = [...messagesRef.current];
              newArr[index].status = "delivered";
              setMessages(newArr);
            }
          });
        }
        const foundMessage = lastMessage.findIndex((message) => data.payload.messageId.includes(message.messageId));
        if (foundMessage >= 0) {
          lastMessage[foundMessage].status = "delivered";
          setLastMessage(lastMessage);
        }
      }
      if (data.type === "online_Group_Members") {
        if (activeGroup?._id === data.payload.groupId) setActiveGroup_OnlineMembers(data.payload.activeMembers);
      }
      if (data.type === "messageSeenRequestProcessed") {
        fetchTotalUnreadMessages();
        unreadMessagesCountForEachFunc();
      }
      if (data.type === "call-initiated") {
      }
      if (data.type === "incoming-call") {
        setIncomingCall(data.payload);
      }
      if (data.type === "call-accepted") {
        await peerConnectionHold.current.setRemoteDescription(data.payload.answer);
      }
      if (data.type === "new-ice-candidate") {
        const candidate = new RTCIceCandidate(data.payload.candidate);
        if (peerConnectionHold.current) {
          await peerConnectionHold.current.addIceCandidate(candidate);
        }
      }
    };

    socket.onerror = (error) => {
      console.log("error: ", error);
    };
  }, [loggedInUser, activeFriend, socketHolder, connectSocket, lastMessage, onlineUsers, isTyping, activeGroup]);

  useEffect(() => {
    if (notify === "Group created successfully" && groupCreatedSoundRef.current) {
      groupCreatedSoundRef.current.play();
    }
  }, [notify]);
  useEffect(() => {
    lastMessageRef.current = lastMessage;
  }, [lastMessage]);
  useEffect(() => {
    async function getSpecificFriend() {
      if (friendId) {
        const found = lastMessage.find((e) => e.friendId?._id === friendId);
        if (found) {
          setActiveFriend(found.friendId);
          if (windowWidth <= 900) {
            setActiveTabUnder900("Messages");
          }
        } else {
          try {
            const response = await axiosInstance.get(`/message/getSpecificFriend/${friendId}`);
            if (response.data) {
              setActiveFriend(response.data.friendId);
              lastMessageRef.current.push(response.data);
              setLastMessage(lastMessageRef.current);
              if (windowWidth <= 900) {
                setActiveTabUnder900("Messages");
              }
            }
          } catch (error) {
            setNotify("Friend not found");
            notifyTimer.current = setTimeout(() => {
              setNotify(null);
            }, 5 * 1000);
          }
        }
      }
    }
    getSpecificFriend();
  }, [friendId]);
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (messageInputRef.current && document.activeElement !== messageInputRef.current && ) {
  //       messageInputRef.current.focus();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // Getting friendlist and setting activeFriend
  async function getFriendsList() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (pageLoading.current) {
      clearTimeout(pageLoading.current);
    }
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/getAllFriends`);
      const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
      setLastMessage(responseForRecentMessages.data.lastMessages);
      if (response.data.friends) {
        setFriendsList(response.data.friends);
        rememberMyFriendList.current = response.data.friends;
        pageLoading.current = setTimeout(() => {
          setLoading(false);
        }, 1500);
        if (windowWidth > 900) {
          if (friendId) {
            const found = response.data.friends.find((e) => e.friendId._id === friendId);
            if (found) {
              setActiveFriend(found.friendId);
            }
          }
        } else {
          if (friendId) {
            const found = response.data.friends.find((e) => e.friendId._id === friendId);
            if (found) {
              setActiveFriend(found.friendId);
              setActiveTabUnder900("Messages");
            }
          }
        }
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
  // async function getGroups() {
  //   try {
  //     const response = await axiosInstance.get(`/message/getGroups`);
  //     if (response.data.success) {
  //       setGroups(response.data.groups.groupIds);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // getting friends list on mount
  useEffect(() => {
    // getFriendsList()
    // getGroups();
    getLastMessages();
    setMessages([]);
    setOpenProfileModal(false);
  }, []);

  // Enter handler for send message input and esc for go to home
  useEffect(() => {
    function clickHandler(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (activeFriend) {
          sendMessage(activeFriend);
        } else if (activeGroup) {
          sendMessage(activeGroup);
        }
      }
      if (e.key === "Escape") {
        navigate("/home");
      }
    }
    document.addEventListener("keyup", clickHandler);
    return () => {
      document.removeEventListener("keyup", clickHandler);
    };
  }, [activeFriend, activeGroup]);

  // Sending message handler
  function sendMessage(active) {
    if (!messageInputRef.current) {
      return;
    }
    if (!active) return;
    const message = messageInputRef.current.value.trim();

    if (inputTimer.current) {
      clearTimeout(inputTimer.current);
    }
    // setIsTyping(false);
    socketRef.current.send(
      JSON.stringify({
        type: "typing",
        payload: {
          senderId: loggedInUser._id,
          senderName: loggedInUser.name.split(" ")[0],
          receiverId: activeFriend ? active._id : null,
          groupId: activeGroup ? active._id : null,
          isTyping: false,
        },
      })
    );
    if (message !== "" && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      setMessageInputActive(false);
      const sendMessageObj = {
        type: "text",
        payload: {
          senderId: loggedInUser._id,
          receiverId: activeFriend ? active._id : null,
          groupId: activeGroup ? active._id : null,
          senderName: loggedInUser.name,
          friends: activeFriend ? [loggedInUser.name, active.name] : [],
          content: message,
          senderPic: activeGroup?._id && loggedInUser.profilePic,
          timestamp: new Date().toISOString(),
        },
      };
      socketRef.current.send(JSON.stringify(sendMessageObj));
      messageInputRef.current.value = "";
      messageInputRef.current.focus();
    }
  }

  // click handlers for outside click
  useEffect(() => {
    function outSideClickHandler(e) {
      if (uploadContainers.current && !uploadContainers.current.contains(e.target) && !addMediaRef.current.contains(e.target)) {
        setUploadFiles(false);
      }
      if (profileEditModalRef.current && !profileEditModalRef.current.contains(e.target) && !profileEditIconRef.current.contains(e.target)) {
        setOpenProfileModal(false);
      }
      if (openMenuDropDownRef.current && !openMenuDropDownRef.current.contains(e.target) && !openMenuDropDownDotsRef.current.contains(e.target)) {
        setOpenMenuDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
        setOpenProfileDropdown(false);
      }
      if (friendFindNotActive && !friendsFindInputRef.current.contains(e.target)) {
        friendsFindInputRef.current.value = null;
        setFriendFindNotActive(false);
      }
      if (friendListsRef.current && !friendListsRef.current.contains(e.target)) {
        setShowFriends(false);
      }
    }

    document.addEventListener("mousedown", outSideClickHandler);
    return () => {
      document.removeEventListener("mousedown", outSideClickHandler);
      setOpenProfileDropdown(false);
    };
  }, [topBarRightProfilePicRefState, friendFindNotActive]);

  // scrolling to bottom of chat
  useEffect(() => {
    messagesRef.current = messages;
    if (chatBottom && chatBoxRef.current && windowWidth > 900) {
      setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }, 100);
      // messageBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    if (chatBottom && chatBoxRef.current && windowWidth <= 900 && activeTabUnder900 === "Messages") {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, chatBottom]);

  // Scroll handler for chat Box
  useEffect(() => {
    function handleScroll() {
      if (chatBox.offsetHeight + chatBoxRef.current.scrollTop <= chatBoxRef.current.scrollHeight - 20) {
        setTakeToBottom(true);
      } else {
        setTakeToBottom(false);
      }
    }
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatBox) {
        chatBox.removeEventListener("scroll", handleScroll);
      }
    };
  }, [activeFriend, windowWidth, chatBottom]);

  // User status and last seen time handler
  useEffect(() => {
    async function getUserStatus() {
      if (activeFriend) {
        if (onlineUsers.find((a) => a.userId === activeFriend._id)?.status) {
          setUserStatus(true);
        } else {
          setUserStatus(false);
          const getUser = await axiosInstance.get(`/user/userProfile/${activeFriend._id}`);
          if (getUser) {
            const lastSeenOnMessage = lastSeenTimeLogic(getUser.data.user.lastSeenOnMessage);
            setLastSeen(lastSeenOnMessage);
          }
        }
      }
    }
    getUserStatus();
    return () => {
      setUserStatus(null);
      setLastSeen(null);
    };
  }, [onlineUsers, activeFriend]);

  // isTyping indicator
  function inputChanging(e) {
    if (!activeFriend && !activeGroup) return;

    if (inputTimer.current) {
      clearTimeout(inputTimer.current);
    }
    if (e.target.value.trim().length === 0) {
      setMessageInputActive(false);
    }
    if (e.target.value.trim().length > 0) {
      // setIsTyping(true);
      setMessageInputActive(true);
      socketRef.current.send(
        JSON.stringify({
          type: "typing",
          payload: {
            senderId: loggedInUser._id,
            senderName: loggedInUser.name.split(" ")[0],
            receiverId: activeFriend ? activeFriend._id : null,
            groupId: activeGroup ? activeGroup._id : null,
            isTyping: true,
          },
        })
      );
    }
    inputTimer.current = setTimeout(() => {
      // setIsTyping(false);
      socketRef.current.send(
        JSON.stringify({
          type: "typing",
          payload: {
            senderId: loggedInUser._id,
            senderName: loggedInUser.name.split(" ")[0],
            receiverId: activeFriend ? activeFriend._id : null,
            groupId: activeGroup ? activeGroup._id : null,
            isTyping: false,
          },
        })
      );
    }, 3000);
  }

  // sending files handler
  async function handleMediaInputChange(e, type) {
    if (!activeFriend && !activeGroup) {
      setNotify("Select a friend or a group");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (e.target.files[0]?.size / (1024 * 1024) > 10) {
      setNotify("File size should be less than 10 MB");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    let showLoadMessage = null;
    const formData = new FormData();
    formData.append("media", e.target.files[0]);
    formData.append("type", type);
    let mediaURL = null;
    try {
      // setNotify("Uploading...");
      let randomId = null;
      if (e.target.files[0]) {
        const type = e.target.files[0].type.includes("pdf")
          ? "pdf"
          : e.target.files[0].type.includes("image")
          ? "image"
          : e.target.files[0].type.includes("video")
          ? "video"
          : e.target.files[0].type.includes("audio")
          ? "audio"
          : "";
        randomId = Math.floor(Math.random() * 1000000);
        setUploadingMediaIds((prev) => [...prev, randomId]);
        mediaURL = URL.createObjectURL(e.target.files[0]);
        showLoadMessage = {
          id: randomId,
          senderId: loggedInUser._id,
          receiverId: activeFriend ? activeFriend._id : null,
          groupId: activeGroup ? activeGroup._id : null,
          status: "sending",
          type,
          imageUrl: type === "image" ? [mediaURL] : [],
          videoUrl: type === "video" ? [mediaURL] : [],
          audioUrl: type === "audio" ? [mediaURL] : [],
          documentFiles: type === "pdf" ? [mediaURL] : [],
        };
        messagesRef.current = [...messagesRef.current, showLoadMessage];
        setMessages(messagesRef.current);
      }
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      let response;
      if (type === "video") {
        response = await axiosInstance.post("/message/uploadVideo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axiosInstance.post("/message/uploadFiles", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      if (response.data.message === "File uploaded successfully") {
        if (notifyTimer.current) {
          clearTimeout(notifyTimer.current);
        }
        let senderPic = activeGroup?._id && loggedInUser.profilePic;
        socketRef.current.send(
          JSON.stringify({
            type: type,
            payload: {
              senderId: loggedInUser._id,
              receiverId: activeFriend ? activeFriend._id : null,
              groupId: activeGroup ? activeGroup._id : null,
              senderName: loggedInUser.name,
              friends: activeFriend ? [loggedInUser.name, activeFriend.name] : [],
              file: response.data.url,
              randomId,
              senderPic,
              timestamp: new Date().toISOString(),
            },
          })
        );
      }
      URL.revokeObjectURL(mediaURL);
    } catch (error) {
      URL.revokeObjectURL(mediaURL);
      const filteredMessages = messagesRef.current.filter((message) => message.id !== showLoadMessage.id);
      messagesRef.current = filteredMessages;
      setMessages(messagesRef.current);
      if (error.response.data.message === "File size is too large") {
        setNotify("File size is too large");
      } else {
        setNotify("Something went wrong, please try again");
      }
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  async function blockUser() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setOpenProfileModal(false);
    try {
      setProfileBlock(null);
      const response = await axiosInstance.post(`/user/${profileBlock.friendId}/blockUser`);
      await axiosInstance.delete(`/message/deleteAllMessages/permanent/${profileBlock.friendId}`);
      const updatedMessages = lastMessage.filter((message) => message.friendId?._id !== activeFriend._id);
      if (response.data.message === "User blocked") {
        setLastMessage(updatedMessages);
        setMessages([]);
        setActiveFriend(null);
        setActiveGroup(null);
        if (windowWidth < 900) {
          setActiveTabUnder900("Friends");
        }
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        setNotify(`You have blocked ${profileBlock.name}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "blockFriend",
              payload: {
                recipientId: profileBlock.friendId,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                senderProfilePic: loggedInUser.profilePic,
              },
            })
          );
        }
      }
    } catch (error) {
      setProfileBlock(null);
      if (error.response.data.message === "You already blocked this user") {
        setNotify(`You have already blocked ${profileBlock.name}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else {
        setNotify(`Something went wrong, please try again later.`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
  }
  async function deleteAllChat() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setOpenProfileModal(false);
    if (messagesRef.current.length === 0) {
      setDeleteAllMessagesConfirmation(null);
      setNotify("No messages to delete");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    try {
      const response = await axiosInstance.delete(`/message/deleteAllMessages/${activeFriend?._id}`);
      const updatedMessages = lastMessage.filter((message) => message.friendId?._id !== activeFriend._id);
      setDeleteAllMessagesConfirmation(null);
      if (response.data.success) {
        setLastMessage(updatedMessages);
        setMessages(response.data.messages);
        // setActiveFriend(null);
        // setActiveGroup(null);
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        // if (windowWidth < 900) {
        //   setActiveTabUnder900("Friends");
        // }
        setNotify("All messages deleted");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else if (response.data.message === "No messages found") {
        setNotify("No messages found");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setDeleteAllMessagesConfirmation(null);
      setNotify("Could not delete messages, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  async function removeFriend() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setOpenProfileModal(false);

    try {
      const response = await axiosInstance.delete(`/user/${confirmRemoveFriend.friendId}/removeFriend`);
      await axiosInstance.delete(`/message/deleteAllMessages/permanent/${confirmRemoveFriend.friendId}`);
      setConfirmRemoveFriend(null);
      if (response.data.message === `Removed friend`) {
        const updatedMessages = lastMessage.filter((e) => e.friendId?._id !== confirmRemoveFriend.friendId);
        setLastMessage(updatedMessages);
        if (windowWidth < 900) {
          setActiveTabUnder900("Friends");
        }
        setMessages([]);
        setActiveFriend(null);
        setActiveGroup(null);
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        setNotify(`Removed ${confirmRemoveFriend.name} from your friendlist`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);

        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "removeFriend",
              payload: {
                recipientId: confirmRemoveFriend.friendId,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                senderProfilePic: loggedInUser.profilePic,
              },
            })
          );
        }
      }
    } catch (error) {
      setConfirmRemoveFriend(null);
      setNotify("Something went wrong, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  async function getProfiles() {
    const friendName = friendsFindInputRef.current.value.trim();
    if (friendName.length >= 1) {
      try {
        setFriendSearchLoading(true);
        const response = await axiosInstance.get(`/user/searchFriends/${friendName}`);
        setFriendSearchLoading(false);
        if (response.data.length >= 1) {
          setFriendsList(response.data);
        } else if (response.data.length === 0) {
          setFriendsList([]);
          setNoFriendMessage("No friends found");
        }
      } catch (error) {
        setFriendSearchLoading(false);
        setFriendsList([]);
      }
    } else if (friendName.length === 0) {
      setFriendsList([]);
    }
  }

  async function callUser(friendId, name, callType) {
    if (!userStatus) return;
    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalVideo(stream);

      const peerConnection = new RTCPeerConnection(servers);
      peerConnectionHold.current = peerConnection;
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      // peerConnection.ontrack = (event) => {
      //     console.log("Caller: Remote track received", event.streams[0]);
      //     friendVideoRef.current.srcObject = event.streams[0];
      // };

      peerConnection.onnegotiationneeded = () => {
        console.log("nego needed came from peer");
      };
      peerConnection.onicecandidate = (event) => {
        console.log("call initiator candidate found:  ", event);
        if (event.candidate) {
          socketRef.current.send(
            JSON.stringify({
              type: "new-ice-candidate",
              payload: {
                callerId: loggedInUser._id,
                receiverId: friendId,
                candidate: event.candidate,
              },
            })
          );
        }
      };
      socketRef.current.send(
        JSON.stringify({
          type: "initiateCall",
          payload: {
            callerId: loggedInUser._id,
            callerName: loggedInUser.name,
            callerProfilePic: loggedInUser.profilePic,
            receiverId: friendId,
            callType,
            offer,
          },
        })
      );
      setCalling({
        caller: loggedInUser._id,
        receiverId: friendId,
        receiverName: name,
        callType: callType,
      });
    } catch (error) {
      console.log("error in calling: ", error);
    }
  }

  async function acceptCall(incomingCall) {
    setIncomingCall(null);
    const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    // const stream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });
    // setLocalVideo(stream);
    const pc = new RTCPeerConnection(servers);
    peerConnectionHold.current = pc;
    console.log("pc: ", pc);
    // if (friendVideoRef.current) {
    //     peerConnectionHold.current.ontrack = (event) => {
    //         console.log("Caller: Remote track received", event.streams[0]);
    //         friendVideoRef.current.srcObject = event.streams[0];
    //     };

    // }
    pc.ontrack = (event) => {
      // console.log("friendStream.current: ", friendStream.current);
      console.log("event: ", event);
      setFriendStream(event.streams[0]);
      // friendVideoRef.current.srcObject = event.streams[0];
    };
    console.log("incomingCall: ", incomingCall);
    await pc.setRemoteDescription(incomingCall.offer);
    console.log("offer: ", incomingCall.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log("answer: ", answer);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: "new-ice-candidate",
            payload: {
              candidate: event.candidate,
            },
          })
        );
      }
    };
    socketRef.current.send(
      JSON.stringify({
        type: "call-accepted",
        payload: {
          callerId: incomingCall.callerId,
          receiverId: incomingCall.receiverId,
          answer: answer,
        },
      })
    );

    setCalling({
      caller: incomingCall.callerId,
      callerName: incomingCall.callerName,
      callerProfilePic: incomingCall.callerProfilePic,
      receiverId: loggedInUser._id,
      callType: incomingCall.callType,
    });
  }
  useEffect(() => {
    console.log("friendStream: ", friendStream);
    if (friendVideoRef.current && friendStream) {
      friendVideoRef.current.srcObject = friendStream;
      console.log("friendVideoRef.current: ", friendVideoRef.current);
      console.log("friendVideoRef.current.srcObject: ", friendVideoRef.current.srcObject);
      friendVideoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [calling, friendStream]);
  // async function rest(incomingCall) {

  //     // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     // setLocalVideo(stream);

  // }
  useEffect(() => {
    if (myCallMedia.current && localVideo) {
      myCallMedia.current.srcObject = localVideo;
    }
  }, [calling]);

  async function logout() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setClickedLogOut(null);
    setLogOut(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.data.message === "Logged out successfully") {
        navigate("/login");
        setLastMessage([]);
        setFriendsList([]);
        setActiveGroup(null);
        setActiveFriend(null);
        setMessages([]);
        setOnlineUsers([]);
        // setCalling(null);
        // setIncomingCall(null);
        // setLocalVideo(null);
        // setFriendVideo(null);
        // setLocalVideo(null);
        // setFriendVideo(null);
        setIsLoggedOut(true);
        setLogOut(null);
        // notifyTimer.current = setTimeout(() => {
        // }, 1000);
      } else {
        throw Error;
      }
    } catch (error) {
      setLogOut(null);
      setNotify("Error occured, please try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  async function deleteGroupHandler() {
    try {
      const response = await axiosInstance.delete(`message/deleteGroup/${deleteGroup}`);
      if (response.data.success) {
        const members = response.data.members;
        setDeleteGroup(null);
        if (windowWidth < 900) {
          setActiveTabUnder900("Friends");
        }
        setActiveGroup(null);
        setActiveFriend(null);
        setMessages([]);
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        const updatedArr = lastMessage.filter((message) => message.groupId?._id !== activeGroup._id);
        setLastMessage(updatedArr);
        setNotify(response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "deleteGroup",
              payload: {
                groupId: deleteGroup,
                members,
                groupName: activeGroup.groupName,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                groupAvatar: activeGroup.groupAvatar,
              },
            })
          );
        }
      } else {
        throw Error;
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
  async function leaveGroup() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`message/leaveGroup/${activeGroup._id}`);
      if (response.data.success) {
        if (windowWidth < 900) {
          setActiveTabUnder900("Friends");
        }
        setMessages([]);
        setActiveGroup(null);
        setActiveFriend(null);
        const updatedArr = lastMessage.filter((message) => message.groupId?._id !== activeGroup._id);
        setLastMessage(updatedArr);
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        setNotify(response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "leaveGroup",
              payload: {
                groupId: activeGroup._id,
                groupName: activeGroup.groupName,
                senderId: loggedInUser._id,
                senderName: loggedInUser.name,
                groupAvatar: activeGroup.groupAvatar,
              },
            })
          );
        }
      } else {
        throw Error;
      }
    } catch (error) {
      if (error.response.data.message) {
        setNotify(error.response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } finally {
      setConfirmLeaveGroup(null);
    }
  }
  const containerVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      y: 60,
      scale: 0.1,
      transition: { duration: 0.3 },
    },
  };
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="spinOnButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <div className="relative h-[100vh]  overflow-hidden w-[100vw] bg-black messageText">
      <AnimatePresence>{notify && windowWidth > 450 && <Notify page="Message" reference={notifyTimer} width={windowWidth} notify={notify} />}</AnimatePresence>
      <AnimatePresence>
        {notify && windowWidth <= 450 && (
          <div className="absolute w-[100%] bottom-14 flex justify-center">
            <Notify page="Message" reference={notifyTimer} width={windowWidth} notify={notify} />
          </div>
        )}
      </AnimatePresence>

      {showImage && (
        <dialog
          onClick={() => setShowImage(null)}
          className={`fixed inset-0 z-50 h-[100%] w-[100%] bg-black ${windowWidth > 900 ? "bg-opacity-60" : "bg-opacity-100"} flex justify-center items-center`}
        >
          {windowWidth > 900 && (
            <FontAwesomeIcon
              icon={faXmark}
              className={`absolute top-2 right-4 w-[20px] h-[20px] p-2 bg-white hover:bg-zinc-400 text-black rounded-full cursor-pointer`}
              onClick={() => setShowImage(null)}
            />
          )}
          {windowWidth <= 900 && (
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={`absolute top-2 left-1 w-[16px] h-[16px] p-2 hover:bg-white hover:text-black text-white rounded-full cursor-pointer`}
              onClick={() => setShowImage(null)}
            />
          )}
          <div
            ref={modalImageRef}
            onClick={(e) => e.stopPropagation()}
            className={`${windowWidth > 900 ? "max-w-[90vw] max-h-[80vh]" : "w-[100vw] h-[80vh]"} bg-black flex justify-center items-center`}
          >
            <img src={showImage} className={`${windowWidth > 900 ? "max-w-[90vw] max-h-[80vh]" : "max-w-[100vw] max-h-[80vh]"} rounded-sm`} alt="" />
          </div>
        </dialog>
      )}

      {deleteAllMessagesConfirmation && (
        <Confirmation
          width={windowWidth}
          cancel={setDeleteAllMessagesConfirmation}
          proceed={deleteAllChat}
          ConfirmText={"Are you sure you want to delete all messages of this conversation?"}
        />
      )}
      {confirmLeaveGroup && <Confirmation width={windowWidth} cancel={setConfirmLeaveGroup} proceed={leaveGroup} ConfirmText={"Are you sure you want to leave this group?"} />}
      {deleteGroup && <Confirmation width={windowWidth} cancel={setDeleteGroup} proceed={deleteGroupHandler} ConfirmText={"Are you sure you want to delete this group?"} />}
      {confirmRemoveFriend && (
        <Confirmation
          width={windowWidth}
          cancel={setConfirmRemoveFriend}
          proceed={removeFriend}
          ConfirmText={`Are you sure you want to remove ${confirmRemoveFriend.name} from your friendlist?`}
        />
      )}
      {showMyGroups && <MyGroups width={windowWidth} setActiveTabUnder900={setActiveTabUnder900} />}
      {profileBlock && (
        <Confirmation width={windowWidth} cancel={setProfileBlock} proceed={blockUser} ConfirmText={`Are you sure you want to block ${profileBlock.name}'s profile?`} />
      )}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {openBlockList && <BlockList ref={blockListsRef} width={windowWidth} currentUserId={loggedInUser._id} />}
      {logOut && <Logout width={windowWidth} />}
      {showFriends === "Friends" && <FriendsList width={windowWidth} ref={friendListsRef} currentUserId={loggedInUser._id} />}
      {createGroup && <CreateGroup width={windowWidth} />}
      {addGroupMember && <AddMemberToGroup width={windowWidth} activeGroup={addGroupMember} setAddGroupMember={setAddGroupMember} />}
      {showAllGroupMembers && (
        <AllGroupMembers
          removeGroupMember={removeGroupMember}
          setRemoveGroupMember={setRemoveGroupMember}
          setShowAllGroupMembers={setShowAllGroupMembers}
          setActiveTabUnder900={setActiveTabUnder900}
          width={windowWidth}
        />
      )}
      <AnimatePresence>
        {changeWidth && (
          <motion.dialog
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black"
          >
            <VideoPlayer maxHeight="100vh" playing={changeWidth.videoPlaying} currentTimeVideo={changeWidth.currentTime} e={changeWidth.e} />
          </motion.dialog>
        )}
      </AnimatePresence>
      <>
        <audio src={Incoming_message_notification} preload="auto" ref={incomingMessageSoundRef} className="hidden" />
        <audio src={outgoing_message_notification} preload="auto" ref={outgoingMessageSoundRef} className="hidden" />
        <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />
        <audio ref={groupCreatedSoundRef} preload="auto" className="hidden" src={group_created} />
      </>
      <Topbar page={"Messages"} />
      {/* <AnimatePresence>{notifyClicked && windowWidth <= 550 && <Notification width={windowWidth} />}</AnimatePresence> */}
      <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>

      <div className="relative flex  h-[100vh] w-[100vw] rounded-lg">
        <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Message"} ref={profileDropdownRef} />}</AnimatePresence>
        {/* Friends List section */}
        {(windowWidth > 900 || activeTabUnder900 === "Friends") && (
          <div
            className={`${windowWidth >= 1280 && "w-[450px]"} ${windowWidth >= 1024 && windowWidth < 1280 && "w-[400px]"} ${
              windowWidth >= 900 && windowWidth < 1024 && "w-[350px]"
            } ${windowWidth < 900 && "w-full"} transition-width duration-500 ease-in bg-slate-900`}
          >
            <div className="relative flex justify-center w-[100%] items-center h-[60px] mt-2 px-1">
              <div className={`relative ${windowWidth >= 1024 ? "px-2" : "px-2"} w-full`}>
                <FontAwesomeIcon
                  onClick={() => {
                    setFriendFindNotActive(false);
                    friendsFindInputRef.current.value = "";
                    setFriendsList([]);
                  }}
                  icon={friendsList.length > 0 ? faArrowLeft : faSearch}
                  className={`absolute top-[13px] left-5 w-[16px] h-[16px] text-white`}
                />
                <input
                  type="text"
                  ref={friendsFindInputRef}
                  onClick={() => setFriendFindNotActive(true)}
                  onChange={getProfiles}
                  className={`w-[100%] h-[42px] outline-none rounded-lg placeholder:text-white ${friendFindNotActive ? "bg-slate-600" : "bg-slate-700"} text-white cursor-pointer ${
                    windowWidth >= 1024 ? "px-12" : "px-10"
                  } `}
                  placeholder="Search your friends"
                />
                {/* <FontAwesomeIcon
                  icon={faCircleXmark}
                  onClick={() => {
                    setFriendFindNotActive(false);
                    friendsFindInputRef.current.value = "";
                    setFriendsList([]);
                  }}
                  className={`absolute top-[13px] right-5  w-[16px] h-[16px] cursor-pointer text-white`}
                /> */}
              </div>
              <div className="relative">
                <FontAwesomeIcon
                  ref={openMenuDropDownDotsRef}
                  icon={faEllipsisVertical}
                  onClick={() => {
                    setOpenMenuDropdown(!openMenuDropDown);
                  }}
                  className={`w-[17px] h-[17px] p-2 ${
                    windowWidth >= 1024 ? "mr-2" : "mr-0"
                  }  hover:bg-slate-800 text-white font-bold transition duration-200 rounded-full cursor-pointer`}
                />
                <AnimatePresence>
                  {openMenuDropDown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, y: -50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0, y: -50 }}
                      transition={{ duration: 0.2 }}
                      ref={openMenuDropDownRef}
                      className={`absolute top-12  z-50 px-2 py-2 border-[2px] border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 rounded-md  ${
                        windowWidth < 900 && "w-[290px] right-[0px]"
                      } ${windowWidth >= 900 && windowWidth < 1024 && "w-[290px] right-[-6px]"} ${windowWidth >= 1024 && "w-[300px] right-[-6px]"}`}
                    >
                      <ul>
                        <li>
                          <p
                            onClick={() => {
                              setCreateGroup(true);
                              setOpenMenuDropdown(false);
                            }}
                            className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700"
                          >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Create Group
                          </p>
                        </li>
                        <li>
                          <p
                            onClick={() => {
                              setShowMyGroups(true);
                              setOpenMenuDropdown(false);
                            }}
                            className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700"
                          >
                            <FontAwesomeIcon icon={faUsersLine} className="mr-2" />
                            My Groups
                          </p>
                        </li>
                        <li>
                          <p
                            onClick={() => {
                              setShowFriends("Friends");
                              setOpenMenuDropdown(false);
                            }}
                            className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700"
                          >
                            <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
                            Friend List
                          </p>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div
              className={`relative h-[90%] xl:w-[450px] pb-[150px] transition-width duration-500 ease-in lg:w-[400px] ${windowWidth >= 900 && windowWidth < 1024 && "w-[350px]"} ${
                windowWidth < 900 && "w-full"
              } overflow-y-auto scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-zinc-400`}
            >
              {friendsList.length === 0 &&
                lastMessage &&
                lastMessage.length > 0 &&
                lastMessage.map((e, i) => {
                  const isGroup = e.groupId ? true : false;
                  return (
                    <RenderItem
                      e={e}
                      key={i}
                      search={false}
                      lastMessage={lastMessage}
                      loggedInUser={loggedInUser}
                      isTyping={isTyping}
                      unreadMessagesCountForEach={unreadMessagesCountForEach}
                      setActiveTabUnder900={setActiveTabUnder900}
                      setActiveFriend={setActiveFriend}
                      setActiveGroup={setActiveGroup}
                      activeFriend={activeFriend}
                      activeGroup={activeGroup}
                      onlineUsers={onlineUsers}
                      OnlineGroupMembersCount={OnlineGroupMembersCount}
                      windowWidth={windowWidth}
                      isGroup={isGroup}
                    />
                  );
                })}
              {(!friendSearchLoading && !lastMessage) ||
                (!friendSearchLoading && lastMessage.length === 0 && friendsList.length === 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <p className="text-white">{noFriendMessage}</p>
                  </div>
                ))}
              {friendsList.length > 0 &&
                friendsList.map((e, i) => {
                  const isGroup = e.groupId ? true : false;
                  return (
                    <RenderItem
                      e={e}
                      key={i}
                      search={true}
                      lastMessage={lastMessage}
                      loggedInUser={loggedInUser}
                      setActiveTabUnder900={setActiveTabUnder900}
                      isTyping={isTyping}
                      unreadMessagesCountForEach={unreadMessagesCountForEach}
                      setActiveFriend={setActiveFriend}
                      setActiveGroup={setActiveGroup}
                      activeFriend={activeFriend}
                      activeGroup={activeGroup}
                      onlineUsers={onlineUsers}
                      windowWidth={windowWidth}
                      isGroup={isGroup}
                    />
                  );
                })}
              {friendSearchLoading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 ">
                  <p className="spinOnButton h-[30px] w-[30px]"></p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Message List Section */}
        {(windowWidth >= 900 || activeTabUnder900 === "Messages") && (
          <div
            className={`relative ${windowWidth > 900 && "h-[calc(100vh-65px)]"} ${windowWidth >= 768 && windowWidth <= 900 && "h-[calc(100vh-60px)]"} ${
              windowWidth < 768 && windowWidth > 450 && "h-[calc(100vh-110px)]"
            } ${windowWidth <= 450 && "h-[calc(100vh-92px)]"} w-full  `}
          >
            <AnimatePresence>
              {takeToBottom && !showImage && !createGroup && !changeWidth && !uploadFiles && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                  }}
                  className="absolute bottom-[90px] right-6 z-50 cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-full"
                >
                  <FontAwesomeIcon icon={faArrowDown} className=" h-[15px] w-[20px] p-2 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`h-[70px] ${windowWidth < 900 ? "pl-1" : "pl-3"}  pr-1 relative bg-gradient-to-r from-slate-900 to-slate-800   py-2 transition duration-200 `}>
              {activeFriend && (
                <div className="flex justify-between w-full h-full items-center">
                  <div className="flex items-center">
                    {windowWidth < 900 && (
                      <button
                        onClick={() => {
                          setActiveFriend(null);
                          setActiveGroup(null);
                          setActiveTabUnder900("Friends");
                          if (friendId) {
                            navigate(`/message`);
                          }
                        }}
                        className="w-[30px] mr-0 h-[30px] flex justify-center items-center rounded-full cursor-pointer transition duration-200 hover:bg-zinc-700"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className=" text-white" />
                      </button>
                    )}
                    <Link to={`/userProfile/${activeFriend?._id}`}>
                      <img src={activeFriend?.profilePic} className={` ${windowWidth < 400 ? "w-[40px] h-[40px]" : " w-[45px] h-[45px]"} rounded-full`} alt="" />
                    </Link>
                    <Link to={`/userProfile/${activeFriend?._id}`}>
                      <div className="ml-3">
                        <DisplayName windowWidth={windowWidth} activeEntity={activeFriend} />
                        <div>
                          {isTyping.find((e) => e.senderId === activeFriend?._id && e.receiverId === loggedInUser._id) ? (
                            <p className="text-[14px] font-semibold text-green-400">Typing...</p>
                          ) : (
                            onlineUsers.find((a) => a.userId === activeFriend?._id)?.status === true && <p className="text-[14px] font-semibold text-zinc-300">Online</p>
                          )}
                        </div>
                        <div>
                          {!userStatus && lastSeen && (
                            <p
                              className={` ${windowWidth >= 500 && "text-[14px]"} ${windowWidth > 400 && windowWidth < 500 && "text-[13px]"} ${
                                windowWidth <= 400 && "text-[12px]"
                              } font-semibold text-zinc-300`}
                            >
                              Last seen {lastSeen}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center">
                    {/* <FontAwesomeIcon
                      onClick={() => callUser(activeFriend?._id, activeFriend?.name, "video")}
                      icon={faVideo}
                      className={`w-[25px] mr-5 h-[25px] p-2 ${userStatus ? "hover:text-green-400 text-green-600 cursor-pointer" : "text-zinc-500 "}  transition duration-200 `}
                    />
                    <FontAwesomeIcon
                      onClick={() => callUser(activeFriend?._id, activeFriend?.name, "audio")}
                      icon={faPhone}
                      className={`w-[22px] mr-5 h-[22px] p-2 ${userStatus ? "hover:text-green-400 text-green-600 cursor-pointer" : "text-zinc-500 "}  transition duration-200 `}
                    /> */}
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      ref={profileEditIconRef}
                      onClick={() => setOpenProfileModal(!openProfileModal)}
                      className="w-[17px] h-[17px]  p-2 hover:bg-slate-700 text-zinc-300 font-bold transition duration-300 rounded-full cursor-pointer"
                    />
                  </div>
                </div>
              )}
              {activeGroup && (
                <div className="flex justify-between w-full h-full items-center">
                  {/* <Link to={`/userProfile/${activeFriend?._id}`}> */}
                  <div
                    onClick={() => {
                      if (windowWidth > 900) {
                        setShowAllGroupMembers(activeGroup?._id);
                      }
                    }}
                    className="flex  items-center cursor-pointer"
                  >
                    {windowWidth <= 900 && (
                      <button
                        onClick={() => {
                          setActiveFriend(null);
                          setActiveGroup(null);
                          setActiveTabUnder900("Friends");
                          if (newGroupAsActive) {
                            navigate(`/message`);
                          }
                        }}
                        className="w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer transition duration-200 hover:bg-zinc-700 mr-2"
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className=" text-white" />
                      </button>
                    )}
                    <img src={activeGroup?.groupAvatar} className={` w-[45px] h-[45px] rounded-full`} alt="" />
                    <div className="ml-3">
                      {/* <p className="text-white text-[17px] font-bold"> */}
                      <DisplayName windowWidth={windowWidth} activeEntity={activeGroup} />
                      {/* </p> */}
                      <div>
                        {isTyping.find((e) => e.groupId === activeGroup?._id && e.senderId !== loggedInUser._id) ? (
                          <p className="text-[14px] font-semibold text-green-400">
                            {isTyping.find((e) => e.groupId === activeGroup?._id && e.senderId !== loggedInUser._id)?.senderName} Typing...
                          </p>
                        ) : (
                          OnlineGroupMembersCount.find((a) => a.groupId === activeGroup._id)?.count > 0 && (
                            <p className="text-[14px] font-semibold text-green-400">{OnlineGroupMembersCount.find((a) => a.groupId === activeGroup._id)?.count} Online</p>
                          )
                        )}
                        {/* {} */}
                      </div>
                      {/* : onlineUsers.find(a => a.userId === activeFriend?._id)?.status === true && <p className="text-[14px] font-semibold text-zinc-300">Online</p> */}
                    </div>
                  </div>
                  {/* </Link> */}
                  <div className="flex items-center">
                    {/* <FontAwesomeIcon
                      onClick={() => callUser(activeFriend?._id, activeFriend?.name, "video")}
                      icon={faVideo}
                      className={`w-[25px] mr-5 h-[25px] p-2 ${userStatus ? "hover:text-green-400 text-green-600 cursor-pointer" : "text-zinc-500 "}  transition duration-200 `}
                    />
                    <FontAwesomeIcon
                      onClick={() => callUser(activeFriend?._id, activeFriend?.name, "audio")}
                      icon={faPhone}
                      className={`w-[22px] mr-5 h-[22px] p-2 ${userStatus ? "hover:text-green-400 text-green-600 cursor-pointer" : "text-zinc-500 "}  transition duration-200 `}
                    /> */}
                    <FontAwesomeIcon
                      icon={faEllipsisVertical}
                      ref={profileEditIconRef}
                      onClick={() => setOpenProfileModal(!openProfileModal)}
                      className="w-[17px] h-[17px]  p-2 hover:bg-slate-900 text-zinc-300 font-bold transition duration-300 rounded-full cursor-pointer"
                    />
                  </div>
                </div>
              )}
              <AnimatePresence>
                {openProfileModal && activeFriend && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: -50 }}
                    transition={{ duration: 0.2 }}
                    ref={profileEditModalRef}
                    className="absolute top-6 right-0 z-50 px-2 py-2 mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-md shadow-md w-[300px]"
                  >
                    <ul>
                      <li
                        onClick={() => {
                          setProfileBlock({
                            friendId: activeFriend?._id,
                            name: activeFriend?.name.split(" ")[0],
                          });
                          setOpenProfileModal(false);
                        }}
                        className="flex items-center cursor-pointer px-2 rounded-lg hover:bg-slate-700"
                      >
                        <FontAwesomeIcon className="text-white" icon={faBan} /> <p className="px-4 py-3 text-zinc-300 text-[15px] rounded-md">Block</p>
                      </li>
                      <li
                        onClick={() => {
                          setDeleteAllMessagesConfirmation(activeFriend?._id), setOpenProfileModal(false);
                        }}
                        className="flex items-center px-2 cursor-pointer rounded-lg hover:bg-slate-700"
                      >
                        <FontAwesomeIcon className="text-white" icon={faTrashCan} /> <p className="pl-[18px] py-3 text-zinc-300 text-[15px] rounded-md">Delete All Messages</p>
                      </li>
                      <li
                        onClick={() => {
                          setConfirmRemoveFriend({
                            friendId: activeFriend?._id,
                            name: activeFriend?.name.split(" ")[0],
                          });
                          setOpenProfileModal(false);
                        }}
                        className="flex items-center cursor-pointer px-2 rounded-lg hover:bg-slate-700"
                      >
                        <FontAwesomeIcon className="text-white" icon={faUserXmark} /> <p className="pl-[13px] py-3 text-zinc-300 text-[15px] rounded-md">Remove From Friends</p>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {openProfileModal && activeGroup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, y: -50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: -50 }}
                    transition={{ duration: 0.2 }}
                    ref={profileEditModalRef}
                    className="absolute top-6 right-0 z-50 px-2 py-2 mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-md shadow-md w-[300px]"
                  >
                    <ul>
                      <li
                        onClick={() => {
                          setShowAllGroupMembers(activeGroup?._id);
                          setOpenProfileModal(false);
                        }}
                        className="flex items-center cursor-pointer px-2 rounded-lg hover:bg-slate-700"
                      >
                        <FontAwesomeIcon className="text-white" icon={faUserGroup} /> <p className="pl-[13px] py-3 text-zinc-300 text-[15px] rounded-md">All Members</p>
                      </li>
                      {activeGroup.groupAdminId === loggedInUser._id && (
                        <>
                          <li
                            onClick={() => {
                              setAddGroupMember(activeGroup), setOpenProfileModal(false);
                            }}
                            className="flex items-center px-2 cursor-pointer rounded-lg hover:bg-slate-700"
                          >
                            <FontAwesomeIcon className="text-white" icon={faPlus} /> <p className="pl-[18px] py-3 text-zinc-300 text-[15px] rounded-md">Add Member</p>
                          </li>
                          <li
                            onClick={() => {
                              setShowAllGroupMembers(activeGroup?._id), setOpenProfileModal(false);
                              setRemoveGroupMember(true);
                            }}
                            className="flex items-center px-2 cursor-pointer rounded-lg hover:bg-slate-700"
                          >
                            <FontAwesomeIcon className="text-white" icon={faMinus} /> <p className="pl-[18px] py-3 text-zinc-300 text-[15px] rounded-md">Remove Member</p>
                          </li>
                        </>
                      )}

                      {activeGroup.groupAdminId !== loggedInUser._id && (
                        <li
                          onClick={() => {
                            setConfirmLeaveGroup({
                              friendId: activeFriend?._id,
                              name: activeFriend?.name.split(" ")[0],
                            });
                            setOpenProfileModal(false);
                          }}
                          className="flex items-center cursor-pointer px-2 rounded-lg hover:bg-slate-700"
                        >
                          <FontAwesomeIcon className="text-white" icon={faUserXmark} /> <p className="pl-[13px] py-3 text-zinc-300 text-[15px] rounded-md">Leave Group</p>
                        </li>
                      )}
                      {activeGroup.groupAdminId === loggedInUser._id && (
                        <li
                          onClick={() => {
                            setDeleteGroup(activeGroup?._id), setOpenProfileModal(false);
                          }}
                          className="flex items-center px-2 cursor-pointer rounded-lg hover:bg-slate-700"
                        >
                          <FontAwesomeIcon className="text-white" icon={faTrashCan} /> <p className="pl-[18px] py-3 text-zinc-300 text-[15px] rounded-md">Delete Group</p>
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* All Messages list */}
            <div
              ref={(el) => {
                chatBoxRef.current = el;
                if (el) {
                  setChatBotom(true);
                } else {
                  setChatBotom(false);
                }
              }}
              className={`relative ${windowWidth >= 900 && "h-[calc(100vh-195px)] px-5"} ${windowWidth >= 768 && windowWidth < 900 && "h-[calc(100vh-200px)] px-5"}
                    ${windowWidth < 768 && windowWidth > 450 && "h-[calc(100vh-250px)] px-3"} ${windowWidth <= 450 && "h-[calc(100vh-220px)]  px-2"}
                    pb-[30px] overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-zinc-400 w-full bg-cover pt-[12px] `}
              style={{
                backgroundImage: `url("https://res.cloudinary.com/dnku8pwjp/image/upload/v1733975369/Desktop-2_xvmmfa.png")`,
              }}
            >
              {activeFriendMessagesLoading && (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="spinOnButton h-[30px] w-[30px]"></p>
                </div>
              )}
              {messages && !activeFriendMessagesLoading && messages.length > 0 && (
                <>
                  {messageDateGroupLogic(messages).map((unique, i) => {
                    return (
                      <div key={i}>
                        <div className="flex justify-center my-4">
                          <div className={`text-white text-[16px] hover:opacity-90 font-semibold bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg  px-4 py-1`}>
                            {unique.date}
                          </div>
                        </div>
                        {unique.data.map((e, ind) => {
                          return <MessageComponent key={ind} message={e} isSender={e.senderId === loggedInUser._id} senderName={e.senderName} windowWidth={windowWidth} />;
                        })}
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messageBoxRef}></div>
            </div>
            {/* Input box for sending messages */}
            {
              <div className={`h-[70px] absolute bottom-0 w-full cursor-pointer bg-gradient-to-r from-slate-800 to-slate-900 pl-2 pr-2 py-2 transition duration-200 `}>
                <div className="relative flex items-center w-full">
                  <AnimatePresence>
                    {uploadFiles && (
                      <>
                        {windowWidth > 450 && (
                          <motion.div
                            variants={containerVariants}
                            initial="closed"
                            animate={uploadFiles ? "open" : "closed"}
                            exit="closed"
                            ref={uploadContainers}
                            className="absolute bottom-[70px] rounded-xl left-0  flex bg-gradient-to-b from-slate-800 to-slate-900 flex items-center"
                          >
                            <div
                              onClick={() => {
                                photosInput.current.value = null;
                                photosInput.current.click();
                                setUploadFiles(false);
                              }}
                              className="text-[16px] w-[100px] flex justify-center  items-center ml-1  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"
                            >
                              <p>
                                {" "}
                                <FontAwesomeIcon icon={faImage} className="mr-2 text-red-500" /> Photos{" "}
                              </p>
                            </div>
                            <div
                              onClick={() => {
                                videosInput.current.value = null;
                                videosInput.current.click();
                                setUploadFiles(false);
                              }}
                              className="text-[16px] w-[100px] flex justify-center  items-center ml-2  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"
                            >
                              <p>
                                {" "}
                                <FontAwesomeIcon icon={faVideo} className="mr-2 text-green-500" /> Videos{" "}
                              </p>
                            </div>
                            <div
                              onClick={() => {
                                audioInput.current.value = null;
                                audioInput.current.click();
                                setUploadFiles(false);
                              }}
                              className="text-[16px] w-[100px] flex justify-center  items-center ml-2 py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"
                            >
                              <p>
                                {" "}
                                <FontAwesomeIcon icon={faHeadphones} className="mr-2 text-blue-500" /> Audio{" "}
                              </p>
                            </div>
                            <div
                              onClick={() => {
                                fileInput.current.value = null;
                                fileInput.current.click();
                                setUploadFiles(false);
                              }}
                              className="text-[16px] w-[100px] flex justify-center items-center  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"
                            >
                              <p>
                                {" "}
                                <FontAwesomeIcon icon={faFileLines} className="mr-2 text-yellow-500" /> Files
                              </p>
                            </div>
                            {/* <p onClick={() => } className="text-[16px] w-[120px] flex items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-900 text-white font-bold transition-duration-200"> <FontAwesomeIcon icon={faLocationDot} className="mr-2" />  Location</p> */}
                          </motion.div>
                        )}

                        {windowWidth <= 450 && (
                          <motion.div
                            variants={containerVariants}
                            initial="closed"
                            animate={uploadFiles ? "open" : "closed"}
                            exit="closed"
                            ref={uploadContainers}
                            className="absolute bottom-[65px] rounded-xl left-0 w-[100%] flex bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center"
                          >
                            <div className="w-[50%]">
                              <div
                                onClick={() => {
                                  photosInput.current.value = null;
                                  photosInput.current.click();
                                  setUploadFiles(false);
                                }}
                                className={`text-[18px] w-[100%] flex justify-center  items-center   py-4 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}
                              >
                                <p>
                                  {" "}
                                  <FontAwesomeIcon icon={faImage} className="mr-2 text-red-500" /> Photos{" "}
                                </p>
                              </div>
                              <div
                                onClick={() => {
                                  videosInput.current.value = null;
                                  videosInput.current.click();
                                  setUploadFiles(false);
                                }}
                                className={`text-[18px] w-[100%] flex justify-center  items-center  py-4 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}
                              >
                                <p>
                                  {" "}
                                  <FontAwesomeIcon icon={faVideo} className="mr-2 text-green-500" /> Videos{" "}
                                </p>
                              </div>
                            </div>
                            <div className="w-[50%]">
                              <div
                                onClick={() => {
                                  audioInput.current.value = null;
                                  audioInput.current.click();
                                  setUploadFiles(false);
                                }}
                                className={`text-[18px] w-[100%] flex justify-center  items-center py-4 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}
                              >
                                <p>
                                  {" "}
                                  <FontAwesomeIcon icon={faHeadphones} className="mr-2 text-blue-500" /> Audio{" "}
                                </p>
                              </div>
                              <div
                                onClick={() => {
                                  fileInput.current.value = null;
                                  fileInput.current.click();
                                  setUploadFiles(false);
                                }}
                                className={` text-[18px] w-[100%] flex justify-center items-center  py-4 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}
                              >
                                <p>
                                  {" "}
                                  <FontAwesomeIcon icon={faFileLines} className="mr-2 text-yellow-500" /> Files
                                </p>
                              </div>
                            </div>
                            {/* <p onClick={() => } className="text-[16px] w-[120px] flex items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-900 text-white font-bold transition-duration-200"> <FontAwesomeIcon icon={faLocationDot} className="mr-2" />  Location</p> */}
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>
                  <div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      ref={fileInput}
                      onChange={(e) => {
                        handleMediaInputChange(e, "file");
                      }}
                    />
                    <input type="file" className="hidden" accept="image/*" ref={photosInput} onChange={(e) => handleMediaInputChange(e, "image")} />
                    <input type="file" className="hidden" accept="video/*" ref={videosInput} onChange={(e) => handleMediaInputChange(e, "video")} />
                    <input type="file" className="hidden" accept="audio/*" ref={audioInput} onChange={(e) => handleMediaInputChange(e, "audio")} />
                  </div>
                  <FontAwesomeIcon
                    icon={faSquarePlus}
                    ref={addMediaRef}
                    onClick={() => setUploadFiles(!uploadFiles)}
                    className="w-[35px] h-[35px] ml-0 p-2 hover:text-zinc-400 text-white font-bold transition duration-100  cursor-pointer"
                  />

                  <input
                    type="text"
                    ref={messageInputRef}
                    onChange={inputChanging}
                    placeholder="Type a message"
                    className={`w-full placeholder-zinc-200 text-white h-full bg-slate-700 rounded-lg ml-2 pl-5 p-2 outline-none`}
                  />
                  <div className="w-[22px] ml-1 mr-3 ">
                    {messageInputRef.current?.value.length > 0 && (
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        onClick={() => sendMessage(activeGroup || activeFriend)}
                        className={`w-[22px] h-[22px] p-2 hover:text-zinc-400 ${
                          messageInputActive ? "text-zinc-100" : "text-zinc-400"
                        } font-bold transition duration-100  cursor-pointer`}
                      />
                    )}
                    {messageInputRef.current?.value.length === 0 && <VoiceRecorder />}
                    {/* {messageInputRef.current?.value.length === 0 && audioRecording && <VoiceRecorder />} */}
                  </div>
                  {/* <FontAwesomeIcon icon={faMicrophone} onClick={sendMessage} className="w-[22px] h-[22px] ml-2 p-2 hover:text-zinc-900 text-zinc-700 font-bold transition duration-100  cursor-pointer" /> */}
                </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};
export default MessagePage;

// {calling && (
//   <dialog className={`fixed inset-0 z-50 h-[100%] w-[100%] bg-black ${windowWidth > 900 ? "bg-opacity-60" : "bg-opacity-100"} flex justify-center items-center`}>
//     {console.log("calling:1584 ", calling)}
//     <div className={`w-[100vw] h-[90vh] flex justify-center items-center`}>
//       {calling.callType === "video" && (
//         <div className="bg-zinc-300">
//           <div className="flex items-center">
//             <video ref={myCallMedia} autoPlay muted className="w-[450px] h-[200px]"></video>
//             <video ref={friendVideoRef} autoPlay muted className="w-[450px] border-2 border-red-500 h-[200px]"></video>
//             <p className="text-3xl">Call accepted</p>
//           </div>
//           <div className="flex justify-center items-center">
//             <button>End Call</button>
//             <button>Mute</button>
//             <button>Hold</button>
//             <button>Audio</button>
//           </div>
//         </div>
//       )}
//       <CallComponent caller={calling.caller} reciever={calling.reciever} stream={calling.stream} type={calling.type} />
//     </div>
//   </dialog>
// )}
// {incomingCall && (
//   <dialog className={`fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center h-[100%] w-[100%]`}>
//     <div className="bg-zinc-800 w-[50vw] h-[30vh] flex flex-col justify-center items-center rounded-lg">
//       <div className="flex items-center">
//         <h1 className="text-white text-[20px] font-bold">{incomingCall.callerName} is calling you</h1>
//         {incomingCall.callType === "audio" && <FontAwesomeIcon icon={faPhone} className=" w-[25px] h-[25px] p-2 text-green-500 rounded-full" />}
//         {incomingCall.callType === "video" && <FontAwesomeIcon icon={faVideo} className=" w-[25px] h-[25px] p-2 text-green-500 rounded-full" />}
//         <div className="flex items-center ml-2">
//           <img src={incomingCall.callerProfilePic} className="w-[50px] h-[50px] rounded-full" alt="" />
//           <h1 className="text-white text-[20px] font-bold">{incomingCall.callerName}</h1>
//         </div>
//       </div>
//       <div className="flex justify-center items-center">
//         <button onClick={() => acceptCall(incomingCall)} className="ml-2 px-4 py-2 bg-green-600 text-white">
//           Accept
//         </button>
//         <button onClick={() => rejectCall(incomingCall)} className="ml-2 px-4 py-2 bg-green-600 text-white">
//           Reject
//         </button>
//       </div>
//     </div>
//   </dialog>
// )}
