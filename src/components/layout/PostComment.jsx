import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight, faEllipsisVertical, faPen, faPenToSquare, faReply, faTrash, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { axiosInstance } from "../../lib/axios.js";
import "./../../styles/commentBox.css";
import globalState from "../../lib/globalState.js";

const PostComment = ({ e, showTime, loggedInUserId, postId, postCreatorId, width }) => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setNotify = globalState((state) => state.setNotify);
  const setComment = globalState((state) => state.setComment);
  const commentTextEdit = globalState((state) => state.commentTextEdit);
  const setCommentTextEdit = globalState((state) => state.setCommentTextEdit);
  const deletePostComment = globalState((state) => state.deletePostComment);
  const setDeletePostComment = globalState((state) => state.setDeletePostComment);
  const notifyTimer = useRef();
  const [openCommentEditor, setOpenCommentEditor] = useState(null);
  const [commentCounts, setCommentCounts] = useState("");
  const [showFullComment, setShowFullComment] = useState(false);
  const commentEditRef = useRef();
  const threedots = useRef();
  const editCommentTextRef = useRef();
  const editCommentRef = useRef();
  const completeInnerRef = useRef();
  useEffect(() => {
    function handleClickOutside(e) {
      if (commentEditRef.current && !commentEditRef.current.contains(e.target) && !threedots.current.contains(e.target)) {
        setOpenCommentEditor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setCommentTextEdit(null);
    };
  }, []);
  useEffect(() => {
    if (commentTextEdit && editCommentTextRef.current) {
      editCommentTextRef.current.style.height = "auto";
      if (editCommentTextRef.current.scrollHeight < 290) {
        editCommentTextRef.current.style.height = editCommentTextRef.current.scrollHeight + "px";
      } else if (editCommentTextRef.current.scrollHeight >= 290) {
        editCommentTextRef.current.style.height = "290px";
      }
    }
  }, [commentTextEdit]);
  function editTextHandler(id) {
    setOpenCommentEditor(null);
    setCommentTextEdit(id);
  }

  async function updateComment(id) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/post/${id}/${postId}/updateComment`, {
        content: editCommentTextRef.current.value,
      });
      setComment(response.data.allComments);
      setCommentTextEdit(false);
    } catch (error) {
      setNotify("Failed to update comment, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  function openEditor(key) {
    if (commentTextEdit) return;
    if (!key) {
      setOpenCommentEditor(null);
      return;
    } else {
      setOpenCommentEditor(key === openCommentEditor ? null : key);
    }
  }

  return (
    <div className="">
      <div className={`mt-8 relative flex group/item`}>
        <div className="mt-[-6px] mr-1">
          <Link to={`/userProfile/${e.creatorId}`}>
            <img src={e.creatorProfilePic} className="w-[35px] h-[35px] rounded-full" alt="" />
          </Link>
        </div>
        <div
          className={`commentContentBg bg-slate-200 bg-opacity-80 ${!openCommentEditor && "hover:opacity-80"}  cursor-pointer ${
            width > 768 ? "max-w-[75%] ml-2" : "max-w-[75%] ml-1"
          } min-w-[200px] pr-0 py-1  `}
        >
          <div ref={completeInnerRef} className="flex  items-center ">
            <div className={`flex ${width <= 500 ? "flex-col justify-center" : "items-center"}  w-full ${width > 768 ? "justify-between" : ""} mt-2`}>
              <Link to={`/userProfile/${e.creatorId}`}>
                <h2 className={`text-black font-bold ml-4 hover:underline text-[14px] ${width <= 500 ? "mr-3" : "mr-1"}`}>
                  {e.creatorName.length > 26 ? e.creatorName.slice(0, 26) + "..." : e.creatorName}
                </h2>
              </Link>
              {width <= 768 && width > 500 && <p className="text-black mr-1 font-bold text-[14px]">.</p>}
              <p className={`text-zinc-600 mr-2 ${width <= 500 && "ml-4"} font-bold text-[12px]`}>{showTime}</p>
            </div>
            <div className={` ${width > 768 && (openCommentEditor === e._id ? "" : "group/edit invisible group-hover/item:visible")}  ${width <= 768 ? "" : ""} `}>
              {(e.creatorId === loggedInUser._id || postCreatorId === loggedInUser._id) && (
                <FontAwesomeIcon
                  ref={threedots}
                  onClick={() => openEditor(e._id)}
                  className={`text-black absolute  top-0 right-[-8px]  cursor-pointer h-4 w-4 ${
                    width > 550 ? "hover:bg-zinc-300" : "hover:bg-zinc-200"
                  }  rounded-full transition duration-200 p-2 ${openCommentEditor === e._id && width > 550 ? "bg-zinc-300" : ""} `}
                  icon={openCommentEditor === e._id ? faXmark : faEllipsisVertical}
                />
              )}
              {openCommentEditor === e._id && (
                <div ref={commentEditRef} className={`absolute top-8 right-0 commentEditDropdown z-20  px-2 py-2 bg-white rounded-md shadow-lg w-max`}>
                  {e.creatorId === loggedInUser._id && (
                    <>
                      <p
                        onClick={() => editTextHandler(e._id)}
                        className={`text-black hover:bg-zinc-200 px-2 font-bold ${
                          width > 340 ? "w-[300px]" : "w-[270px]"
                        } h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer`}
                      >
                        <FontAwesomeIcon className="mr-2" icon={faPen} /> Edit your comment
                      </p>
                      <p
                        onClick={() => {
                          setDeletePostComment(e._id), setOpenCommentEditor(null);
                        }}
                        className={`text-black hover:bg-zinc-200 px-2 font-bold mt-1 ${
                          width > 340 ? "w-[300px]" : "w-[270px]"
                        } h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer`}
                      >
                        <FontAwesomeIcon className="mr-2" icon={faTrashCan} /> Delete your comment
                      </p>
                    </>
                  )}
                  {e.creatorId !== loggedInUser._id && postCreatorId === loggedInUser._id && (
                    <>
                      {/* <p onClick={() => deleteComment(e._id)} className={`text-black hover:bg-zinc-400 px-2 font-bold mt-1 ${width > 340 ? "w-[300px]" : "w-[270px]"} h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer`}><FontAwesomeIcon className='mr-2' icon={faReply} />Reply to {e.creatorName.split(" ")[0]}</p>
                                        <p onClick={() => deleteComment(e._id)} className={`text-black hover:bg-zinc-400 px-2 font-bold mt-1 ${width > 340 ? "w-[300px]" : "w-[270px]"} h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer`}><FontAwesomeIcon className='mr-2' icon={faHeart} />Like {e.creatorName.split(" ")[0]}'s' Comment</p> */}
                      <p
                        onClick={() => {
                          setDeletePostComment(e._id), setOpenCommentEditor(null);
                        }}
                        className={`text-black hover:bg-zinc-400 px-2 font-bold mt-1 ${
                          width > 340 ? "w-[300px]" : "w-[270px]"
                        } h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer`}
                      >
                        <FontAwesomeIcon className="mr-2 ml-[1px]" icon={faTrashCan} /> Delete {e.creatorName.split(" ")[0]}'s' Comment
                      </p>
                    </>
                  )}
                  {/* {loggedInUserId !== postCreatorId && loggedInUserId !== e.creatorId &&
                                    <>
                                        <p onClick={() => { setDeletePostComment(e._id), setOpenCommentEditor(null) }} className={`text-black hover:bg-zinc-400 px-2 font-bold mt-1 ${width > 340 ? "w-[300px]" : "w-[270px]"} h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer`}>Like {e.creatorName.split(" ")[0]}'s' Comment</p>
                                    </>} */}
                </div>
              )}
            </div>
          </div>
          <div className={`commentContent text-black ${width > 540 ? "text-[16px]" : "text-[16px]"} ml-4 pr-8 pb-2 `}>
            {commentTextEdit === e._id ? (
              <div ref={editCommentRef} className="flex items-center">
                <textarea
                  type="text"
                  className="outline-none w-[60vw] px-4 py-2 rounded-lg bg-white"
                  defaultValue={e.content}
                  ref={editCommentTextRef}
                  placeholder="Share your thoughts"
                ></textarea>
                <FontAwesomeIcon
                  onClick={() => updateComment(e._id)}
                  className="comments text-[22px] ml-2 text-blue-800 cursor-pointer  transition duration-200 hover:opacity-90 rounded-full"
                  icon={faCircleArrowRight}
                />{" "}
              </div>
            ) : e.content.length > 200 ? (
              <p onClick={() => setShowFullComment(!showFullComment)}>{showFullComment ? e.content : e.content.slice(0, 200) + "... read more"}</p>
            ) : (
              <p>{e.content}</p>
            )}
          </div>
        </div>
      </div>

      {/* <div className='ml-14 mt-3'>
                <div className='flex w-[80px] h-[10px] items-center justify-between'>
                    <FontAwesomeIcon icon={faThumbsUp} className='text-zinc-900 text-lg cursor-pointer hover:text-[#6A0DAD] transition duration-200' />
                    {/* <FontAwesomeIcon icon={faThumbsDown} className='text-[#4B0082] text-md cursor-pointer hover:text-[#4B0082] transition duration-200' />
                    <p className='text-zinc-900 cursor-pointer hover:text-[#6A0DAD] text-md transition duration-200'>Reply</p>
                </div>
            </div> */}
    </div>
  );
};

export default PostComment;
