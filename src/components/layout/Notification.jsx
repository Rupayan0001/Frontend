import React, { useState, useEffect, useRef } from "react";
import globalState from "../../lib/globalState";
import { lastMessageTimeLogic } from "../../lib/MessageTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/images/215958.jpg";

const Notification = ({ width }) => {
  const notifications = globalState((state) => state.notifications);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const topBarNotificationIconRef = globalState((state) => state.topBarNotificationIconRef);
  const setNewGroupAsActive = globalState((state) => state.setNewGroupAsActive);
  const removeNotification = globalState((state) => state.removeNotification);
  const setNotify = globalState((state) => state.setNotify);
  const notificationRef = useRef();
  const notifyTimer = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    function handleClick(e) {
      if (notificationRef.current && !notificationRef.current.contains(e.target) && !topBarNotificationIconRef.contains(e.target)) {
        setNotifyClicked(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [topBarNotificationIconRef]);

  async function markAsRead() {
    try {
      const response = await axiosInstance.delete(`/notification/deleteNotification`);
      if (response.data.success) {
        globalState.setState({ notifications: [] });
      }
    } catch (error) {
      globalState.setState({ notifications: [] });
    }
  }

  async function handleNotificationClicks(notification) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
    }
    if (notification.type.toLowerCase().includes("group") && notification.type !== "groupDeleted") {
      navigate(`/message`);
      setNewGroupAsActive(notification.sender);
      setNotifyClicked(null);
    } else if (notification.type === "groupDeleted") {
      setNotifyClicked(null);
      setNotify("The Group is Deleted");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    } else {
      navigate(`/userProfile/${notification.sender}`);
      setNotifyClicked(null);
    }
    try {
      const response = await axiosInstance.delete(`/notification/deleteSpecificNotification/${notification._id}`);
    } catch (error) {}
    removeNotification(notification);
  }
  // bg-gradient-to-r from-slate-900 via-blue-900 to-gray-900
  return (
    <dialog className={`fixed inset-0 h-[100%] w-[100%] z-20 flex justify-center items-center ${width > 550 ? "bg-black bg-opacity-80" : "bg-black bg-opacity-0"} `}>
      <motion.div
        ref={notificationRef}
        initial={{ opacity: 0, scale: 1, x: 550 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 1, scale: 1, x: 550 }}
        transition={{ duration: 0.5 }}
        className={`h-[100vh] pb-[80px] ${width > 550 ? "w-[420px] absolute right-0 top-0 rounded-md" : "w-full h-[100vh] absolute top-0"} z-50   p-2 scrollbar-thin ${
          notifications?.length > 0 && "overflow-y-auto scrollbar-thumb-zinc-400 scrollbar-track-gray-200"
        } `}
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
      >
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => setNotifyClicked(null)}
          className={`absolute w-[25px] h-[25px] p-2 hover:opacity-60 text-slate-800 ${width > 550 ? "" : ""} top-2 left-1 transition duration-200 rounded-full cursor-pointer`}
        />
        <h2 className="text-2xl text-center  border-b-2 border-zinc-400 pb-2 mt-1 mb-8 text-slate-800">Notifications</h2>
        {notifications && notifications.length > 0 && (
          <button
            onClick={markAsRead}
            className={`absolute top-[11px] right-2 text-xs text-white bg-gradient-to-r from-slate-700 to-slate-800 w-[80px] h-[30px] transition duration-200 rounded-md hover:opacity-80`}
          >
            {width > 400 ? "Mark read" : "Mark read"}
          </button>
        )}
        <ul className="space-y-2 pb-[80px] relative">
          {
            notifications &&
              notifications.length > 0 &&
              notifications.map((notification, index) => (
                <li
                  key={index}
                  onClick={() => handleNotificationClicks(notification)}
                  className="p-3 mx-2 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900  rounded-lg cursor-pointer hover:opacity-95 transition duration-150"
                >
                  {/* <Link to={`/userProfile/${notification.sender}`}> */}
                  <div className="flex items-center">
                    <img src={notification.senderProfilePic} className="w-[40px] h-[40px] object-cover rounded-full" alt="" />
                    <div>
                      <p className="text-md ml-2 font-semibold hover:underline transition duration-300 break-words text-white">{notification.senderName}</p>
                      <p className="text-sm mx-2 text-zinc-300">{lastMessageTimeLogic(notification.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-md mt-2 ml-2 break-words word-wrap text-white">
                    {notification.content.length > 80 ? notification.content.slice(0, 80) + "..." : notification.content}{" "}
                    {/* {notification.type === "like" ? (
                  <FontAwesomeIcon icon={faHeart} className="ml-1 text-red-600" />
                ) : notification.type === "comment" ? (
                  <FontAwesomeIcon icon={faComment} className="ml-1 text-zinc-600" />
                ) : (
                  ""
                )} */}
                  </p>
                  {notification.type === "comment" && notification.extraContent.length > 0 && (
                    <p className="text-md mt-2 ml-2 break-words word-wrap text-white">
                      Comment: {notification.extraContent.length < 100 ? notification.extraContent : notification.extraContent.slice(0, 100) + "..."}
                    </p>
                  )}
                  {/* </Link> */}
                </li>
              ))
            // : (
            //   <p className="text-white  absolute top-1/2 left-1/2 transform -translate-x-1/2  text-md">No notifications available</p>
            // )
          }
        </ul>
      </motion.div>
    </dialog>
  );
};

export default Notification;
