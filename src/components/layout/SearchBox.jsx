import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import userProfilePicStore from "../../lib/userProfilePicStore";
import { axiosInstance } from "../../lib/axios";
const SearchBox = forwardRef(({ page }, ref) => {
    const openSearch = userProfilePicStore((state) => state.openSearch);
    const setOpenSearch = userProfilePicStore((state) => state.setOpenSearch);
    const topBarsearch = userProfilePicStore((state) => state.topBarsearch);
    const setTopBarsearch = userProfilePicStore((state) => state.setTopBarsearch);
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
            return
        };
        try {
            setLoading(true);
            let response;
            if (page === "Home" || page === "Profile") {
                response = await axiosInstance.get(`user/profileSearch/${value.trim()}`);
                console.log("userProfiles: ", response.data);
            }
            if(page === "Message"){
                response = await axiosInstance.get(`message/friendSearch/${value.trim()}`);
                console.log("userProfiles: ", response.data);
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
            // console.log(error)
        }
    }
    // console.log("fired", ref);
    useEffect(() => {
        searchInputRef.current.focus();
        if (timer.current) {
            console.log("clearing privious timeout")
            clearTimeout(timer.current);
        };
        timer.current = setTimeout(() => {
            // console.log("After 400ms launching")
            getProfiles()
        }, 500)
        return () => clearTimeout(timer.current);
    }, [value])

    // useEffect(() => {
    //     searchInputRef.current.focus();
    //     function handleClickOutside(e) {
    //         // console.log("clicked outside", searchRef.current, !searchRef.current.contains(e.target), ref.current, "topBarsearch: ", topBarsearch.current)
    //         if (searchRef.current && !searchRef.current?.contains(e.target) && !ref.current?.contains(e.target) && !topBarsearch.current?.contains(e.target)) {
    //             setOpenSearch(false)
    //         }
    //     }
    //     document.addEventListener("click", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     }
    // }, [])
    // console.log("openSearch: ", openSearch)
    return (
        // {openSearch && }
        // <div className="relative border-4 border-blue-600">
        <div ref={ref} className=" searchBox z-10 w-[350px] h-[400px] flex flex-col shadow bg-white rounded-md">
            <div className="h-[40px]  flex items-center">
                <input type="text" ref={searchInputRef} placeholder="Search by name" onChange={(e) => setValue(e.target.value)} className="w-full pl-4 outline-none h-[40px] pr-[50px] inputShadow bg-white text-black rounded-md px-3" />
            </div>
            <div className={` pt-4 h-full ${profiles && profiles.length > 5 ? "overflow-y-scroll" : "overflow-y-hidden"} `}>
                {/* {console.log("profiles: ", profiles)} */}
                {loading && <div className="flex justify-center mt-6"><p className='spinOnButton h-[25px] w-[25px]'></p></div>}
                {!loading && noUser && <div className="text-center text-zinc-500 mt-4">{ page === "Home" || page === "Profile" ? "No user found" : "No friends found"}</div>}
                {!loading && profiles && page !== "Message" && profiles.map((e, i) => {
                    // { console.log("e: ", e) }
                    
                    return (
                        <Link to={`/userProfile/${e._id}`} key={i}>
                            <div key={i} className=" h-[70px] w-full px-4 bg-white flex cursor-pointer transition duration-200 items-center px-2 py-1 hover:bg-zinc-200">
                                <div>
                                    <img src={e.profilePic} className="w-[50px] h-[50px] object-cover rounded-full" />
                                </div>
                                <div className="ml-2">
                                    <p className="font-semibold text-black">{e.name}</p>
                                    <div className="flex text-[14px] items-center">
                                        <p className="text-zinc-500 font-thin">{e.username}</p>
                                        <div className=" ml-1 flex items-center">
                                            <p className="text-black font-bold">.</p>
                                            <p className="ml-1 text-zinc-500">{e.followerCount}</p>
                                            <p className="ml-1 text-zinc-500">followers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
                {!loading && profiles && page === "Message" && profiles.map((e, i) => {
                    // { console.log("e: ", e) }
                    
                    return (
                        <Link to={`/userProfile/${e.friendId._id}`} key={i}>
                            <div key={i} className=" h-[70px] w-full px-4 bg-white flex cursor-pointer transition duration-200 items-center px-2 py-1 hover:bg-zinc-200">
                                <div>
                                    <img src={e.friendId.profilePic} className="w-[50px] h-[50px] object-cover rounded-full" />
                                </div>
                                <div className="ml-2">
                                    <p className="font-semibold text-black">{e.friendName}</p>
                                    <div className="flex text-[14px] items-center">
                                        <p className="text-zinc-500 font-thin">{e.friendId.username}</p>
                                        <div className=" ml-1 flex items-center">
                                            <p className="text-black font-bold">.</p>
                                            <p className="ml-1 text-zinc-500">{e.friendId.followerCount}</p>
                                            <p className="ml-1 text-zinc-500">followers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
});
export default SearchBox;

