import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import globalState from "../../lib/globalState";
import { axiosInstance } from "../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
// import { faCircleXmark } from "@fortawesome/free-sol-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import UserListSkeleton from "./UserListSkeleton";
const SearchBox = forwardRef(({ page, width }, ref) => {
  const openSearch = globalState((state) => state.openSearch);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const topBarsearch = globalState((state) => state.topBarsearch);
  const setTopBarsearch = globalState((state) => state.setTopBarsearch);
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noUser, setNoUser] = useState(false);
  const timer = useRef();
  const searchRef = useRef();
  const searchInputRef = useRef();

  async function getProfiles() {
    if (value.trim() === "") {
      setProfiles(null);
      return;
    }
    try {
      setLoading(true);
      let response;
      if (page === "Home" || page === "Profile") {
        response = await axiosInstance.get(`user/profileSearch/${value.trim()}`);
      }
      setLoading(false);
      if (response.data.length >= 1) {
        setNoUser(false);
      }
      if (response.data.length === 0) {
        setNoUser(true);
      }
      setProfiles(response.data);
    } catch (error) {
      setNoUser(true);
    }
  }
  useEffect(() => {
    searchInputRef.current.focus();
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      getProfiles();
    }, 500);
    return () => clearTimeout(timer.current);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: -180, x: -180 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0, y: -180, x: -180 }}
      transition={{ duration: 0.2 }}
      ref={ref}
      className={` searchBox absolute z-10 ${width > 768 ? " w-[360px] h-[400px] left-[8px] top-[10px] " : "w-full h-full top-0 "}  flex flex-col shadow bg-white rounded-md`}
    >
      <div className={` ${width > 768 ? "h-[50px] mt-4" : "h-[50px] px-2 mt-4"} relative flex items-center`}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => setOpenSearch(false)}
          className={`text-xl p-2 ${width > 768 ? "mx-1" : "mx-0"}  rounded-full hover:bg-zinc-100 text-black cursor-pointer`}
        />
        <input
          type="text"
          ref={searchInputRef}
          value={value}
          placeholder="Search by name or username"
          onChange={(e) => setValue(e.target.value)}
          className={`w-full pl-4 ${width > 768 ? " rounded-full mr-2 " : "rounded-xl"} pr-[40px] ${
            width > 380 ? "text-[18px]" : "text-[16px]"
          } outline-none h-full placeholder:text-black bg-opacity-60 inputShadow bg-zinc-200  text-black`}
        />
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => setValue("")}
          className={` ${width > 768 ? "text-xl" : "text-2xl"} p-2 absolute text-slate-600 hover:text-slate-700 right-2 rounded-full cursor-pointer`}
        />
      </div>
      <div className={` pt-4 h-full ${profiles && profiles.length > 5 ? "overflow-y-scroll" : "overflow-y-hidden"} `}>
        {!loading && noUser && <div className="text-center text-zinc-500 mt-4">{page === "Home" || page === "Profile" ? "No user found" : "No friends found"}</div>}
        {!loading &&
          profiles &&
          page !== "Message" &&
          profiles.map((e, i) => {
            return (
              <Link to={`/userProfile/${e._id}`} key={i} onClick={() => setOpenSearch(null)}>
                <div key={i} className=" h-[70px] w-full px-4 bg-white flex cursor-pointer transition duration-200 items-center px-2 py-1 hover:bg-zinc-200 hover:bg-opacity-70 ">
                  <div>
                    <img src={e.profilePic} className="w-[50px] h-[50px] object-cover rounded-full" />
                  </div>
                  <div className="ml-2">
                    <p className="font-semibold text-black">{e.name}</p>
                    <div className="flex text-[14px] items-center">
                      <p className="text-black text-zinc-800">{e.username}</p>
                      <div className=" ml-1 flex items-center">
                        <p className="text-black font-bold">.</p>
                        <p className="ml-1 text-zinc-800">{e.followerCount}</p>
                        <p className="ml-1 text-zinc-800">followers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </motion.div>
  );
});
export default SearchBox;
