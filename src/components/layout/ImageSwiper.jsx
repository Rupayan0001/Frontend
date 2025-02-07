import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useEffect } from "react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const ImageSwiper = ({ images, isModalOpen }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      const nextButton = document.querySelector(".custom-next");
      const prevButton = document.querySelector(".custom-prev");
      if (nextButton && prevButton) {
        nextButton.style.opacity = "1";
        prevButton.style.opacity = "1";
        nextButton.style.visibility = "visible";
        prevButton.style.visibility = "visible";
      }
    }, 500);
  }, []);
  return (
    <div className="max-w-lg">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={5}
        slidesPerView={1}
        navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 1000 }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              onLoad={() => setImageLoaded(true)}
              src={img}
              alt={`Slide ${index}`}
              className={`w-full max-h-[500px] ${imageLoaded ? "block" : "hidden"} rounded-2xl object-cover`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <button
        className={`custom-prev  ${
          imageLoaded ? "block" : "hidden"
        } z-10 text-white text[30px] opacity-100 h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 left-2`}
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <button
        className={`custom-next  ${
          imageLoaded ? "block" : "hidden"
        } text-white  text[30px] opacity-100 h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 right-2 z-10`}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
};

export default ImageSwiper;
