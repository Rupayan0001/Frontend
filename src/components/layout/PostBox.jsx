import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Link } from 'react-router-dom';
import userProfilePicStore from '../../lib/userProfilePicStore'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faXmark, faPhotoFilm, faRightLong, faEarthAmericas, faUsers, faUser, faSortDown, faLock } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../lib/axios';
import newPostStore from '../../lib/NewPost.js';
// import newPostStore from '../../lib/NewPost';
import "./../../styles/PostBox.css";
import axios from 'axios';
// import { faUser } from '@fortawesome/free-regular-svg-icons';

const PostBox = forwardRef(({ onSubmit, page, pageNo }, ref) => {
    // console.log(onSubmit)
    const postDetailsObj = userProfilePicStore((state) => state.postDetailsObj);
    const setPostDetailsObj = userProfilePicStore((state) => state.setPostDetailsObj);
    const homePagePost = userProfilePicStore((state) => state.homePagePost);
    const setHomePagePost = userProfilePicStore((state) => state.setHomePagePost);
    const notify = userProfilePicStore((state) => state.notify);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    // const user = userProfilePicStore((state) => state.user);
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const setLikedData = userProfilePicStore((state) => state.setLikedData);
    const setNewPost = newPostStore((state) => state.setNewPost);
    const post = newPostStore((state) => state.post);
    const [media, setMedia] = useState("Image");
    // const setCurrent = newPostStore((state) => state.setCurrent);
    const [openPoll, setOpenPoll] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [textInputHeight, setTextInputHeight] = useState("20vh");
    const [allFiles, setAllFiles] = useState([]);
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadText, setUploadText] = useState(false);
    const [editAudience, setEditAudience] = useState(false);
    const [audience, setAudience] = useState("Everyone");
    const [updateMedia, setUpdateMedia] = useState(false);
    // const [uploadedUrls, setUploadedUrls] = useState([]);
    const mediaInput = useRef();
    const textInput = useRef();
    const notifyTimer = useRef();
    const editAudienceRef = useRef();
    const audienceRef = useRef();
    const questionRef = useRef();
    const option1 = useRef();
    const option2 = useRef();
    const option3 = useRef();
    const option4 = useRef();
    // console.log("state: ", state)



    useEffect(() => {
        function clickOutside(e) {
            // alert("clicked outside")
            if (editAudienceRef.current && !editAudienceRef.current.contains(e.target) && !audienceRef.current.contains(e.target)) {
                setEditAudience(false);

            }
        }
        document.addEventListener("click", clickOutside);
        return () => {
            document.removeEventListener("click", clickOutside);
        }
    }, [])
    async function handleMedia(e) {
        console.log("Pictures")
        const arr = Array.from(e.target.files);
        setAllFiles(arr);
        const imagesFiles = arr.filter(e => e.type.includes("image"));
        const videoFiles = arr.filter(e => e.type.includes("video"));
        const imageUrls = imagesFiles.map(e => URL.createObjectURL(e));
        const videoUrls = videoFiles.map(e => URL.createObjectURL(e));
        // console.log(videoFiles)
        setImageFiles(imageUrls);
        setVideoFiles(videoUrls);
        setUrls([...imageUrls, ...videoUrls]);
        // console.log("e", urls)


    }
    useEffect(() => {
        console.log(postDetailsObj);
        if (postDetailsObj && postDetailsObj.postVideo.length >= 1 && !updateMedia) {

            setMedia("Video")
        }
    }, [postDetailsObj])
    function cancelMedia() {
        setVideoFiles([]);
        setImageFiles([]);
        setAllFiles([]);
        setUrls([]);
    }

    async function Upload() {
        if (uploadText) return;
        setUploadText(true);
        // if (uploadText === "Posting...") return;

        const text = textInput.current.value.trim();
        // if(postDetailsObj.postVideo.length > 0){
        //     setMedia("Video")
        // }
        // console.log(text)
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        if (postDetailsObj) {
            console.log("postDetailsObj", postDetailsObj)

            if (text === " " && allFiles.length === 0 && postDetailsObj.postImage.length === 0 && postDetailsObj.postVideo.length === 0) {
                setNotify("Please enter text or upload media");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
                setUploadText(false);
                return;
            }

        }
        if (!postDetailsObj) {

            if ((text === "" || text === " ") && (allFiles.length === 0 || (postDetailsObj && postDetailsObj.postImage.length === 0 || postDetailsObj && postDetailsObj.postVideo.length === 0))) {

                // setNotify("Please enter text or upload media");
                // notifyTimer.current = setTimeout(() => {
                //     setNotify(null)
                // }, 5 * 1000)
                setUploadText(false);
                return;
            }
        }
        if (urls.length > 10) {
            setNotify("Can not upload more than 10 images");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
            return
        }
        try {
            if (notifyTimer.current) {
                clearTimeout(notifyTimer.current);
                setNotify(null);
            }
            // console.log("Started...", text)
            setUploadText("Posting...")
            setLoading(true);
            // const filesArr = e.target.files;
            const formData = new FormData();
            if (media === "Image") {
                if (allFiles.length > 0) {
                    allFiles.forEach(file => {
                        formData.append("media", file)
                    })
                }
            }
            if (media === "Video") {
                if (allFiles.length > 0) {
                    allFiles.forEach(e => {

                        formData.append("video", e)
                    })

                }
            }
            formData.append("text", text)
            formData.append("audience", audience)

            if (postDetailsObj) {
                if (postDetailsObj.postImage.length === 0 && postDetailsObj.postVideo.length === 0 && allFiles.length === 0) {
                    formData.append("isMedia", "No media")

                }
                if (postDetailsObj.postImage.length > 0 || postDetailsObj.postVideo.length > 0 || allFiles.length > 0) {
                    formData.append("isMedia", "Media present")
                }
                if (media === "Video") {
                    const response = await axiosInstance.put(`/post/${postDetailsObj.postId}/${postDetailsObj.userId}/updatePost/video`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                    setNotify("Post updated successfully");
                    notifyTimer.current = setTimeout(() => {
                        setNotify(null)
                    }, 5 * 1000)
                }
                if (media === "Image") {

                    const response = await axiosInstance.put(`/post/${postDetailsObj.postId}/${postDetailsObj.userId}/updatePost`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                    // console.log(response);
                    setNotify("Post updated successfully");
                    notifyTimer.current = setTimeout(() => {
                        setNotify(null)
                    }, 5 * 1000)
                }

            }
            if (!postDetailsObj) {
                if (media === "Image") {
                    const response = await axiosInstance.post("/post/createPost", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })

                }
                if (media === "Video") {
                    const response = await axiosInstance.post("/post/createPost/video", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    })
                }
                setNotify("Post uploaded successfully");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)

            }
            // setNewPost(response.data.post);
            if (page === "Profile") {
                const allPosts = await axiosInstance.get(`/post/${loggedInUser._id}/getCurrentUserPost`, {
                    params: { page: pageNo, limit: 50 }
                });
                // console.log("Allposts: ", allPosts.data.posts)
                const newArr = allPosts.data.posts;
                const allIds = newArr.map((e) => {
                    return e._id;
                })
                const unique = [...new Set(allIds)]
                const uniquePosts = [];
                unique.forEach((e) => {
                    uniquePosts.push(newArr.find(obj => obj._id === e))
                })
                setNewPost(uniquePosts)
                console.log("uniquePosts...", uniquePosts)
                // setPosts(uniquePosts);
                // state(allPosts.data.posts)

            }
            if (page === "Home") {
                console.log(page)
                // console.log("homePagePost: ",homePagePost)
                const responseForPosts = await axiosInstance.get("/post/getAllPost", {
                    params: { page: pageNo, limit: 50 }
                });

                // console.log("setHomePagePost: ", setHomePagePost)
                const newArr = responseForPosts.data.allPosts;
                console.log("newArr : ", newArr)
                // const allIds = newArr.map((e) => {
                //     return e._id;
                // })
                // const unique = [...new Set(allIds)]
                // const uniquePosts = [];
                // unique.forEach((e) => {
                //     uniquePosts.push(newArr.find(obj => obj._id === e));
                // })
                setHomePagePost(newArr);
                setLikedData(responseForPosts.data.likedData);
                console.log("likedData:  ", responseForPosts.data.likedData)
                // state(newArr);
                // setHomePagePost(newArr);
                // setLoadingPosts(false);
                // setShowLoading(false);
                // setLoading(false);
                // console.log(homePagePost);

            }
            onSubmit();
            setUploadText("Uploaded")
            setLoading(false);


            // console.log(allPosts.data.posts)
        }
        catch (error) {
            // console.log(error)
            if (notifyTimer.current) {
                clearTimeout(notifyTimer.current);
                setNotify(null);
            }
            setNotify("Something went wrong, please try againg later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
        finally {
            // textInput.current.value = ""
            setVideoFiles([]);
            setImageFiles([]);
            setAllFiles([]);
            setUrls([]);
            setPostDetailsObj(null);
        }

    }
    // console.log("Post Details: ", postDetailsObj)

    const noMedia = (
        <div className='mediaInput ml-2 mr-2 mt-3 min-h-[200px] transition duration-100  cursor-pointer rounded-lg flex flex-col justify-center items-center' onClick={() => mediaInput.current.click()}>
            {media === "Image" && <>
                <input type="file" className='hidden' ref={mediaInput} multiple={true} accept='image/*' onChange={handleMedia} />
                <p className='text-zinc-700 text-[50px]'><FontAwesomeIcon icon={faPhotoFilm} /></p>
                <p className='text-zinc-700 font-bold text-lg mt-2'>Add Photos Here</p>
                <p className='text-zinc-500 font-semibold text-md'>max 10 images</p>
            </>}
            {media === "Video" && <>
                <input type="file" className='hidden' ref={mediaInput} accept='video/*' onChange={handleMedia} />
                <p className='text-zinc-700 text-[50px]'><FontAwesomeIcon icon={faPhotoFilm} /></p>
                <p className='text-zinc-700 font-bold text-lg mt-2'>Add Video Here</p>
                <p className='text-zinc-500 font-semibold text-md'>Max size 100 mb (max 1 video)</p>
            </>}
        </div>
    )
    function cancelMediaOfPostDetailsObj(obj) {
        setUpdateMedia(true);

        setPostDetailsObj({ postId: obj.postId, userId: obj.userId, textContent: obj.textContent, postImage: [], postVideo: "", audience: obj.audience });
    }
    function countLetters(e) {
        // console.log("textInputHeight", textInputHeight)
        const letters = e.target.value.length;
        if (letters >= 400) {
            // console.log(letters)
            setTextInputHeight("40vh");
        }
        else {
            setTextInputHeight("20vh");
        }
    }
    function changeAudienceHandler(e) {
        postDetailsObj ? setPostDetailsObj({ ...postDetailsObj, audience: e }) : null;
        setAudience(e);
        setEditAudience(false);
    }

    // will build this later for launching polls 
    async function LaunchPoll() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        const formData = new FormData();
        if (questionRef.current.value === "") {
            questionRef.current.placeholder = "Question is required ?";
            return;
        }
        if (option1.current.value === "") {
            option1.current.placeholder = "Option is required ?";
            return;
        }
        if (option2.current.value === "") {
            option2.current.placeholder = "Option is required ?";
            return;
        }
        formData.append("question", questionRef.current.value);
        formData.append("option1", option1.current.value);
        formData.append("option2", option2.current.value);
        if (allFiles.length> 0){
            allFiles.forEach(e=>{
                formData.append("images", e);
            })
        }
        try {
            const response = await axiosInstance.post(`/post/launchPoll`, formData);
            console.log(response);
        } catch (error) {
            
        }
    }


    return (
        <>
            <dialog className='fixed inset-0 flex justify-center items-center z-20 bg-black bg-opacity-70 w-[100%] h-[100%]'>
                <div ref={ref} className='mainPostBox text-zinc-500'>
                    <div className="relative postBox overflow-y-scroll scrollbar-thin pt-0 p-2 ml-2 pr-4">
                        <div onClick={() => onSubmit()} className='closePostBox absolute top-1 right-2 flex justify-center items-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition duration-150 text-lg  rounded-full h-[40px] w-[40px] cursor-pointer'>
                            <FontAwesomeIcon className='text-[25px]' icon={faXmark} />
                        </div>
                        {!openPoll && <div className="postBoxTop mt-4 text-black font-bold text-center text-2xl border-b-2 w-[100%] mx-auto border-gray-300 pb-2">
                            {/* {openPoll && "Launch a Poll"} */}
                            {postDetailsObj ? "Edit Post" : "Create Post"}
                        </div>}
                        {openPoll && <div className="postBoxTop mt-4 text-black font-bold text-center text-2xl border-b-2 w-[90%] mx-auto border-gray-300 pb-2">
                            {openPoll && "Launch a Poll"}

                        </div>}
                        <div className="info flex justify-between items-center mt-3">
                            <div className='flex '>
                                <Link to={`/userProfile/${loggedInUser._id}`}>
                                    <img src={loggedInUser.profilePic} className='h-[45px] w-[45px] rounded-full ml-2 ' alt="profile" />
                                </Link>
                                <div className=''>
                                    <Link to={`/userProfile/${loggedInUser._id}`}>
                                        <p className='text-black ml-2 font-semibold transition duration-200 hover:underline'>{loggedInUser.name}</p>
                                        <p className='text-zinc-500 ml-2 '>{loggedInUser.username}</p>
                                    </Link>
                                </div>

                            </div>
                            <div>
                                <div className='relative'>
                                    {postDetailsObj && <p ref={audienceRef} className='flex items-center justify-center cursor-pointer bg-zinc-200 hover:bg-zinc-300 rounded-md w-[120px] h-[40px] transition duration-200 ' onClick={() => setEditAudience(!editAudience)}><FontAwesomeIcon className='mr-1' icon={postDetailsObj.audience === "Everyone" && faEarthAmericas || postDetailsObj.audience === "Friends" && faUsers || postDetailsObj.audience === "Only me" && faLock} /> {postDetailsObj.audience}  <FontAwesomeIcon className='mb-1 ml-1' icon={faSortDown} /></p>}
                                    {!postDetailsObj && <p ref={audienceRef} className='flex items-center justify-center cursor-pointer bg-zinc-200 hover:bg-zinc-300 rounded-md w-[120px] h-[40px] transition duration-200 ' onClick={() => setEditAudience(!editAudience)}><FontAwesomeIcon className='mr-1' icon={audience === "Everyone" && faEarthAmericas || audience === "Friends" && faUsers || audience === "Only me" && faLock} /> {audience} <FontAwesomeIcon className='mb-1 ml-1' icon={faSortDown} /></p>}

                                    {/* <FontAwesomeIcon ref={threedots} onClick={() => openEditor(e._id)} className={`text-black absolute top-[-30px] right-[-45px]  cursor-pointer h-4 w-4 hover:bg-zinc-400 rounded-full transition duration-200 p-2 ${openCommentEditor === e._id ? "bg-zinc-400" : ""} `} icon={openCommentEditor === e._id ? faXmark : faEllipsisVertical} /> */}
                                    {editAudience && <div ref={editAudienceRef} className='absolute top-[50px] right-[0px] commentEditDropdown z-20  p-2 bg-white rounded-md shadow-lg w-max'>
                                        <p onClick={() => changeAudienceHandler("Everyone")} className='text-black hover:bg-zinc-400 px-2 flex items-center font-bold w-[300px] h-[35px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faEarthAmericas} /> Everyone</p>
                                        <p onClick={() => changeAudienceHandler("Friends")} className='text-black hover:bg-zinc-400 px-2 flex items-center font-bold w-[300px] h-[35px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='ml-[-2px] mr-2' icon={faUsers} />  Friends</p>
                                        <p onClick={() => changeAudienceHandler("Only me")} className='text-black hover:bg-zinc-400 px-2 flex items-center font-bold mt-1 w-[300px] h-[35px] transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faLock} />  Only me</p>
                                        {/* <p className='text-black hover:bg-zinc-200 px-2 font-bold w-[320px] h-[30px] transition duration-100 rounded-lg cursor-pointer'>Report the comment</p> */}
                                    </div>}

                                </div>
                            </div>
                        </div>
                        <div className='textInput ml-2 mt-3'>
                            {!openPoll && <textarea type="text" ref={textInput} defaultValue={postDetailsObj && postDetailsObj.textContent} className={`text-black bg-white rounded-md mr-2 p-2 outline-none w-[99%] resize-none placeholder-zinc-700`} style={{ height: textInputHeight, transition: 'height 0.3s ease', }} onChange={countLetters} placeholder={`What's on your mind, ${loggedInUser.name.split(" ")[0]} ?`} />}
                            {openPoll &&
                                <div className='mr-2'>
                                    <textarea type="text" ref={questionRef} className='text-black rounded-md bg-white p-2 mb-2 outline-none h-[66px] w-full resize-none' placeholder={`Post a question , ${loggedInUser.name.split(" ")[0]}`} />
                                    <input type="text" ref={option1} className='text-black bg-zinc-300 rounded-lg mr-2 pl-3 mt-3 placeholder-zinc-700 p-2 outline-none h-[40px] w-full resize-none' placeholder={`Option 1`} />
                                    <input type="text" ref={option2} className='text-black bg-zinc-300 rounded-lg mr-2 pl-3 mt-3 placeholder-zinc-700 p-2 outline-none h-[40px] w-full resize-none' placeholder={`Option 2`} />
                                    {/* <input type="text" ref={option3} className='text-black bg-zinc-300 rounded-lg mr-2 pl-3 mt-3 placeholder-zinc-700 p-2 outline-none h-[40px] w-full resize-none' placeholder={`Option 3`} />
                                    <input type="text" ref={option4} className='text-black bg-zinc-300 rounded-lg mr-2 pl-3 mt-3 placeholder-zinc-700 p-2 outline-none h-[40px] w-full resize-none' placeholder={`Option 4`} /> */}

                                </div>}
                        </div>
                        {/* <div className='ml-2 mt-3 mb-3 w-1/2 flex cursor-pointer hover:bg-zinc-300 hover:text-zinc-700 transition duration-200 py-2 mr-2 rounded-lg items-center' onClick={() => setOpenPoll(!openPoll)}>
                            {openPoll ? <> <p className='px-3 text-md mr-3'>Close poll, go back to post</p> <FontAwesomeIcon icon={faRightLong} /> </> : <> <p className=' px-1 pr-0 text-md '>Launch a poll (Adding this feaure soon)</p> <FontAwesomeIcon className='text-md text-zinc-600 ml-3 ' icon={faSliders} /> </>}</div> */}
                        <div className='flex justify-end w-full'>
                            {!postDetailsObj && <>
                                <button onClick={() => { setMedia("Image"); cancelMedia(); }} className={`  text-white px-2 py-1 ${openPoll ? "mr-3" : "mr-7"} ${media === "Image" ? "bg-[#6A0DAD]" : "bg-zinc-500"} rounded-lg`}>Image</button>
                                {!openPoll && <button onClick={() => { setMedia("Video"); cancelMedia(); }} className={`  text-white px-2 py-1 mr-5 ${media === "Video" ? "bg-[#6A0DAD]" : "bg-zinc-500"} rounded-lg`}>Video</button>}

                            </>}
                            {postDetailsObj && <>
                                <button onClick={() => { setMedia("Image"); cancelMediaOfPostDetailsObj(postDetailsObj); }} className={` text-white px-2 py-1 mr-7 ${media === "Image" ? "bg-[#6A0DAD]" : "bg-zinc-500"} rounded-lg`}>Image</button>
                                <button onClick={() => { setMedia("Video"); cancelMediaOfPostDetailsObj(postDetailsObj); }} className={` text-white px-2 py-1 mr-3 ${media === "Video" ? "bg-[#6A0DAD]" : "bg-zinc-500"} rounded-lg`}>Video</button>

                            </>}
                        </div>
                        {postDetailsObj && postDetailsObj.postImage.length === 0 && postDetailsObj.postVideo.length === 0 && urls.length === 0 && noMedia}
                        {!postDetailsObj && imageFiles.length === 0 && videoFiles.length === 0 && noMedia}
                        {postDetailsObj && (postDetailsObj.postImage.length > 0 || postDetailsObj.postVideo.length > 0) && <div className='mediaInput relative ml-2 mr-2 mt-3 min-h-[200px] transition duration-100 border-2 border-zinc-300 bg-zinc-100 cursor-pointer hover:bg-zinc-200 rounded-lg flex flex-col justify-center items-center'>
                            <div className='closePostBox absolute top-2 right-2 flex justify-center items-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-300 transition duration-150 text-xl bg-zinc-200 rounded-full h-[40px] w-[40px] cursor-pointer'>
                                <FontAwesomeIcon onClick={() => cancelMediaOfPostDetailsObj(postDetailsObj)} className='' icon={faXmark} />
                            </div>
                            {postDetailsObj.postImage.length > 0 && postDetailsObj.postImage.map((e, i) => <img className='w-[320px] mt-5 mb-2' key={i} src={e} />)}
                            {postDetailsObj.postVideo.length > 0 && postDetailsObj.postVideo.map((e, i) => <video controls className='w-[320px] mt-3' key={i} src={e} />)}

                        </div>}
                        {urls.length > 0 && (imageFiles.length > 0 || videoFiles.length > 0) &&
                            <div className='mediaInput relative ml-2 pb-2 mr-2 mt-3 min-h-[200px] transition duration-100 border-2 border-zinc-300 bg-zinc-100 cursor-pointer hover:bg-zinc-200 rounded-lg flex flex-col justify-center items-center'>
                                <div className='closePostBox absolute top-2 right-2 flex justify-center items-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-300 transition duration-150 text-xl bg-zinc-200 rounded-full h-[40px] w-[40px] cursor-pointer'>
                                    <FontAwesomeIcon onClick={cancelMedia} className='' icon={faXmark} />
                                </div>
                                {imageFiles.length > 0 && imageFiles.map((e, i) => <img className='w-[320px] mt-5 mb-2' key={i} src={e} />)}
                                {videoFiles.length > 0 && videoFiles.map((e, i) => <video controls className='w-[320px] rounded-xl mt-3' key={i} src={e} />)}

                            </div>
                        }
                        <div className="submit ml-2 mt-3 mr-2 mb-5">
                            {!openPoll && <button className=' flex justify-center items-center text-white bg-[#6A0DAD]  hover:bg-[#5C0D94] rounded-md h-[40px] w-full' onClick={Upload} >{uploadText ? <p className='spinOnButton h-[25px] w-[25px]'></p> : "Post"} </button>}
                            {openPoll && <button className=' flex justify-center items-center text-white bg-[#6A0DAD]  hover:bg-[#5C0D94] rounded-md h-[40px] w-full' onClick={LaunchPoll} >{uploadText ? <p className='spinOnButton h-[25px] w-[25px]'></p> : "Launch Poll"} </button>}
                        </div>
                    </div>
                </div >
            </dialog>
        </>
    )
});

export default PostBox;