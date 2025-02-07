import React, { useEffect, useState, useRef } from "react";
import { axiosInstance } from "../../lib/axios";
import Carousel from "./Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faCircleXmark, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import VideoPlayer from "./VideoPlayer";
import { Videos_Profile_Skeleton } from "./Photos_Profile_Skeleton.jsx";
import globalState from "../../lib/globalState";
import { AnimatePresence, motion } from "framer-motion";

const VideoProfilePage = ({ width, userId }) => {
  const [photosList, setPhotosList] = useState([]);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const changeWidth = globalState((state) => state.changeWidth);
  const setChangeWidth = globalState((state) => state.setChangeWidth);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);

  const notifyTimer = useRef();

  useEffect(() => {
    async function getPhotos() {
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
      try {
        const response = await axiosInstance.get(`/post/getThisUserPostVideos/${userId}`);
        setPhotosList(response.data.posts);
        setLoading(false);
      } catch (error) {
        setNotify(`Failed to get videos, please try again later.`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
    getPhotos();
    return () => {
      setChangeWidth(null);
    };
  }, [userId]);

  return (
    <>
      <AnimatePresence>
        {changeWidth && (
          <motion.dialog
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
            className="fixed messageText inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black"
          >
            <VideoPlayer maxHeight="100vh" playing={changeWidth.videoPlaying} currentTimeVideo={changeWidth.currentTime} e={changeWidth.e} />
          </motion.dialog>
        )}
      </AnimatePresence>
      <div
        className={`${width >= 1280 && "w-[550px] mt-1 rounded-lg"} ${width >= 550 && width < 1280 && " w-[520px] mt-1 rounded-lg"} ${
          width < 550 && " w-[100vw] mt-1"
        } flex-1 justify-center`}
      >
        <div className="w-[100%] flex flex-col items-center mt-0">
          {loading && (
            <div className="mt-2 w-full flex flex-wrap">
              <Videos_Profile_Skeleton />
              <Videos_Profile_Skeleton />
              <Videos_Profile_Skeleton />
            </div>
          )}
          {!loading && (
            <div className="mt-2 w-full flex flex-wrap">
              {photosList.length > 0 && photosList.map((e, i) => <VideoPlayer key={i} maxHeight="200px" width={width} e={e} />)}
              {photosList.length === 0 && (
                <div className="w-[100%] flex justify-center items-center">
                  <h1 className="text-center mt-4">No videos yet</h1>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoProfilePage;
