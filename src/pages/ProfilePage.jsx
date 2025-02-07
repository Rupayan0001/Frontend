import React, { useState, useEffect, useRef } from "react";
import Topbar from "../components/layout/Topbar";
import LeftBarComponent from "../components/layout/LeftBarComponent";
import Post from "../components/layout/Post";
import "./../styles/ProfilePage.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState.js";
import SearchBox from "../components/layout/SearchBox.jsx";
import post_uploaded from "../../src/assets/notification_sound/post_uploaded.mp3";
import {
  faMagnifyingGlass,
  faCreditCard,
  faSquarePlus,
  faCirclePlay,
  faGear,
  faUserGroup,
  faHouse,
  faLandmark,
  faBriefcase,
  faMessage,
  faStore,
  faGamepad,
  faVideo,
  faBars,
  faBell,
  faCopy,
  faEnvelope,
  faRightFromBracket,
  faUser,
  faXmark,
  faBookmark,
  faArrowLeft,
  faBan,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faWhatsapp, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import BannerImg, { ProfileImg } from "../components/layout/BannerImg";
import PostBox from "../components/layout/PostBox.jsx";
import postTimeLogic from "../lib/Post_Time_Logic.js";
import CommentBox from "../components/layout/commentBox.jsx";
import About from "../components/layout/About.jsx";
import Photos from "../components/layout/Photos.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import FollowersList from "../components/layout/FollowersList.jsx";
import FriendsList from "../components/layout/FriendsList.jsx";
import ReportBox from "../components/layout/ReportBox.jsx";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown.jsx";
import { AnimatePresence, motion } from "framer-motion";
import BlockList from "../components/layout/BlockList.jsx";
import Logout from "../components/layout/Logout.jsx";
import ShareModal from "../components/layout/ShareModal.jsx";
import Leftbar from "../components/layout/LeftBar.jsx";
import Confirmation from "../components/layout/Confirmation.jsx";
import HideUser from "../components/layout/HideUser.jsx";
import Notify from "../components/layout/Notify.jsx";
import WritePost from "../components/layout/WritePost.jsx";
import PostSkeleton from "../components/layout/PostSkeleton.jsx";
import delete_notification from "../assets/notification_sound/delete_notification.wav";
import VideoProfilePage from "../components/layout/VideoProfilePage.jsx";
import VideoPlayer from "../components/layout/VideoPlayer.jsx";
import Carousel from "../components/layout/Carousel.jsx";
import Notification from "../components/layout/Notification.jsx";
const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const profilePic = globalState((state) => state.profilePic);
  const selected = globalState((state) => state.selected);
  const setSelected = globalState((state) => state.setSelected);
  const shareOptions = globalState((state) => state.shareOptions);
  const setShareOptions = globalState((state) => state.setShareOptions);
  const confirmDelete = globalState((state) => state.confirmDelete);
  const setConfirmDelete = globalState((state) => state.setConfirmDelete);
  const deletePostObj = globalState((state) => state.deletePostObj);
  const commentDetails = globalState((state) => state.commentDetails);
  const setCommentDetails = globalState((state) => state.setCommentDetails);
  const setDeletePostObj = globalState((state) => state.setDeletePostObj);
  const setConfirmRemoveFriend = globalState((state) => state.setConfirmRemoveFriend);
  const setOnlineFriends = globalState((state) => state.setOnlineFriends);
  const [page, setPage] = useState(1);
  const [noPost, setNoPost] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [numOfComment, setNumOfComment] = useState("");
  const post = globalState((state) => state.post);
  const setNewPost = globalState((state) => state.setNewPost);
  const openPost = globalState((state) => state.openPost);
  const setProfileBlock = globalState((state) => state.setProfileBlock);
  const profileBlock = globalState((state) => state.profileBlock);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setPostDetailsObj = globalState((state) => state.setPostDetailsObj);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const tabSelectedForFollow = globalState((state) => state.tabSelectedForFollow);
  const setTabSelectedForFollow = globalState((state) => state.setTabSelectedForFollow);
  const setIsLoggedOut = globalState((state) => state.setIsLoggedOut);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const pageName = globalState((state) => state.pageName);
  const setPageName = globalState((state) => state.setPageName);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const removePost = globalState((state) => state.removePost);
  const setRemovePost = globalState((state) => state.setRemovePost);
  const setCloseModal = globalState((state) => state.setCloseModal);
  // const openPost = globalState((state) => state.openPost);
  // const setOpenPost = globalState((state) => state.setOpenPost);
  const setOpenPoll = globalState((state) => state.setOpenPoll);
  const closeModal = globalState((state) => state.closeModal);
  const likedData = globalState((state) => state.likedData);
  const setLikedData = globalState((state) => state.setLikedData);
  const showFriends = globalState((state) => state.showFriends);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const openHideUserList = globalState((state) => state.openHideUserList);
  const setOpenHideUserList = globalState((state) => state.setOpenHideUserList);
  const setBlockedUserPosts = globalState((state) => state.setBlockedUserPosts);
  const setFriendsList = globalState((state) => state.setFriendsList);
  const openBlockList = globalState((state) => state.openBlockList);
  const setOpenBlockList = globalState((state) => state.setOpenBlockList);
  const friendsList = globalState((state) => state.friendsList);
  const report = globalState((state) => state.report);
  const setReport = globalState((state) => state.setReport);
  const blockedUserPosts = globalState((state) => state.blockedUserPosts);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const block = globalState((state) => state.block);
  const setBlock = globalState((state) => state.setBlock);
  const logOut = globalState((state) => state.logOut);
  const savePost = globalState((state) => state.savePost);
  const setSavePost = globalState((state) => state.setSavePost);
  const savePostList = globalState((state) => state.savePostList);
  const setSavePostList = globalState((state) => state.setSavePostList);
  const setShowProfilePicFull = globalState((state) => state.setShowProfilePicFull);
  const showProfilePicFull = globalState((state) => state.showProfilePicFull);
  const increaseTotalUnreadMessages = globalState((state) => state.increaseTotalUnreadMessages);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const showBannerPicFull = globalState((state) => state.showBannerPicFull);
  const setShowBannerPicFull = globalState((state) => state.setShowBannerPicFull);
  const confirmRemoveFriend = globalState((state) => state.confirmRemoveFriend);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const totalUnreadMessages = globalState((state) => state.totalUnreadMessages);
  const setTotalUnreadMessages = globalState((state) => state.setTotalUnreadMessages);
  const setLogOut = globalState((state) => state.setLogOut);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const hideAllPostUser = globalState((state) => state.hideAllPostUser);
  const setHideAllPostUser = globalState((state) => state.setHideAllPostUser);
  const setWSFriendRequest = globalState((state) => state.setWSFriendRequest);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const changeWidth = globalState((state) => state.changeWidth);
  const expandImageForPost = globalState((state) => state.expandImageForPost);
  const setExpandImageForPost = globalState((state) => state.setExpandImageForPost);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);

  const postBoxRef = useRef();
  const shareOptionsRef = useRef();
  const postScroll = useRef();
  const confirmDeleteRef = useRef();
  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const { userId } = useParams();
  const navigate = useNavigate();
  const leftBarSearchRef = useRef();
  const postsArrayRef = useRef();
  const followListsRef = useRef();
  const friendListsRef = useRef();
  const reportRef = useRef();
  const blockListsRef = useRef();
  const showProfilePicFullRef = useRef();
  const showBannerPicFullRef = useRef();
  const hideUserRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const expandImageForPostRef = useRef();

  const response = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/userProfile/${userId}`);
      setUser(response.data.user);
      setLoading(false);
      setBlock(response.data.isBlocked);
    } catch (error) {
      if (!loggedInUser) {
        navigate("/home");
      }
      if (!response.data.user) {
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    if (notify === "Post uploaded successfully" || notify === "Post updated successfully") {
      if (postUploadedSoundRef.current) {
        postUploadedSoundRef.current.play();
      }
    }
  }, [notify]);

  const fetchPosts = async (page) => {
    setLoadingPosts(true);
    postsArrayRef.current = post;
    try {
      const responseForPosts = await axiosInstance.get(`/post/${userId}/getCurrentUserPost`, {
        params: { page: page, limit: 50 },
      });
      if (responseForPosts.data.posts && responseForPosts.data.posts.length === 0 && page === 1) {
        setHasMore(false);
        setLoadingPosts(false);
        if (page === 1 && loggedInUser._id === user._id) {
          setNoPost("Create a post.");
        }
        if (page === 1 && loggedInUser._id !== user._id) {
          setNoPost(`${user.name.split(" ")[0]} has not created any posts yet.`);
        }
        return;
      }
      if (page > 1 && responseForPosts.data.posts.length === 0) {
        setHasMore(false);
        setNoPost("No more posts.");
        setLoadingPosts(false);
        return;
      }
      if (responseForPosts.data.posts && responseForPosts.data.posts.length > 0) {
        setLikedData(responseForPosts.data.likedData);
        setNewPost([...postsArrayRef.current, ...responseForPosts.data.posts]);
        setLoadingPosts(false);
        return;
      } else {
        setHasMore(false);
        setLoadingPosts(false);
      }
    } catch (error) {
      setLoadingPosts(false);
      setNotify("Failed to get posts, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  };

  // getting logged in user details
  useEffect(() => {
    async function getLoggedInUser() {
      const response = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(response.data.user);
    }
    if (!loggedInUser) {
      getLoggedInUser();
    }
    setCommentDetails(null);
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      setNotifyClicked(null);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
      }
    };
  }, []);
  // For live unread incoming message count on TopBar
  useEffect(() => {
    socketData();
    function socketData() {
      if (!loggedInUser) return;
      if (!socketHolder) {
        connectSocket();
        return;
      }
    }
    fetchTotalUnreadMessages();
    const socket = socketHolder;
    const handleMessage = async (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "text" || data.type === "file" || data.type === "audio" || data.type === "video" || data.type === "image") {
        if (data.payload.receiverId === loggedInUser._id && data.payload.status === "sent") {
          increaseTotalUnreadMessages();
        }
      }
      if (data.type === "notification") {
        addNotification(data.payload);
        if (
          data.payload.type === "friendRequestAccepted" ||
          data.payload.type === "newfriendRequest" ||
          data.payload.type === "removeFriend" ||
          data.payload.type === "cancelfriendRequest"
        ) {
          setWSFriendRequest(true);
        }
        if (data.payload.type === "blockFriend") {
          response();
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
      if (data.type === "online_friends") {
        setOnlineFriends(data.payload.onlineFriends);
      }
    };
    if (socket) {
      socket.onmessage = handleMessage;
    }
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socketHolder, connectSocket, loggedInUser, onlineUsers]);
  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
    };
    document.addEventListener("resize", handleResize);
    return () => document.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (!userId) return;
    if (!loggedInUser) return;
    setPageName("Profile");
    setSelected("Posts");
    response();
    return () => {
      setPageName("");
      setUser(null);
      setTabSelectedForFollow(null);
      setShowFriends(null);
      setOpenBlockList(false);
      setNewPost([]);
      postsArrayRef.current = [];
      setNotify(null);
      setBlock(null);
      setOpenHideUserList(null);
      setNotifyClicked(null);
    };
  }, [loggedInUser, userId]);
  useEffect(() => {
    return () => {
      setSavePost(false);
    };
  }, [userId]);
  useEffect(() => {
    if (pageName !== "Profile") return;
    if (!user) return;
    if (block) return;
    fetchPosts(page);
  }, [page, pageName, user, block]);

  useEffect(() => {
    let scrollTimeOut = null;
    function handleScroll() {
      if (scrollTimeOut) return;
      scrollTimeOut = setTimeout(() => {
        if (window.innerHeight + postScroll.current.scrollTop >= postScroll.current.scrollHeight / 2) {
          setPage((prev) => prev + 1);
        }
        scrollTimeOut = null;
      }, 300);
    }
    if (postScroll.current && hasMore && !loadingPosts) {
      postScroll.current.onscroll = handleScroll;
    }
    return () => {
      clearTimeout(scrollTimeOut);
      if (postScroll.current) {
        postScroll.current.onscroll = null;
      }
    };
  }, [loadingPosts, page, hasMore]);
  useEffect(() => {
    if (closeModal) {
      setTabSelectedForFollow(null);
      setShowFriends(null);
      setCloseModal(null);
      setOpenBlockList(false);
      setShareOptions(false);
      setOpenHideUserList(null);
    }
  }, [closeModal]);
  useEffect(() => {
    if (savePost) {
      getSavedPosts();
    }
  }, [savePost]);

  async function getSavedPosts() {
    try {
      setLoadingPosts(true);
      const response = await axiosInstance.get(`/post/getSavedPosts`);
      setSavePostList(response.data.mySavedPosts);
      setHasMore(false);
      setLoadingPosts(false);
    } catch (error) {
      setLoadingPosts(false);
    }
  }

  // Outside clicks handlers

  useEffect(() => {
    function handleClickOutside(e) {
      if (postBoxRef.current && !postBoxRef.current.contains(e.target)) {
        setOpenPost(false);
        setPostDetailsObj(null);
        setOpenPoll(null);
      }
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(e.target)) {
        setShareOptions(false);
      }
      if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(e.target)) {
        setConfirmDelete(false);
      }
      if (followListsRef.current && !followListsRef.current.contains(e.target)) {
        setTabSelectedForFollow(null);
      }
      if (friendListsRef.current && !friendListsRef.current.contains(e.target)) {
        setShowFriends(null);
      }
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setReport(null);
      }
      if (blockListsRef.current && !blockListsRef.current.contains(e.target)) {
        setOpenBlockList(false);
      }
      if (leftBarSearchRef.current && !leftBarSearchRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
      if (showProfilePicFullRef.current && !showProfilePicFullRef.current.contains(e.target)) {
        setShowProfilePicFull(null);
      }
      if (showBannerPicFullRef.current && !showBannerPicFullRef.current.contains(e.target)) {
        setShowBannerPicFull(null);
      }
      if (hideUserRef.current && !hideUserRef.current.contains(e.target)) {
        setOpenHideUserList(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setOpenSearch(false);
      setSavePost(false);
      postsArrayRef.current = [];
    };
  }, []);

  // Topbar rightside profile dropdown click handler
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
        setOpenProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [topBarRightProfilePicRefState]);

  function openPostBox() {
    setOpenPost(true);
  }
  function handlePostSubmit() {
    setOpenPost(false);
  }

  // need work here
  function handleShareClick(buttonName, url) {
    if (buttonName === "CopyLink") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
      return;
    }
    if (buttonName === "Facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?text=${url}`, "_blank");
      return;
    }
    if (buttonName === "Twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
      return;
    }
    if (buttonName === "Whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${window.location.href}`, "_blank");
      return;
    }
    if (buttonName === "Gmail") {
      window.open(`mailto:?subject=Check out this link&body=${window.location.href}`, "_blank");
      return;
    }
  }
  async function handleDeletePost() {
    try {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      const response = await axiosInstance.delete(`/post/${deletePostObj.postId}/${deletePostObj.currentUserId}/deletePost`);
      if (response.data.message === "Post deleted successfully") {
        const deletedNewPosts = post.filter((e) => e._id !== deletePostObj.postId);
        setNewPost(deletedNewPosts);
        setDeletePostObj(null);
        setNotify("Post deleted successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setNotify("Failed to delete post, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
    setConfirmDelete(false);
  }

  async function unblockUser(id, name) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/user/${id}/unblockUser/`);
      if (response.data.message === "Unblocked") {
        setBlock(null);
        setNotify(`You have unblocked ${name.split(" ")[0]}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      if (response.data.message === "Could not unblock, please try again later") {
        setNotify(response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setNotify("Failed to unblock, please try again later");
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
    try {
      const response = await axiosInstance.delete(`/user/${confirmRemoveFriend.userId}/removeFriend`);
      if (response.data.message === `Removed friend`) {
        setConfirmRemoveFriend(null);
        setNotify(`Removed ${confirmRemoveFriend.name} from your friendlist`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "removeFriend",
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
      setNotify("Failed to remove friend, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

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
        setIsLoggedOut(true);
        notifyTimer.current = setTimeout(() => {
          setLogOut(null);
          navigate("/login");
        }, 1000);
      } else {
        throw Error;
      }
    } catch (error) {
      setLogOut(null);
      setNotify("Failed to logout, please try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  async function hideAllPosts() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setHideAllPostUser(null);
    try {
      const response = await axiosInstance.post(`/post/${hideAllPostUser.userId}/hideAllPosts`);
      if (response.data.message === "User hidden") {
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        setNotify(`You will not see any posts from ${hideAllPostUser.username}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      if (error.response.data.message === "User already hidden") {
        setNotify(`You will not see any posts from ${hideAllPostUser.username}`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else {
        setNotify(`Failed to hide user, please try again later.`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
  }
  async function blockUser() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }

    try {
      const response = await axiosInstance.post(`/user/${profileBlock.userId}/blockUser`);
      if (response.data.message === "User blocked") {
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        setBlock({ userId: loggedInUser._id });
        postScroll.current.scrollTop = 0;
        setBlockedUserPosts([...blockedUserPosts, profileBlock.userId]);
        setProfileBlock(null);
        setNotify(`You have blocked ${profileBlock.username}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
          socketHolder.send(
            JSON.stringify({
              type: "blockFriend",
              payload: {
                recipientId: profileBlock.userId,
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
      if (error.response.data.message === "You already blocked this user") {
        setProfileBlock(null);
        setNotify(`You have already blocked ${profileBlock.username}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else {
        setNotify(`Failed to block user, please try again later.`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
  }

  if (loading || !loggedInUser || !user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="spinOnButton h-[30px] w-[30px]"></p>
      </div>
    );
  }

  return (
    <>
      {report && <ReportBox pageName="Profile" width={windowWidth} ref={reportRef} />}
      {confirmDelete && <Confirmation width={windowWidth} cancel={setConfirmDelete} proceed={handleDeletePost} ConfirmText="Are you sure you want to delete this post?" />}
      {confirmRemoveFriend && (
        <Confirmation
          width={windowWidth}
          cancel={setConfirmRemoveFriend}
          proceed={removeFriend}
          ConfirmText={`Are you sure you want to remove ${confirmRemoveFriend.name} from your friend list?`}
        />
      )}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {hideAllPostUser && (
        <Confirmation
          width={windowWidth}
          cancel={setHideAllPostUser}
          proceed={hideAllPosts}
          ConfirmText={`Are you sure you want to hide all posts from ${hideAllPostUser.username}?`}
        />
      )}
      {profileBlock && (
        <Confirmation width={windowWidth} cancel={setProfileBlock} proceed={blockUser} ConfirmText={`Are you sure you want to block ${profileBlock.username}'s profile?`} />
      )}
      {commentDetails && <CommentBox page="Profile" width={windowWidth} {...commentDetails} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />

      {showProfilePicFull && (
        <dialog className={`fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black ${windowWidth > 540 ? "bg-opacity-60" : "bg-opacity-100"}`}>
          <div className="relative flex justify-center items-center h-full w-full">
            <FontAwesomeIcon
              icon={windowWidth > 540 ? faXmark : faArrowLeft}
              onClick={() => setShowProfilePicFull(null)}
              className={`absolute p-2 hover:bg-zinc-600 text-white ${
                windowWidth > 540 ? "top-2 right-1 bg-zinc-700 w-[25px] h-[25px]" : "top-2 left-2 w-[22px] h-[22px]"
              } transition duration-300 rounded-full cursor-pointer`}
            />
            <img ref={showProfilePicFullRef} src={showProfilePicFull} alt="" className={`rounded-xl object-cover ${windowWidth > 540 ? "w-[400px] h-[400px]" : "max-h-[60%]"}`} />
          </div>
        </dialog>
      )}
      {expandImageForPost && (
        <dialog className={`fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black ${windowWidth > 540 ? "bg-opacity-60" : "bg-opacity-100"}`}>
          <div className="relative flex justify-center items-center h-full w-full">
            <FontAwesomeIcon
              icon={windowWidth > 540 ? faXmark : faArrowLeft}
              onClick={() => setExpandImageForPost(null)}
              className={`absolute p-2 hover:bg-zinc-600 text-white ${
                windowWidth > 540 ? "top-2 right-1 bg-zinc-700 w-[25px] h-[25px]" : "top-2 left-2 w-[22px] h-[22px]"
              } transition duration-300 rounded-full cursor-pointer`}
            />
            <div ref={expandImageForPostRef}>
              <Carousel images={expandImageForPost} />
            </div>
          </div>
        </dialog>
      )}

      {showBannerPicFull && (
        <dialog className={`fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black ${windowWidth > 540 ? "bg-opacity-60" : "bg-opacity-100"}`}>
          <div className="relative flex justify-center items-center h-full w-full">
            <FontAwesomeIcon
              icon={windowWidth > 540 ? faXmark : faArrowLeft}
              onClick={() => setShowBannerPicFull(null)}
              className={`absolute p-2 hover:bg-zinc-600 text-white ${
                windowWidth > 540 ? "top-2 right-1 bg-zinc-700 w-[25px] h-[25px]" : "top-2 left-2 w-[22px] h-[22px]"
              } transition duration-300 rounded-full cursor-pointer`}
            />
            <img ref={showBannerPicFullRef} src={showBannerPicFull} alt="" className={`rounded-xl ${windowWidth > 540 ? "w-[70%] max-h-[80%]" : "w-full max-h-[60%]"}`} />
          </div>
        </dialog>
      )}

      {tabSelectedForFollow === "Followers" && (
        <FollowersList width={windowWidth} ref={followListsRef} tabName={"Followers"} currentUserId={loggedInUser._id} user_name={user.name} userId={userId} />
      )}
      {tabSelectedForFollow === "Following" && (
        <FollowersList width={windowWidth} ref={followListsRef} tabName={"Following"} currentUserId={loggedInUser._id} user_name={user.name} userId={userId} />
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

      {showFriends === "Friends" && <FriendsList width={windowWidth} ref={friendListsRef} currentUserId={loggedInUser._id} />}
      {openHideUserList && <HideUser ref={hideUserRef} width={windowWidth} currentUserId={loggedInUser._id} />}
      {openBlockList && <BlockList width={windowWidth} ref={blockListsRef} currentUserId={loggedInUser._id} />}
      {shareOptions && <ShareModal page="Profile" ref={shareOptionsRef} />}
      {logOut && <Logout />}

      <div className={`parent inter relative flex flex-col w-full ${windowWidth > 550 ? "bg-zinc-100 bg-opacity-60" : "bg-zinc-300"}`}>
        {notify && windowWidth > 450 && <Notify page="Profile" reference={notifyTimer} width={windowWidth} notify={notify} />}
        {notify && windowWidth <= 450 && (
          <div className="absolute w-[100%] bottom-10 flex justify-center">
            <Notify page="Profile" reference={notifyTimer} width={windowWidth} notify={notify} />
          </div>
        )}
        <div>
          <Topbar />
          <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
          <AnimatePresence>{openSearch && <SearchBox width={windowWidth} page={"Profile"} ref={leftBarSearchRef} />}</AnimatePresence>
        </div>
        <div className="mainsection relative ">
          {/* <AnimatePresence>{notifyClicked && windowWidth > 550 && <Notification width={windowWidth} />}</AnimatePresence> */}
          <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Profile"} ref={profileDropdownRef} />}</AnimatePresence>
          {windowWidth >= 1024 && <Leftbar width={windowWidth} />}

          {/* {selected !== "Photos" && ( */}
          <div ref={postScroll} className={`postContents overflow-y-scroll ${windowWidth > 768 ? "" : "scrollbar-none"} `}>
            <div className={`middleBar  ${windowWidth >= 1280 && "mr-[70px]"} mr-0 relative`}>
              {block && (
                <dialog className="absolute inset-0 w-[100%] h-[100%] z-10 flex justify-center bg-[#E9E9E9] bg-opacity-100">
                  <div className="flex mt-10" style={{ height: `${innerHeight}px` }}>
                    <div className={`${windowWidth > 400 ? "w-[400px]" : "w-[100vw]"} h-[200px] bg-white rounded-mdcd  flex flex-col justify-center items-center`}>
                      <div className="text-2xl mb-2 font-bold">Blocked user</div>
                      <div className="mb-2">
                        {block.userId === loggedInUser._id && `You have blocked ${user.name.split(" ")[0]}'s profile`}
                        {block.userId !== loggedInUser._id && `${user.name.split(" ")[0]} has blocked you, you can not see this profile.`}
                      </div>
                      {block.userId === loggedInUser._id && (
                        <button
                          onClick={() => unblockUser(user._id, user.name)}
                          className="px-6 py-[6px] ml-0 rounded-md bg-gradient-to-r from-slate-700 to-slate-900 transition duration-200 hover:opacity-90 text-white"
                        >
                          Unblock
                        </button>
                      )}
                    </div>
                  </div>
                </dialog>
              )}
              <div className="profileimgages bg-white rounded-lg">
                <BannerImg width={windowWidth} loggedInUser={loggedInUser} />
                <ProfileImg width={windowWidth} loggedInUser={loggedInUser} />
              </div>
              {selected === "Posts" && !savePost && loggedInUser._id === user._id && <WritePost width={windowWidth} onClick={openPostBox} />}
              <div className="flex flex-col items-center pb-[150px]">
                {!savePost && selected === "Posts" && (
                  <>
                    {post.length > 0 &&
                      post.map((e, i) => {
                        const showTime = postTimeLogic(e);
                        return (
                          <Post
                            key={i}
                            userId={e.userId}
                            width={windowWidth}
                            page="Profile"
                            currentUserId={loggedInUser._id}
                            id={e._id}
                            logoImg={e.creatorProfilePic}
                            username={e.postCreator}
                            likedData={likedData}
                            time={showTime}
                            textContent={e.postTextContent}
                            postImage={e.image}
                            postVideo={e.video}
                            audience={e.audience}
                            likes={e.likes}
                            comments={e.commentCount}
                            shares={e.sharesCount}
                            views={e.views}
                            type={e.type}
                            question={e.question}
                            option1={e.option1}
                            option2={e.option2}
                            totalVotes={e.totalVotes}
                            votesOnOption1={e.votesOnOption1}
                            votesOnOption2={e.votesOnOption2}
                            voters={e.voters}
                          />
                        );
                      })}
                    {!hasMore && !loadingPosts && noPost && <div className="text-zinc-500 mt-8">{noPost}</div>}
                    {loadingPosts && hasMore && <PostSkeleton width={windowWidth} />}
                  </>
                )}
                {savePost && !loadingPosts && savePostList && savePostList.length > 0 && (
                  <>
                    <div className="text-zinc-600 border-b-2 border-zinc-300 text-md mt-2">Your Saved posts</div>
                    {savePostList.map((e, i) => {
                      const showTime = postTimeLogic(e.postId);
                      return (
                        <Post
                          key={i}
                          userId={e.postId.userId}
                          width={windowWidth}
                          page="Profile"
                          savedPosts={true}
                          currentUserId={loggedInUser._id}
                          id={e.postId._id}
                          likedData={likedData}
                          logoImg={e.postId.creatorProfilePic}
                          username={e.postId.postCreator}
                          time={showTime || ""}
                          textContent={e.postId.postTextContent}
                          postImage={e.postId.image}
                          postVideo={e.postId.video}
                          audience={e.postId.audience}
                          likes={e.postId.likes}
                          comments={e.postId.commentCount}
                          shares={e.postId.sharesCount}
                          views={e.postId.views}
                        />
                      );
                    })}
                  </>
                )}
                {savePost && loadingPosts && <PostSkeleton width={windowWidth} />}
                {savePost && !loadingPosts && savePostList && savePostList.length === 0 && <div className="text-zinc-500 mt-[40px]">No saved posts</div>}
                {selected === "About" && <About width={windowWidth} user={user} />}
                {selected === "Photos" && <Photos width={windowWidth} userId={userId} />}
                {selected === "Videos" && <VideoProfilePage width={windowWidth} userId={userId} />}
              </div>
            </div>
          </div>
          {/* )} */}
          {openPost && <PostBox width={windowWidth} onSubmit={handlePostSubmit} page="Profile" ref={postBoxRef} />}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
