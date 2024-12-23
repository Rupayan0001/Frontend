import React, { useEffect, useState, useRef } from 'react'
import Topbar from '../components/layout/Topbar';
import './../styles/HomePage.css'

import WritePost from '../components/layout/WritePost';
import { axiosInstance } from '../lib/axios';
import userProfilePicStore from '../lib/userProfilePicStore.js';
import newPostStore from '../lib/NewPost.js';
import postTimeLogic from '../lib/Post_Time_Logic.js';
import PostBox from '../components/layout/PostBox';
import Post from '../components/layout/Post';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultProfilePic from "../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import {
  faMagnifyingGlass, faCreditCard, faSquarePlus, faCirclePlay, faGear, faPhone, faUserGroup, faHouse,
  faLandmark, faBriefcase, faMessage, faStore, faGamepad, faVideo, faBars, faBell, faCopy, faEnvelope,
  faRightFromBracket, faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faWhatsapp, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import CommentBox from '../components/layout/commentBox.jsx';
import Photos from '../components/layout/Photos.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import SearchBox from '../components/layout/SearchBox.jsx';
import ReportBox from '../components/layout/ReportBox.jsx';
import TopbarRightDropdown from '../components/layout/TopbarRightDropdown.jsx';
import Logout from '../components/layout/Logout.jsx';
import BlockList from '../components/layout/BlockList.jsx';
import ShareModal from '../components/layout/ShareModal.jsx';
import Leftbar from '../components/layout/LeftBar.jsx';


