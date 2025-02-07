import React, { useRef } from "react";
import LeftBarComponent from "./LeftBarComponent";
import { Link } from "react-router-dom";
import {
  faMagnifyingGlass,
  faCreditCard,
  faSquarePlus,
  faCirclePlay,
  faGear,
  faPhone,
  faUserGroup,
  faHouse,
  faLandmark,
  faBriefcase,
  faMessage,
  faStore,
  faGamepad,
  faVideo,
  faBars,
  faBell,
  faCopy,
  faEnvelope,
  faRightFromBracket,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import globalState from "../../lib/globalState";

const Leftbar = ({ width }) => {
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setSelectedTab = globalState((state) => state.setSelected);
  const setOpenSearch = globalState((state) => state.setOpenSearch);
  const setOpenPost = globalState((state) => state.setOpenPost);

  const setShowFriends = globalState((state) => state.setShowFriends);
  const user = globalState((state) => state.user);
  const leftBarSearchRef = useRef();

  return (
    <div
      className={`leftBar border-r-[2px] h-[calc(100vh-60px)] border-transparent hover:border-zinc-300 ${width >= 1280 && "w-[24vw]"} ${
        width >= 1024 && width < 1280 && "w-[70px]"
      } transition duration-300 overflow-y-scroll scrollbar-none`}
    >
      <Link to={`/userProfile/${loggedInUser && loggedInUser._id}`}>
        <LeftBarComponent width={width} color={"#FFD700"} onClick={() => setSelectedTab("Posts")} radius={"100%"} logo={loggedInUser.profilePic} featurename={loggedInUser.name} />
      </Link>
      <LeftBarComponent width={width} color={"#000000"} ref={leftBarSearchRef} onClick={() => setOpenSearch(true)} icon={faMagnifyingGlass} featurename={"Search"} />
      {loggedInUser._id === user._id && <LeftBarComponent width={width} color={"#FF007F"} onClick={() => setOpenPost("Image")} icon={faSquarePlus} featurename={"Create post"} />}
      <LeftBarComponent width={width} onClick={() => setShowFriends("Friends")} color={"#002395"} icon={faUserGroup} featurename={"Friends"} />
      <Link to="/message">
        <LeftBarComponent width={width} color={"#4B0082"} icon={faMessage} featurename={"Messages"} />
      </Link>
      <div>
        {/* <Link to="/reels"> */}
        <LeftBarComponent width={width} color={"#DC143C"} icon={faCirclePlay} featurename={"Reels"} />
        {/* </Link> */}
        <LeftBarComponent width={width} color={"#800020"} icon={faStore} featurename={"Explore Shop"} />
        {/* <LeftBarComponent color={"#DC143C"} icon={faVideo} featurename={"Watch Videos"} /> */}
        {/* <Link to={"/message"}>
                <LeftBarComponent color={"#0B3D2E"} icon={faPhone} featurename={"Video/Audio Call"} />
            </Link> */}
        {/* <Link to="/payment-page"> */}
        <LeftBarComponent width={width} color={"#FF007F"} icon={faGamepad} featurename={"Games"} />
        {/* </Link> */}
        <LeftBarComponent width={width} color={"#8F00FF"} icon={faCreditCard} featurename={"Renokon Wallet"} />
        <Link to="/ads-manager">
          <LeftBarComponent width={width} color={"#26619C"} icon={faBriefcase} featurename={"Business"} />
        </Link>
        {/* <LeftBarComponent width={width} color={"#002395"} icon={faLandmark} featurename={"Your Money"} /> */}
      </div>
    </div>
  );
};

export default Leftbar;
