import React, { useEffect, useState, useRef } from "react";
import Topbar from "../components/layout/Topbar";
import "./../styles/HomePage.css";
import WritePost from "../components/layout/WritePost";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState.js";
import postTimeLogic from "../lib/Post_Time_Logic.js";
import PostBox from "../components/layout/PostBox";
import Post from "../components/layout/Post";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import defaultProfilePic from "../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import post_uploaded from "../../src/assets/notification_sound/post_uploaded.mp3";
import { faXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faWhatsapp, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import CommentBox from "../components/layout/commentBox.jsx";
import Photos from "../components/layout/Photos.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import mongoose from "mongoose";
import delete_notification from "../assets/notification_sound/delete_notification.wav";
import SearchBox from "../components/layout/SearchBox.jsx";
import ReportBox from "../components/layout/ReportBox.jsx";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown.jsx";
import Logout from "../components/layout/Logout.jsx";
import BlockList from "../components/layout/BlockList.jsx";
import ShareModal from "../components/layout/ShareModal.jsx";
import Leftbar from "../components/layout/LeftBar.jsx";
import Confirmation from "../components/layout/Confirmation.jsx";
import HideUser from "../components/layout/HideUser.jsx";
import FriendsList from "../components/layout/FriendsList.jsx";
import Notify from "../components/layout/Notify.jsx";
import PostSkeleton from "../components/layout/PostSkeleton.jsx";
import VideoPlayer from "../components/layout/VideoPlayer.jsx";
import Carousel from "../components/layout/Carousel.jsx";
import Notification from "../components/layout/Notification.jsx";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const user = globalState((state) => state.user);
  // const setUser = globalState((state) => state.setUser);
  const id = JSON.parse(localStorage.getItem("user"));
  const postBoxRef = useRef();
  const navigate = useNavigate();
  const { postId } = useParams();
  const commentDetails = globalState((state) => state.commentDetails);
  const shareOptionsRef = useRef();
  // const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const profilePic = globalState((state) => state.profilePic);
  const selectedTab = globalState((state) => state.selected);
  const shareOptions = globalState((state) => state.shareOptions);
  const setShareOptions = globalState((state) => state.setShareOptions);
  const confirmDelete = globalState((state) => state.confirmDelete);
  const setConfirmDelete = globalState((state) => state.setConfirmDelete);
  const deletePostObj = globalState((state) => state.deletePostObj);
  const setDeletePostObj = globalState((state) => state.setDeletePostObj);
  const setHideAllPostUser = globalState((state) => state.setHideAllPostUser);
  const hideAllPostUser = globalState((state) => state.hideAllPostUser);
  const showFriends = globalState((state) => state.showFriends);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const setSelected = globalState((state) => state.setSelected);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const changeWidth = globalState((state) => state.changeWidth);
  const setChangeWidth = globalState((state) => state.setChangeWidth);
  const expandImageForPost = globalState((state) => state.expandImageForPost);
  const setExpandImageForPost = globalState((state) => state.setExpandImageForPost);
  // const [showLoading, setShowLoading] = useState(false);
  const [numOfComment, setNumOfComment] = useState("");

  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  // const [homePagePost, setHomePagePost] = useState([]);
  const openPost = globalState((state) => state.openPost);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setPostDetailsObj = globalState((state) => state.setPostDetailsObj);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const setTotalUnreadMessages = globalState((state) => state.setTotalUnreadMessages);
  const totalUnreadMessages = globalState((state) => state.totalUnreadMessages);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const pageName = globalState((state) => state.pageName);
  const setPageName = globalState((state) => state.setPageName);
  const setOpenHideUserList = globalState((state) => state.setOpenHideUserList);
  const openHideUserList = globalState((state) => state.openHideUserList);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const setFriendRequests = globalState((state) => state.setFriendRequests);
  const setFriendsList = globalState((state) => state.setFriendsList);
  const increaseTotalUnreadMessages = globalState((state) => state.increaseTotalUnreadMessages);
  const report = globalState((state) => state.report);
  const setReport = globalState((state) => state.setReport);
  const blockedUserPosts = globalState((state) => state.blockedUserPosts);
  const setBlockedUserPosts = globalState((state) => state.setBlockedUserPosts);
  const setOnlineFriends = globalState((state) => state.setOnlineFriends);
  const likedData = globalState((state) => state.likedData);
  const setLikedData = globalState((state) => state.setLikedData);
  const setOpenPoll = globalState((state) => state.setOpenPoll);
  const logOut = globalState((state) => state.logOut);
  const openBlockList = globalState((state) => state.openBlockList);
  const closeModal = globalState((state) => state.closeModal);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const setOpenBlockList = globalState((state) => state.setOpenBlockList);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const setProfileBlock = globalState((state) => state.setProfileBlock);
  const profileBlock = globalState((state) => state.profileBlock);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const setLogOut = globalState((state) => state.setLogOut);
  const onlineUsers = globalState((state) => state.onlineUsers);
  const setOnlineUsers = globalState((state) => state.setOnlineUsers);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  const setIsLoggedOut = globalState((state) => state.setIsLoggedOut);
  // const [likedData, setLikedData] = useState([]);
  // const postBoxRef = useRef();

  const postScroll = useRef();
  const confirmDeleteRef = useRef();
  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const leftBarSearchRef = useRef();
  const postsArrayRef = useRef();
  const reportRef = useRef();
  const blockListsRef = useRef();
  const sharedPostRef = useRef();
  const hideUserRef = useRef();
  const friendListsRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();
  const expandImageForPostRef = useRef();

  const response = async () => {
    let result = null;
    try {
      result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setUser(result.data.user);
      setLoading(false);
    } catch (err) {
      navigate("/login");
    }
  };
  useEffect(() => {
    setPageName("Home");
    setSelected("Home");
    response();
    return () => {
      setPageName("");
      setHomePagePost([]);
      setNotifyClicked(null);
      setOpenPost(false);
    };
  }, []);

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
      }
      if (data.type === "online_friends") {
        setOnlineFriends(data.payload.onlineFriends);
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

  const fetchPosts = async (page) => {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    let getThisPost = null;
    try {
      setLoadingPosts(true);
      if (postId && mongoose.Types.ObjectId.isValid(postId)) {
        getThisPost = await axiosInstance.get(`/post/${postId}/getThisPost`);
      }
      const responseForPosts = await axiosInstance.get(`/post/getAllPost`, {
        params: { page: page, limit: 50 },
      });
      if (responseForPosts.data.allPosts && responseForPosts.data.allPosts.length === 0) {
        setHasMore(false);
        setLoadingPosts(false);
        setLoading(false);
      }
      if (responseForPosts.data.allPosts && responseForPosts.data.allPosts.length > 0) {
        setLikedData(responseForPosts.data.likedData);
        const newArr = [...homePagePost, ...responseForPosts.data.allPosts];
        if (getThisPost?.data?.post) {
          newArr.unshift(getThisPost.data.post);
        }
        setHomePagePost(newArr);
        setLoadingPosts(false);
        setLoading(false);
      } else {
        setHasMore(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setLoadingPosts(false);
      setNotify("Failed to get posts, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  };

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
    };
  }, []);

  useEffect(() => {
    if (pageName !== "Home") return;
    fetchPosts(page);
  }, [page, pageName]);

  useEffect(() => {
    let scrollTimeOut = false;
    if (!loadingPosts && postScroll.current) {
      postScroll.current.onscroll = function handleScroll() {
        if (scrollTimeOut) return;

        scrollTimeOut = setTimeout(() => {
          if (window.innerHeight + postScroll.current.scrollTop >= postScroll.current.scrollHeight * 0.7) {
            if (hasMore) {
              setPage((prev) => prev + 1);
            }
          }
          scrollTimeOut = false;
        }, 300);
      };
    }
    return () => {
      clearTimeout(scrollTimeOut);
    };
  }, [loadingPosts]);

  // click outside handler
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
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setReport(null);
      }
      if (blockListsRef.current && !blockListsRef.current.contains(e.target)) {
        setOpenBlockList(false);
      }
      if (leftBarSearchRef.current && !leftBarSearchRef.current.contains(e.target)) {
        setOpenSearch(false);
      }
      if (hideUserRef.current && !hideUserRef.current.contains(e.target)) {
        setOpenHideUserList(false);
      }
      if (friendListsRef.current && !friendListsRef.current.contains(e.target)) {
        setShowFriends(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      setOpenSearch(false);
      setReport(null);
      setOpenBlockList(false);
      document.removeEventListener("mousedown", handleClickOutside);
      setNotify(null);
    };
  }, []);
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
  useEffect(() => {
    if (notify === "Post uploaded successfully" || notify === "Post updated successfully") {
      if (postUploadedSoundRef.current) {
        postUploadedSoundRef.current.play();
      }
    }
  }, [notify]);

  useEffect(() => {
    let newArr;
    if (blockedUserPosts && blockedUserPosts.length > 0) {
      blockedUserPosts.forEach((e) => {
        newArr = homePagePost.filter((post, ind) => post.userId !== e);
      });
      setHomePagePost(newArr);
    }
  }, [blockedUserPosts]);

  useEffect(() => {
    if (closeModal) {
      setOpenBlockList(null);
      setOpenHideUserList(null);
      setCloseModal(null);
      setShareOptions(null);
      setShowFriends(null);
    }
  }, [closeModal]);

  function handlePostSubmit() {
    setOpenPost(false);
  }

  async function handleDeletePost() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.delete(`/post/${deletePostObj.postId}/${deletePostObj.userId}/deletePost`);
      if (response.data.message === "Post deleted successfully") {
        deletePostObj?.ref.current.remove();
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

  async function blockUser() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }

    try {
      const response = await axiosInstance.post(`/user/${profileBlock.userId}/blockUser`);
      await axiosInstance.delete(`/message/deleteAllMessages/${profileBlock.userId}`);
      if (response.data.message === "User blocked") {
        if (deleteSoundRef.current) {
          deleteSoundRef.current.play();
        }
        setBlockedUserPosts([...blockedUserPosts, profileBlock.userId]);
        setProfileBlock(null);
        setNotify(`You have blocked ${profileBlock.username}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
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

  async function hideAllPosts() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    const newArr = homePagePost.filter((e) => e.userId !== hideAllPostUser.userId);
    setHomePagePost(newArr);
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

  if (loading || !loggedInUser) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="spinOnButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <>
      {confirmDelete && <Confirmation width={windowWidth} cancel={setConfirmDelete} proceed={handleDeletePost} ConfirmText={"Are you sure you want to delete this post?"} />}
      {profileBlock && (
        <Confirmation width={windowWidth} cancel={setProfileBlock} proceed={blockUser} ConfirmText={`Are you sure you want to block ${profileBlock.username}'s profile?`} />
      )}
      {hideAllPostUser && (
        <Confirmation
          width={windowWidth}
          cancel={setHideAllPostUser}
          proceed={hideAllPosts}
          ConfirmText={`Are you sure you want to hide all posts from ${hideAllPostUser.username}?`}
        />
      )}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {commentDetails && <CommentBox page="Home" width={windowWidth} {...commentDetails} />}
      {shareOptions && <ShareModal page="Home" ref={shareOptionsRef} />}
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
      {report && <ReportBox pageName="Home" width={windowWidth} ref={reportRef} />}
      {openHideUserList && <HideUser ref={hideUserRef} width={windowWidth} currentUserId={loggedInUser._id} />}
      {openBlockList && <BlockList ref={blockListsRef} width={windowWidth} currentUserId={loggedInUser._id} />}
      {logOut && <Logout width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />

      <div className={`parent inter flex flex-col w-full ${windowWidth > 550 ? "bg-zinc-100 bg-opacity-60" : "bg-zinc-300"} `}>
        {notify && windowWidth > 450 && <Notify page="Home" reference={notifyTimer} width={windowWidth} notify={notify} />}
        {notify && windowWidth <= 450 && (
          <div className="absolute w-[100%] bottom-10 flex justify-center">
            <Notify page="Home" reference={notifyTimer} width={windowWidth} notify={notify} />
          </div>
        )}
        <div className="">
          <Topbar />
          <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
          <AnimatePresence>{openSearch && <SearchBox width={windowWidth} page={"Home"} ref={leftBarSearchRef} />}</AnimatePresence>
        </div>
        <div className="mainsection relative">
          <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Home"} ref={profileDropdownRef} />}</AnimatePresence>
          {windowWidth >= 1024 && <Leftbar width={windowWidth} />}
          <div ref={postScroll} className={`postContents overflow-y-scroll ${windowWidth > 768 ? "" : "scrollbar-none"}`}>
            <div className={`middleBar ${windowWidth >= 1280 && "mr-[70px]"} mr-0 `}>
              <WritePost width={windowWidth} />
              {homePagePost.length > 0 &&
                homePagePost.map((e, i) => {
                  const showTime = postTimeLogic(e);
                  return (
                    <Post
                      key={i}
                      width={windowWidth}
                      userId={e.userId}
                      currentUserId={loggedInUser._id}
                      id={e._id}
                      page={"Home"}
                      logoImg={e.creatorProfilePic}
                      username={e.postCreator}
                      time={showTime}
                      textContent={e.postTextContent}
                      postImage={e.image}
                      postVideo={e.video}
                      audience={e.audience}
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
              {loadingPosts && <PostSkeleton width={windowWidth} />}
              {!loadingPosts && !hasMore && <div className="text-zinc-500 mt-6 flex justify-center">No more posts to show</div>}
            </div>
          </div>
          {openPost && <PostBox onSubmit={handlePostSubmit} width={windowWidth} page="Home" ref={postBoxRef} />}
        </div>
      </div>
    </>
  );
};

export default HomePage;
