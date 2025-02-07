import React, { useState, useRef, useEffect } from "react";
import "./../../styles/Topbar.css";
import logo from "./../../assets/U.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import globalState from "../../lib/globalState.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHouse,
  faMessage,
  faStore,
  faGamepad,
  faCircleChevronDown,
  faVideo,
  faBars,
  faBell,
  faGear,
  faRightFromBracket,
  faChessKing,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import defaultProfilePic from "./../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import { axiosInstance } from "../../lib/axios.js";
const Topbar = ({ page = "Home" }) => {
  const selected = globalState((state) => state.selected);
  const setSelected = globalState((state) => state.setSelected);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [isHovered5, setIsHovered5] = useState(false);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const setTopBarRightProfilePicRefState = globalState((state) => state.setTopBarRightProfilePicRefState);
  const totalUnreadMessages = globalState((state) => state.totalUnreadMessages);
  const fetchTotalUnreadMessages = globalState((state) => state.fetchTotalUnreadMessages);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const topBarsearch = globalState((state) => state.topBarsearch);
  const setTopBarsearch = globalState((state) => state.setTopBarsearch);
  const [windowSm, setWindowSm] = useState(window.innerWidth <= 767);
  const [below500, setBelow500] = useState(window.innerWidth < 500);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const setSelectedTab = globalState((state) => state.setSelected);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const notifications = globalState((state) => state.notifications);
  const setNotifications = globalState((state) => state.setNotifications);
  const setTopBarNotificationIconRef = globalState((state) => state.setTopBarNotificationIconRef);
  const topBarRightProfilePicRef = useRef();
  const topBarsearchRef = useRef();
  const notifyIconRef = useRef();

  useEffect(() => {
    fetchTotalUnreadMessages();
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 768) {
        // alert("true")
        setWindowSm(true);
      }
      if (width > 768) {
        setWindowSm(false);
      }
      if (width < 500) {
        setBelow500(true);
      }
      if (width > 500) {
        setBelow500(false);
      }
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    setTopBarsearch(topBarsearchRef);
    getNotifications();
  }, []);
  useEffect(() => {
    if (topBarRightProfilePicRef.current) {
      setTopBarRightProfilePicRefState(topBarRightProfilePicRef.current);
    }
  }, [setTopBarRightProfilePicRefState]);
  useEffect(() => {
    if (notifyIconRef.current) {
      setTopBarNotificationIconRef(notifyIconRef.current);
    }
  }, [setTopBarNotificationIconRef]);

  async function getNotifications() {
    try {
      const response = await axiosInstance.get(`/notification/getNotifications`);
      if (response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      setNotifications([]);
    }
  }

  function handleClickOnHome() {
    setSelected("Home");
    setSelectedTab("Posts");
  }

  return (
    <div>
      <div className={`topbar messageText ${windowWidth > 450 ? "h-[65px]" : "h-[50px]"} `}>
        <div className="topBox ">
          <div className=" flex  items-center">
            <Link to="/home">
              <div className="logo">
                <h1
                  className={`logoHead ${windowWidth <= 450 && "text-2xl"} ${
                    windowWidth > 450 && "text-3xl"
                  } font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600`}
                >
                  Renokon
                </h1>

                {/* {windowWidth > 768 && (
                  <div className="h-[40px] w-[40px] bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-full flex justify-center items-center">
                    <h1
                      className={`logoHead text-2xl
                     font-bold text-center text-transparent text-white`}
                    >
                      R
                    </h1>
                  </div>
                )} */}
              </div>
            </Link>

            {page === "Messages" && windowWidth >= 1280 && (
              <p className={`search w-[13vw] ${windowWidth >= 768 && windowWidth < 1024 && ""} opacity-0 relative `}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon absolute top-3 left-3" />
              </p>
            )}
            {windowWidth > 1279 && page !== "Messages" && (
              <div onClick={() => setOpenSearch(true)} className="relative ml-2">
                <input
                  className={`search hover:bg-gray-50 transition duration-200 ${windowWidth >= 1024 && "w-[14vw] block"} pl-[30px] block sm:block ${
                    windowWidth >= 768 && windowWidth < 1024 && "hidden"
                  } relative cursor-pointer`}
                  readOnly
                  placeholder="Search by name"
                  ref={topBarsearchRef}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon absolute top-3 left-[16px]" />
              </div>
            )}
            {/* {page !== "Messages" && <p className=" md:block lg:hidden  relative cursor-pointer" ref={topBarsearchRef} onClick={() => setOpenSearch(true)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon absolute top-[-8px] left-[15px]' />
                        </p>} */}
            {windowWidth <= 1279 && page !== "Messages" && (
              <p className="block relative cursor-pointer" ref={topBarsearchRef} onClick={() => setOpenSearch(true)}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchIcon absolute top-[-8px] left-[15px]" />
              </p>
            )}
          </div>
          {!windowSm && (
            // ${windowWidth > 1024 && windowWidth <= 1200 && (page === "Home" || page === "Profile") ? "ml-[0px]" : ""}
            <div className={`middle `}>
              <div className={`middlebox ml-[0px] mr-[20px] ${windowWidth >= 768 && windowWidth < 1024 && "mr-0 w-[42vw]"} ${windowWidth >= 1024 && "w-[34vw]"}`}>
                <Link to="/game">
                  <div
                    className={`text-[25px] px-[25px] py-[8px] ${selected === "Game" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={() => setSelected("Game")}
                    onMouseEnter={() => setIsHovered4(true)}
                    onMouseLeave={() => setIsHovered4(false)}
                  >
                    <FontAwesomeIcon icon={faHouse} />
                    {/* <h3 className={isHovered4 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Games</h3> */}
                  </div>
                </Link>
                <Link to="/home">
                  <div
                    className={` px-[25px] text-[25px] py-[8px] ${selected === "Home" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={handleClickOnHome}
                    onMouseEnter={() => setIsHovered1(true)}
                    onMouseLeave={() => setIsHovered1(false)}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    {/* <h3 >Home</h3> */}
                    {/* className={isHovered1 ? "opacity-100 transition-opacity duration-500  " : "transition-opacity duration-300 opacity-0"} */}
                  </div>
                </Link>
                <Link to="/message">
                  <div
                    className={`relative text-[25px] px-[25px] py-[8px] ${selected === "Messages" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={() => setSelected("Messages")}
                    onMouseEnter={() => setIsHovered2(true)}
                    onMouseLeave={() => setIsHovered2(false)}
                  >
                    <FontAwesomeIcon icon={faMessage} />
                    {/* <h3 className={isHovered2 ? "block" : "hidden"}>Messages</h3> */}
                    {totalUnreadMessages > 0 && (
                      <p className="text-[12px] font-bold absolute right-[-5px] top-[-7px] bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[24px] h-[24px] pt-[1px] flex items-center justify-center rounded-full">
                        {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                      </p>
                    )}
                  </div>
                </Link>
                <Link to="/shop">
                  <div
                    className={` text-[25px] px-[25px] py-[8px] ${selected === "Shop" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600"}`}
                    onClick={() => setSelected("Shop")}
                    onMouseEnter={() => setIsHovered3(true)}
                    onMouseLeave={() => setIsHovered3(false)}
                  >
                    <FontAwesomeIcon icon={faStore} />
                    {/* <h3 className={isHovered3 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Shop</h3> */}
                  </div>
                </Link>
                {/* <div><FontAwesomeIcon icon={faVideo} />
                            <h3>Video Call</h3>
                        </div> */}
                {/* sdvsdvsvsd */}
              </div>
            </div>
          )}
          <div className="right ">
            {/* <p className={`dropdown ${(windowWidth > 450  && windowWidth < 1024) && "h-[41px] w-[41px] text-[25px]"} ${(windowWidth <= 450) && "h-[35px] w-[35px] text-[23px]"} ${windowWidth >= 1024 && "invisible"} ml-4 hover:bg-zinc-600 rounded-full cursor-pointer`}><FontAwesomeIcon icon={faCircleChevronDown} /></p> */}
            <div
              ref={notifyIconRef}
              className={`notification hover:opacity-80 bg-zinc-100 relative ${windowWidth > 450 ? "h-[40px] w-[40px] text-[18px] " : "h-[38px] w-[38px] text-[16px] "} ml-4`}
              onMouseEnter={() => setIsHovered5(true)}
              onMouseLeave={() => setIsHovered5(false)}
              onClick={() => setNotifyClicked(!notifyClicked)}
            >
              <FontAwesomeIcon className="text-blue-700 " icon={faBell} />
              {notifications && notifications.length > 0 && (
                <p
                  className={`text-[12px] font-bold absolute ${
                    windowWidth > 450 ? "right-[-5px] top-[-7px]" : "right-[-11px] top-[-3px]"
                  } bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[24px] h-[24px] pt-[1px] flex items-center justify-center rounded-full`}
                >
                  {notifications.length > 99 ? "99+" : notifications.length}
                </p>
              )}
              {/* <h3 className={` ${isHovered5 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"} `} >Notification</h3><h3 className={isHovered5 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Notifications</h3> */}
            </div>
            <div ref={topBarRightProfilePicRef} className="userLogo ml-4">
              {/* <Link to="/myProfile"><img src={user.profilePic} className='topbarRightProfilePic transition duration-400 w-[40px] h-[40px] cursor-pointer rounded-full' alt="" /></Link> */}
              <img
                src={loggedInUser?.profilePic}
                onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
                className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"} object-cover  mb-1 cursor-pointer rounded-full`}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      {windowSm && (
        <div>
          <div className={`middle pb-2 ${windowWidth >= 768 && windowWidth < 1024 && "hidden"} bg-white`}>
            <div className={`middlebox ${windowWidth > 600 ? "w-[65vw]" : "w-[100vw]"} `}>
              <Link to="/game">
                <div
                  className={`${windowWidth > 450 ? "text-[25px]" : "text-[20px]"} px-[25px] py-[8px] ${
                    selected === "Game" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"
                  }`}
                  onClick={() => setSelected("Game")}
                  onMouseEnter={() => setIsHovered4(true)}
                  onMouseLeave={() => setIsHovered4(false)}
                >
                  <FontAwesomeIcon icon={faHouse} />
                  {/* <h3 className={isHovered4 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Games</h3> */}
                </div>
              </Link>
              <Link to="/home">
                <div
                  className={` ${windowWidth > 450 ? "text-[25px]" : "text-[20px]"} ml-2 px-[25px] py-[8px] ${
                    selected === "Home" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600 border-b-2 border-transparent"
                  }`}
                  onClick={handleClickOnHome}
                  onMouseEnter={() => setIsHovered1(true)}
                  onMouseLeave={() => setIsHovered1(false)}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  {/* <h3 >Home</h3> */}
                  {/* className={isHovered1 ? "opacity-100 transition-opacity duration-500  " : "transition-opacity duration-300 opacity-0"} */}
                </div>
              </Link>
              <Link to="/message">
                <div
                  className={`relative ${windowWidth > 450 ? "text-[25px]" : "text-[20px]"} px-[25px] py-[8px] ${
                    selected === "Messages" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"
                  }`}
                  onClick={() => setSelected("Messages")}
                  onMouseEnter={() => setIsHovered2(true)}
                  onMouseLeave={() => setIsHovered2(false)}
                >
                  <FontAwesomeIcon icon={faMessage} />
                  {/* <h3 className={isHovered2 ? "block" : "hidden"}>Messages</h3> */}
                  {totalUnreadMessages > 0 && (
                    <p className="text-[12px] font-bold absolute right-[-5px] top-[-7px] bg-gradient-to-r from-blue-500 to-blue-600 text-white w-[24px] h-[24px] pt-[1px] flex items-center justify-center rounded-full">
                      {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                    </p>
                  )}
                </div>
              </Link>
              <Link to="/shop">
                <div
                  className={`${windowWidth > 450 ? "text-[25px]" : "text-[20px]"}  px-[25px] py-[8px] ${
                    selected === "Shop" ? "text-blue-700 border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"
                  }`}
                  onClick={() => setSelected("Shop")}
                  onMouseEnter={() => setIsHovered3(true)}
                  onMouseLeave={() => setIsHovered3(false)}
                >
                  <FontAwesomeIcon icon={faStore} />
                  {/* <h3 className={isHovered3 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Shop</h3> */}
                </div>
              </Link>
              {/* <div><FontAwesomeIcon icon={faVideo} />
                            <h3>Video Call</h3>
                        </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
{
  /* <i class="fa-solid faCircleChevronDown"></i> */
}

export default Topbar;
