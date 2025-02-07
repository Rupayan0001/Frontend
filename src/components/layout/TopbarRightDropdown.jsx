import React, { useState, useRef, forwardRef } from "react";
import globalState from "../../lib/globalState";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUserSlash, faRightFromBracket, faUser, faGear, faBan, faSquarePlus, faUserGroup, faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../lib/axios";
import { motion } from "framer-motion";

const TopbarRightDropdown = forwardRef(({ pageName, width }, ref) => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const user = globalState((state) => state.user);
  const setOpenBlockList = globalState((state) => state.setOpenBlockList);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const setOpenHideUserList = globalState((state) => state.setOpenHideUserList);
  const setSavePost = globalState((state) => state.setSavePost);
  const setSelected = globalState((state) => state.setSelected);
  const setLogOut = globalState((state) => state.setLogOut);
  const setShowFriends = globalState((state) => state.setShowFriends);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setNotify = globalState((state) => state.setNotify);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const navigate = useNavigate();
  const notifyTimer = useRef();
  function goToProfile() {
    navigate(`/userProfile/${loggedInUser._id}`);
    setOpenProfileDropdown(false);
  }

  function showBlockedUsers() {
    setOpenBlockList(true);
    setOpenProfileDropdown(false);
  }
  function showHideUsers() {
    setOpenHideUserList(true);
    setOpenProfileDropdown(false);
  }

  function showSavedPosts() {
    if (pageName !== "Profile") {
      navigate(`/userprofile/${loggedInUser._id}`);
    }
    setSelected("");
    setSavePost(true);
    setOpenProfileDropdown(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 0, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 0, x: 0 }}
      transition={{ duration: 0.2 }}
      ref={ref}
      className={`absolute inter top-[-4px] ${pageName !== "Message" ? "shadowForTopDropDown" : "shadowForTopDropDownForMessagePage"} ${
        width > 400 ? "right-[0px]" : "right-[0px]"
      }   z-20  p-2 bg-white rounded-md shadow-lg w-max`}
      style={{ transition: `all 0.2 ease-in` }}
    >
      <div
        onClick={goToProfile}
        className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
          width > 400 ? " w-[300px]" : " w-[270px]"
        } h-[40px] transition duration-200 rounded-md cursor-pointer`}
      >
        <img src={loggedInUser.profilePic} className="w-[33px] h-[33px] ml-[-5px] rounded-full mr-3" alt="" />{" "}
        {loggedInUser.name.length > 22 ? loggedInUser.name.slice(0, 22) + "..." : loggedInUser.name}
      </div>
      {/* {pageName === "Profile" && */}
      {/* {width < 1024 && <div onClick={showSavedPosts} className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${width > 400 ? " w-[300px]" : " w-[270px]"} h-[40px] transition duration-200 rounded-md cursor-pointer`}><FontAwesomeIcon icon={faCirclePlay} className='text-[20px] text-[#DC143C] ml-[0px] rounded-full mr-4' />Reels</div>} */}
      {(pageName === "Profile" || pageName === "Home") && (
        <>
          {user._id === loggedInUser._id && width < 1024 && (
            <div
              onClick={() => {
                setOpenPost("Image");
                setOpenProfileDropdown(false);
              }}
              className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
                width > 400 ? " w-[300px]" : " w-[270px]"
              } h-[40px] transition duration-200 rounded-md cursor-pointer`}
            >
              <FontAwesomeIcon icon={faSquarePlus} className="text-[20px] text-[#FF007F] ml-[0px] rounded-full mr-4" />
              Create Post
            </div>
          )}
          {width < 1024 && (
            <div
              onClick={() => {
                setShowFriends("Friends");
                setOpenProfileDropdown(false);
              }}
              className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
                width > 400 ? " w-[300px]" : " w-[270px]"
              } h-[40px] transition duration-200 rounded-md cursor-pointer`}
            >
              <FontAwesomeIcon icon={faUserGroup} className="text-[20px] text-[#002395] ml-[-1px] rounded-full mr-3" />
              Friend List
            </div>
          )}
          {user._id === loggedInUser._id && pageName === "Profile" && (
            <div
              onClick={showSavedPosts}
              className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
                width > 400 ? " w-[300px]" : " w-[270px]"
              } h-[40px] transition duration-200 rounded-md cursor-pointer`}
            >
              <FontAwesomeIcon icon={faBookmark} className="text-[20px] text-slate-600 ml-[2px] rounded-full mr-4" />
              Saved Posts
            </div>
          )}
        </>
      )}
      <div
        onClick={showBlockedUsers}
        className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
          width > 400 ? " w-[300px]" : " w-[270px]"
        } h-[40px] transition duration-200 rounded-md cursor-pointer`}
      >
        <FontAwesomeIcon icon={faBan} className="text-[20px] text-slate-700  ml-[-1px] rounded-full mr-[14px]" /> Blocked users{" "}
      </div>
      {(pageName === "Profile" || pageName === "Home") && (
        <div
          onClick={showHideUsers}
          className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
            width > 400 ? " w-[300px]" : " w-[270px]"
          } h-[40px] transition duration-200 rounded-md cursor-pointer`}
        >
          <FontAwesomeIcon icon={faUserSlash} className="text-[20px] text-slate-900  ml-[-3px] rounded-full mr-3" /> Hide users{" "}
        </div>
      )}
      {/* <div className={`text-black hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${width > 400 ? " w-[300px]" : " w-[270px]"} h-[40px] transition duration-200 rounded-md cursor-pointer`}><FontAwesomeIcon className='mr-4 text-xl text-slate-900 ' icon={faGear} />  Settings</div> */}
      <div
        onClick={() => {
          setClickedLogOut(true);
          setOpenProfileDropdown(false);
        }}
        className={`text-red-700 hover:bg-zinc-200 px-2 z-90 flex items-center  mt-1 ${
          width > 400 ? " w-[300px]" : " w-[270px]"
        } h-[40px] transition duration-200 rounded-md cursor-pointer`}
      >
        {" "}
        <FontAwesomeIcon className={` ${pageName === "Message" ? "mr-[14px]" : "mr-4"} ml-[1px] text-xl`} icon={faRightFromBracket} /> Log Out
      </div>
    </motion.div>
  );
});

export default TopbarRightDropdown;
