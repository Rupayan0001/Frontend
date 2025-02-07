import react, { forwardRef, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import globalState from "../../lib/globalState";
import HoverBasicDetails from "./HoverBasicDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";

const HideUser = forwardRef(({ currentUserId, width }, ref) => {
  const setNotify = globalState((state) => state.setNotify);
  const showIdDetails = globalState((state) => state.showIdDetails);
  const setShowIdDetails = globalState((state) => state.setShowIdDetails);
  const setStoreId = globalState((state) => state.setStoreId);
  const setEnterDialogHover = globalState((state) => state.setEnterDialogHover);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const setOpenHideUserList = globalState((state) => state.setOpenHideUserList);
  const closeModal = globalState((state) => state.closeModal);
  const [hideUser, sethideUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const notifyTimer = useRef();
  const dialogHoverTimer = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    async function gethideUser() {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/user/${currentUserId}/getHideUsers`);
        if (response.data.hideUsers) {
          sethideUser(response.data.hideUsers);
        } else {
          setNotify(response.data.message);
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      } catch (error) {
        setNotify("Failed to get hide users, please try again later");
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      } finally {
        setLoading(false);
      }
    }
    gethideUser();
  }, []);

  function idDetails(id) {
    if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
    setShowIdDetails(id);
    setStoreId(id);
  }
  function doNullId() {
    if (dialogHoverTimer.current) clearTimeout(dialogHoverTimer.current);
    dialogHoverTimer.current = setTimeout(() => {
      setShowIdDetails(null);
    }, 400);
    setEnterDialogHover(dialogHoverTimer);
  }

  async function unHideUser(id, name) {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    try {
      const response = await axiosInstance.put(`/user/${id}/unHideUser`);
      if (response.data.message === "UnHide") {
        const deletedunHideUser = hideUser.filter((e, i) => e.hideUserId._id !== id);
        sethideUser(deletedunHideUser);
        setNotify(`You have unhide ${name.split(" ")[0]}'s profile`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
      if (response.data.message === "Could not unHide, please try again later") {
        setNotify(response.data.message);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    } catch (error) {
      setNotify("Failed to unhide user, please try again later");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  return (
    <dialog className="fixed inset-0 h-[100%] w-[100%] z-50 flex justify-center items-center bg-black bg-opacity-60">
      <div ref={ref} className={`relative ${width > 550 ? "h-[450px] w-[400px]" : "h-full w-full"} bg-white rounded-md`}>
        <FontAwesomeIcon
          icon={width > 550 ? faXmark : faArrowLeft}
          onClick={() => setCloseModal(true)}
          className={`absolute w-[25px] h-[25px] p-2 hover:bg-zinc-200 text-zinc-800 ${
            width > 550 ? "top-1 right-1" : "top-1 left-1"
          } transition duration-300 rounded-full top-0 right-0 cursor-pointer`}
        />
        <div className="flex justify-center items-center  ">
          <h1 className="border-b-2 border-zinc-300 h-[50px] text-lg w-full flex justify-center items-center">Hide User</h1>
        </div>
        <div className={`h-[400px] ${width > 460 ? "px-2" : "px-1"}  ${hideUser && hideUser.length > 5 ? "overflow-y-scroll" : "overflow-y-hidden"} `}>
          {!loading &&
            hideUser &&
            hideUser.length > 0 &&
            hideUser.map((e, i) => {
              return (
                <div
                  key={i}
                  className={`relative  ${
                    width > 460 ? " h-[70px]" : " h-[86px]"
                  } mt-0 cursor-pointer hoverChange rounded-md transition duration-300 ml-0 px-2 w-full flex items-center`}
                >
                  <div className="flex">
                    <div
                      onClick={() => {
                        navigate(`/userProfile/${e.hideUserId._id}`);
                        setOpenHideUserList(null);
                      }}
                      className="relative w-[50px] h-[50px] cursor-pointer rounded-full group"
                    >
                      <img src={e.hideUserId.profilePic} alt="Profile Image" className="w-full h-full object-cover rounded-full" />
                      <div className="absolute inset-0 bg-zinc-800 bg-opacity-15 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center">
                        <p
                          className="font-bold text-[16px] cursor-pointer text-black hover:underline transition duration-300 "
                          onClick={() => {
                            navigate(`/userProfile/${e.hideUserId._id}`);
                            setOpenHideUserList(null);
                          }}
                        >
                          {e.hideUserId.name ? (e.hideUserId.name.length > 19 ? e.hideUserId.name.slice(0, 19) + ".." : e.hideUserId.name) : ""}
                        </p>
                        <FontAwesomeIcon icon={faCircleCheck} className="text-blue-700 ml-2 mt-1 text-[22px]" />
                      </div>
                      <p className="text-[14px] text-zinc-700">{e.hideUserId.username ? e.hideUserId.username : ""}</p>
                    </div>
                    <button
                      onClick={() => unHideUser(e.hideUserId._id, e.hideUserId.name)}
                      className={`absolute ${
                        width > 460 ? "top-3 right-2" : "bottom-0 right-0"
                      }  px-3 py-[4px] ml-0 rounded-md transition duration-200 hover:opacity-90 bg-gradient-to-r from-blue-800 via-blue-700 font-bold to-blue-600 text-white`}
                    >
                      UnHide
                    </button>
                  </div>
                </div>
              );
            })}
          {!loading && hideUser && hideUser.length === 0 && <div className="text-center text-zinc-500 h-[380px] flex items-center justify-center">No user found</div>}
          {loading && (
            <div className="mt-10 text-zinc-500 w-full flex justify-center">
              <p className="spinOnButton h-[25px] w-[25px]"></p>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
});

export default HideUser;
