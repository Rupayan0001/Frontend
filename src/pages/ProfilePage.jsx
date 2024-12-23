import React, { useState, useEffect, useRef } from 'react'
import Topbar from '../components/layout/Topbar'
import LeftBarComponent from '../components/layout/LeftBarComponent'
import Post from '../components/layout/Post';
import './../styles/ProfilePage.css'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import userProfilePicStore from '../lib/userProfilePicStore.js';
import SearchBox from '../components/layout/SearchBox.jsx';
import {
    faMagnifyingGlass, faCreditCard, faSquarePlus, faCirclePlay, faGear, faUserGroup, faHouse,
    faLandmark, faBriefcase, faMessage, faStore, faGamepad, faVideo, faBars, faBell, faCopy, faEnvelope,
    faRightFromBracket, faUser,
    faBookmark,
    faBan,
    faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faWhatsapp, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import BannerImg, { ProfileImg } from '../components/layout/BannerImg';
import PostBox from '../components/layout/PostBox.jsx';
import postTimeLogic from '../lib/Post_Time_Logic.js';
import CommentBox from '../components/layout/commentBox.jsx';
import newPostStore from '../lib/NewPost.js';
import About from '../components/layout/About.jsx';
import Photos from '../components/layout/Photos.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import FollowersList from '../components/layout/FollowersList.jsx';
import FriendsList from '../components/layout/FriendsList.jsx';
import ReportBox from '../components/layout/ReportBox.jsx';
import TopbarRightDropdown from '../components/layout/TopbarRightDropdown.jsx';
import BlockList from '../components/layout/BlockList.jsx';
import Logout from '../components/layout/Logout.jsx';
import ShareModal from '../components/layout/ShareModal.jsx';
import Leftbar from '../components/layout/LeftBar.jsx';
const ProfilePage = () => {
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const user = userProfilePicStore((state) => state.user);
    const setUser = userProfilePicStore((state) => state.setUser);
    const profilePic = userProfilePicStore((state) => state.profilePic);
    const selectedTab = userProfilePicStore((state) => state.selected);
    const setSelectedTab = userProfilePicStore((state) => state.setSelected);
    const shareOptions = userProfilePicStore((state) => state.shareOptions);
    const setShareOptions = userProfilePicStore((state) => state.setShareOptions);
    const confirmDelete = userProfilePicStore((state) => state.confirmDelete);
    const setConfirmDelete = userProfilePicStore((state) => state.setConfirmDelete);
    const deletePostObj = userProfilePicStore((state) => state.deletePostObj);
    const commentDetails = userProfilePicStore((state) => state.commentDetails);
    const setDeletePostObj = userProfilePicStore((state) => state.setDeletePostObj);
    const [page, setPage] = useState(1);
    const [noPost, setNoPost] = useState("");
    const [hasMore, setHasMore] = useState(true);
    // const [showLoading, setShowLoading] = useState(false);
    const [numOfComment, setNumOfComment] = useState("");
    // const [post, setNewPost] = useState([]);
    // setPosts 
    const post = newPostStore((state) => state.post);
    const setNewPost = newPostStore((state) => state.setNewPost);
    // const post = newPostStore((state) => state.post);
    // const setPosts = newPostStore((state) => state.setNewPost);
    const openPost = userProfilePicStore((state) => state.openPost);
    const setOpenPost = userProfilePicStore((state) => state.setOpenPost);
    const setPostDetailsObj = userProfilePicStore((state) => state.setPostDetailsObj);
    const openProfileDropdown = userProfilePicStore((state) => state.openProfileDropdown);
    const setOpenProfileDropdown = userProfilePicStore((state) => state.setOpenProfileDropdown);
    const topBarRightProfilePicRefState = userProfilePicStore((state) => state.topBarRightProfilePicRefState);
    const tabSelectedForFollow = userProfilePicStore((state) => state.tabSelectedForFollow);
    const setTabSelectedForFollow = userProfilePicStore((state) => state.setTabSelectedForFollow);
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const setLoggedInUser = userProfilePicStore((state) => state.setLoggedInUser);
    const pageName = userProfilePicStore((state) => state.pageName);
    const setPageName = userProfilePicStore((state) => state.setPageName);
    const notify = userProfilePicStore((state) => state.notify);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const openSearch = userProfilePicStore((state) => state.openSearch);
    const setOpenSearch = userProfilePicStore((state) => state.setOpenSearch);
    const removePost = userProfilePicStore((state) => state.removePost);
    const setRemovePost = userProfilePicStore((state) => state.setRemovePost);
    const setCloseModal = userProfilePicStore((state) => state.setCloseModal);
    const closeModal = userProfilePicStore((state) => state.closeModal);
    const likedData = userProfilePicStore((state) => state.likedData);
    const setLikedData = userProfilePicStore((state) => state.setLikedData);
    const showFriends = userProfilePicStore((state) => state.showFriends);
    const setShowFriends = userProfilePicStore((state) => state.setShowFriends);
    const setFriendsList = userProfilePicStore((state) => state.setFriendsList);
    const openBlockList = userProfilePicStore((state) => state.openBlockList);
    const setOpenBlockList = userProfilePicStore((state) => state.setOpenBlockList);
    const friendsList = userProfilePicStore((state) => state.friendsList);
    const report = userProfilePicStore((state) => state.report);
    const setReport = userProfilePicStore((state) => state.setReport);
    const blockedUserPosts = userProfilePicStore((state) => state.blockedUserPosts);
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const block = userProfilePicStore((state) => state.block);
    const setBlock = userProfilePicStore((state) => state.setBlock);
    const logOut = userProfilePicStore((state) => state.logOut);
    const savePost = userProfilePicStore((state) => state.savePost);
    const setSavePost = userProfilePicStore((state) => state.setSavePost);
    const savePostList = userProfilePicStore((state) => state.savePostList);
    const setSavePostList = userProfilePicStore((state) => state.setSavePostList);
    // const setSelected = newPostStore((state) => state.setSelected);
    // const [savePostList, setSavePostList] = useState(null);

    // const [banner, setBanner] = useState(defaultBannerPic);
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
    // let id = JSON.parse(localStorage.getItem("user"));
    // console.log(post)

    const response = async () => {
        try {
            setOpenSearch(false)

            const response = await axiosInstance.get(`/user/userProfile/${userId}`);
            setUser(response.data.user);
            console.log(loggedInUser)
            console.log("response.data.friendRequestStatus.............: ", response.data)
            setLoading(false);
            fetchPosts(page);
        } catch (error) {
            if (!loggedInUser) {
                navigate("/home");
            }
            if (!response.data.user) {
                navigate("/login");

            }
            console.log("error in reponse ", error)
        }
    }


    const fetchPosts = async (page) => {
        console.log("fetching.........")
        setLoadingPosts(true);

        // setPosts([]);
        try {
            // console.log("fetching...")
            // setLoadingPosts(true);
            // console.log("UserId: ", userId)
            // console.log("Post: ", postsArrayRef.current)
            const responseForPosts = await axiosInstance.get(`/post/${userId}/getCurrentUserPost`, {
                params: { page: page, limit: 50 }
            });
            // console.log("response: ", responseForPosts.data.posts)
            if (page === 1 && responseForPosts.data.posts.length === 0) {
                setNoPost("Create a post.")
            }

            if (responseForPosts.data.posts && responseForPosts.data.posts.length > 0) {
                // console.log(responseForPosts.data.posts)
                // console.log("Posts : ", responseForPosts.data.posts)
                // console.log("oldPosts : ", post)
                // setHasMore(responseForPosts.data.postsCount > (50 * page));
                if(responseForPosts.data.posts.length === 0) {
                    setHasMore(false);
                }
                setLikedData(responseForPosts.data.likedData);
                setNewPost([...postsArrayRef.current, ...responseForPosts.data.posts])
                if (page >= 1 && !hasMore) {
                    setNoPost("No more posts.")
                }
                // setNewPost((prevPosts) => {
                //     // console.log("OldPosts: ", prevPosts)
                //     const newArr = [...prevPosts, ...responseForPosts.data.posts]
                //     const allIds = newArr.map((e) => {
                //         return e._id;
                //     })
                //     const unique = [...new Set(allIds)]
                //     const uniquePosts = [];
                //     unique.forEach((e) => {
                //         uniquePosts.push(newArr.find(obj => obj._id === e))
                //     })
                //     console.log("uniquePosts", uniquePosts)
                //     return uniquePosts
                // })

                setLoadingPosts(false);
                // setShowLoading(false);

                // console.log("fetchPosts fineshed first")
            }

            else {
                console.log("No posts")
                setHasMore(false);
                setLoadingPosts(false);
            }

        } catch (error) {
            console.log(error)
        }
    }


    // console.log("window.innerheight: ", window.innerHeight)
    // getting logged in user details 
    useEffect(() => {
        async function getLoggedInUser() {
            const response = await axiosInstance.get(`/user/getLoggedInuser`);
            console.log("response.data loggedInUser: ", response.data)
            setLoggedInUser(response.data.user)
        }
        getLoggedInUser()
    }, [])
    useEffect(() => {
        // setSelectedTab("")
        const handleResize = () => {
            console.log(innerHeight)
            setInnerHeight(window.innerHeight);
        }
        document.addEventListener("resize", handleResize);
        return () => document.removeEventListener("resize", handleResize);
    }, [])
    useEffect(() => {
        // console.log("Fired", post)
        setPageName("Profile")
        setNewPost([]);
        // setNewPost([]);
        postsArrayRef.current = [];
        console.log("postArrayRef.current: ", postsArrayRef.current)
        response();
        return () => {
            setPageName("")
            setUser(null);
            setSelectedTab("Posts")
            setTabSelectedForFollow(null);
            setShowFriends(null);
            setOpenBlockList(false);
            setBlock(false)
            setSavePost(false);
            // postsArrayRef.current = [];
            console.log("unmounter user id changed")
        }

    }, [userId]);
    useEffect(() => {
        if (pageName !== "Profile") return;
        console.log("Page: ", page);
        if (page === 1) return;

        fetchPosts(page)
        postsArrayRef.current = post;
        return () => {
            postsArrayRef.current = []
            setNewPost([]);
        }
        // console.log("fired", pageName)
    }, [page, pageName]);

    useEffect(() => {
        let scrollTimeOut = false;
        if (!loadingPosts && postScroll.current) {
            // console.log("Mounted", postScroll.current)

            postScroll.current.onscroll = function handleScroll() {
                if (scrollTimeOut) return;

                scrollTimeOut = setTimeout(() => {
                    // console.log("Scrolled", window.innerHeight, postScroll.current.scrollTop, postScroll.current.scrollHeight);
                    if (window.innerHeight + postScroll.current.scrollTop >= postScroll.current.scrollHeight / 2) {
                        // console.log("fired 300px");
                        console.log("Page: ", page);
                        console.log("hasMore: ", hasMore);
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

    }, [loadingPosts, page])
    useEffect(() => {
        if (closeModal) {
            setTabSelectedForFollow(null);
            setShowFriends(null);
            setCloseModal(null);
            setOpenBlockList(false);
            setShareOptions(false);
        }
    }, [closeModal])
    useEffect(() => {
        // console.log(savePost)
        if (savePost) {
            getSavedPosts();
            // setSelectedTab("Posts");
        }
    }, [savePost])

    // useEffect(()=>{

    //     if (selectedTab === "Posts") {
    //         setSavePost(false);
    //         fetchPosts(1);
    //     }
    // },[selectedTab])

    async function getSavedPosts() {
        try {
            setLoadingPosts(true);
            const response = await axiosInstance.get(`/post/getSavedPosts`);
            setSavePostList(response.data.mySavedPosts);
            setLoadingPosts(false);
            // console.log("response.data: ", response.data.mySavedPosts)
        } catch (error) {
            console.log("error: ", error)
        }
    }

    // Outside clicks handlers 

    useEffect(() => {
        function handleClickOutside(e) {
            if (postBoxRef.current && !postBoxRef.current.contains(e.target)) {
                setOpenPost(false);
                setPostDetailsObj(null);
            }
            if (shareOptionsRef.current && !shareOptionsRef.current.contains(e.target)) {
                setShareOptions(false);
            }
            if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(e.target)) {
                setConfirmDelete(false);
            }
            if (followListsRef.current && !followListsRef.current.contains(e.target)) {
                // setSelectedTab("Posts");
                setTabSelectedForFollow(null);
            }
            if (friendListsRef.current && !friendListsRef.current.contains(e.target)) {
                // setSelectedTab("Posts");
                setShowFriends(null);
            }
            if (reportRef.current && !reportRef.current.contains(e.target)) {
                setReport(null);
            }
            if (blockListsRef.current && !blockListsRef.current.contains(e.target)) {
                setOpenBlockList(false);
            }

        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            setOpenSearch(false)
            setSavePost(false);
            postsArrayRef.current = [];
        }
    }, [])

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
        }
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
            window.open(`https://www.facebook.com/sharer/sharer.php?text=${url}`, '_blank');
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
    // console.log(commentDetails)
    async function handleDeletePost() {
        console.log("deletePostObj: ", deletePostObj)
        try {
            if (notifyTimer.current) {
                clearTimeout(notifyTimer.current);
                setNotify(null);
            }
            const response = await axiosInstance.delete(`/post/${deletePostObj.postId}/${deletePostObj.currentUserId}/deletePost`);
            if (response.data.message === "Post deleted successfully") {
                // setRemovePost(deletePostObj.postId);
                const deletedNewPosts = post.filter((e) => e._id !== deletePostObj.postId)
                console.log("deletePostObj.postId: ", deletePostObj.postId)
                console.log("deletedNewPosts: ", deletedNewPosts)
                setNewPost(deletedNewPosts);

                // deletePostObj.ref.current.remove();
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

    async function unblockUser(id, name) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put(`/user/${id}/unblockUser/`);
            if (response.data.message === "Unblocked") {
                setBlock(false);
                setNotify(`You have unblocked ${name.split(" ")[0]}'s profile`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            if (response.data.message === "Could not unblock, please try again later") {
                setNotify(response.data.message);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            // console.log(response.data);
        } catch (error) {
            console.log(error);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)

        }
    }

    // console.log("user: ", user)

    if (loading || !loggedInUser || !user) {
        return <div className='h-screen flex justify-center items-center'><p className='spinOnButton h-[30px] w-[30px]'></p></div>
    }

    return (
        <>
            {report && <ReportBox ref={reportRef} />}
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
            {commentDetails && <CommentBox {...commentDetails} />}

            {tabSelectedForFollow === "Followers" && <FollowersList ref={followListsRef} tabName={"Followers"} currentUserId={loggedInUser._id} user_name={user.name} userId={userId} />}
            {tabSelectedForFollow === "Following" && <FollowersList ref={followListsRef} tabName={"Following"} currentUserId={loggedInUser._id} user_name={user.name} userId={userId} />}
            {showFriends === "Friends" && <FriendsList ref={friendListsRef} currentUserId={loggedInUser._id} />}
            {openBlockList && <BlockList ref={blockListsRef} currentUserId={loggedInUser._id} />}
            {shareOptions && <ShareModal ref={shareOptionsRef} />}
            {logOut && <Logout />}

            <div className='parent relative flex flex-col w-full bg-[#E9E9E9]'>
                {notify && <div className='absolute giveShadow left-6 bottom-10 z-50 bg-zinc-900 px-5 py-3 text-white rounded-lg'>
                    {notify} <button className='cursor-pointer hover:bg-zinc-700 transition duration-200 border-0 px-2 py-1 ml-2 bg-zinc-800 rounded-md font-semibold text-[15px]' onClick={() => window.location.reload()}>Reload</button>
                </div>}
                <div>
                    <Topbar />
                    {openSearch && <SearchBox page={"Profile"} ref={leftBarSearchRef} />}
                </div>
                {/* <div className='flex justify-center w-full h-full border-4 border-red-500'> */}


                <div className="mainsection relative ">
                    {openProfileDropdown && <TopbarRightDropdown pageName={"Profile"} ref={profileDropdownRef} />}

                    <Leftbar />
                    {selectedTab === "Photos" && <Photos />
                    }
                    {selectedTab !== "Photos" &&
                        <div ref={postScroll} className="postContents ">
                            <div className="middleBar relative">
                                {block && <dialog className='absolute inset-0 w-[100%] h-[100%] z-50 flex justify-center bg-white bg-opacity-60'>
                                    <div className='flex items-center' style={{ height: `${innerHeight}px` }} >
                                        <div className='w-[400px] h-[200px] bg-white blockListShadow rounded-mdcd  flex flex-col justify-center items-center'>
                                            <div className='text-2xl mb-2 font-bold'>
                                                Blocked user
                                            </div>
                                            <div className='mb-2'>
                                                {block.userId === loggedInUser._id && `You have blocked ${user.name.split(" ")[0]}'s profile`}
                                                {block.userId !== loggedInUser._id && `${user.name.split(" ")[0]} has blocked you, you can not see this profile.`}
                                            </div>
                                            {block.userId === loggedInUser._id && <button onClick={() => unblockUser(user._id, user.name)} className='px-6 py-2 ml-0 rounded-lg bg-zinc-500 transition duration-200 hover:bg-[#6A0DAD] text-white'>Unblock</button>}
                                        </div>
                                    </div>
                                </dialog>}
                                <div className='profileimgages bg-white rounded-lg'>
                                    {/* {console.log("user: ", user)} */}
                                    {/* user ? user.bannerPic : defaultBannerPic */}
                                    <BannerImg loggedInUser={loggedInUser} />
                                    <ProfileImg loggedInUser={loggedInUser} />
                                </div>
                                <div className='flex flex-col items-center pb-[150px]'>
                                    {!savePost && <>
                                        {selectedTab === "Posts" && post.length > 0 && post.map((e, i) => {
                                            const showTime = postTimeLogic(e);
                                            return <Post key={i} userId={e.userId} currentUserId={loggedInUser._id} id={e._id} logoImg={e.creatorProfilePic} username={e.postCreator} likedData={likedData} time={showTime} textContent={e.postTextContent} postImage={e.image} postVideo={e.video} audience={e.audience} likes={e.likes} comments={e.commentCount} shares={e.shares} views={e.views} />
                                        })}
                                        {loadingPosts && <div className="text-zinc-500 mt-12"><p className='spinOnButton h-[30px] w-[30px]'></p></div>}
                                        {/* {!loadingPosts && !hasMore && <div className="text-zinc-500 mt-6">No more posts.</div>} */}
                                        {/* {post.length === 0 && !showLoading && <div className="text-zinc-500 mt-4">No posts yet.</div>} */}
                                        {/* {console.log("hasMore", hasMore)} */}
                                        {selectedTab === "Posts" && !hasMore && !loadingPosts && <div className="text-zinc-500 mt-8">{noPost}</div>}
                                    </>}
                                    {savePost && !loadingPosts && savePostList && savePostList.length > 0 &&
                                        <>
                                        
                                            <div className='text-zinc-600 text-lg mt-6'>Your Saved posts</div>
                                            {savePostList.map((e, i) => {
                                                const showTime = postTimeLogic(e.postId);
                                                return <Post key={i} userId={e.postId.userId} savedPosts={true} currentUserId={loggedInUser._id} id={e.postId._id} likedData={likedData} page={"Profile"} logoImg={e.postId.creatorProfilePic} username={e.postId.postCreator} time={showTime} textContent={e.postId.postTextContent} postImage={e.postId.image} postVideo={e.postId.video} audience={e.postId.audience} likes={e.postId.likes} comments={e.postId.commentCount} shares={e.postId.shares} views={e.postId.views} />
                                            })}
                                        </>}
                                    {savePost && loadingPosts && <div className="text-zinc-500 mt-12"><p className='spinOnButton h-[30px] w-[30px]'></p></div>}
                                    {savePost && !loadingPosts && savePostList && savePostList.length === 0 && <div className='text-zinc-500 mt-[60px]'>No saved posts</div>}
                                    {selectedTab === "About" && <About user={user} />}
                                </div>
                            </div>
                        </div>
                    }
                    {openPost && <PostBox onSubmit={handlePostSubmit} page="Profile" pageNo={page} ref={postBoxRef} />}
                    {/* <div className="rightBar">

                </div> */}
                </div>
                {/* </div> */}
            </div>

        </>
    )
}

export default ProfilePage
