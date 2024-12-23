import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as regularThumbsUp, faComment as regularComment, faShareFromSquare as regularShare, faHeart as regularHeart, faEye, } from '@fortawesome/free-regular-svg-icons';
import { faRetweet as regularRetweet, faEllipsis, faShare, faHeart, faCircleRight, faCircleArrowRight, faXmark, faPen, faTrashCan, faBookmark, faCircleMinus, faUserSlash, faBan, faFlag, faUserPlus, faBellSlash, faThumbTack, faUserGroup, faEarthAmericas, faUsers, faUser, faLock, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import './../../styles/Post.css'
import { axiosInstance } from "../../lib/axios.js";
import userProfilePicStore from '../../lib/userProfilePicStore.js';
import Carousel from './Carousel.jsx';
import { Link } from 'react-router-dom';
import HoverBasicDetails from './HoverBasicDetails.jsx';




export default function Post({ userId, page, width, id, currentUserId, likedData, logoImg, audience, username, savedPosts = false, subtitle, time, textContent, postImage = [], postVideo = [], likes, comments, shares, views }) {
    const [likesCount, setLikesCount] = useState(likes);
    const [likeStatus, setLikeStatus] = useState(false);
    // const shareOptions = userProfilePicStore((state) => state.shareOptions);
    const [showIdDetails, setShowIdDetails] = useState(null);
    // const likeStatus = userProfilePicStore((state) => state.likeStatus);
    // const setLikeStatus = userProfilePicStore((state) => state.setLikeStatus);
    const setShareOptions = userProfilePicStore((state) => state.setShareOptions);
    const setCommentDetails = userProfilePicStore((state) => state.setCommentDetails);
    const setConfirmDelete = userProfilePicStore((state) => state.setConfirmDelete);
    const setDeletePostObj = userProfilePicStore((state) => state.setDeletePostObj);
    // const user = userProfilePicStore((state) => state.user);
    const openPost = userProfilePicStore((state) => state.openPost);
    const setOpenPost = userProfilePicStore((state) => state.setOpenPost);
    const postDetailsObj = userProfilePicStore((state) => state.postDetailsObj);
    const setPostDetailsObj = userProfilePicStore((state) => state.setPostDetailsObj);
    // const deletePost = userProfilePicStore((state)=> state.deletePost);
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const notify = userProfilePicStore((state) => state.notify);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const storeId = userProfilePicStore((state) => state.storeId);
    const setStoreId = userProfilePicStore((state) => state.setStoreId);
    const homePagePost = userProfilePicStore((state) => state.homePagePost);
    const setHomePagePost = userProfilePicStore((state) => state.setHomePagePost);
    const setReport = userProfilePicStore((state) => state.setReport);
    const setBlockedUserPosts = userProfilePicStore((state) => state.setBlockedUserPosts);
    const blockedUserPosts = userProfilePicStore((state) => state.blockedUserPosts);
    const setBlock = userProfilePicStore((state) => state.setBlock);
    const savePostList = userProfilePicStore((state) => state.savePostList);
    const setSavePostList = userProfilePicStore((state) => state.setSavePostList);
    // const [blockedUserPosts, setBlockedUserPosts] = useState(null);

    // const removePost = userProfilePicStore((state) => state.removePost);
    // const setRemovePost = userProfilePicStore((state) => state.setRemovePost);

    const [openEditor, setOpenEditor] = useState(null);
    const [oldId, setOldId] = useState(null);
    const postEditRef = useRef();
    const postEditDotsRef = useRef();
    const entirePostRef = useRef();
    const notifyTimer = useRef();

    // console.log("loggedInUser", loggedInUser)
    useEffect(() => {
        if(likedData.length > 0){
            setLikeStatus(likedData.find(e=> e.postId === id)?.userLiked)
        }
        // console.log("likes: ", likes)
        console.log("likeStatus: ", likeStatus)
        function clickOutside(e) {
            if (postEditRef.current && !postEditRef.current.contains(e.target) && !postEditDotsRef.current.contains(e.target)) {
                setOpenEditor(null);
                setOldId(null);
            }
        }
        document.addEventListener("click", clickOutside);
        

        // async function getStatus() {
        //     try {
        //         const response = await axiosInstance.put(`/post/${id}/isLiked`);
        //         setLikeStatus(response.data.Liked);
        //         // console.log("response.data.Liked: ", response.data)

        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        // getStatus();
        return () => {
            document.removeEventListener("click", clickOutside);
        }
    }, [])
    // useEffect(()=> {
        
    // },[likedData])
    async function updateLikes() {
        try {
            const response = await axiosInstance.put(`/post/${id}/likes`);
            // console.log(response.data)
            if (response.data.message === "Liked") {
                
                setLikeStatus(true);
            }
            else if (response.data.message === "Like removed") {
                setLikeStatus(false);
            }
            setLikesCount(response.data.likesCount);
        } catch (error) {
            console.log(error)
        }
    }
    // console.log("Views: ", views)
    // console.log("comments: ", comments)
    function editPosttHandler(id) {
        setOpenPost(true);
        setPostDetailsObj({ postId: id, userId, currentUserId, textContent, postImage, postVideo, audience });
        // postEditDotsRef.current.click();
        setOpenEditor(null);
    }

    async function deletePostHandler(id) {
        setConfirmDelete(true);
        // postEditRef.current.click();
        setOpenEditor(null);
        setDeletePostObj({ postId: id, userId: userId, currentUserId, ref: entirePostRef });
    }
    async function pinPostHandler(id) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.put(`post/${id}/${userId}/pinPost`);
            setNotify("You post is pinned successfully");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 3 * 1000)
            setOpenEditor(null);
            // console.log(response.data)
        } catch (error) {
            setNotify("Something went wrong, Please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 3 * 1000)
            setOpenEditor(null);
            // console.log(error)
        }
    }
    function handleOpenEditor(id) {
        // console.log("clicked")
        setOpenEditor(oldId === id ? null : id);
        setOldId(oldId !== id ? id : null);
    }
    function turnOffNotificationtHandler(id) {
        setNotify("Notification turned off for this post");
        setTimeout(() => {
            setNotify(null);
        }, 5 * 1000)
        setOpenEditor(null);
    }

    //    function turnOffDetails(){
    //     setTimeout(()=>{
    //         setShowIdDetails(null);
    //     }, 400)
    //    }

    function idDetails(id) {
        setShowIdDetails(id);
        setStoreId(id);
    }

    async function saveThisPost(id) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.post(`/post/${id}/savePost`);
            setOpenEditor(null);
            if (response.data.message) {

                setNotify(response.data.message);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 3 * 1000)
            }
            // console.log(response.data);
        } catch (error) {
            console.log("Error: ", error);
            setOpenEditor(null);
            setNotify("Something went wrong, Please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 3 * 1000)
        }

    }
    async function interestedPost(id) {
        const firstName = loggedInUser.name.split(" ")[0];
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenEditor(null);
        try {
            const response = await axiosInstance.post(`/post/${id}/interestedPost`);
            if (response.data.message === "Interested") {

                // console.log("name: ", loggedInUser.name)
                setNotify(`You will see more posts like this, ${firstName} `);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            // console.log(response.data)
        } catch (error) {
            // console.log(error)
            if (error.response.data.message === "Interested") {
                setNotify(`You will see more posts like this, ${firstName}`);
            }
            else {
                setNotify("Something went wrong, Please try again later");
            }
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
        }
    }
    async function notInterestedPost(id) {
        const firstName = loggedInUser.name.split(" ")[0];
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenEditor(null);
        try {
            const response = await axiosInstance.post(`/post/${id}/notInterestedPost`);
            if (response.data.message === "Not Interested") {
                // setOpenEditor(null);
                // console.log("name: ", loggedInUser.name)
                setNotify(`You will see less posts like this, ${firstName} `);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            // console.log(response.data)
        } catch (error) {
            // console.log(error)
            if (error.response.data.message === "Not Interested") {
                setNotify(`You will see less posts like this, ${firstName}`);
            }
            else {
                setNotify("Something went wrong, Please try again later");
            }
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
        }
        finally {
            const deleteThisPost = homePagePost.filter(e => e._id !== id);
            setHomePagePost(deleteThisPost);
        }
    }

    function setReportAndClose(id) {
        setReport(id);
        setOpenEditor(null);
        // postEditDotsRef.current.click();
    }

    async function hideAllPosts(userId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenEditor(null);
        try {
            const response = await axiosInstance.post(`/post/${userId}/hideAllPosts`);
            if (response.data.message === "User hidden") {

                setNotify(`You will not see any posts from ${username.split(" ")[0]}`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)

            }
        } catch (error) {
            // console.log(error)
            if (error.response.data.message === "User already hidden") {

                setNotify(`You will not see any posts from ${username.split(" ")[0]}`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            else {
                setNotify(`Something went wrong, please try again later.`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
        }
    }

    async function blockUser(userId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenEditor(null);
        try {
            const response = await axiosInstance.post(`/user/${userId}/blockUser`);
            if (response.data.message === "User blocked") {
                // console.log("blockedUserPosts: ", blockedUserPosts)
                // const allPreviosBlockedUser = [...blockedUserPosts]
                setBlockedUserPosts([...blockedUserPosts, userId]);
                setBlock({ userId: loggedInUser._id })
                setNotify(`You have blocked ${username.split(" ")[0]}'s profile`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)

            }
        } catch (error) {
            if (error.response.data.message === "You already blocked this user") {

                setNotify(`You have already blocked ${username.split(" ")[0]}'s profile`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
            else {
                setNotify(`Something went wrong, please try again later.`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
        }
    }

    // console.log("savePostList: ", savePostList)
    async function unSaveThisPost(id) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenEditor(null);
        try {
            const response = await axiosInstance.put(`/post/${id}/unSavePost`);
            if (response.data.message === "Post unsaved") {
                const deleteThisPost = savePostList.filter(e => e.postId._id !== id);
                setSavePostList(deleteThisPost);
                setNotify(`You have unsaved this post`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)
            }
        } catch (error) {
            console.log(error)

            setNotify(`Something went wrong, please try again later.`);
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)

        }
    }

    // if(blockedUserPosts === userId) return <></>;
    // console.log(`CurrentUserId ${currentUserId} userId ${userId}`)
    return (
        <div className='' ref={entirePostRef}>
            {/* <CommentBox logoImg={logoImg} username={username} comments={comments} /> */}
            <div className={`mainPost xl:w-[550px] ${(width >= 550 && width < 1280) && "w-[520px]"} ${width < 550 && "w-[97.5vw]"}  mt-4 mb-6 rounded-lg`}>
                <div className="box">
                    <div className="top mt-1 flex">
                        <div className="image relative">
                            <Link to={`/userProfile/${userId}`}>
                                <img src={logoImg} onMouseEnter={() => idDetails(userId)} onMouseLeave={() => setShowIdDetails(null)} className='w-[55px] h-[55px] mt-[-5px] cursor-pointer rounded-full' alt="" />
                                {/* <img src={logoImg} onMouseEnter={() => turnOnDetails(userId)} onMouseLeave={() => turnOffDetails()} className='w-[50px] h-[50px] cursor-pointer rounded-full' alt="" /> */}
                            </Link>
                            {width > 550 && <HoverBasicDetails userId={showIdDetails} currentUserId={currentUserId} />}
                        </div>
                        <div className="details ml-4">
                            <Link to={`/userProfile/${userId}`}>
                                <div className={`name text-black ${width < 400 && "text-[14px]"} font-bold cursor-pointer transition duration-300 hover:underline`} onMouseEnter={() => idDetails(userId)} onMouseLeave={() => setShowIdDetails(null)}>{(width < 450 && username.length > 21) ? username.slice(0, 21) + ".." : username}</div>
                            </Link>
                            <div className="subtitle text-sm  text-zinc-600">{subtitle}</div>
                            <div className="time text-[13px] text-semibold text-zinc-600">{time}
                                {audience === "Everyone" && <FontAwesomeIcon className='ml-2 text-[12px]' icon={faEarthAmericas} />}
                                {audience === "Friends" && <FontAwesomeIcon className='ml-2 text-[12px]' icon={faUsers} />}
                                {audience === "Only me" && <FontAwesomeIcon className='ml-2 text-[12px]' icon={faLock} />}
                            </div>


                        </div>

                        <div className='postEdit ' >
                            <FontAwesomeIcon ref={postEditDotsRef} onClick={() => handleOpenEditor(id)} className={` relative h-[22px] w-[22px] cursor-pointer transition duration-200 p-2 rounded-full hover:bg-zinc-300 hover:text-zinc-700 text-zinc-500 ${openEditor === id ? 'bg-zinc-300 text-zinc-800' : ''}`} icon={openEditor === id ? faXmark : faEllipsis} />
                            {(openEditor === id) && <div ref={postEditRef} className={`absolute editPost  top-[50px] ${width < 400 ? "right-[-20px]" : "right-[0px]"}  giveShadowToPostEdit  p-2 bg-white rounded-md w-max`}>
                                {/* transition duration-200 giveShadow */}
                                {currentUserId === userId && <>
                                    <div onClick={() => editPosttHandler(id)} className={`text-black hover:bg-zinc-300 rounded-lg px-2 py-2  flex items-center font-bold ${width < 400 ? "w-[90vw]" : "w-[300px]"} h-[40px] transition duration-100 rounded-md cursor-pointer`}><p className='h-[40px] w-[32px] flex items-center '><FontAwesomeIcon className='h-[17px] w-[17px] text-zinc-800' icon={faPen} /></p> Edit post</div>
                                    <div onClick={() => deletePostHandler(id)} className={`text-black hover:bg-zinc-300 px-2 rounded-lg flex items-center py-2 font-bold mt-1  ${width < 400 ? "w-[90vw]" : "w-[300px]"} h-[40px] transition duration-100 rounded-md cursor-pointer`}><p className='h-[40px] w-[32px] flex items-center'><FontAwesomeIcon className='h-[17px] w-[17px] mr-4 text-zinc-800' icon={faTrashCan} /></p> Delete your post</div>
                                    {/* <div onClick={() => pinPosttHandler(id)} className='text-black hover:bg-zinc-200 px-2 flex items-center py-2 font-bold mt-1 w-[300px] h-[40px] transition duration-100 rounded-md cursor-pointer`}><p className='h-[40px] w-[32px] flex items-center '><FontAwesomeIcon className='text-md ml-[2px] text-zinc-800' icon={faThumbTack} /></p> Pin to your profile</div> */}
                                    <div onClick={() => editPosttHandler(id)} className={`text-black hover:bg-zinc-300 px-2 rounded-lg flex items-center py-2 font-bold mt-1  ${width < 400 ? "w-[90vw]" : "w-[300px]"} h-[40px] transition duration-100 rounded-md cursor-pointer`}><p className='h-[40px] w-[32px] flex items-center '><FontAwesomeIcon className='text-md text-zinc-800' icon={faUserGroup} /></p> Change audience</div>
                                    <div onClick={() => turnOffNotificationtHandler(id)} className={`text-black hover:bg-zinc-300 px-2 rounded-lg flex items-center py-[1px] font-bold mt-1  ${width < 400 ? "w-[90vw]" : "w-[300px]"}  transition duration-100 rounded-md cursor-pointer`}><p className='h-[45px] w-[32px] flex items-center '><FontAwesomeIcon className='text-md text-zinc-800' icon={faBellSlash} /></p> Turn off notifications for this post</div>
                                </>}
                                {currentUserId !== userId && <>
                                    {/* {!following && <div onClick={() => followUser(userId)} className='text-black hover:bg-zinc-200 px-2 flex items-center py-2 font-bold mt-1 w-[300px] h-[40px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center'><FontAwesomeIcon className='text-md mr-4 text-zinc-800' icon={faUserPlus} /></p> Follow {username}</div>}
                                    {following && <div onClick={() => unFollowUser(userId)} className='text-black hover:bg-zinc-200 px-2 flex items-center py-2 font-bold mt-1 w-[300px] h-[40px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center'><FontAwesomeIcon className='text-md mr-4 text-zinc-800' icon={faUserPlus} /></p> Unfollow {username}</div>} */}
                                    {!savedPosts && <div onClick={() => saveThisPost(id)} className='text-black  hover:bg-zinc-300 rounded-lg px-2 flex items-center font-bold mt-1 w-[300px] h-[45px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] mr-4 text-zinc-800' icon={faBookmark} /></p>
                                        <p>Save this post</p>
                                    </div>}
                                    {savedPosts && <div onClick={() => unSaveThisPost(id)} className='text-black  hover:bg-zinc-300 rounded-lg px-2 flex items-center font-bold mt-1 w-[300px] h-[45px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] mr-4 text-zinc-800' icon={faBookmark} /></p>
                                        <p>Unsave this post</p>
                                    </div>}
                                    <div className='border-t-2 my-1 border-zinc-300'></div>
                                    <div onClick={() => setReportAndClose(id)} className='text-red-700  hover:bg-zinc-300 rounded-lg px-2  flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex justify-center items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] ml-1 mr-4 text-red-700' icon={faFlag} /></p>
                                        <p> Report post</p>
                                    </div>
                                    <div onClick={() => hideAllPosts(userId)} className='text-black  hover:bg-zinc-300 rounded-lg px-2 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex justify-center items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] ml-1 mr-4 text-zinc-800' icon={faBan} /></p>
                                        <p> Hide all posts from {username.split(" ")[0]}</p>
                                    </div>
                                    {/* <div onClick={() => deletePostHandler(id)} className='text-black hover:bg-zinc-200 px-2 flex items-center font-bold mt-1 w-[300px] h-[40px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex justify-center items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] ml-1 mr-4 text-zinc-800' icon={faFlag} /></p>
                                        <p> Hide all posts from {username.split(" ")[0]}</p>
                                    </div> */}
                                    <div className='border-t-2 my-1 border-zinc-300'></div>
                                    <div onClick={() => interestedPost(id)} className='text-black  hover:bg-zinc-300 rounded-lg px-2 pt-0 flex items-center font-bold mt-1 w-[300px] h-[55px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] mr-4 text-zinc-800' icon={faCirclePlus} /></p>
                                        <div className='py-3'>
                                            <p>Interested</p>
                                            <p className='text-zinc-700 text-[15px] font-thin'>You will see more posts like this</p>
                                        </div>
                                    </div>
                                    <div onClick={() => notInterestedPost(id)} className='text-black  hover:bg-zinc-300 rounded-lg px-2 flex items-center font-bold mt-1 w-[300px] h-[55px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center'>
                                            <FontAwesomeIcon className='h-[20px] w-[20px] mr-4 text-zinc-800' icon={faCircleMinus} /></p>
                                        <div className='py-3'>
                                            <p>Not interested</p>
                                            <p className='text-zinc-700 text-[15px] font-thin'>You will see less posts like this</p>
                                        </div>
                                    </div>

                                    <div className='border-t-2 my-1 border-zinc-300'></div>
                                    <div onClick={() => blockUser(userId)} className='text-black  hover:bg-zinc-300 rounded-lg px-2 flex items-center font-bold w-[300px] transition duration-100 rounded-md cursor-pointer'>
                                        <p className='h-[40px] w-[32px] flex items-center '>
                                            <FontAwesomeIcon className='h-[24px] w-[24px] mr-4 text-red-700' icon={faUserSlash} /></p>
                                        <div className='py-2'>
                                            <p className='text-red-700'>Block {username.split(" ")[0]}'s profile</p>
                                            <p className='text-zinc-700 text-[15px] font-thin'>You won't able to see or contact <br /> each other</p>
                                        </div>
                                    </div> </>}
                                {/* {/* <p className='text-black hover:bg-zinc-200 px-2 font-bold w-[320px] h-[30px] transition duration-100 rounded-lg cursor-pointer'>Report the comment</p> */}
                            </div>}
                        </div>
                        {/* <div className='relative postEdit'>
                            <FontAwesomeIcon ref={threedots} onClick={() => openEditor(e._id)} className={`text-black absolute top-[-30px] right-[-45px]  cursor-pointer h-4 w-4 hover:bg-zinc-400 rounded-full transition duration-200 p-2 ${openCommentEditor === e._id ? "bg-zinc-400" : ""} `} icon={openCommentEditor === e._id ? faXmark : faEllipsis} />

                        {/* </div> */}
                    </div>
                    <div className={`texts ${textContent.length > 1 ? "mt-5 mb-5" : "mt-2 mb-2 ml-2"} `}>
                        <pre className='postTextSection'>{textContent}</pre>
                    </div>
                    <div className="media flex justify-center items-center">
                        {/* {postImage && <img className='flex max-h-[550px] justify-center' src={postImage} alt="" />} */}
                        {postImage && postImage.length > 0 && <div className='flex max-h-[550px] justify-center'> <Carousel images={postImage} /> </div>}
                        {postVideo && postVideo.length > 0 && <video className='flex max-h-[550px] rounded-xl justify-center' controls download={false} src={postVideo} alt="" />}
                    </div>
                    <div className={`reaction flex justify-between mt-3 border-t-2 border-zinc-300 pt-3 ${width < 450 ? "px-0" : "px-0"}`} >
                        <p className='flex group justify-center items-center cursor-pointer transition duration-200 hover:bg-zinc-200 hover:text-[#FF007F]  px-2 py-1 rounded-md' onClick={updateLikes}>

                            <FontAwesomeIcon className={`likes ${width < 450 ? "ml-0 text-xl" : "ml-4 text-2xl"}  group-hover:text-[#FF007F] ${likeStatus ? "text-[#FF007F]" : "text-zinc-500"} `} icon={likeStatus ? faHeart : regularHeart} />
                            <span className={`ml-4 w-[25px] text-sm`}>
                                {/* {console.log(likesCount)} */}
                                {likesCount > 0 ? likesCount : ""}
                            </span>
                        </p>
                        <p className='flex group justify-center items-center hover:text-[#002395] hover:bg-zinc-200 cursor-pointer transition duration-200  px-2 py-1 rounded-lg' onClick={() => setCommentDetails({ loggedInUserName: loggedInUser.name, postId: id, loggedInUserProfilePic: loggedInUser.profilePic, postCreatorName: username, loggedInUserId: loggedInUser._id, postCreatorId: userId })}>

                            <FontAwesomeIcon className={`comments  ${width < 450 ? " text-xl ml-0" : " text-2xl ml-6"}  text-zinc-500 group-hover:text-[#002395]`} icon={regularComment} />

                            <span className={` ml-4  text-sm w-[25px] `}>

                                {comments > 0 ? comments : ""}


                            </span>
                        </p>
                        <p className='flex group items-center hover:text-[#FF007F] hover:bg-zinc-200 px-3 py-0 rounded-md' onClick={() => setShareOptions(id)}>

                            <FontAwesomeIcon className={`shares  ${width < 450 ? "ml-0 text-xl p-0" : " text-2xl p-3"} text-zinc-500 cursor-pointer transition duration-200 group-hover:text-[#FF007F]  `} icon={faShare} />
                            <span className='ml-1 text-sm'>

                                {/* {shares.length> 0? shares.length : ""} */}
                            </span>

                        </p>
                        {width > 450 && <p className='flex group items-center hover:text-[#FF007F] hover:bg-zinc-200 px-3 py-0 rounded-md'>
                            <FontAwesomeIcon className={`repos   text-2xl p-3 text-zinc-500 cursor-pointer transition duration-200 group-hover:text-[#DC143C] `} icon={faEye} />
                            <span className='ml-1 text-sm'>

                                {views}
                            </span>
                        </p>}

                    </div>
                </div>
            </div>
        </div>
    )
}