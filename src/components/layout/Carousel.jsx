import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft, faExpand } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../lib/globalState";
const Carousel = ({ images, isModalOpen }) => {
  const expandImageForPost = globalState((state) => state.expandImageForPost);
  const setExpandImageForPost = globalState((state) => state.setExpandImageForPost);
  const [ind, setInd] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  function previousPic() {
    if (ind === 0) {
      setInd(images.length - 1);
    } else {
      setInd(ind - 1);
    }
  }

  function nextPic() {
    if (ind === images.length - 1) {
      setInd(0);
    } else {
      setInd(ind + 1);
    }
  }

  return (
    <div className="flex w-full relative">
      {!expandImageForPost && !isModalOpen && (
        <FontAwesomeIcon
          onClick={() => setExpandImageForPost(images)}
          icon={faExpand}
          className="text-white text[20px] hover:scale-105 transition cursor-pointer duration-100 absolute top-1 right-2"
        />
      )}
      {images.length > 0 && (
        <>
          {images.length > 1 && (
            <button
              className={`prev text-white text[30px] ${
                imageLoaded ? "opacity-100" : "opacity-30"
              } h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 left-2`}
              onClick={previousPic}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
          )}
          <img onLoad={() => setImageLoaded(true)} src={images[ind]} className="max-h-[500px] w-full rounded-2xl object-cover" alt="" />
          {images.length > 1 && (
            <button
              className={`next text-white text[30px] ${
                imageLoaded ? "opacity-100" : "opacity-30"
              } h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 right-2`}
              onClick={nextPic}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-2 flex justify-center w-full">
              <div className="dots flex justify-center">
                {images.map((e, i) => (
                  <p key={i} className={`h-[6px] w-[6px] rounded-full mx-1 ${ind === i ? "bg-white" : "bg-zinc-500"} `}></p>
                ))}
              </div>{" "}
            </div>
          )}
        </>
      )}{" "}
    </div>
  );
};

export default Carousel;
