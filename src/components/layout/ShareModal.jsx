import React, { forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import globalState from "../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { axiosInstance } from "../../lib/axios";

const ShareModal = forwardRef(({ page = "Home" }, ref) => {
  const shareOptions = globalState((state) => state.shareOptions);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const setNotify = globalState((state) => state.setNotify);
  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  const post = globalState((state) => state.post);
  const setNewPost = globalState((state) => state.setNewPost);
  const notifyTimer = useRef();
  const navigate = useNavigate();

  const mainUrl = `http://localhost:5173/home/${shareOptions}`;

  async function handleShareClick(buttonName, url) {
    try {
      const response = await axiosInstance.put(`/post/updateShareCount/${shareOptions}`);
    } catch (error) {}
    if (page === "Home") {
      const found = homePagePost.findIndex((e) => e._id === shareOptions);
      if (found >= 0) {
        homePagePost[found].sharesCount += 1;
        setHomePagePost([...homePagePost]);
      }
    } else if (page === "Profile") {
      const found = post.findIndex((e) => e._id === shareOptions);
      if (found >= 0) {
        post[found].sharesCount += 1;
        setNewPost([...post]);
      }
    }
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    if (buttonName === "CopyLink") {
      navigator.clipboard.writeText(url);
      setNotify("Link copied to clipboard");
      notifyTimer.current = setTimeout(() => setNotify(null), 5000);
    }
    if (buttonName === "Facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?text=${url}`, "_blank");
    }
    if (buttonName === "Twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
    }
    if (buttonName === "Whatsapp") {
      window.open(`https://web.whatsapp.com/send?text=${url}`, "_blank");
    }
    if (buttonName === "Gmail") {
      const subject = encodeURIComponent("Check out this link");
      const body = encodeURIComponent(url);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");
    }
    setCloseModal(true);
  }

  function handleClose() {
    setCloseModal(true);
  }
  return (
    <dialog className="fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black bg-opacity-60">
      <div ref={ref} className="relative w-[350px] h-[330px] bg-white rounded-xl px-2 pt-2">
        <FontAwesomeIcon
          icon={faXmark}
          onClick={() => handleClose()}
          className="absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 top-1 right-1 transition duration-300 rounded-full top-0 right-0 cursor-pointer"
        />
        <h1 className="border-b-2 border-zinc-300 h-[45px] font-semibold pr-4 text-lg w-full flex justify-center items-center">Share</h1>

        <div className="options text-black">
          <p
            onClick={() => handleShareClick("CopyLink", mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-zinc-300 transition duration-200 p-2 rounded-lg"
          >
            Copy Link
            <FontAwesomeIcon className="ml-4 text-zinc-600 text-2xl" icon={faCopy} />
          </p>
          <p
            onClick={() => handleShareClick("Facebook", mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-zinc-300 transition duration-200 p-2 rounded-lg"
          >
            Share to Facebook
            <FontAwesomeIcon className="ml-4 text-blue-600 text-2xl" icon={faFacebook} />
          </p>
          <p
            onClick={() => handleShareClick("Twitter", mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-zinc-300 transition duration-200 p-2 rounded-lg"
          >
            {" "}
            Share to Twitter
            <FontAwesomeIcon className="ml-4 text-zinc-900 text-2xl" icon={faTwitter} />
          </p>
          <p
            onClick={() => handleShareClick("Whatsapp", mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-zinc-300 transition duration-200 p-2 rounded-lg"
          >
            {" "}
            Share to Whatsapp
            <FontAwesomeIcon className="ml-4 text-green-600 text-2xl" icon={faWhatsapp} />
          </p>
          <p
            onClick={() => handleShareClick("Gmail", mainUrl)}
            className="w-full text-lg text-center font-semibold mt-2 cursor-pointer hover:bg-zinc-300 transition duration-200 p-2 rounded-lg"
          >
            Share to Gmail
            <FontAwesomeIcon className="ml-4 text-red-600 text-2xl" icon={faEnvelope} />
          </p>
        </div>
      </div>
    </dialog>
  );
});

export default ShareModal;
