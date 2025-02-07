import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Topbar from "../components/layout/Topbar";
// import { useGlobalContext } from "../context";
import TopbarRightDropdown from "../components/layout/TopbarRightDropdown";
import Notification from "../components/layout/Notification";
import Notify from "../components/layout/Notify";
import Leftbar from "../components/layout/LeftBar";
import globalState from "../lib/globalState";
import { axiosInstance } from "../lib/axios";

const ShopPage = () => {
  const notify = globalState((state) => state.notify);
  const notifyClicked = globalState((state) => state.notifyClicked);
  const openProfileDropdown = globalState((state) => state.openProfileDropdown);
  const profileDropdownRef = globalState((state) => state.profileDropdownRef);
  const openSearch = globalState((state) => state.openSearch);
  const leftBarSearchRef = globalState((state) => state.leftBarSearchRef);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const postScroll = globalState((state) => state.postScroll);
  const setNotify = globalState((state) => state.setNotify);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const setUser = globalState((state) => state.setUser);
  const [loading, setLoading] = useState(true);
  const notifyTimer = useRef();
  useEffect(() => {
    response();
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
    };
  }, []);
  const response = async () => {
    try {
      const result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
      setUser(result.data.user);
      setLoading(false);
    } catch (err) {
      // navigate("/login");
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="spinOnButton h-[30px] w-[30px]"></p>
      </div>
    );
  }
  return (
    <div className={`parent flex flex-col w-full ${windowWidth > 550 ? "bg-zinc-200 bg-opacity-60" : "bg-zinc-300"} `}>
      {notify && windowWidth > 450 && <Notify reference={notifyTimer} width={windowWidth} notify={notify} />}
      {notify && windowWidth <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify reference={notifyTimer} width={windowWidth} notify={notify} />
        </div>
      )}
      <div className="">
        <Topbar />
        {/* <AnimatePresence>{openSearch && <SearchBox width={windowWidth} page={"Home"} ref={leftBarSearchRef} />}</AnimatePresence> */}
      </div>
      <div className="mainsection relative">
        <AnimatePresence>{notifyClicked && <Notification width={windowWidth} />}</AnimatePresence>
        {/* <AnimatePresence>{openProfileDropdown && <TopbarRightDropdown width={windowWidth} pageName={"Home"} ref={profileDropdownRef} />}</AnimatePresence> */}
        {windowWidth >= 1024 && <Leftbar width={windowWidth} />}
        <div className={`postContents overflow-hidden ${windowWidth > 768 ? "" : "scrollbar-none"}`}>
          <div className={`middleBar h-[110vh] flex items-center justify-center ${windowWidth >= 1280 && "mr-[80px]"} mr-0 `}>
            <p className="text-[120px] text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-violet-600 to-sky-900 font-bold">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
