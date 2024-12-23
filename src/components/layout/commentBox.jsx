import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faEllipsisVertical, faPen, faPenToSquare, faReply, faTrash, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { axiosInstance } from '../../lib/axios';
import "./../../styles/commentBox.css"
import userProfilePicStore from '../../lib/userProfilePicStore';
import postTimeLogic from '../../lib/Post_Time_Logic.js';


const CommentBox = ({ loggedInUserName, loggedInUserProfilePic, postCreatorName, postId, loggedInUserId, postCreatorId, width }) => {
    // const postId = id;
    // const [holdValue, setHoldValue] = useState("")
    const setCommentDetails = userProfilePicStore((state) => state.setCommentDetails);
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    // const commentDetails = userProfilePicStore((state) => state.commentDetails);
    const notify = userProfilePicStore((state) => state.notify);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const notifyTimer = useRef();
    const [comment, setComment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCommentEditor, setOpenCommentEditor] = useState(null);
    const [commentTextEdit, setCommentTextEdit] = useState(false);
    const [commentCounts, setCommentCounts] = useState("");
    // const [disableClick, setDisableClick] = useState(true);
    const commentInput = useRef();
    const commentRef = useRef();
    const commentEditRef = useRef();
    const threedots = useRef();
    const completeInnerRef = useRef();
    const editCommentTextRef = useRef();
    const editCommentRef = useRef();
    // console.log("Logoimg", logoImg)
    function openEditor(key) {
        setOpenCommentEditor(key === openCommentEditor ? null : key);
        // console.log(editButtonPosition)
    }

    // console.log(commentDetails)
    async function createComment() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        if (commentInput.current.value.trim() === "") {
            commentInput.current.focus();
            // setNotify("Please enter a comment");
            // notifyTimer.current = setTimeout(() => {
            //     setNotify(null)
            // }, 5 * 1000)
            // alert("Please enter a comment");
            return;
        }
        try {
            const str = commentInput.current.value;
            commentInput.current.value = "";
            // setLoading(true);
            // setEmpty("");
            const response = await axiosInstance.post(`/post/${postId}/createComment`, {
                content: str,
                creatorName: loggedInUserName,
                creatorProfilePic: loggedInUserProfilePic,
                creatorId: loggedInUserId,
                postCreatorId: postCreatorId,
            });
            setComment(response.data.allComments);
            setCommentCounts(response.data.allComments.length)
            // setNotify("Comment created");
            // notifyTimer.current = setTimeout(() => {
            //     setNotify(null)
            // }, 5 * 1000)

            // setLoading(false);
            // alert("Created")
            // console.log("Comments: ", response.data.allComments);
            // console.log(comment);
            // console.log(response.data);
        } catch (error) {
            // console.log(error)
            setNotify("Something went wrong, please try againg later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }
    async function deleteComment(id) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            // setLoading(true);
            const response = await axiosInstance.delete(`/post/${id}/${postId}/deleteComment`);
            setComment(response.data.allComments)
            setCommentCounts(response.data.allComments.length)
            setNotify("Comment deleted");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)

            // setLoading(false);
        } catch (error) {
            if (notifyTimer.current) {
                clearTimeout(notifyTimer.current);
                setNotify(null);
            }
            setNotify("Something went wrong, please try againg later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }
    async function updateComment(id) {
        try {
            const response = await axiosInstance.put(`/post/${id}/${postId}/updateComment`, {
                content: editCommentTextRef.current.value
            })
            setComment(response.data.allComments);
            // setOpenCommentEditor(null);
            setCommentTextEdit(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log("fired")
        async function getDatas() {
            try {
                const response = await axiosInstance.get(`/post/${postId}/getComment`, {

                })
                // const commentCount = await axiosInstance.get(`/post/${postId}/getPost`)
                if (response) {
                    // console.log(response.data.comments)
                    setCommentCounts(response.data.comments.length)
                    setComment(response.data.comments)
                    setLoading(false);
                }
            } catch (err) {
                console.log(err)
            }
        };
        getDatas();
        function handleClicksOutside(e) {
            if (commentRef.current && !commentRef.current.contains(e.target)) {
                setCommentDetails(null);
            }
            if (editCommentRef.current && !editCommentRef.current.contains(e.target)) {
                setCommentTextEdit(null);
                // alert("fired")
            }
            // if(commentEditRef.current && !commentEditRef.current.contains(e.target) && !threedots.current.contains(e.target)){

            //     // threedots.current.click();
            //     openEditor(e._id)

            //     alert(e._id)
            // }


        }

        document.addEventListener("mousedown", handleClicksOutside);
        return () => {
            document.removeEventListener("mousedown", handleClicksOutside);
        }
    }, [])
    useEffect(() => {

        function handleEnter(e) {
            // console.log()
            if (e.key === "Enter") {
                createComment();
            }
        }
        document.addEventListener("keyup", handleEnter);
        return () => {
            document.removeEventListener("keyup", handleEnter);
        }
    }, [])

    function editTextHandler(id) {
        setOpenCommentEditor(null);
        setCommentTextEdit(id);
    }

    return (
        <dialog className='commentBoxMain fixed inset-0 z-50 flex justify-center w-[100%] h-[100%] items-center bg-black bg-opacity-70'>


            <div ref={commentRef} className='innerCommentBox overflow-hidden  h-[88vh] w-[750px] rounded-md pb-2  '>

                <div className='relative  h-[100%]'>
                    <FontAwesomeIcon icon={faXmark} onClick={() => setCommentDetails(null)} className='absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 top-1 right-1 transition duration-300 rounded-full top-0 right-0 cursor-pointer' />
                    <h1 className='commentheading text-black text-[25px] h-[50px] flex justify-center items-center text-center italic mb-0 pb-0  border-b-2 w-[98%] mx-auto border-zinc-300'>{postCreatorName.split(" ")[0]}'s post</h1>
                    {/* <div className='absolute top-3 right-3 text-zinc-700'>
                        Comments:  {commentCounts >= 0 ? commentCounts : "Loading..."}
                    </div> */}
                    {/* <div className='flex justify-end'>
                    </div> */}
                    <div className='usersComment overflow-y-scroll scrollbar-thin scrollbar-track-zinc-200 px-4 h-[80%]  pb-40 border-zinc-300'>
                        {loading && <h1 className='text-zinc-700 flex justify-center items-center'>Loading...</h1>}
                        {!loading && comment && comment.map((e, i) => {
                            // console.log("comment: ", comment)
                            const showTime = postTimeLogic(e);
                            return (
                                <div key={i} className=''>
                                    <div className='mt-8 flex group/item'>
                                        <div className='mt-0 mr-1'>
                                            <img src={e.creatorProfilePic} className='w-[35px] h-[35px] rounded-full' alt="" />
                                        </div>
                                        {/* <div className=' border-4 border-red-500'>

                                    </div> */}
                                        <div className='commentContentBg  hover:bg-slate-100 max-w-[75%] min-w-[200px] pr-1 py-1 ml-2 '>
                                            <div ref={completeInnerRef} className='flex items-center '>
                                                <div className='flex items-center w-full justify-between mt-2'>
                                                    <h2 className='text-black font-bold ml-4  text-[13px] mr-4'>{e.creatorName}</h2>
                                                    <p className='text-zinc-500 ml-4 mr-2 text-[12px]'>{showTime}</p>

                                                </div>
                                                <div className='relative group/edit invisible group-hover/item:visible'>
                                                    <FontAwesomeIcon ref={threedots} onClick={() => openEditor(e._id)} className={`text-black absolute top-[-18px] right-[-45px]  cursor-pointer h-4 w-4 hover:bg-zinc-400 rounded-full transition duration-200 p-2 ${openCommentEditor === e._id ? "bg-zinc-400" : ""} `} icon={openCommentEditor === e._id ? faXmark : faEllipsisVertical} />
                                                    {(openCommentEditor === e._id) && <div ref={commentEditRef} className='absolute top-5 right-[-130px] commentEditDropdown z-20  px-2 py-2 bg-white rounded-md shadow-lg w-max'>
                                                        {e.creatorId === loggedInUser._id &&
                                                            <>
                                                                <p onClick={() => editTextHandler(e._id)} className='text-black hover:bg-zinc-200 px-2 font-bold w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faPen} /> Edit your comment</p>
                                                                <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-200 px-2 font-bold mt-1 w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faTrashCan} /> Delete your comment</p>
                                                            </>
                                                        }
                                                        {e.creatorId !== loggedInUser._id && postCreatorId === loggedInUser._id &&
                                                            <>
                                                                {/* <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-400 px-2 font-bold mt-1 w-[300px] h-[30px] transition duration-200 rounded-md cursor-pointer'>Delete comment</p> */}
                                                                <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-400 px-2 font-bold mt-1 w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faReply} />Reply to {e.creatorName.split(" ")[0]}</p>
                                                                <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-400 px-2 font-bold mt-1 w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2' icon={faHeart} />Like {e.creatorName.split(" ")[0]}'s' Comment</p>
                                                                <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-400 px-2 font-bold mt-1 w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'><FontAwesomeIcon className='mr-2 ml-[1px]' icon={faTrashCan} /> Delete {e.creatorName.split(" ")[0]}'s' Comment</p>
                                                            </>
                                                        }
                                                        {loggedInUserId !== postCreatorId && loggedInUserId !== e.creatorId &&
                                                            <>
                                                                <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-400 px-2 font-bold mt-1 w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'>Like {e.creatorName.split(" ")[0]}'s' Comment</p>
                                                                <p onClick={() => deleteComment(e._id)} className='text-black hover:bg-zinc-400 px-2 font-bold mt-1 w-[300px] h-[35px] flex items-center transition duration-200 rounded-md cursor-pointer'>Reply to {e.creatorName.split(" ")[0]}</p>
                                                            </>}
                                                        {/* <p className='text-black hover:bg-zinc-200 px-2 font-bold w-[320px] h-[30px] transition duration-100 rounded-lg cursor-pointer'>Report the comment</p> */}
                                                    </div>}

                                                </div>
                                            </div>
                                            {/* onClick={()=> setOpenCommentEditor(i)} */}
                                            <div className='commentContent text-black text-[18px] ml-4 pr-8 pb-2 '>
                                                {commentTextEdit === e._id ? <div ref={editCommentRef} className='flex items-center'>
                                                    <input type='text' className='outline-none w-[100%] h-[30px] px-4 py-2 rounded-lg bg-white' defaultValue={e.content} ref={editCommentTextRef} placeholder='Share your thoughts' />
                                                    <FontAwesomeIcon onClick={() => updateComment(e._id)} className="comments text-[22px] ml-2 text-[#4B0082] cursor-pointer  transition duration-200 hover:text-[#4B0082] rounded-full"
                                                        icon={faCircleArrowRight} /> </div> : e.content}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className='ml-14 mt-3'>
                                        <div className='flex w-[80px] h-[10px] items-center justify-between'>
                                            <FontAwesomeIcon icon={faThumbsUp} className='text-zinc-900 text-lg cursor-pointer hover:text-[#6A0DAD] transition duration-200' />
                                            {/* <FontAwesomeIcon icon={faThumbsDown} className='text-[#4B0082] text-md cursor-pointer hover:text-[#4B0082] transition duration-200' /> */}
                                            <p className='text-zinc-900 cursor-pointer hover:text-[#6A0DAD] text-md transition duration-200'>Reply</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {!comment && <h2>No comments yet</h2>}
                    </div>
                    <div className='absolute  flex justify-between items-center bgLightGrey px-2 bottom-[-10px] w-[100%]'>
                        <div className='mb-0'>
                            <img src={loggedInUserProfilePic} className='w-[35px] h-[35px] rounded-full' alt="" />
                        </div>
                        <div className='relative w-[90%]'>
                            <textarea ref={commentInput} type="text" placeholder='Add a comment' className='w-[100%] resize-none outline-none transition duration-100 placeholder-black bg-zinc-100 h-[50px] cursor-pointer  rounded-lg pr-[66px] pl-4 py-2 text-black text-lg' ></textarea>
                            {loading ? <button className='round absolute right-4 top-[12px] text-[#4B0082] cursor-pointer  transition duration-200 hover:text-[#4B0082]'></button> : <FontAwesomeIcon onClick={createComment} className="comments absolute right-4 top-[12px] text-[25px] text-[#4B0082] cursor-pointer  transition duration-200 hover:text-[#4B0082] rounded-full" icon={faCircleArrowRight} />}

                        </div>

                    </div>
                </div>
            </div>
            {/* <button className="close absolute top-2 right-5 w-[28px] h-[28px] text-white transition duration-200 hover:bg-zinc-800 rounded-full"><FontAwesomeIcon icon={faXmark} />  </button> */}
            {/* {loading ? <button className="close absolute top-2 right-5 w-[58px] h-[28px] text-white transition duration-200 hover:bg-zinc-800 rounded-full">ethh </button> : } */}


        </dialog>
    )
}

export default CommentBox
