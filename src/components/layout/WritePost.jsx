import React, { forwardRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faSliders, faVideo } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../lib/globalState.js";

const WritePost = forwardRef(({ width }, ref) => {
  // const [loading, setLoading] = useState(false);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setOpenPostWithType = globalState((state) => state.setOpenPostWithType);
  const setOpenPost = globalState((state) => state.setOpenPost);
  const setOpenPoll = globalState((state) => state.setOpenPoll);
  const openPost = globalState((state) => state.openPost);

  return (
    <div
      className={`writePost inter ${width >= 1280 && "w-[550px] mt-2 rounded-lg px-4 pt-4"} ${width >= 550 && width < 1280 && "w-[520px] mt-2 rounded-lg px-4 pt-4"} ${
        width < 550 && "w-[100vw] mt-1 px-2 pt-2"
      }  bg-white  pb-1 `}
    >
      <div className="writePostTop pb-2 border-b-2 border-zinc-300">
        <div className="profileImg flex items-center">
          <Link to={`/userProfile/${loggedInUser._id}`}>
            <img src={loggedInUser.profilePic} className={`w-[50px] h-[50px] ${width < 550 && "ml-2"} cursor-pointer rounded-full mr-3`} alt="" />
          </Link>
          <input
            type="text"
            ref={ref}
            onClick={() => {
              setOpenPost("Image");
            }}
            readOnly
            className="w-full ml-2 outline-none placeholder-black bg-zinc-200 bg-opacity-80 h-[42px] sm:h-[45px] cursor-pointer hover:bg-zinc-300 hover:bg-opacity-70 placeholder:text-[15px] rounded-full px-1 pl-4 text-black text-xl"
            placeholder={`What's on your mind? ${loggedInUser && loggedInUser.name.split(" ")[0]}`}
          />
        </div>
      </div>
      <div className="writePostBottom flex text-zinc-500 justify-between pt-2">
        <div
          onClick={() => {
            setOpenPost("Image");
          }}
          ref={ref}
          className="cursor-pointer flex  hover:bg-zinc-200 hover:bg-opacity-60 px-3 sm:px-5 py-2 rounded-lg"
        >
          <FontAwesomeIcon className="text-xl text-[#FF007F] " icon={faImage} /> <div className="ml-2 text-md">Photo</div>
        </div>
        <div
          onClick={() => {
            setOpenPost("Video");
          }}
          ref={ref}
          className="cursor-pointer flex hover:bg-zinc-200 hover:bg-opacity-60 px-3 sm:px-5 py-2 rounded-lg"
        >
          <FontAwesomeIcon className="text-xl text-[#DC143C] " icon={faVideo} /> <div className="ml-2 text-md">Video</div>
        </div>
        <div
          onClick={() => {
            setOpenPost("Image");
            setOpenPoll(true);
          }}
          ref={ref}
          className="cursor-pointer flex hover:bg-zinc-200 hover:bg-opacity-60 px-3 sm:px-5 py-2 rounded-lg"
        >
          <FontAwesomeIcon className="text-xl text-[#800020]" icon={faSliders} /> <div className="ml-2 text-md">Poll</div>
        </div>
      </div>
    </div>
  );
});

export default WritePost;
