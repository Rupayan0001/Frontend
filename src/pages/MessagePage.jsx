import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
// import FriendList from "../components/layout/Message/FriendList";
// import ChatWindow from "../components/layout/Message/ChatWindow";
// import SearchBar from "../components/layout/Message/SearchBarMessage";
import ReactPlayer from 'react-player';
import { axiosInstance } from "../lib/axios";
import userProfilePicStore from "../lib/userProfilePicStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faEllipsisVertical, faHeadphones, faLocationDot, faMicrophone, faPaperPlane, faPhone, faPhotoFilm, faSquareArrowUpRight, faVideo, faXmark } from "@fortawesome/free-solid-svg-icons";
import Topbar from "../components/layout/Topbar";
import newPostStore from "../lib/NewPost.js";
import SearchBox from "../components/layout/SearchBox.jsx";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown.jsx";
import { faFile, faImage, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import DefaultProfilePic from "../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import chatBg from "../assets/Desktop.png";
import messageTimeLogic from "../lib/MessageTime.js";


const MessagePage = () => {
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const setLoggedInUser = userProfilePicStore((state) => state.setLoggedInUser);
    const openProfileDropdown = userProfilePicStore((state) => state.openProfileDropdown);
    const setOpenProfileDropdown = userProfilePicStore((state) => state.setOpenProfileDropdown);
    const topBarRightProfilePicRefState = userProfilePicStore((state) => state.topBarRightProfilePicRefState);
    const setNotify = userProfilePicStore((state) => state.setNotify);
    const notify = userProfilePicStore((state) => state.notify);
    const selected = newPostStore((state) => state.selected);
    const setSelected = newPostStore((state) => state.setSelected);
    const [loading, setLoading] = useState(true);
    const [openSearch, setOpenSearch] = useState(false);
    const [messages, setMessages] = useState([]);
    const [tab, setTab] = useState("Messages");
    const [activeFriend, setActiveFriend] = useState(null);

    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const [isTyping, setIsTyping] = useState([]);
    const [uploadFiles, setUploadFiles] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [lastMessage, setLastMessage] = useState([]);
    const [editMessage, setEditMessage] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [activeTabUnder900, setActiveTabUnder900] = useState("Friends");
    const [activeFriendMessagesLoading, setActiveFriendMessagesLoading] = useState(false)
    const [friendFindNotActive, setFriendFindNotActive] = useState(false);
    const [messageInputActive, setMessageInputActive] = useState(false);
    const [showImage, setShowImage] = useState(null);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [calling, setCalling] = useState(null);
    const [incomingCall, setIncomingCall] = useState(null);
    const [localVideo, setLocalVideo] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    const navigate = useNavigate();

    const messageBarSearchRef = useRef()
    const friendsFindInputRef = useRef();
    const messageInputRef = useRef();
    const inputMessage = useRef();
    const socketRef = useRef();
    const notifyTimer = useRef();
    const profileDropdownRef = useRef();
    const inputTimer = useRef();
    const messageBoxRef = useRef();
    const chatBoxRef = useRef();
    const fileInput = useRef();
    const photosInput = useRef();
    const videosInput = useRef();
    const audioInput = useRef();
    const uploadContainers = useRef();
    const addMediaRef = useRef();
    const confirmEditRef = useRef();
    const rememberMyFriendList = useRef();
    const profileEditModalRef = useRef();
    const profileEditIconRef = useRef();
    const myCallMedia = useRef();
    const myVideoRef = useRef();
    const friendVideoRef = useRef();

    // Getting logged in user
    useEffect(() => {
        setLoading(true);
        setSelected("Messages");
        setActiveFriend(null);

        async function getLoggedInUser() {
            console.log("hitting   ddds")
            const response = await axiosInstance.get(`/user/getLoggedInuser`);
            console.log("response.data loggedInUser: ", response.data)
            setLoggedInUser(response.data.user)
            setLoading(false);
        }
        getLoggedInUser();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }

    }, [])
    useEffect(() => {
        function resize() {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener("resize", resize)
        return () => {
            window.removeEventListener("resize", resize)
        }
    }, [])
    // getting active friend messages
    useEffect(() => {
        async function getMessages() {
            try {
                // console.log("getting messages...................")
                setActiveFriendMessagesLoading(true)
                const response = await axiosInstance.get(`/message/getMessages`, {
                    params: {
                        senderId: activeFriend._id
                    }
                })
                setMessages([...response.data.messages])
                setActiveFriendMessagesLoading(false)
                response.data.messages.forEach(async (e) => {
                    if (e.recieverId === loggedInUser._id && e.status === "sent") {

                        // console.log("request going out to server")
                        await axiosInstance.post(`/message/seen/${e._id}`)

                    }
                })
                // console.log(response.data.messages)
            } catch (error) {
                console.log(error)
            }
        }
        if (activeFriend) {
            getMessages()
        }
        else {
            return;
        }
    }, [activeFriend])

    useEffect(() => {
        if (lastMessage.length > 0 && friendsList.length > 0) {
            // lastMessage.sort((a, b) => a.createdAt - b.createdAt)
            console.log("lastMessage: ", lastMessage)
            console.log("friendList: ", friendsList)
            let arr = [];
            friendsList.forEach((e, i) => {
                const index = lastMessage.findIndex((f) => f.senderId === e.friendId._id || f.recieverId === e.friendId._id)
                console.log("index", index)
                console.log("e", e)
                if (index >= 0) {
                    arr[index] = e

                }
                if (index < 0) {
                    arr[i] = e
                }
                //    if(index){
                //    }
            })
            setFriendsList(arr);
            console.log("arr: ", arr)
        }
    }, [lastMessage])

    // Websocket connection handler
    useEffect(() => {
        // WebSocket connection
        if (!loggedInUser) return;
        const socket = new WebSocket("ws://localhost:3000");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("connected")
            socket.send(JSON.stringify({ type: "register", userId: loggedInUser._id }));
        }

        socket.onmessage = async (e) => {
            // console.log("messages came back from server: ", activeFriend)
            const data = JSON.parse(e.data);
            if (data.type === "text" || data.type === "file" || data.type === "audio" || data.type === "video" || data.type === "image") {
                console.log(`Received message from server: `, data);
                // if(activeFriend._id !== data.payload.senderId && ){
                //     setMessages(prev => [...prev, data.payload]);

                // }
                if (loggedInUser._id === data.payload.senderId) {
                    setMessages(prev => [...prev, data.payload]);
                }
                console.log("data.payload.senderId: ", data.payload.senderId)
                console.log("activeFriend._id: ", activeFriend._id)
                if (activeFriend._id === data.payload.senderId) {
                    setMessages(prev => [...prev, data.payload]);
                }
                const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
                setLastMessage(responseForRecentMessages.data)
                

                // console.log(".........................firstmessages", responseForRecentMessages.data)
            }
            if (data.type === "typing") {
                if (data.payload.isTyping === false) {
                    const ind = isTyping.findIndex((e) => e.senderId === data.payload.senderId && e.recieverId === data.payload.recieverId && e.isTyping === true)
                    const newArr = isTyping.slice(ind, 1)
                    setIsTyping(newArr)
                }
                if (data.payload.isTyping) {
                    setIsTyping(prev => [...prev, data.payload])
                }
            }
            if (data.type === "statusUpdate") {
                // console.log("data.payload: ", data.payload)
                if (data.payload.status === false) {
                    setOnlineUsers(prev => prev.filter(user => user.userId !== data.payload.userId))
                }
                if (data.payload.status === true) {
                    setOnlineUsers(prev => [...prev, data.payload])
                }
            }
            if (data.type === "call-initiated") {
                console.log("call initiated ................: ", data)
            }
            if (data.type === "incoming-call") {
                console.log("incoming call ................: ", data)
                setIncomingCall(data.payload)
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalVideo(stream);
                const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
                const pc = new RTCPeerConnection(servers);
                await pc.setRemoteDescription(data.payload.offer);
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
                console.log("answer: ", answer);
                socketRef.current.send(
                    JSON.stringify({
                        type: "call-accepted",
                        payload: {
                            callerId: data.payload.callerId,
                            recieverId: data.payload.recieverId,
                            answer
                        }
                    })
                )

            }
            if ( data.type === "call-accepted"){
                console.log("call accepted ................: ", data)
                // const pc = new RTCPeerConnection();

                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.payload.answer));
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalVideo(stream);
                setCalling({ caller: data.payload.callerId, reciever: { userId: data.payload.recieverId, name: data.payload.recieverName }, stream: stream, callType: data.payload.callType });
            }
        }

        socket.onerror = (error) => {
            console.log("error: ", error)
        }
        socket.onclose = (event) => {
            console.log("WebSocket connection closed:", event.code, event.reason);
        };

        return () => {
            console.log("unmounting")
            socket.close();
        }
    }, [loggedInUser, activeFriend])

    async function getFriendsList() {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/user/getAllFriends`);
            const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
            // console.log(".........................firstmessages", responseForRecentMessages.data)
            setLastMessage(responseForRecentMessages.data)
            if (response.data.friends) {
                setFriendsList(response.data.friends);
                rememberMyFriendList.current = response.data.friends;
                setLoading(false);
                console.log("response.data.friendsList: ", response.data.friends)
                setActiveFriend(response.data.friends[0]?.friendId);
            }
            else {
                throw Error;
            }
        }

        catch (error) {
            console.log(error)
            setNotify("Could not get friends list, please try later")
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }
    // getting friends list on mount
    useEffect(() => {
        // setTab("Messages")
        getFriendsList()

    }, [])

    // Enter handler for message input and esc for go to home
    useEffect(() => {

        console.log("Active", activeFriend)

        function clickHandler(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                // console.log(e.key)
                sendMessage(activeFriend);
            }
            if (e.key === "Escape") {
                navigate("/home");

            }
        }
        document.addEventListener("keyup", clickHandler);
        return () => {
            document.removeEventListener("keyup", clickHandler);
        }
    }, [activeFriend, messageInputRef.current])

    // Sending message handler
    function sendMessage(activeFriend) {
        if (!messageInputRef.current) {
            console.error("Message input is not available.");
            return;
        }
        if (!activeFriend) return;
        const message = messageInputRef.current.value.trim();

        if (inputTimer.current) {
            clearTimeout(inputTimer.current);
        }
        // setIsTyping(false);
        socketRef.current.send(
            JSON.stringify({
                type: "typing",
                payload: {
                    senderId: loggedInUser._id,
                    recieverId: activeFriend._id,
                    isTyping: false
                }
            })
        )
        if (message !== "" && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            setMessageInputActive(false);
            const sendMessageObj = {
                type: "text",
                payload: {
                    senderId: loggedInUser._id,
                    recieverId: activeFriend._id,
                    content: message,
                    timestamp: new Date().toISOString(),
                }
            };
            console.log(sendMessageObj)
            socketRef.current.send(JSON.stringify(sendMessageObj));
            // setMessages(prev => [...prev, { ...sendMessageObj.payload, fromSelf: true }]);
            messageInputRef.current.value = "";

        }
    }
    // click handlers for outside click
    useEffect(() => {
        // console.log("clicked")
        function outSideClickHandler(e) {
            if (uploadContainers.current && !uploadContainers.current.contains(e.target) && !addMediaRef.current.contains(e.target)) {
                setUploadFiles(false)
            }
            if (profileEditModalRef.current && !profileEditModalRef.current.contains(e.target) && !profileEditIconRef.current.contains(e.target)) {
                setOpenProfileModal(false)
            }
        }

        document.addEventListener("click", outSideClickHandler);
        return () => {
            document.removeEventListener("click", outSideClickHandler);
            setOpenProfileDropdown(false)
        }
    }, [])
    useEffect(() => {
        function inputClick(e) {
            if (friendFindNotActive && !friendsFindInputRef.current.contains(e.target)) {

                friendsFindInputRef.current.value = null;
                setFriendFindNotActive(false)
                setFriendsList(rememberMyFriendList.current);
            }
        }
        document.addEventListener("click", inputClick);
        return () => {
            document.removeEventListener("click", inputClick);

        }
    }, [friendFindNotActive])

    // top bar profile pic dropown state manage
    useEffect(() => {
        function outSideClickHandler(e) {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
                setOpenProfileDropdown(false)
            }

        }

        document.addEventListener("click", outSideClickHandler);
        return () => {
            document.removeEventListener("click", outSideClickHandler);
        }
    }, [topBarRightProfilePicRefState])

    // scrolling to bottom of chat
    useEffect(() => {
        const scrollTpBottomIfNeeded = () => {

            if (chatBoxRef.current) {
                // if(firstMount === 1){
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                // }
                // if (chatBoxRef.current.clientHeight + chatBoxRef.current.scrollTop >= chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollHeight * 0.3) {
                //     console.log("fired 11111111")
                //     chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                // }
            }
        }
        scrollTpBottomIfNeeded()
    }, [messages])

    // isTyping indicator
    function inputChanging(e) {
        if (!activeFriend) return;
        if (inputTimer.current) {
            clearTimeout(inputTimer.current)
        }
        if (e.target.value.trim().length === 0) {
            setMessageInputActive(false);
        }
        if (e.target.value.trim().length > 0) {
            // setIsTyping(true);
            setMessageInputActive(true);
            socketRef.current.send(
                JSON.stringify({
                    type: "typing",
                    payload: {
                        senderId: loggedInUser._id,
                        recieverId: activeFriend._id,
                        isTyping: true
                    }
                })
            )
        }
        inputTimer.current = setTimeout(() => {
            // setIsTyping(false);
            socketRef.current.send(
                JSON.stringify({
                    type: "typing",
                    payload: {
                        senderId: loggedInUser._id,
                        recieverId: activeFriend._id,
                        isTyping: false
                    }
                })
            )
        }, 3000);

    }

    // sending files handler
    async function handleMediaInputChange(e, type) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        if (e.target.files[0].size / (1024 * 1024) > 25) {
            setNotify("File size should be less than 25 MB");
            notifyTimer.current = setTimeout(() => {
                setNotify(null);
            }, 5 * 1000)
            return
        }
        console.log("arr: ", e.target.files[0])
        const formData = new FormData();
        formData.append("media", e.target.files[0]);
        formData.append("type", type);
        try {
            setNotify("Uploading...");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000);
            let response;
            if (type === "video") {
                response = await axiosInstance.post("/message/uploadVideo", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })

            }
            else {
                response = await axiosInstance.post("/message/uploadFiles", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
            }
            if (response.data.message === "File uploaded successfully") {
                if (notifyTimer.current) {

                    clearTimeout(notifyTimer.current);
                }
                setNotify(`Uploaded successfully`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
                console.log("success", response.data.url)
                socketRef.current.send(
                    JSON.stringify({
                        type: type,
                        payload: {
                            senderId: loggedInUser._id,
                            recieverId: activeFriend._id,
                            file: response.data.url,
                            timestamp: new Date().toISOString(),
                        }
                    })
                )
            }
        } catch (error) {
            console.log("error: ", error)
            // console.log("error: ", error)
            if (error.response.data.message === "File size is too large") {
                setNotify("File size is too large");
            }
            else {
                setNotify("Something went wrong, please try again later");

            }
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000);

        }

    }

    async function blockUser(userId, username) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenProfileModal(false);
        try {
            const response = await axiosInstance.post(`/user/${userId}/blockUser`);
            if (response.data.message === "User blocked") {
                setMessages([]);
                const response = await axiosInstance.get(`/user/getAllFriends`);
                const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
                // console.log(".........................firstmessages", responseForRecentMessages.data)
                setLastMessage(responseForRecentMessages.data)
                if (response.data.friends) {
                    setFriendsList(response.data.friends);
                    rememberMyFriendList.current = response.data.friends;
                    setActiveFriend(response.data.friends[0]?.friendId);
                }
                setNotify(`You have blocked ${username.split(" ")[0]}'s profile`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000)

            }
        } catch (error) {
            // console.log("error: ", error)
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
    async function deleteAllChat(userId) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenProfileModal(false);
        try {
            const response = await axiosInstance.delete(`/message/deleteAllMessages/${userId}`);
            console.log("response: ", response.data)
            if (response.data.success) {
                setMessages(response.data.messages);
                setNotify("All Messages deleted");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
            else {
                throw new Error("Could not delete messages")
            }
        } catch (error) {
            console.log(error)
            setNotify("Could not delete messages, please try again later")
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }

    async function removeFriend(id, username) {
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        setOpenProfileModal(false);
        try {
            const response = await axiosInstance.delete(`/user/${id}/removeFriend`);
            console.log(response.data.message === "Removed friend")
            if (response.data.message === `Removed friend`) {
                setMessages([]);
                const response = await axiosInstance.get(`/user/getAllFriends`);
                const responseForRecentMessages = await axiosInstance.get(`/message/getRecentMessages`);
                // console.log(".........................firstmessages", responseForRecentMessages.data)
                setLastMessage(responseForRecentMessages.data)
                if (response.data.friends) {
                    setFriendsList(response.data.friends);
                    rememberMyFriendList.current = response.data.friends;
                    setActiveFriend(response.data.friends[0]?.friendId);
                }
                setNotify(`Removed ${username.split(" ")[0]} from your friendlist`);
                notifyTimer.current = setTimeout(() => {
                    setNotify(null)
                }, 5 * 1000)
            }
        } catch (error) {
            console.log("error: ", error);
            setNotify("Something went wrong, please try again later");
            notifyTimer.current = setTimeout(() => {
                setNotify(null)
            }, 5 * 1000)
        }
    }
    function getProfiles() {

        console.log("rememberMyFriendList.current: ", rememberMyFriendList.current)
        const friendName = friendsFindInputRef.current.value.trim()
        if (friendName.length >= 1) {

            const newArr = rememberMyFriendList.current.filter(e => {
                if (e.friendId.name.toLowerCase().startsWith(friendName.toLowerCase())) {
                    console.log("found: ", e)
                    return e;
                }
            })
            console.log("Searched Friends List: ", newArr)
            setFriendsList(newArr);
        }
        else if (friendName.length === 0) {
            setFriendsList(rememberMyFriendList.current);
        }
    }


    async function callUser(friendId, name, callType) {
        console.log("callType: ", callType)

        const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalVideo(stream);
            // if( myCallMedia.current){
            //     myCallMedia.current.srcObject = stream;
            //     console.log("myCallMedia.current: ", myCallMedia.current.srcObject)

            // }
            const peerConnection = new RTCPeerConnection(servers);
            setPeerConnection(peerConnection);
            // if (stream) {
            //     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
            // }
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

            // // Send the offer to the remote peer via signaling server (WebSocket/Socket.IO)
            // socketRef.current.send(JSON.stringify({ type: 'offer', sdp: offer }));
            socketRef.current.send(
                JSON.stringify({
                    type: "initiateCall",
                    payload: {
                        callerId: loggedInUser._id,
                        callerName: loggedInUser.name,
                        callerProfilePic: loggedInUser.profilePic,
                        recieverId: friendId,
                        callType,
                        offer,
                        // stream: stream           
                    }
                })
            )
            setCalling({ caller: loggedInUser._id, reciever: { userId: friendId, name: name }, stream: stream, callType: callType });
        } catch (error) {
            console.log("error in calling: ", error)
        }
    }
    async function acceptCall(incomingCall) {
        socketRef.current.send(
            JSON.stringify({
                type: "accept-call",
                payload: {
                    callerId: incomingCall.callerId,
                    callerName: incomingCall.callerName,
                    callerProfilePic: incomingCall.callerProfilePic,
                    recieverId: incomingCall.recieverId,
                    callType,
                    // stream: stream           
                }
            })
        )
    }
    useEffect(() => {
        if (myCallMedia.current && localVideo) {
            myCallMedia.current.srcObject = localVideo;
            console.log("myCallMedia.current: ", myCallMedia.current.srcObject)
        }
    }, [calling])
    // useEffect(() => {
    //     if (friendVideoRef.current && localVideo) {
    //         friendVideoRef.current.srcObject = localVideo;
    //         console.log("myCallMedia.current: ", friendVideoRef.current.srcObject)
    //     }
    // }, [incomingCall])
    if (loading) {
        return <div className='h-screen flex justify-center items-center'><p className='spinOnButton h-[30px] w-[30px]'></p></div>
    }
    return (
        <div className="relative h-[100vh] overflow-hidden w-[100vw] bg-black">
            {notify && windowWidth > 900 && <div className='absolute giveShadow left-6 bottom-10 z-50 bg-zinc-900 px-5 py-3 text-white rounded-lg'>
                {notify} <button className='cursor-pointer hover:bg-zinc-700 transition duration-200 border-0 px-2 py-1 ml-2 bg-zinc-800 rounded-md font-semibold text-[15px]' onClick={() => window.location.reload()}>Reload</button>
            </div>}
            {notify && windowWidth <= 900 && <dialog className="inset-0 h-[100%] w-[100%] z-50 bg-transparent flex justify-center items-baseline">
                <div className='giveShadow bg-zinc-900 px-5 py-3 text-white rounded-lg'>
                    {notify} <button className='cursor-pointer hover:bg-zinc-700 transition duration-200 border-0 px-2 py-1 ml-2 bg-zinc-800 rounded-md font-semibold text-[15px]' onClick={() => window.location.reload()}>Reload</button>
                </div>
            </dialog>
            }

            {showImage && <dialog className={`fixed inset-0 z-50 h-[100%] w-[100%] bg-black ${windowWidth > 900 ? "bg-opacity-60" : "bg-opacity-100"} flex justify-center items-center`}>
                {windowWidth > 900 && <FontAwesomeIcon icon={faXmark} className={`absolute top-2 right-4 w-[20px] h-[20px] p-2 bg-white hover:bg-zinc-400 text-black rounded-full cursor-pointer`} onClick={() => setShowImage(null)} />}
                {windowWidth <= 900 && <FontAwesomeIcon icon={faArrowLeft} className={`absolute top-2 left-2 w-[20px] h-[20px] p-2 hover:bg-white hover:text-black text-white rounded-full cursor-pointer`} onClick={() => setShowImage(null)} />}
                <div ref={confirmEditRef} className={`${windowWidth > 900 ? "w-[90vw] h-[80vh]" : "w-[100vw] h-[80vh]"} flex justify-center items-center`}>
                    <img src={showImage} className={`${windowWidth > 900 ? "max-w-[90vw] max-h-[80vh]" : "max-w-[100vw] max-h-[80vh]"} rounded-sm`} alt="" />

                </div>
            </dialog>}


            {calling && <dialog className={`fixed inset-0 z-50 h-[100%] w-[100%] bg-black ${windowWidth > 900 ? "bg-opacity-60" : "bg-opacity-100"} flex justify-center items-center`}>
                {console.log("calling: ", calling)}
                <div className={`w-[100vw] h-[90vh] flex justify-center items-center`}>
                    {calling.callType === "video" && <div className="bg-zinc-300">
                        <div className="flex items-center">
                            <video ref={myCallMedia} autoPlay muted className="w-[450px] h-[200px]"></video>
                            <video ref={friendVideoRef} autoPlay muted className="max-w-[50%]"></video>
                        </div>
                        <div className="flex justify-center items-center">
                            <button>End Call</button>
                            <button>Mute</button>
                            <button>Hold</button>
                            <button>Audio</button>
                        </div>
                    </div>}
                    {/* <CallComponent caller={calling.caller} reciever={calling.reciever} stream={calling.stream} type={calling.type} /> */}
                </div>
            </dialog>}

            {incomingCall && <dialog className={`fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center h-[100%] w-[100%]`}>

                <div className="bg-zinc-800 w-[50vw] h-[30vh] flex flex-col justify-center items-center rounded-lg">
                    <div className="flex items-center">
                        {/* <h1 className="text-white text-[20px] font-bold">{incomingCall.callerName} is calling you</h1> */}
                        {incomingCall.callType === "audio" && <FontAwesomeIcon icon={faPhone} className=" w-[25px] h-[25px] p-2 text-green-500 rounded-full" />}
                        {incomingCall.callType === "video" && <FontAwesomeIcon icon={faVideo} className=" w-[25px] h-[25px] p-2 text-green-500 rounded-full" />}
                        <h1 className="text-white text-[20px] font-bold">{incomingCall.callerName}</h1>

                    </div>
                    <div className="flex justify-center items-center">
                        <button onClick={() => acceptCall(incomingCall)} className="ml-2 px-4 py-2 bg-green-600 text-white">Accept</button>
                        <button onClick={() => rejectCall(incomingCall)} className="ml-2 px-4 py-2 bg-green-600 text-white">Reject</button>
                    </div>
                </div>
            </dialog>}

            <Topbar page={"Messages"} />
            <div className="relative flex h-full w-full">
                {openProfileDropdown && <TopbarRightDropdown pageName={"Message"} ref={profileDropdownRef} />}

                {/* Friends List section */}
                {windowWidth > 900 && <div className="xl:w-[450px] transition-width duration-500 ease-in lg:w-[400px] md:w-[300px] sm:w-[250px] w-full bg-slate-900">

                    <div className="flex justify-center w-[100%] items-center h-[60px] mt-2 px-1">
                        {/* <img src={loggedInUser?.profilePic || DefaultProfilePic} className="w-[45px] ml-1 h-[45px] rounded-full" alt="" /> */}
                        <div className="relative px-4 w-full">
                            <input type="text" ref={friendsFindInputRef} onClick={() => setFriendFindNotActive(true)} onChange={getProfiles} className={`w-[100%] h-[42px] outline-none rounded-xl placeholder:text-white ${friendFindNotActive ? "bg-slate-600" : "bg-slate-700"} text-white cursor-pointer pl-4`} placeholder="Search your friends" />

                        </div>
                        {/* <FontAwesomeIcon icon={faEllipsisVertical} className="w-[17px] h-[17px] bg-white p-2 ml-4 hover:bg-zinc-200 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer" /> */}
                    </div>

                    <div className="h-full xl:w-[450px] transition-width duration-500 ease-in lg:w-[400px] md:w-[300px] sm:w-[250px] w-full overflow-y-scroll scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-zinc-400">
                        {console.log("friendsList: ", friendsList)}
                        {friendsList && friendsList.length > 0 && friendsList.map((e, i) => {

                            return (<div key={i} onClick={() => setActiveFriend(e.friendId)} className={`flex items-center w-full text-white h-[80px] ${activeFriend?._id === e.friendId._id ? "bg-slate-600" : ""} cursor-pointer hover:bg-slate-600 rounded-lg px-4 transition duration-200 mt-2`}>
                                <img src={e.friendId.profilePic} className="w-[50px] h-[50px] shadow-sm shadow-zinc-300 rounded-full" alt="" />
                                <div className="ml-4 w-full">
                                    <div className="flex items-center">
                                        <h1 className="text-white text-[15px] font-bold">{e.friendId.name}</h1>
                                        <div className="flex items-center">
                                            {/* {console.log("onlineUsers: ", onlineUsers)}
                                            {console.log("onlineUsers: ", e.friendId._id)} */}
                                            {onlineUsers.find(a => a.userId === e.friendId._id)?.status === true &&
                                                <p className="h-[8px] w-[8px] rounded-full bg-green-400 mt-[1px] mr-2 ml-3"></p>}
                                            {/* <div>{isTyping.senderId === e.friendId._id && isTyping.isTyping === true ? <p className="text-[12px] font-bold text-white">Typing...</p> : <p className="text-[14px] text-zinc-500"></p>}</div> */}
                                        </div>

                                    </div>
                                    {isTyping.find(a => a.senderId === e.friendId._id && a.recieverId === loggedInUser._id) &&
                                        <div className={`max-w-[60vw] flex items-center overflow-x-hidden`}> <p className=" font-bold text-green-400">Typing...</p> </div>
                                    }
                                    {!isTyping.find(a => a.senderId === e.friendId._id && a.recieverId === loggedInUser._id) &&
                                        <div className={`max-w-[60vw] flex items-center overflow-x-hidden`}>{lastMessage.find(message => message.recieverId === loggedInUser._id && message.senderId === e.friendId._id) && <FontAwesomeIcon icon={faSquareArrowUpRight} className="rotate-180 mr-2" />} {lastMessage.find(a => a.recieverId === e.friendId._id || a.senderId === e.friendId._id)?.content} </div>
                                    }
                                </div>
                            </div>
                            )
                        })}
                        {friendsList && friendsList.length === 0 && <div className="h-[70%] flex items-center justify-center"><p className="text-white">No friend found</p></div>}

                    </div>
                </div>}

                {windowWidth <= 900 && activeTabUnder900 === "Friends" && <div className=" w-full bg-slate-900">

                    <div className="flex justify-center w-[100%] items-center h-[60px] mt-2 px-1">
                        {/* <img src={loggedInUser?.profilePic || DefaultProfilePic} className="w-[45px] ml-1 h-[45px] rounded-full" alt="" /> */}
                        <div className="relative px-4 w-full">
                            <input type="text" ref={friendsFindInputRef} onClick={() => setFriendFindNotActive(true)} onChange={getProfiles} className={`w-[100%] h-[42px] outline-none rounded-xl ${friendFindNotActive ? "bg-slate-500" : "bg-slate-600"} placeholder:text-white text-white cursor-pointer pl-4`} placeholder="Search your friends" />
                            {/* w-[24vw] h-[42px] mx-4 pl-4 rounded-xl bg-zinc-300 cursor-pointer outline-none  */}
                            {/* <div className="absolute top-[-13px] left-[-1px]">
                                {openSearch && <SearchBox page="Message" ref={messageBarSearchRef} />}

                            </div> */}
                        </div>
                        {/* <FontAwesomeIcon icon={faEllipsisVertical} className="w-[17px] h-[17px] bg-white p-2 ml-4 hover:bg-zinc-200 text-zinc-800 font-bold transition duration-300 rounded-full cursor-pointer" /> */}
                    </div>
                    {/* <div className="flex w-full items-center h-[60px]  px-0">
                        <button onClick={() => setTab("Messages")} className={`text-[17px] cursor-pointer hover:bg-zinc-800 ${tab === "Messages" ? "border-b-[4px] font-semibold  border-[#6A0DAD] text-white" : "text-zinc-500 border-b-[4px] border-transparent"} transition duration-200 h-[50px] w-1/2`}>Messages</button>
                        <button onClick={() => setTab("Friends")} className={`text-[17px] cursor-pointer hover:bg-zinc-800 ${tab === "Friends" ? "border-b-[4px] font-semibold  border-[#6A0DAD] text-white" : "text-zinc-500 border-b-[4px] border-transparent"} transition duration-200 h-[50px] w-1/2`}>Friends</button>
                    </div> */}

                    <div className="h-full w-full overflow-y-scroll scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-zinc-400">
                        {friendsList && friendsList.length > 0 && friendsList.map((e, i) => {

                            // { console.log("firing:..........", e) }
                            return (<div key={i} onClick={() => { setActiveFriend(e.friendId); setActiveTabUnder900("Messages") }} className={`flex items-center text-white ${windowWidth >= 900 ? "h-[80px] mt-2" : "h-[70px] mt-2"} cursor-pointer w-full hover:bg-slate-600 rounded-lg px-4 transition duration-200 `}>
                                <img src={e.friendId.profilePic} className={`${windowWidth > 600 ? "w-[50px] h-[50px]" : "w-[40px] h-[40px]"} shadow-sm shadow-zinc-300 rounded-full`} alt="" />
                                <div className={`${windowWidth >= 375 ? "ml-4" : "ml-3"} mt-1 w-full`}>
                                    <div className="flex items-center">
                                        <h1 className="text-white text-[15px] font-bold">{e.friendId.name}</h1>
                                        <div className="flex items-center">
                                            {onlineUsers.find(a => a.userId === e.friendId._id)?.status === true &&
                                                <p className="h-[8px] w-[8px] rounded-full bg-green-400 mt-[1px] ml-2"></p>
                                            }
                                            {/* <div>{isTyping.senderId === e.friendId._id && isTyping.isTyping === true && <p className="text-[12px] font-bold text-white">Typing...</p>}</div> */}
                                        </div>

                                    </div>
                                    {isTyping.find(a => a.senderId === e.friendId._id && a.recieverId === loggedInUser._id) &&
                                        <div className={`max-w-[60vw] flex items-center overflow-x-hidden`}> <p className=" font-bold text-green-400">Typing...</p> </div>
                                    }
                                    {!isTyping.find(a => a.senderId === e.friendId._id && a.recieverId === loggedInUser._id) &&
                                        <div className={`max-w-[60vw] flex items-center overflow-x-hidden`}>{lastMessage.find(message => message.recieverId === loggedInUser._id && message.senderId === e.friendId._id) && <FontAwesomeIcon icon={faSquareArrowUpRight} className="rotate-180 mr-2" />} {lastMessage.find(a => a.recieverId === e.friendId._id || a.senderId === e.friendId._id)?.content} </div>
                                    }
                                </div>
                            </div>
                            )
                        })}
                        {friendsList && friendsList.length === 0 && <div className="h-[70%] flex items-center justify-center"><p className="text-white">No friend found</p></div>}


                    </div>
                </div>}

                {/* Message List Section */}
                {windowWidth > 900 && <div className={`relative ${windowWidth >= 900 && "h-[91.5vh]"} ${(windowWidth >= 768 && windowWidth < 900) && "h-[91.5vh]"} ${(windowWidth < 768 && windowWidth > 450) && "h-[82.5vh]"} ${(windowWidth <= 450) && "h-[84vh]"}  w-full  `}>

                    <div className={`${windowWidth > 450 ? "h-[70px] px-4" : "h-[50px] px-2"} relative bg-gradient-to-r from-slate-900 to-slate-800   py-2 transition duration-200 `}>
                        {activeFriend && <div className="flex justify-between w-full h-full items-center">
                            <Link to={`/userProfile/${activeFriend?._id}`}>
                                <div className="flex items-center">
                                    {windowWidth < 900 && <button className="w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer transition duration-200 hover:bg-zinc-700 mr-2"> <FontAwesomeIcon icon={faArrowLeft} className=" text-white" /></button>}
                                    <img src={activeFriend?.profilePic || loggedInUser.profilePic} className={` ${windowWidth > 450 ? "w-[45px] h-[45px]" : "w-[30px] h-[30px]"} rounded-full`} alt="" />
                                    <div className="ml-3">
                                        <p className="text-white text-[17px] font-bold">{activeFriend?.name || ""}</p>
                                        <div>{isTyping.find(e => e.senderId === activeFriend?._id && e.recieverId === loggedInUser._id) ? <p className="text-[14px] font-semibold text-green-400">Typing...</p> : onlineUsers.find(a => a.userId === activeFriend?._id)?.status === true && <p className="text-[14px] font-semibold text-zinc-300">Online</p>}</div>
                                    </div>
                                </div>
                            </Link>
                            <div className="flex items-center">
                                <FontAwesomeIcon onClick={() => callUser(activeFriend?._id, activeFriend?.name, "video")} icon={faVideo} className={`w-[25px] mr-5 h-[25px] p-2 hover:text-green-400 text-green-600 transition duration-200 cursor-pointer`} />
                                <FontAwesomeIcon onClick={() => callUser(activeFriend?._id, activeFriend?.name, "audio")} icon={faPhone} className={`w-[22px] mr-5 h-[22px] p-2 hover:text-green-400 text-green-600 transition duration-200 cursor-pointer`} />
                                <FontAwesomeIcon icon={faEllipsisVertical} ref={profileEditIconRef} onClick={() => setOpenProfileModal(!openProfileModal)} className="w-[17px] h-[17px]  p-2 hover:bg-slate-900 text-zinc-300 font-bold transition duration-300 rounded-full cursor-pointer" />
                            </div>
                        </div>}
                        {openProfileModal && <div ref={profileEditModalRef} className="absolute top-6 right-2 z-50 px-2 py-2 mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-md shadow-md w-[200px]">
                            <ul>
                                <li><p onClick={() => blockUser(activeFriend?._id, activeFriend?.name)} className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Block</p></li>
                                {/* <li><p className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Report</p></li> */}
                                <li><p onClick={() => deleteAllChat(activeFriend?._id)} className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Delete All Chat</p></li>
                                <li><p onClick={() => removeFriend(activeFriend?._id, activeFriend?.name)} className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Remove From Friends</p></li>
                            </ul>
                        </div>}
                    </div>

                    {/* <div className="relative h-[calc(91vh-140px)]"> */}
                    {/* <div className="absolute w-full h-full bg-black bg-opacity-50"></div> */}
                    <div ref={chatBoxRef} className={` ${(windowWidth < 768 && windowWidth > 450) && "h-[calc(83vh-140px)] px-3"} ${windowWidth >= 768 && "h-[calc(91.5vh-140px)] px-5"} ${windowWidth < 450 && "h-[calc(84vh-110px)] px-2"}  pb-6 overflow-y-scroll scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-zinc-400 w-full bg-cover pt-[12px] `} style={{ backgroundImage: `url("https://res.cloudinary.com/dnku8pwjp/image/upload/v1733975369/Desktop-2_xvmmfa.png")` }}>
                        {/* {console.log("message: ", messages)} */}
                        {activeFriendMessagesLoading && <div className="h-full w-full flex items-center justify-center"> <p className='spinOnButton h-[30px] w-[30px]'></p> </div>}
                        {messages && !activeFriendMessagesLoading && messages.length > 0 && messages.map((e, i) => {
                            return (<div key={i} className={`flex mt-[12px] items-center ${e.senderId === loggedInUser._id ? "justify-end" : "justify-start"}`}>

                                {e.content?.length > 0 &&
                                    <div className={`relative  transition duration-100 text-[16px] max-w-[400px] flex items-top  ${e.senderId === loggedInUser._id ? "bg-[#6A0DAD] hover:bg-opacity-70" : "bg-slate-700 bg-opacity-70 hover:bg-opacity-40"}  text-white rounded-lg pl-2 pr-11 pt-[2px] pb-0 `}>
                                        <p className={`word-wrap ${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} pb-3 break-words`}>{e.content} </p>
                                        <div className="absolute bottom-1 right-1"><p className="text-[11px] text-right ">{messageTimeLogic(e)}</p> </div>
                                    </div>}

                                {(e.imageUrl.length > 0 || e.videoUrl.length > 0 || e.audioUrl.length > 0 || e.documentFiles.length > 0) &&
                                    <div className={`relative cursor-pointer  transition duration-100 text-[16px] ${windowWidth > 600 && "max-w-[400px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[320px]"} ${windowWidth < 450 && "max-w-[240px]"} flex items-top  ${e.senderId === loggedInUser._id ? "bg-[#6A0DAD] hover:bg-opacity-60 bg-opacity-50" : "bg-slate-700 bg-opacity-70 hover:bg-opacity-40"}  text-white rounded-lg pl-1 pr-1 pt-[1px] pb-0 `}>

                                        {/* // <p className="word-wrap max-w-[430px] pb-3 break-words">{e.content} </p> */}

                                        {e.audioUrl.length > 0 && <audio controls src={e.audioUrl[0]} className={`${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} rounded-sm `} />}
                                        {/* {e.audioUrl.length > 0 && <ReactPlayer
                                            url={e.audioUrl[0]}
                                            controls
                                            width="100%"
                                            height="50px"
                                            style={{ borderRadius: '10px', overflow: 'hidden' }}
                                        />} */}
                                        {e.videoUrl.length > 0 && <video controls src={e.videoUrl[0]} className={`${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} rounded-lg pb-1 pt-1`} />}
                                        {e.imageUrl.length > 0 && <img src={e.imageUrl[0]} onClick={() => { setShowImage(e.imageUrl[0]) }} className={`${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} rounded-lg pt-1 pb-1`} />}
                                        {e.documentFiles.length > 0 && <a href={e.documentFiles[0]} className="text-[12px] pt-1 pl-1 pr-6 pb-4 text-white" target="_blank" rel="noopener noreferrer">View File <FontAwesomeIcon icon={faFile} className="ml-2 mr-2 text-lg text-yellow-500" /> </a>}

                                        <div className={`absolute ${e.audioUrl.length > 0 ? "right-6 bottom-0" : "right-2 bottom-1"} `}><p className={`text-[11px] text-right ${e.audioUrl.length > 0 && "text-black"}`}>{messageTimeLogic(e)}</p> </div>
                                    </div>}
                                {/* <p>{e.senderId === loggedInUser._id && e.status === "sent" && <FontAwesomeIcon icon={faCheck} className="ml-2 text-[12px]"/>}</p>  */}
                            </div>
                            )
                        })}
                        <div ref={messageBoxRef}></div>

                    </div>
                    {/* </div> */}


                    <div className={`${windowWidth > 450 ? "h-[70px]" : "h-[60px]"}  absolute bottom-0 w-full cursor-pointer bg-gradient-to-r from-slate-800 to-slate-900 pl-2 pr-5 py-2 transition duration-200 `}>
                        <div className="relative flex items-center">
                            {uploadFiles && <div ref={uploadContainers} className="absolute bottom-[70px] rounded-xl left-0  flex bg-gradient-to-b from-slate-800 to-slate-900 flex items-center">
                                <div onClick={() => fileInput.current.click()} className="text-[16px] w-[100px] flex justify-center items-center  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"><p> <FontAwesomeIcon icon={faFile} className="mr-2 text-yellow-500" />  Files</p></div>
                                <div onClick={() => photosInput.current.click()} className="text-[16px] w-[100px] flex justify-center  items-center ml-1  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"><p> <FontAwesomeIcon icon={faImage} className="mr-2 text-red-500" />  Photos </p></div>
                                <div onClick={() => videosInput.current.click()} className="text-[16px] w-[100px] flex justify-center  items-center ml-2  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"><p> <FontAwesomeIcon icon={faVideo} className="mr-2 text-green-500" />  Videos </p></div>
                                <div onClick={() => audioInput.current.click()} className="text-[16px] w-[100px] flex justify-center  items-center ml-2 py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200"><p> <FontAwesomeIcon icon={faHeadphones} className="mr-2 text-blue-500" />  Audio </p></div>
                                {/* <p onClick={() => } className="text-[16px] w-[120px] flex items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-900 text-white font-bold transition-duration-200"> <FontAwesomeIcon icon={faLocationDot} className="mr-2" />  Location</p> */}
                            </div>}
                            <div>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx" ref={fileInput} onChange={(e) => handleMediaInputChange(e, "file")} />
                                <input type="file" className="hidden" accept="image/*" ref={photosInput} onChange={(e) => handleMediaInputChange(e, "image")} />
                                <input type="file" className="hidden" accept="video/*" ref={videosInput} onChange={(e) => handleMediaInputChange(e, "video")} />
                                <input type="file" className="hidden" accept="audio/*" ref={audioInput} onChange={(e) => handleMediaInputChange(e, "audio")} />

                            </div>
                            <FontAwesomeIcon icon={faSquarePlus} ref={addMediaRef} onClick={() => setUploadFiles(!uploadFiles)} className="w-[35px] h-[35px] ml-0 p-2 hover:text-zinc-400 text-white font-bold transition duration-100  cursor-pointer" />
                            {/* <img src={loggedInUser.profilePic} className="w-[50px] h-[50px] mr-2 rounded-full" alt="" /> */}
                            <input type="text" ref={messageInputRef} onChange={inputChanging} placeholder="Type a message" className={`w-full placeholder-zinc-200 text-white h-full bg-slate-700 rounded-lg ml-2 pl-5 p-2 outline-none`} />
                            <FontAwesomeIcon icon={faPaperPlane} onClick={() => sendMessage(activeFriend)} className={`w-[22px] h-[22px] ml-2 p-2 hover:text-zinc-400 ${messageInputActive ? "text-zinc-100" : "text-zinc-400"} font-bold transition duration-100  cursor-pointer`} />
                            {/* <FontAwesomeIcon icon={faMicrophone} onClick={sendMessage} className="w-[22px] h-[22px] ml-2 p-2 hover:text-zinc-900 text-zinc-700 font-bold transition duration-100  cursor-pointer" /> */}
                        </div>
                    </div>

                </div>}

                {windowWidth <= 900 && activeTabUnder900 === "Messages" && <div className={`relative ${windowWidth >= 900 && "h-[91.5vh]"} ${(windowWidth >= 768 && windowWidth < 900) && "h-[91.5vh]"} ${(windowWidth < 768 && windowWidth > 450) && "h-[82.5vh]"} ${(windowWidth <= 450) && "h-[84vh]"}  w-full  `}>

                    <div className={`${windowWidth > 450 ? "h-[70px] pl-0 pr-4" : "h-[50px] px-2"} relative cursor-pointer  bg-gradient-to-r from-slate-900 to-slate-800    py-2 transition duration-200 `}>
                        <div className="flex justify-between w-full h-full items-center">
                            <div className="flex items-center">
                                {windowWidth <= 900 && <button onClick={() => { setActiveTabUnder900("Friends"); setMessages([]); setActiveFriend(null) }} className="w-[34px] h-[50px] flex items-center justify-center rounded-full cursor-pointer transition duration-200 mr-2"> <FontAwesomeIcon icon={faArrowLeft} className=" text-white" /></button>}
                                {activeFriend && <Link to={`/userProfile/${activeFriend?._id}`}>
                                    <img src={activeFriend?.profilePic || loggedInUser.profilePic} className={` ${windowWidth > 450 ? "w-[45px] h-[45px]" : "w-[30px] h-[30px]"} rounded-full`} alt="" />
                                </Link>}
                                {activeFriend && <Link to={`/userProfile/${activeFriend?._id}`}>
                                    <div className="ml-3">
                                        {windowWidth <= 450 && <p className="text-white text-[17px] font-bold">{activeFriend?.name.length > 19 ? activeFriend?.name.slice(0, 18) + "..." : activeFriend?.name || ""}</p>}
                                        {windowWidth > 450 && <p className="text-white text-[17px] font-bold">{activeFriend?.name || ""}</p>}
                                        <div>{isTyping.find(e => e.senderId === activeFriend?._id && e.recieverId === loggedInUser._id) ? <p className="text-[14px] font-semibold text-green-400">Typing...</p> : onlineUsers.find(a => a.userId === activeFriend?._id)?.status === true && <p className="text-[14px] font-semibold text-zinc-300">Online</p>}</div>
                                        {/* <div>{onlineUsers.find(a => a.userId === activeFriend?._id)?.status === true && <p className="text-[14px] text-zinc-300">Online</p>}</div> */}
                                    </div>
                                </Link>}
                            </div>
                            {activeFriend && <FontAwesomeIcon onClick={() => setOpenProfileModal(!openProfileModal)} ref={profileEditIconRef} icon={faEllipsisVertical} className="w-[17px] h-[17px]  p-2 hover:bg-slate-900 text-zinc-300 font-bold transition duration-300 rounded-full cursor-pointer" />}
                        </div>
                        {openProfileModal && <div ref={profileEditModalRef} className={`absolute ${windowWidth > 450 ? "top-6 right-2" : "top-2 right-0"}  z-50 px-2 py-2 mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-md shadow-md w-[200px]`}>
                            <ul>
                                <li><p onClick={() => blockUser(activeFriend?._id, activeFriend?.name)} className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Block</p></li>
                                {/* <li><p className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Report</p></li> */}
                                <li><p onClick={() => deleteAllChat(activeFriend?._id)} className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Delete All Chat</p></li>
                                <li><p onClick={() => removeFriend(activeFriend?._id, activeFriend?.name)} className="px-4 py-3 text-zinc-300 text-[15px] cursor-pointer rounded-md hover:bg-slate-700">Remove From Friends</p></li>
                            </ul>
                        </div>}
                    </div>

                    {/* <div className="relative h-[calc(91vh-140px)]"> */}
                    {/* <div className="absolute w-full h-full bg-black bg-opacity-50"></div> */}
                    <div ref={chatBoxRef} className={` ${(windowWidth < 768 && windowWidth > 450) && "h-[calc(83vh-140px)] px-3"} ${windowWidth >= 768 && "h-[calc(91.5vh-140px)] px-5"} ${windowWidth <= 450 && "h-[calc(84vh-110px)] px-2"}  pb-6 overflow-y-scroll scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-zinc-400 w-full bg-cover pt-[12px] `} style={{ backgroundImage: `url("https://res.cloudinary.com/dnku8pwjp/image/upload/v1733975369/Desktop-2_xvmmfa.png")` }}>
                        {/* {console.log("message: ", messages)} */}
                        {activeFriendMessagesLoading && <div className="h-full w-full flex items-center justify-center"> <p className='spinOnButton h-[30px] w-[30px]'></p> </div>}
                        {messages && !activeFriendMessagesLoading && messages.length > 0 && messages.map((e, i) => {
                            return (<div key={i} className={`flex mt-[12px] items-center ${e.senderId === loggedInUser._id ? "justify-end" : "justify-start"}`}>

                                {e.content?.length > 0 &&
                                    <div onClick={() => setEditMessage(e)} className={`relative cursor-pointer hover:bg-opacity-60 transition duration-100 text-[16px] max-w-[400px] flex items-top  ${e.senderId === loggedInUser._id ? "bg-[#6A0DAD]" : "bg-slate-700 bg-opacity-70"}  text-white rounded-lg pl-2 pr-11 pt-[2px] pb-0 `}>
                                        <p className={`word-wrap ${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} pb-3 break-words`}>{e.content} </p>
                                        <div className="absolute bottom-1 right-1"><p className="text-[11px] text-right ">{messageTimeLogic(e)}</p> </div>
                                    </div>}

                                {(e.imageUrl.length > 0 || e.videoUrl.length > 0 || e.audioUrl.length > 0 || e.documentFiles.length > 0) &&
                                    <div onClick={() => setEditMessage(e)} className={`relative cursor-pointer hover:bg-opacity-60 transition duration-100 text-[16px] ${windowWidth > 600 && "max-w-[400px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[320px]"} ${windowWidth < 450 && "max-w-[240px]"} flex items-top  ${e.senderId === loggedInUser._id ? "bg-[#6A0DAD] bg-opacity-80" : "bg-slate-700 bg-opacity-70"}  text-white rounded-lg pl-1 pr-1 pt-[1px] pb-0 `}>

                                        {/* // <p className="word-wrap max-w-[430px] pb-3 break-words">{e.content} </p> */}

                                        {e.audioUrl.length > 0 && <audio controls src={e.audioUrl[0]} className={`${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} rounded-sm `} />}
                                        {/* {e.audioUrl.length > 0 && <ReactPlayer
                                            url={e.audioUrl[0]}
                                            controls
                                            width="100%"
                                            height="50px"
                                            style={{ borderRadius: '10px', overflow: 'hidden' }}
                                        />} */}
                                        {e.videoUrl.length > 0 && <video controls src={e.videoUrl[0]} className={`${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} rounded-lg pb-1 pt-1`} />}
                                        {e.imageUrl.length > 0 && <img src={e.imageUrl[0]} onClick={() => { setShowImage(e.imageUrl[0]) }} className={`${windowWidth > 600 && "max-w-[380px]"} ${(windowWidth < 600 && windowWidth > 450) && "max-w-[300px]"} ${windowWidth < 450 && "max-w-[220px]"} rounded-lg pt-1 pb-1`} />}
                                        {e.documentFiles.length > 0 && <a href={e.documentFiles[0]} className="text-[12px] pt-1 pl-1 pr-6 pb-4 text-white" target="_blank" rel="noopener noreferrer">View File <FontAwesomeIcon icon={faFile} className="ml-2 mr-2 text-lg text-yellow-500" /> </a>}

                                        <div className={`absolute ${e.audioUrl.length > 0 ? "right-6 bottom-0" : "right-2 bottom-1"} `}><p className={`text-[11px] text-right ${e.audioUrl.length > 0 && "text-black"}`}>{messageTimeLogic(e)}</p> </div>
                                    </div>}
                                {/* <p>{e.senderId === loggedInUser._id && e.status === "sent" && <FontAwesomeIcon icon={faCheck} className="ml-2 text-[12px]"/>}</p>  */}
                            </div>
                            )
                        })}
                        <div ref={messageBoxRef}></div>

                    </div>
                    {/* </div> */}


                    <div className={`${windowWidth > 450 ? "h-[70px]" : "h-[60px]"}  absolute bottom-0 w-full cursor-pointer bg-gradient-to-r from-slate-800 to-slate-900 pl-2 pr-5 py-2 transition duration-200 `}>
                        <div className="relative flex items-center">
                            {uploadFiles && <div ref={uploadContainers} className={`absolute bottom-[70px] rounded-xl left-0 ${windowWidth > 550 ? "flex" : "flex flex-col justify-center"}  bg-gradient-to-b from-slate-800 to-slate-900  items-center`}>
                                <div onClick={() => fileInput.current.click()} className={`text-[16px] w-[120px] flex ${windowWidth > 550 ? "justify-center" : "pl-3 pr-3"}  items-center  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}><p> <FontAwesomeIcon icon={faFile} className="mr-2 text-yellow-500" />  Files</p></div>
                                <div onClick={() => photosInput.current.click()} className={`text-[16px] w-[120px] flex ${windowWidth > 550 ? "justify-center" : "pl-3 pr-3"}   items-center ml-0  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}><p> <FontAwesomeIcon icon={faImage} className="mr-2 text-red-500" />  Photos </p></div>
                                <div onClick={() => videosInput.current.click()} className={`text-[16px] w-[120px] flex ${windowWidth > 550 ? "justify-center" : "pl-3 pr-3"}   items-center ml-0  py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}><p> <FontAwesomeIcon icon={faVideo} className="mr-2 text-green-500" />  Videos </p></div>
                                <div onClick={() => audioInput.current.click()} className={`text-[16px] w-[120px] flex ${windowWidth > 550 ? "justify-center" : "pl-3 pr-3"}   items-center ml-0 py-3 rounded-md cursor-pointer hover:bg-slate-700 text-white font-bold transition duration-200`}><p> <FontAwesomeIcon icon={faHeadphones} className="mr-2 text-blue-500" />  Audio </p></div>
                                {/* <p onClick={() => } className="text-[16px] w-[120px] flex items-center px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-900 text-white font-bold transition-duration-200"> <FontAwesomeIcon icon={faLocationDot} className="mr-2" />  Location</p> */}
                            </div>}
                            <div>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx" ref={fileInput} onChange={(e) => handleMediaInputChange(e, "file")} />
                                <input type="file" className="hidden" accept="image/*" ref={photosInput} onChange={(e) => handleMediaInputChange(e, "image")} />
                                <input type="file" className="hidden" accept="video/*" ref={videosInput} onChange={(e) => handleMediaInputChange(e, "video")} />
                                <input type="file" className="hidden" accept="audio/*" ref={audioInput} onChange={(e) => handleMediaInputChange(e, "audio")} />

                            </div>
                            <FontAwesomeIcon icon={faSquarePlus} ref={addMediaRef} onClick={() => setUploadFiles(!uploadFiles)} className="w-[35px] h-[35px] ml-0 p-2 hover:text-zinc-400 text-white font-bold transition duration-100  cursor-pointer" />
                            {/* <img src={loggedInUser.profilePic} className="w-[50px] h-[50px] mr-2 rounded-full" alt="" /> */}
                            <input type="text" ref={messageInputRef} onChange={inputChanging} placeholder="Type a message" className="w-full placeholder-zinc-200 text-white h-full bg-slate-700 rounded-lg ml-2 pl-5 p-2 outline-none" />
                            <FontAwesomeIcon icon={faPaperPlane} onClick={() => sendMessage(activeFriend)} className="w-[22px] h-[22px] ml-2 p-2 hover:text-zinc-400 text-zinc-300 font-bold transition duration-100  cursor-pointer" />
                            {/* <FontAwesomeIcon icon={faMicrophone} onClick={sendMessage} className="w-[22px] h-[22px] ml-2 p-2 hover:text-zinc-900 text-zinc-700 font-bold transition duration-100  cursor-pointer" /> */}
                        </div>
                    </div>

                </div>}

            </div>
        </div >
    )
}
export default MessagePage;