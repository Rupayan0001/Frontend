import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import globalState from "../../lib/globalState.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders, faXmark, faPhotoFilm, faRightLong, faEarthAmericas, faUsers, faUser, faSortDown, faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../lib/axios";
import "./../../styles/PostBox.css";
import axios from "axios";
import VideoPlayer from "./VideoPlayer.jsx";

const PostBox = forwardRef(({ onSubmit, page, width }, ref) => {
  const postDetailsObj = globalState((state) => state.postDetailsObj);
  const setPostDetailsObj = globalState((state) => state.setPostDetailsObj);
  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  const openPostWithType = globalState((state) => state.openPostWithType);
  const setOpenPostWithType = globalState((state) => state.setOpenPostWithType);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const openPoll = globalState((state) => state.openPoll);
  const setOpenPoll = globalState((state) => state.setOpenPoll);
  const openPost = globalState((state) => state.openPost);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLikedData = globalState((state) => state.setLikedData);
  const setNewPost = globalState((state) => state.setNewPost);
  const post = globalState((state) => state.post);
  const [media, setMedia] = useState(openPost);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [textInputHeight, setTextInputHeight] = useState("10vh");
  const [allFiles, setAllFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadText, setUploadText] = useState(false);
  const [editAudience, setEditAudience] = useState(false);
  const [audience, setAudience] = useState("Everyone");
  const [updateMedia, setUpdateMedia] = useState(false);
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
  useEffect(() => {
    setTextInputHeight(width > 768 ? "10vh" : "24vh");
  }, [width]);

  useEffect(() => {
    function clickOutside(e) {
      if (editAudienceRef.current && !editAudienceRef.current.contains(e.target) && !audienceRef.current.contains(e.target)) {
        setEditAudience(false);
      }
    }
    document.addEventListener("click", clickOutside);
    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, []);
  async function handleMedia(e) {
    const arr = Array.from(e.target.files);
    const foundBiggerFile = arr.find((e) => {
      if (e.size / 1024 / 1024 > 100) {
        setNotify("File size hould be less that 100 mb");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
        return true;
      }
    });
    if (foundBiggerFile) return;
    else {
      setAllFiles(arr);
      const imagesFiles = arr.filter((e) => e.type.includes("image"));
      const videoFiles = arr.filter((e) => e.type.includes("video"));
      const imageUrls = imagesFiles.map((e) => URL.createObjectURL(e));
      const videoUrls = videoFiles.map((e) => URL.createObjectURL(e));
      setImageFiles(imageUrls);
      setVideoFiles(videoUrls);
      setUrls([...imageUrls, ...videoUrls]);
    }
  }
  useEffect(() => {
    if (postDetailsObj && postDetailsObj.postVideo.length >= 1 && !updateMedia) {
      setMedia("Video");
    }
  }, [postDetailsObj]);
  function cancelMedia() {
    setVideoFiles([]);
    setImageFiles([]);
    setAllFiles([]);
    setUrls([]);
  }

  async function Upload() {
    if (uploadText) return;
    setUploadText(true);
    const text = textInput.current.value.trim();
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (postDetailsObj) {
      if (text === " " && allFiles.length === 0 && postDetailsObj.postImage.length === 0 && postDetailsObj.postVideo.length === 0) {
        setUploadText(false);
        return;
      }
    }
    if (!postDetailsObj) {
      if (
        (text === "" || text === " ") &&
        (allFiles.length === 0 || (postDetailsObj && postDetailsObj.postImage.length === 0) || (postDetailsObj && postDetailsObj.postVideo.length === 0))
      ) {
        setUploadText(false);
        return;
      }
    }
    if (urls.length > 10) {
      setNotify("Can not upload more than 10 images");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
      return;
    }
    try {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      setUploadText("Posting...");
      setLoading(true);
      const formData = new FormData();

      if (media === "Image") {
        if (allFiles.length > 0) {
          allFiles.forEach((file) => {
            formData.append("media", file);
          });
        }
      }
      if (media === "Video") {
        if (allFiles.length > 0) {
          allFiles.forEach((e) => {
            formData.append("video", e);
          });
        }
      }
      formData.append("text", text);
      formData.append("audience", audience);

      if (postDetailsObj) {
        if (postDetailsObj.postImage.length === 0 && postDetailsObj.postVideo.length === 0 && allFiles.length === 0) {
          formData.append("isMedia", "No media");
        }
        if (postDetailsObj.postImage.length > 0 || postDetailsObj.postVideo.length > 0 || allFiles.length > 0) {
          formData.append("isMedia", "Media present");
        }
        if (media === "Video" && updateMedia) {
          const response = await axiosInstance.put(`/post/${postDetailsObj.postId}/updatePost/video`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setNotify("Post updated successfully");
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
        if (media === "Video" && !updateMedia) {
          formData.append("videoNoChange", "true");
          const response = await axiosInstance.put(`/post/${postDetailsObj.postId}/updatePost/video/videoNoChange`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setNotify("Post updated successfully");
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
        if (media === "Image") {
          const response = await axiosInstance.put(`/post/${postDetailsObj.postId}/updatePost`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setNotify("Post updated successfully");
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      }
      if (!postDetailsObj) {
        if (media === "Image") {
          const response = await axiosInstance.post("/post/createPost", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        if (media === "Video") {
          const response = await axiosInstance.post("/post/createPost/video", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
        setNotify("Post uploaded successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      if (page === "Profile") {
        const allPosts = await axiosInstance.get(`/post/${loggedInUser._id}/getCurrentUserPost`, {
          params: { page: 1, limit: 50 },
        });
        setNewPost(allPosts.data.posts);
        setLikedData(allPosts.data.likedData);
      }
      if (page === "Home") {
        const AllPostsIds = homePagePost.map((e) => e._id);
        const responseForPosts = await axiosInstance.post("/post/myRecentPost", {
          AllPostsIds,
        });
        if (!responseForPosts.data.recentPost) {
          throw new Error("No posts found");
        }
        const newArr = responseForPosts.data.recentPost;
        const filteredHomePagePost = homePagePost.filter((e) => e.userId !== loggedInUser._id);
        const updated = [newArr, ...filteredHomePagePost];
        setHomePagePost(updated);
        setLikedData(responseForPosts.data.likedData);
      }
      onSubmit();
      setUploadText("Uploaded");
      setLoading(false);
    } catch (error) {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      setNotify("Something went wrong, please try againg later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } finally {
      setVideoFiles([]);
      setImageFiles([]);
      setAllFiles([]);
      setUrls([]);
      setPostDetailsObj(null);
    }
  }

  const noMedia = (
    <div
      className={`inter bg-slate-100 hover:bg-slate-200 hover:bg-opacity-70 ${width > 700 ? "mr-0" : "mr-2"}  mt-3 ${
        !openPoll && (width > 500 ? "min-h-[200px]" : "min-h-[150px]")
      } ${openPoll && "min-h-[150px]"} transition duration-100  cursor-pointer rounded-lg flex flex-col justify-center items-center`}
      onClick={() => mediaInput.current.click()}
    >
      {media === "Image" && (
        <>
          <input type="file" className="hidden" ref={mediaInput} multiple={openPoll ? false : true} accept="image/*" onChange={handleMedia} />
          <p className={`text-zinc-700 ${width > 500 ? "text-[45px]" : "text-[30px]"} `}>
            <FontAwesomeIcon icon={faPhotoFilm} />
          </p>
          <p className="text-zinc-700 font-bold text-lg mt-2">{openPoll ? "Add Photo Here" : "Add Photos Here"}</p>
          {!openPoll && <p className="text-zinc-500 font-semibold text-md">max 10 images</p>}
        </>
      )}
      {media === "Video" && (
        <>
          <input type="file" className="hidden" ref={mediaInput} accept="video/*" onChange={handleMedia} />
          <p className={`text-zinc-700 ${width > 500 ? "text-[45px]" : "text-[30px]"}`}>
            <FontAwesomeIcon icon={faPhotoFilm} />
          </p>
          <p className="text-zinc-700 font-bold text-lg mt-2">Add Video Here</p>
          {/* <p className="text-zinc-500 font-semibold text-md"></p> */}
        </>
      )}
    </div>
  );
  function cancelMediaOfPostDetailsObj(obj) {
    setUpdateMedia(true);

    setPostDetailsObj({ postId: obj.postId, userId: obj.userId, textContent: obj.textContent, postImage: [], postVideo: "", audience: obj.audience });
  }
  function countLetters(e) {
    if (width <= 768) return;
    const letters = e.target.value.length;
    if (letters >= 140) {
      setTextInputHeight("30vh");
    } else {
      setTextInputHeight("10vh");
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
      questionRef.current.placeholder = "Question is required";
      return;
    }
    if (option1.current.value === "") {
      option1.current.placeholder = "Both options are required";
      return;
    }
    if (option2.current.value === "") {
      option2.current.placeholder = "Both options are required";
      return;
    }
    setUploadText(true);
    formData.append("question", questionRef.current.value);
    formData.append("option1", option1.current.value);
    formData.append("option2", option2.current.value);
    formData.append("type", "poll");
    if (allFiles.length > 0) {
      formData.append("media", allFiles[0]);
    }
    try {
      const response = await axiosInstance.post(`/post/createPost`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      if (response.data.sucess) {
        if (page === "Profile") {
          const allPosts = await axiosInstance.get(`/post/${loggedInUser._id}/getCurrentUserPost`, {
            params: { page: 1, limit: 50 },
          });
          setNewPost(allPosts.data.posts);
          setLikedData(allPosts.data.likedData);
        }
        if (page === "Home") {
          const AllPostsIds = homePagePost.map((e) => e._id);
          const responseForPosts = await axiosInstance.post("/post/myRecentPost", {
            AllPostsIds,
          });
          if (!responseForPosts.data.recentPost) {
            throw new Error("No posts found");
          }
          const newArr = responseForPosts.data.recentPost;
          const filteredHomePagePost = homePagePost.filter((e) => e.userId !== loggedInUser._id);
          const updated = [newArr, ...filteredHomePagePost];
          setHomePagePost(updated);
          setLikedData(responseForPosts.data.likedData);
        }
        setUploadText(false);
        onSubmit();
        setNotify("Poll launched successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setUploadText(false);
      setNotify("Failed to create poll, please try againg later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  return (
    <>
      <dialog className="fixed inset-0 flex justify-center items-center overflow-y-auto z-20 bg-black bg-opacity-70 w-[100%] h-[100%]">
        <div
          ref={ref}
          className={`mainPostBox inter scrollbar-none bg-white ${openPoll && width > 768 && ""} ${
            width > 768 ? "w-[700px]  overflow-y-scroll rounded-lg px-0" : "w-full h-full rounded-none"
          } text-zinc-500`}
        >
          <div className="relative  postBox overflow-y-scroll scrollbar-none pt-0 p-2">
            <div
              onClick={() => {
                onSubmit();
                setOpenPoll(false);
              }}
              className={`closePostBox absolute top-3 ${
                width > 768 ? "right-2" : "left-1"
              }  flex justify-center items-center text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition duration-150 text-lg  rounded-full h-[40px] w-[40px] cursor-pointer`}
            >
              <FontAwesomeIcon className={` ${width > 768 ? "text-[25px]" : "text-[20px]"} `} icon={width > 768 ? faXmark : faArrowLeft} />
            </div>
            {!openPoll && (
              <div className="postBoxTop mt-4 text-black font-semibold flex justify-center text-2xl border-b-2 w-[100%] border-gray-300 pb-2">
                {postDetailsObj ? "Edit Post" : "Create Post"}
              </div>
            )}
            {openPoll && (
              <div
                className={`postBoxTop flex justify-center mt-4 text-black font-semibold text-center ${width > 768 && "text-2xl"} ${width <= 768 && width > 400 && "text-xl"} ${
                  width <= 400 && "ml-3 text-lg"
                } border-b-2 w-[100%] border-gray-300 pb-2`}
              >
                {openPoll && "Launch a Poll"}
              </div>
            )}
            <div className={`info relative flex ${width > 450 ? "justify-between items-center" : "flex-col"}  mt-3`}>
              <div className="flex ">
                <Link to={`/userProfile/${loggedInUser._id}`}>
                  <img src={loggedInUser.profilePic} className="h-[45px] w-[45px] rounded-full ml-2 " alt="profile" />
                </Link>
                <div className="">
                  <Link to={`/userProfile/${loggedInUser._id}`}>
                    <p className="text-black ml-2 font-semibold transition duration-200 hover:underline">{loggedInUser.name}</p>
                    <p className="text-zinc-500 ml-2 ">{loggedInUser.username}</p>
                  </Link>
                </div>
              </div>
              <div>
                <div className="relative">
                  {postDetailsObj && (
                    <div
                      ref={audienceRef}
                      className={`flex items-center justify-evenly cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-[14px] rounded-md ${
                        width > 450 ? "w-[130px]  h-[40px] " : "w-[110px]  h-[35px] mt-2 ml-2"
                      } transition duration-200 `}
                      onClick={() => setEditAudience(!editAudience)}
                    >
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={
                          (postDetailsObj.audience === "Everyone" && faEarthAmericas) ||
                          (postDetailsObj.audience === "Friends" && faUsers) ||
                          (postDetailsObj.audience === "Only me" && faLock)
                        }
                      />{" "}
                      <p>{postDetailsObj.audience}</p> <FontAwesomeIcon className="mb-1 ml-1" icon={faSortDown} />
                    </div>
                  )}
                  {!postDetailsObj && (
                    <div
                      ref={audienceRef}
                      className={`flex items-center justify-evenly cursor-pointer bg-zinc-100  hover:bg-zinc-200 text-[14px]  rounded-md ${
                        width > 450 ? "w-[130px]  h-[40px] " : "w-[110px]  h-[35px] mt-2 ml-2"
                      } transition duration-200 `}
                      onClick={() => setEditAudience(!editAudience)}
                    >
                      <FontAwesomeIcon
                        className="mr-1"
                        icon={(audience === "Everyone" && faEarthAmericas) || (audience === "Friends" && faUsers) || (audience === "Only me" && faLock)}
                      />{" "}
                      <p>{audience}</p> <FontAwesomeIcon className="mb-1 ml-1" icon={faSortDown} />
                    </div>
                  )}

                  {editAudience && (
                    <div ref={editAudienceRef} className="absolute top-[50px] right-[0px] commentEditDropdown z-20  p-2 bg-white rounded-md  w-max">
                      <p
                        onClick={() => changeAudienceHandler("Everyone")}
                        className={`text-black hover:bg-zinc-400 px-2 flex items-center font-bold ${
                          width > 380 ? "w-[300px]" : "w-[270px]"
                        }  h-[35px] transition duration-200 rounded-md cursor-pointer`}
                      >
                        <FontAwesomeIcon className="mr-2" icon={faEarthAmericas} /> Everyone
                      </p>
                      <p
                        onClick={() => changeAudienceHandler("Friends")}
                        className={`text-black hover:bg-zinc-400 px-2 flex items-center font-bold ${
                          width > 380 ? "w-[300px]" : "w-[270px]"
                        } h-[35px] transition duration-200 rounded-md cursor-pointer`}
                      >
                        <FontAwesomeIcon className="ml-[-2px] mr-2" icon={faUsers} /> Friends
                      </p>
                      <p
                        onClick={() => changeAudienceHandler("Only me")}
                        className={`text-black hover:bg-zinc-400 px-2 flex items-center font-bold mt-1 ${
                          width > 380 ? "w-[300px]" : "w-[270px]"
                        } h-[35px] transition duration-200 rounded-md cursor-pointer`}
                      >
                        <FontAwesomeIcon className="mr-2" icon={faLock} /> Only me
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="textInput ml-2 mt-3">
              {!openPoll && (
                <textarea
                  type="text"
                  ref={textInput}
                  defaultValue={postDetailsObj && postDetailsObj.textContent}
                  className={`text-black bg-white rounded-md mr-2 text-[20px] outline-none w-[99%] resize-none placeholder-zinc-700`}
                  style={{ height: textInputHeight, transition: "height 0.3s ease" }}
                  onChange={countLetters}
                  placeholder={`What's on your mind, ${loggedInUser.name.split(" ")[0]} ?`}
                />
              )}
              {openPoll && (
                <div className="mr-2 mb-3">
                  <textarea
                    type="text"
                    ref={questionRef}
                    className={`text-black rounded-md bg-white p-2 mb-0 outline-none ${width > 768 ? "h-[60px]" : "h-[100px]"} w-full resize-none`}
                    placeholder={`Post a question , ${loggedInUser.name.split(" ")[0]}`}
                  />
                  <input
                    type="text"
                    ref={option1}
                    className={`text-black bg-zinc-200 bg-opacity-60 rounded-lg mr-2 pl-3 mt-3 placeholder-zinc-700 p-2 outline-blue-700 h-[40px] w-full resize-none`}
                    placeholder={`Option 1`}
                  />
                  <input
                    type="text"
                    ref={option2}
                    className="text-black bg-zinc-200 bg-opacity-60 rounded-lg mr-2 pl-3 mt-3 placeholder-zinc-700 p-2 outline-blue-700 h-[40px] w-full resize-none"
                    placeholder={`Option 2`}
                  />
                </div>
              )}
            </div>
            <div className={`${width > 768 ? "" : "absolute bottom-0 w-[98%]"} `}>
              <div className=" flex justify-end w-full">
                {!postDetailsObj && !openPoll && (
                  <>
                    <button
                      onClick={() => {
                        setMedia("Image");
                        cancelMedia();
                      }}
                      className={`  text-white px-4 py-1 ${openPoll ? "mr-3" : "mr-7"} ${
                        media === "Image" ? "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 " : "bg-slate-500"
                      } rounded-md`}
                    >
                      Image
                    </button>
                    {!openPoll && (
                      <button
                        onClick={() => {
                          setMedia("Video");
                          cancelMedia();
                        }}
                        className={`  text-white px-4 py-1 mr-2 ${media === "Video" ? "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 " : "bg-slate-500"} rounded-md`}
                      >
                        Video
                      </button>
                    )}
                  </>
                )}
                {postDetailsObj && !openPoll && (
                  <>
                    <button
                      onClick={() => {
                        setMedia("Image");
                        cancelMediaOfPostDetailsObj(postDetailsObj);
                      }}
                      className={` text-white px-4 py-1 mr-7 ${media === "Image" ? "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 " : "bg-slate-500"} rounded-md`}
                    >
                      Image
                    </button>
                    <button
                      onClick={() => {
                        setMedia("Video");
                        cancelMediaOfPostDetailsObj(postDetailsObj);
                      }}
                      className={` text-white px-4 py-1 mr-2 ${media === "Video" ? "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 " : "bg-slate-500"} rounded-md`}
                    >
                      Video
                    </button>
                  </>
                )}
              </div>
              {postDetailsObj && postDetailsObj.postImage.length === 0 && postDetailsObj.postVideo.length === 0 && urls.length === 0 && noMedia}
              {!postDetailsObj && imageFiles.length === 0 && videoFiles.length === 0 && noMedia}
              {postDetailsObj && (postDetailsObj.postImage.length > 0 || postDetailsObj.postVideo.length > 0) && (
                <div
                  className={`mediaInput relative ml-2 mr-2 mt-3 ${
                    postDetailsObj.postImage.length > 0 && "overflow-y-scroll"
                  }  scrollbar-thin h-[200px] transition duration-100 border-2 border-zinc-300 bg-zinc-100 cursor-pointer hover:bg-zinc-200 rounded-lg flex flex-col items-center`}
                >
                  <div className="closePostBox absolute top-2 right-2 z-10 flex justify-center items-center text-zinc-800 hover:text-zinc-900 hover:bg-zinc-300 transition duration-150 text-xl bg-zinc-100 rounded-full h-[30px] w-[30px] cursor-pointer">
                    <FontAwesomeIcon onClick={() => cancelMediaOfPostDetailsObj(postDetailsObj)} className="" icon={faXmark} />
                  </div>
                  {postDetailsObj.postImage.length > 0 && postDetailsObj.postImage.map((e, i) => <img className="w-[320px] my-2" key={i} src={e} />)}
                  {postDetailsObj.postVideo.length > 0 && postDetailsObj.postVideo.map((e, i) => <VideoPlayer expand={false} e={e} key={i} maxHeight="200px" />)}
                </div>
              )}
              {urls.length > 0 && (imageFiles.length > 0 || videoFiles.length > 0) && (
                <div
                  className={`${
                    imageFiles.length > 0 && "overflow-y-scroll"
                  } scrollbar-thin relative ml-2 mr-2 mt-3 h-[200px] transition duration-100 border-2 border-zinc-300 bg-zinc-100 cursor-pointer hover:bg-zinc-200 rounded-lg flex flex-col items-center`}
                >
                  <div className="closePostBox absolute top-2 right-2 z-10 flex justify-center items-center text-zinc-800 hover:text-zinc-900 hover:bg-zinc-300 transition duration-150 text-lg bg-zinc-100 rounded-full h-[30px] w-[30px] cursor-pointer">
                    <FontAwesomeIcon onClick={cancelMedia} className="" icon={faXmark} />
                  </div>
                  {imageFiles.length > 0 && imageFiles.map((e, i) => <img className="w-[320px] rounded-xl my-2" key={i} src={e} />)}
                  {videoFiles.length > 0 &&
                    videoFiles.map(
                      (e, i) => <VideoPlayer expand={false} e={e} key={i} maxHeight="200px" />
                      //  <video controls className="w-[320px] rounded-xl mt-3" />
                    )}
                </div>
              )}
              <div className={`submit mt-3 ${width > 700 ? "mr-0" : "mr-2"} mb-2`}>
                {!openPoll && (
                  <button
                    className="flex justify-center items-center text-white bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600   hover:opacity-90 rounded-md h-[40px] w-full"
                    onClick={Upload}
                  >
                    {uploadText ? <p className="spinButton h-[24px] w-[24px]"></p> : "Post"}{" "}
                  </button>
                )}
                {openPoll && (
                  <button
                    className=" flex justify-center items-center text-white bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600   hover:opacity-90 rounded-md h-[40px] w-full"
                    onClick={LaunchPoll}
                  >
                    {uploadText ? <p className="spinButton h-[24px] w-[24px]"></p> : "Launch Poll"}{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
});

export default PostBox;
