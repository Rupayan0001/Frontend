import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleArrowRight, faEllipsisVertical, faPen, faPenToSquare, faReply, faTrash, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { axiosInstance } from "../../lib/axios";
import "./../../styles/commentBox.css";
import globalState from "../../lib/globalState.js";
import postTimeLogic from "../../lib/Post_Time_Logic.js";
import PostComment from "./PostComment.jsx";
import Confirmation from "./Confirmation.jsx";
import CommentSkeleton from "./PostCommentSkeleton.jsx";

const CommentBox = ({ loggedInUserName, loggedInUserProfilePic, postCreatorName, postId, loggedInUserId, postCreatorId, page = "Home", width }) => {
  const setCommentDetails = globalState((state) => state.setCommentDetails);
  const setNotify = globalState((state) => state.setNotify);
  const comment = globalState((state) => state.comment);
  const setComment = globalState((state) => state.setComment);
  const commentTextEdit = globalState((state) => state.commentTextEdit);
  const deletePostComment = globalState((state) => state.deletePostComment);
  const setDeletePostComment = globalState((state) => state.setDeletePostComment);
  const socketHolder = globalState((state) => state.socketHolder);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  const post = globalState((state) => state.post);
  const setNewPost = globalState((state) => state.setNewPost);

  const notifyTimer = useRef();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState("");
  const commentInput = useRef();
  const commentRef = useRef();

  async function createComment() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (commentInput.current.value.trim() === "") {
      commentInput.current.focus();
      setText("");
      commentInput.current.style.height = "60px";
      return;
    }
    try {
      const str = commentInput.current.value;
      setText("");
      commentInput.current.style.height = "60px";
      const response = await axiosInstance.post(`/post/${postId}/createComment`, {
        content: str,
        creatorName: loggedInUserName,
        creatorProfilePic: loggedInUserProfilePic,
        creatorId: loggedInUserId,
        postCreatorId: postCreatorId,
      });
      setComment(response.data.allComments);
      if (socketHolder && socketHolder.readyState === WebSocket.OPEN) {
        socketHolder.send(
          JSON.stringify({
            type: "post_comment",
            payload: {
              postId,
              postCreatorId,
              senderId: loggedInUser._id,
              senderName: loggedInUserName,
              senderProfilePic: loggedInUserProfilePic,
              comment: str,
            },
          })
        );
      }
      setCommentCounts(response.data.allComments.length);
      if (page === "Home") {
        const found = homePagePost.findIndex((e) => e._id === postId);
        if (found >= 0) {
          homePagePost[found].commentCount += 1;
          setHomePagePost([...homePagePost]);
        }
      } else if (page === "Profile") {
        const found = post.findIndex((e) => e._id === postId);
        if (found >= 0) {
          post[found].commentCount += 1;
          setNewPost([...post]);
        }
      }
    } catch (error) {
      setNotify("Something went wrong, please try againg later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }
  async function deleteComment() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.delete(`/post/${deletePostComment}/${postId}/deleteComment`);
      setDeletePostComment(null);
      setComment(response.data.allComments);
      setCommentCounts(response.data.allComments.length);
      if (width > 768) {
        setNotify("Comment deleted");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      setNotify("Failed to delete comment, please try againg later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  const handleInput = (e) => {
    const textarea = e.target;
    if (textarea.scrollHeight < 290) {
      textarea.style.height = textarea.scrollHeight + "px";
    } else if (textarea.scrollHeight > 290) {
      textarea.style.height = "290px";
    }
    setText(textarea.value);
  };

  useEffect(() => {
    async function getDatas() {
      try {
        const response = await axiosInstance.get(`/post/${postId}/getComment`);
        if (response) {
          setCommentCounts(response.data.comments.length);
          setComment(response.data.comments);
          setLoading(false);
        }
      } catch (err) {
        setNotify(`Failed to get comments`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
    getDatas();
    function handleClicksOutside(e) {
      if (commentRef.current && !commentRef.current.contains(e.target)) {
        setCommentDetails(null);
      }
    }

    document.addEventListener("mousedown", handleClicksOutside);
    return () => {
      setCommentDetails(null);
      document.removeEventListener("mousedown", handleClicksOutside);
    };
  }, []);

  useEffect(() => {
    function handleEnter(e) {
      if (e.key === "Enter" && !commentTextEdit) {
        createComment();
      }
    }
    document.addEventListener("keyup", handleEnter);
    return () => {
      document.removeEventListener("keyup", handleEnter);
    };
  }, [commentTextEdit]);

  return (
    <dialog className="commentBoxMain inter fixed inset-0 z-50 flex justify-center w-[100%] h-[100%] items-center bg-black bg-opacity-70">
      <div ref={commentRef} className={`innerCommentBox overflow-hidden ${width > 768 ? "h-[88vh]" : "h-[100%]"}  w-[750px] rounded-md pb-2  `}>
        {deletePostComment && <Confirmation cancel={setDeletePostComment} proceed={deleteComment} ConfirmText="Are you sure you want to delete this comment?" width={width} />}
        <div className="relative  h-[100%]">
          <FontAwesomeIcon
            icon={width > 768 ? faXmark : faArrowLeft}
            onClick={() => setCommentDetails(null)}
            className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 top-1 ${
              width > 768 ? "right-1" : "left-1"
            } transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
          />
          <h1 className="commentheading text-black text-[25px] h-[50px] flex justify-center items-center text-center mb-0 pb-0  border-b-2 w-[98%] mx-auto border-zinc-300">
            {postCreatorName.split(" ")[0]}'s post
          </h1>
          <div
            className={`usersComment overflow-y-auto ${width > 768 ? "px-4 scrollbar-thin scrollbar-track-zinc-200" : "px-[12px] scrollbar-none "} h-[80%]  pb-40 border-zinc-300`}
          >
            {loading && <CommentSkeleton width={width} />}
            {!loading &&
              comment &&
              comment.map((e, i) => {
                const showTime = postTimeLogic(e);
                return <PostComment key={i} e={e} showTime={showTime} postCreatorId={postCreatorId} width={width} loggedInUserId={loggedInUserId} postId={postId} />;
              })}
            {!comment && <h2>No comments yet</h2>}
          </div>
          <div className="absolute bg-zinc-100 flex justify-between items-top bgLightGrey px-2 bottom-[-10px] w-[100%]">
            <div className="mt-2">
              <img src={loggedInUserProfilePic} className="w-[35px] h-[35px] rounded-full" alt="" />
            </div>
            <div className={`relative ${width > 460 ? "w-[90%]" : "w-[80%]"} `}>
              <textarea
                ref={commentInput}
                value={text}
                type="text"
                onChange={handleInput}
                placeholder="Add a comment"
                className="w-[100%] resize-none outline-none transition duration-100 placeholder-black bg-zinc-100 h-[60px] cursor-pointer  rounded-lg pr-[66px] pl-0 py-2 text-black text-lg"
                style={{ transition: "height 0.2s ease-in" }}
              ></textarea>
              {loading ? (
                <button
                  className={`round absolute ${width > 550 ? "right-1" : "right-1"} top-[12px] text-blue-700 cursor-pointer  transition duration-200 hover:text-[#4B0082]`}
                ></button>
              ) : (
                <FontAwesomeIcon
                  onClick={createComment}
                  className={`comments absolute ${
                    width > 550 ? "right-1" : "right-1"
                  }  top-[12px] text-[25px] text-blue-800  cursor-pointer transition duration-200 hover:opacity-90 rounded-full`}
                  icon={faCircleArrowRight}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default CommentBox;
