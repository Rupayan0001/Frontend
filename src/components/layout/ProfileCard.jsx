import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const ProfileCard = ({ profilePic, name, username, id, isVerified = false, cardHeight = "70px", profileSize = "60px", width = 550, status = false, className = "" }) => {
  return (
    <div
      className={`relative h-[${cardHeight}] mt-4 pt-1 cursor-pointer hoverChange rounded-md transition duration-300 ${
        width < 450 ? "px-0" : "px-2"
      } w-full flex flex-col items-center ${className}`}
    >
      <div className="flex w-full px-2">
        <div className="relative">
          <img src={profilePic} alt="Profile Image" className={`w-[${profileSize}] h-[${profileSize}] cursor-pointer object-cover rounded-full`} />
          {status && <div className="absolute bottom-1 right-[0px] w-[15px] h-[15px] bg-green-500 rounded-full transition duration-200"></div>}
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <p className={`font-bold ${width > 550 ? "text-[17px]" : "text-[15px]"} cursor-pointer text-black hover:underline transition duration-300`}>{name}</p>
            {isVerified && <FontAwesomeIcon icon={faCircleCheck} className={`text-blue-700 ml-2 ${width > 550 ? "text-[22px]" : "text-[19px]"}`} />}
          </div>
          <p className={`${width > 550 ? "text-[14px]" : "text-[14px]"} text-zinc-700`}>{username}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