const HomePage = () => {
  // const post = newPostStore((state) => state.post);
  const [loading, setLoading] = useState(true);
  const user = userProfilePicStore((state) => state.user);
  // const setUser = userProfilePicStore((state) => state.setUser);
  const id = JSON.parse(localStorage.getItem("user"));
  // const [openPost, setOpenPost] = useState(false);
  const postBoxRef = useRef();
  const navigate = useNavigate();
  const { postId } = useParams();
  const commentDetails = userProfilePicStore((state) => state.commentDetails);
  const shareOptionsRef = useRef();
  // const user = userProfilePicStore((state) => state.user);
  const setUser = userProfilePicStore((state) => state.setUser);
  const profilePic = userProfilePicStore((state) => state.profilePic);
  const selectedTab = userProfilePicStore((state) => state.selected);
  const setSelectedTab = userProfilePicStore((state) => state.setSelected);
  const shareOptions = userProfilePicStore((state) => state.shareOptions);
  const setShareOptions = userProfilePicStore((state) => state.setShareOptions);
  const confirmDelete = userProfilePicStore((state) => state.confirmDelete);
  const setConfirmDelete = userProfilePicStore((state) => state.setConfirmDelete);
  const deletePostObj = userProfilePicStore((state) => state.deletePostObj);
  const setDeletePostObj = userProfilePicStore((state) => state.setDeletePostObj);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  // const [showLoading, setShowLoading] = useState(false);
  const [numOfComment, setNumOfComment] = useState("");
  const [sharedPost, setSharedPost] = useState(null);

  const homePagePost = userProfilePicStore((state) => state.homePagePost);
  const setHomePagePost = userProfilePicStore((state) => state.setHomePagePost);
  // const [homePagePost, setHomePagePost] = useState([]);
  const openPost = userProfilePicStore((state) => state.openPost);
  const setOpenPost = userProfilePicStore((state) => state.setOpenPost);
  const setPostDetailsObj = userProfilePicStore((state) => state.setPostDetailsObj);
  const openProfileDropdown = userProfilePicStore((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = userProfilePicStore((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = userProfilePicStore((state) => state.topBarRightProfilePicRefState);
  const notify = userProfilePicStore((state) => state.notify);
  const setNotify = userProfilePicStore((state) => state.setNotify);
  const pageName = userProfilePicStore((state) => state.pageName);
  const setPageName = userProfilePicStore((state) => state.setPageName);
  const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
  const setLoggedInUser = userProfilePicStore((state) => state.setLoggedInUser);
  const openSearch = userProfilePicStore((state) => state.openSearch);
  const setOpenSearch = userProfilePicStore((state) => state.setOpenSearch);
  const setFriendRequests = userProfilePicStore((state) => state.setFriendRequests);
  const setFriendsList = userProfilePicStore((state) => state.setFriendsList);
  const report = userProfilePicStore((state) => state.report);
  const setReport = userProfilePicStore((state) => state.setReport);
  const blockedUserPosts = userProfilePicStore((state) => state.blockedUserPosts);
  const setBlockedUserPosts = userProfilePicStore((state) => state.setBlockedUserPosts);
  const likedData = userProfilePicStore((state) => state.likedData);
  const setLikedData = userProfilePicStore((state) => state.setLikedData);
  const logOut = userProfilePicStore((state) => state.logOut);
  const openBlockList = userProfilePicStore((state) => state.openBlockList);
  const closeModal = userProfilePicStore((state) => state.closeModal);
  const setCloseModal = userProfilePicStore((state) => state.setCloseModal);
  const setOpenBlockList = userProfilePicStore((state) => state.setOpenBlockList);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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

  const response = async () => {
    try {
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      console.log("Result: ", result.data)

      setLoggedInUser(result.data.user);
      setUser(result.data.user);
      setTimeout(() => {
        setLoading(false);

      }, 500);
    }
    catch (err) {
      console.log(err);
      // navigate("/login");
    }
  }
  useEffect(() => {
    setPageName("Home")
    response()
    return () => {
      setPageName("")
      setHomePagePost([]);
    }
  }, []);

  // console.log("85", loggedInUser);


  function handlePostSubmit() {
    setOpenPost(false);
  }


  const fetchPosts = async (page) => {
    console.log("fetching...........")
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      setLoadingPosts(true);
      if (postId) {
        const getThisPost = await axiosInstance.get(`/post/${postId}/getThisPost`);
        if (getThisPost.data.post) {
          console.log("sharedPost...............", getThisPost.data.post)
          setSharedPost(getThisPost.data.post);
        }
      }
      const responseForPosts = await axiosInstance.get(`/post/getAllPost`, {
        params: { page: page, limit: 50 }
      });
      if (responseForPosts.data.allPosts && responseForPosts.data.allPosts.length === 0) {
        setHasMore(false);
        setLoadingPosts(false);
        // setShowLoading(false);
        setLoading(false);
      }
      if (responseForPosts.data.allPosts && responseForPosts.data.allPosts.length > 0) {
        setLikedData(responseForPosts.data.likedData);
        // console.log(responseForPosts.data.allPosts)
        console.log("homePagePost", homePagePost)
        const newArr = [...homePagePost, ...responseForPosts.data.allPosts];
        // const allIds = newArr.map((e) => {
        //   return e._id;
        // })
        // const unique = [...new Set(allIds)]
        // const uniquePosts = [];
        // unique.forEach((e) => {
        //   uniquePosts.push(newArr.find(obj => obj._id === e));
        // })
        setHomePagePost(newArr);
        setLoadingPosts(false);
        // setShowLoading(false);
        setLoading(false);
        // console.log(homePagePost);
      }
      else {
        // console.log("Setting hasmore to false")
        setHasMore(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
      // window.location.reload();
      setNotify("Something went wrong, refreshing the page");
      notifyTimer.current = setTimeout(() => {
        setNotify(null)
      }, 5 * 1000)
    }

  }

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);

    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    }
  }, [])

  useEffect(() => {
    if (pageName !== "Home") return;
    console.log("fired", pageName)
    fetchPosts(page)
  }, [page, pageName]);

  // console.log("Post: ", post);

  useEffect(() => {
    console.log("Page fetching: ", page);
    let scrollTimeOut = false;
    if (!loadingPosts && postScroll.current) {
      // console.log("Mounted", postScroll.current)

      postScroll.current.onscroll = function handleScroll() {
        if (scrollTimeOut) return;

        scrollTimeOut = setTimeout(() => {
          // console.log("Scrolled", window.innerHeight, postScroll.current.scrollTop, postScroll.current.scrollHeight);
          if (window.innerHeight + postScroll.current.scrollTop >= postScroll.current.scrollHeight * 0.7) {
            // console.log("fired 300px");
            if (hasMore) {
              setPage(prev => prev + 1);
            }
          }
          scrollTimeOut = false;

        }, 300);
      }

    }
    return () => {
      clearTimeout(scrollTimeOut);
    }

  }, [loadingPosts])

  // click outside handler 
  useEffect(() => {

    function handleClickOutside(e) {
      if (postBoxRef.current && !postBoxRef.current.contains(e.target)) {
        setOpenPost(false);
        setPostDetailsObj(null);
      }
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(e.target)) {
        // console.log("Clicked")
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
      // if(sharedPostRef.current && !sharedPostRef.current.contains(e.target) && !commentDetails) {
      //   setSharedPost(null);
      // }

    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      setOpenSearch(false);
      setReport(null);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [])
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
        setOpenProfileDropdown(false);
      }

    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [topBarRightProfilePicRefState]);

  //  not working 
  useEffect(() => {
    // console.log("blockedUserPosts from profile: ", blockedUserPosts)
    if (blockedUserPosts && blockedUserPosts.length > 0) {
      blockedUserPosts.forEach(e => {
        homePagePost.forEach((post, ind) => {
          if (post.userId === e) {
            homePagePost.splice(ind, 1)
          }
        })
      })
      setHomePagePost(homePagePost)
    }
  }, [blockedUserPosts])

  useEffect(() => {
    // console.log("closeModal: ", closeModal)
    if (closeModal) {
      setOpenBlockList(false);
      setCloseModal(null);
      setShareOptions(false);
    }
  }, [closeModal]);
  // console.log("closeModal :", closeModal)
  useEffect(() => {
    // console.log("closeModal :", closeModal)
  }, [closeModal])

  function openPostBox() {
    setOpenPost(true);

  }
  function handlePostSubmit() {
    setOpenPost(false);
  }


  // console.log(commentDetails)
  async function handleDeletePost() {
    // console.log("deletePostObj: ",deletePostObj)
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
          setNotify(null)
        }, 5 * 1000)
        // alert("Post deleted successfully");
      }
    } catch (error) {
      console.log(error)
      setNotify("Something went wrong, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null)
      }, 5 * 1000)
    }
    setConfirmDelete(false)
  }

  function handleCloseSharedPost() {
    setSharedPost(null)
    navigate("/home", { replace: true })
  }


  if (loading || !loggedInUser) {
    return <div className='h-screen flex justify-center items-center'><p className='spinOnButton h-[30px] w-[30px]'></p></div>
  }
  return (
    <>
      {confirmDelete && <dialog className='fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black bg-opacity-60'>
        <div ref={confirmDeleteRef} className='w-[500px] h-[215px] bg-white rounded-xl p-5'>
          <h1 className='text-center text-2xl font-semibold border-b-2 pb-4 border-zinc-300 mb-5 text-black'>Are you sure?</h1>
          <p className='text-black'>If you delete this post, it cannot be recovered. Are you sure you want to delete this post?</p>
          <div className='flex mt-6 justify-end'>
            <button onClick={() => setConfirmDelete(false)} className=' font-semibold  bg-[#6A0DAD] px-6 py-[6px] pb-[8px] rounded-md text-white flex justify-center items-center'>Cancel</button>
            <button onClick={() => handleDeletePost()} className=' font-semibold  ml-6 bg-[#6A0DAD] px-6 py-[6px] pb-[8px] rounded-md text-white flex justify-center items-center'>Delete</button>
          </div>

        </div>
      </dialog>}
      {commentDetails && <CommentBox width={windowWidth} {...commentDetails} />}
      {shareOptions && <ShareModal ref={shareOptionsRef} />}

      {sharedPost && <dialog className='fixed inset-0 h-[100%] z-10 w-[100%] bg-black bg-opacity-70 flex justify-center items-center'>
        {/* <div className='h-[650px] reportShadow flex justify-center items-center rounded-xl bg-black w-[850px]'> */}
        {sharedPost && <div ref={sharedPostRef} >
          <FontAwesomeIcon icon={faXmark} onClick={() => handleCloseSharedPost()} className='absolute w-[25px] h-[25px] p-2 hover:bg-zinc-900 hover:text-white bg-white text-zinc-900 top-2 right-2 transition duration-300 rounded-full top-0 right-0 cursor-pointer' />
          <Post userId={sharedPost.userId} currentUserId={loggedInUser._id} id={sharedPost._id} logoImg={sharedPost.creatorProfilePic} username={sharedPost.postCreator} time={postTimeLogic(sharedPost)} textContent={sharedPost.postTextContent} postImage={sharedPost.image} postVideo={sharedPost.video} audience={sharedPost.audience} likes={sharedPost.likes} comments={sharedPost.commentCount} shares={sharedPost.shares} views={sharedPost.views} />

        </div>}
        {/* </div> */}

      </dialog>}
      {report && <ReportBox ref={reportRef} />}
      {openBlockList && <BlockList ref={blockListsRef} currentUserId={loggedInUser._id} />}
      {logOut && <Logout />}




      <div className='parent flex flex-col w-full bg-[#E9E9E9]'>
        {notify && <div className='absolute giveShadow left-6 bottom-10 z-50 bg-zinc-900 px-5 py-3 text-white rounded-lg'>
          {notify} <button className='cursor-pointer hover:bg-zinc-700 transition duration-200 border-0 px-2 py-1 ml-2 bg-zinc-800 rounded-md font-semibold text-[15px]' onClick={() => window.location.reload()}>Reload</button>
        </div>}
        <div className=''>
          <Topbar />
          {openSearch && <SearchBox page={"Home"} ref={leftBarSearchRef} />}


        </div>
        <div className="mainsection relative">

          {openProfileDropdown && <TopbarRightDropdown pageName={"Home"} ref={profileDropdownRef} />}
          <Leftbar />
          {/* #DC143C video audio call */}
          <div ref={postScroll} className="postContents ">
            <div className="middleBar xl:mr-[80px] mr-0 ">
              <WritePost width={windowWidth} onClick={openPostBox} />
              {console.log("homePagePost", homePagePost)}
              {homePagePost.length > 0 && homePagePost.map((e, i) => {
                // console.log(e)

                const showTime = postTimeLogic(e)

                return <Post key={i} width={windowWidth} userId={e.userId} currentUserId={loggedInUser._id} id={e._id} likedData={likedData} page={"Home"} logoImg={e.creatorProfilePic} username={e.postCreator} time={showTime} textContent={e.postTextContent} postImage={e.image} postVideo={e.video} audience={e.audience} likes={e.likes} comments={e.commentCount} shares={e.shares} views={e.views} />
              })};
              {loadingPosts && <div className="text-zinc-500 mt-6 flex justify-center"><p className='spinOnButton h-[25px] w-[25px]'></p></div>}
              {!loadingPosts && !hasMore && <div className="text-zinc-500 mt-6 flex justify-center">No more posts to show</div>}
            </div>
          </div>
          {openPost &&
            <PostBox onSubmit={handlePostSubmit} state={setHomePagePost} page="Home" ref={postBoxRef} />
          }

          {/* <div className="rightBar">

        </div> */}
        </div>
      </div>
    </>
  )
}

export default HomePage;
