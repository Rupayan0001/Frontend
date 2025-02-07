import React, { useState, useRef, forwardRef } from "react";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

const ReportBox = forwardRef(({ width, pageName }, ref) => {
  const [value, setValue] = useState("");
  const setReport = globalState((state) => state.setReport);
  const report = globalState((state) => state.report);
  const setNotify = globalState((state) => state.setNotify);
  const homePagePost = globalState((state) => state.homePagePost);
  const setHomePagePost = globalState((state) => state.setHomePagePost);
  const post = globalState((state) => state.post);
  const setNewPost = globalState((state) => state.setNewPost);

  const notifyTimer = useRef();
  async function reportPost() {
    if (!value) return;
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      if (pageName === "Home") {
        const newArr = homePagePost.filter((e) => e._id !== report);
        setHomePagePost(newArr);
      } else if (pageName === "Profile") {
        const newArr = post.filter((e) => e._id !== report);
        setNewPost(newArr);
      }

      const response = await axiosInstance.post(`/post/${report}/reportPost`, { reason: value });
      if (response.data.message === "Post reported") {
        setNotify("Post reported successfully");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      if (error.response.data.message === "Post already reported") {
        setNotify("Post already reported");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } else {
        setNotify("Failed to report post, Please try again later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } finally {
      setReport(null);
    }
  }
  return (
    <dialog className="fixed inset-0 h-[100%] w-[100%] z-50 flex justify-center items-center bg-black bg-opacity-60">
      <div ref={ref} className={`relative ${width > 550 ? "h-[450px] w-[400px]" : "h-full w-full"} bg-white rounded-md `}>
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => setReport(null)}
          className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          }  transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
        />
        <div className="flex justify-center items-center py-2 border-b-2 border-zinc-300">
          <h1 className="text-[20px] font-semibold">Report Post</h1>
        </div>
        <div className="mt-4 px-4">
          {["Offensive content", "Spreading misinformation", "Spreading hate or negativity", "Sexual content", "Violence", "Other"].map((e, i) => (
            <p
              key={i}
              onClick={() => setValue(e)}
              className={`text-[21px] font-semibold rounded-lg cursor-pointer ${
                value === e ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white" : ""
              } hover:bg-gradient-to-r from-slate-700 to-slate-900 hover:text-white px-4 py-[5px] mt-[5px]`}
            >
              {e}
            </p>
          ))}
        </div>
        <div className="">
          <div className="mt-6 px-4 flex justify-center">
            <button
              onClick={() => setReport(null)}
              className=" px-6 py-[6px] ml-0 rounded-lg hover:opacity-90  bg-gradient-to-r from-zinc-700 via-slate-700 to-slate-700 text-white"
            >
              Cancel
            </button>
            <button
              onClick={reportPost}
              disabled={value ? false : true}
              className={` px-6 py-[6px] ml-0 rounded-lg ${value ? "hover:opacity-90 bg-gradient-to-r from-slate-700 to-slate-900 " : "bg-zinc-400"} ml-8 text-white`}
            >
              Submit
            </button>
          </div>
          <div className="mt-4 px-4">
            <p className="text-[14px] text-zinc-600">*Select the reason why you want to report this post</p>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default ReportBox;
