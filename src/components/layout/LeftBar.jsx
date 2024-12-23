import React, { useRef } from "react";
import LeftBarComponent from './LeftBarComponent';
import { Link } from 'react-router-dom';
// import defaultProfilePic from "../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
import {
    faMagnifyingGlass, faCreditCard, faSquarePlus, faCirclePlay, faGear, faPhone, faUserGroup, faHouse,
    faLandmark, faBriefcase, faMessage, faStore, faGamepad, faVideo, faBars, faBell, faCopy, faEnvelope,
    faRightFromBracket, faUser,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import userProfilePicStore from "../../lib/userProfilePicStore";

const Leftbar = () => {
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const setSelectedTab = userProfilePicStore((state) => state.setSelected);
    const setOpenSearch = userProfilePicStore((state) => state.setOpenSearch);
    const setOpenPost = userProfilePicStore((state) => state.setOpenPost);
    const user = userProfilePicStore((state) => state.user);
    const leftBarSearchRef = useRef();

    function openPostBox() {
        setOpenPost(true);

    }
    return (
        <div className="leftBar  xl:w-[24vw] lg:w-[90px] hidden lg:block overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-thumb-rounded  scrollbar-track-[#E9E9E9]">
            <Link to={`/userProfile/${loggedInUser && loggedInUser._id}`}>
                <LeftBarComponent color={"#FFD700"} onClick={() => setSelectedTab("Posts")} radius={"100%"} logo={loggedInUser.profilePic} featurename={loggedInUser.name} />
            </Link>
            <LeftBarComponent color={"#000000"} ref={leftBarSearchRef} onClick={() => setOpenSearch(true)} icon={faMagnifyingGlass} featurename={"Search"} />
            {loggedInUser._id === user._id &&
                <LeftBarComponent color={"#FF007F"} onClick={openPostBox} icon={faSquarePlus} featurename={"Create post"} />
            }
            <LeftBarComponent color={"#800020"} icon={faStore} featurename={"Explore U-Shop"} />
            {/* <LeftBarComponent color={"#FF007F"} icon={faBell} featurename={"Notifications"} /> */}
            <LeftBarComponent color={"#002395"} icon={faUserGroup} featurename={"Friends"} />
            <Link to="/message">
                <LeftBarComponent color={"#4B0082"} icon={faMessage} featurename={"Messages"} />
            </Link>
            <Link to="/reels">
                <LeftBarComponent color={"#DC143C"} icon={faCirclePlay} featurename={"Reels"} />
            </Link>
            <LeftBarComponent color={"#DC143C"} icon={faVideo} featurename={"Watch Videos"} />
            <LeftBarComponent color={"#0B3D2E"} icon={faPhone} featurename={"Video/Audio Call"} />
            <LeftBarComponent color={"#FF007F"} icon={faGamepad} featurename={"Games"} />
            <LeftBarComponent color={"#8F00FF"} icon={faCreditCard} featurename={"UnLinked Pay"} />
            <LeftBarComponent color={"#26619C"} icon={faBriefcase} featurename={"Ads Manager"} />
            <LeftBarComponent color={"#002395"} icon={faLandmark} featurename={"Your Money"} />
        </div>
    )
}

export default Leftbar;