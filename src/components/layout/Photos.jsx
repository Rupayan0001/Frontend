import React, { useEffect, useState, useRef } from "react";
import { axiosInstance } from "../../lib/axios";
import Carousel from "./Carousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faCircleXmark, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./../../styles/SignUpPage.css";
import { Photos_Profile_Skeleton } from "./Photos_Profile_Skeleton";
import globalState from "../../lib/globalState";

const Photos = ({ width, userId }) => {
  const [photosList, setPhotosList] = useState([]);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const setNotify = globalState((state) => state.setNotify);
  const dialogRef = useRef();
  const prevRef = useRef();
  const nextRef = useRef();
  const notifyTimer = useRef();

  useEffect(() => {
    async function getPhotos() {
      try {
        const response = await axiosInstance.get(`/post/getThisUserPostPhotos/${userId}`);
        setPhotosList(response.data.posts);
        setLoading(false);
      } catch (error) {
        setNotify(`Failed to get photos, please try again later.`);
        notifyTimer.current = setTimeout(() => {
          setNotify(null);
        }, 5 * 1000);
      }
    }
    getPhotos();
  }, [userId]);

  useEffect(() => {
    function handleOutsideClicks(e) {
      if (dialogRef.current && !dialogRef.current.contains(e.target) && !prevRef.current.contains(e.target) && !nextRef.current.contains(e.target)) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handleOutsideClicks);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClicks);
    };
  }, []);

  async function showPic(i) {
    setImages([photosList[i]]);
    setIsModalOpen(true);
    setSelectedPhoto(i);
  }
  function closeModal() {
    setIsModalOpen(false);
    setSelectedPhoto(null);
    setComments([]);
    setImages([]);
  }
  async function previousPic() {
    const newIndex = selectedPhoto === 0 ? photosList.length - 1 : selectedPhoto - 1;
    showPic(newIndex);
  }

  async function nextPic() {
    const newIndex = selectedPhoto === photosList.length - 1 ? 0 : selectedPhoto + 1;
    console.log("newIndex: ", newIndex);
    showPic(newIndex);
  }

  return (
    <div
      className={`${width >= 1280 && "w-[550px] mt-1 rounded-lg"} ${width >= 550 && width < 1280 && " w-[520px] mt-1 rounded-lg"} ${
        width < 550 && " w-[100vw] mt-1"
      } flex-1 justify-center`}
    >
      <div className="w-[100%] flex flex-col items-center mt-0">
        {loading && !isModalOpen && (
          <div className="mt-2 w-full flex justify-between flex-wrap">
            <Photos_Profile_Skeleton width={width} />
            <Photos_Profile_Skeleton width={width} />
            <Photos_Profile_Skeleton width={width} />
            <Photos_Profile_Skeleton width={width} />
          </div>
        )}
        {!loading && (
          <div className="mt-2 w-full flex justify-between flex-wrap">
            {photosList.length > 0 &&
              photosList.map((e, i) => (
                <img
                  src={e}
                  key={i}
                  onClick={() => showPic(i)}
                  className={` ${width < 400 ? "w-[100%] mb-2" : "w-[47%] mb-2"} ${width <= 550 && width >= 450 && "mx-[4px]"} h-[200px] object-cover rounded-sm cursor-pointer`}
                  alt=""
                />
              ))}
            {photosList.length === 0 && (
              <div className="w-[100%] flex justify-center items-center">
                <h1 className="text-center mt-4">No photos yet</h1>
              </div>
            )}
          </div>
        )}
        {isModalOpen && (
          <dialog open className={`fixed inset-0 z-40 flex justify-center w-[100%] h-[100%] items-center bg-black ${width < 768 ? "bg-opacity-70" : "bg-opacity-60"}`}>
            <div ref={dialogRef} className="rounded-md flex justify-center">
              <div className="image w-[100%] overflow-hidden">
                <Carousel isModalOpen={isModalOpen} images={images} />
              </div>
              {/* <div className="comment ">
                <h1 className="text-lg font-bold text-center text-black">Comments</h1>
                <div className="overflow-y-auto max-h-[400px]">
                  {comments.map((comment, index) => (
                    <p key={index} className="my-2 border-b pb-2 text-black">
                      {comment.content}
                    </p>
                  ))}
                </div>
              </div> */}
            </div>
            <FontAwesomeIcon
              icon={width <= 768 ? faArrowLeft : faXmark}
              onClick={closeModal}
              className={`absolute top-2 ${
                width <= 768 ? "left-2" : "right-2"
              } h-[24px] w-[24px] cursor-pointer hover:bg-zinc-700 p-2 transition duration-100 rounded-full text-white text-xl`}
            />
            {photosList.length > 1 && (
              <button
                ref={prevRef}
                className={`prev text-white flex items-center justify-center ${
                  width < 550 ? "text[25px] h-[35px] w-[35px]" : "text[40px] h-[50px] w-[50px]"
                } hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 left-1`}
                onClick={previousPic}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>
            )}
            {photosList.length > 1 && (
              <button
                ref={nextRef}
                className={`next text-white flex items-center justify-center ${
                  width < 550 ? "text[25px] h-[35px] w-[35px]" : "text[40px] h-[50px] w-[50px]"
                } hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 right-1`}
                onClick={nextPic}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
            )}
          </dialog>
        )}
      </div>
    </div>
  );
};

export default Photos;
