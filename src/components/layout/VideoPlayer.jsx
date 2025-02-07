import React, { useRef, useEffect, useState } from "react";
import { faCirclePlay, faExpand, faPause, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import globalState from "../../lib/globalState";
import { AnimatePresence, motion } from "framer-motion";

const VideoPlayer = ({ e, maxHeight, playing, currentTimeVideo, expand = true, onLoad = () => {}, status = "" }) => {
  const [mediaCurrentTime, setMediaCurrentTime] = useState("0:00");
  const [mediaProgress, setMediaProgress] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoInterval, setVideoInterval] = useState(null);
  const [videoDuration, setVideoDuration] = useState("0:00");
  const changeWidth = globalState((state) => state.changeWidth);
  const setChangeWidth = globalState((state) => state.setChangeWidth);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  let hideControlsTimeout;

  const videoSeekBar = useRef();
  const playingInterval = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (changeWidth) {
      if (videoRef.current && currentTimeVideo) {
        videoRef.current.currentTime = currentTimeVideo;
      }
      const handleMouseMove = () => {
        setIsMouseMoving(true);
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
          setIsMouseMoving(false);
        }, 2000);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(hideControlsTimeout);
      };
    }
  }, [changeWidth, currentTimeVideo]);

  useEffect(() => {
    if (playing && videoRef.current) {
      handleMediaPlay();
    }
  }, [playing]);

  function handleMediaPlay() {
    const mediaRef = videoRef;
    const seekBarRef = videoSeekBar;
    const playingState = videoPlaying;
    const setPlayingState = setVideoPlaying;
    const intervalState = videoInterval;
    const setIntervalState = setVideoInterval;

    if (mediaRef.current && !playingState) {
      setPlayingState(true);
      mediaRef.current.play();
      const interval = setInterval(() => {
        if (seekBarRef.current) {
          setCurrentTime(mediaRef.current.currentTime);
          seekBarRef.current.value = (mediaRef.current.currentTime / mediaRef.current.duration) * 100;
          if (mediaRef.current.ended) {
            setPlayingState(false);
            clearInterval(interval);
            seekBarRef.current.value = 0;
          }
        }
      }, 500);
      setIntervalState(interval);
    } else if (mediaRef.current && playingState) {
      mediaRef.current.pause();
      setPlayingState(false);
      if (intervalState) {
        clearInterval(intervalState);
      }
    }
  }

  const handleSeekMedia = (e) => {
    const mediaRef = videoRef;
    const seekBarRef = videoSeekBar;
    const mediaDuration = videoRef.current?.duration;

    if (mediaRef.current && seekBarRef.current) {
      const seekTime = (e.target.value / 100) * mediaDuration;
      mediaRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    if (videoPlaying) {
      if (videoRef.current?.ended) {
        clearInterval(playingInterval.current);
      }
      playingInterval.current = setInterval(() => {
        const currentTime = videoRef.current?.currentTime || 0;
        setMediaCurrentTime(formatTime(currentTime));
      }, 1000);
    }
  }, [videoPlaying]);

  return (
    <div className={`w-[100%] ${!changeWidth && "mb-2"}  relative group`}>
      <AnimatePresence>
        {!videoPlaying && status !== "sending" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <FontAwesomeIcon icon={faCirclePlay} className="text-white text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:text-zinc-300  " />
          </motion.p>
        )}
        {status === "sending" && <FontAwesomeIcon icon={faSpinner} className="text-[#c677ff] text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   " />}
      </AnimatePresence>
      <video
        ref={videoRef}
        src={e}
        onClick={() => handleMediaPlay()}
        className={`w-[100%] object-cover rounded-lg cursor-pointer`}
        style={{ maxHeight: maxHeight }}
        onLoadedMetadata={(e) => {
          const duration = formatTime(e.target.duration);
          setVideoDuration(duration);
          onLoad();
          // setMediaCurrentTime("0:00");
        }}
        value={isNaN(mediaProgress) ? 0 : mediaProgress}
        onTimeUpdate={(e) => {
          const progress = (e.target.currentTime / e.target.duration) * 100;
          setMediaProgress(progress);
        }}
        alt=""
      />
      <div
        className={`absolute bottom-0 flex items-center justify-between pl-1 ${changeWidth ? "h-[50px]" : "h-[30px] group-hover:opacity-100 opacity-0"} ${
          isMouseMoving ? "opacity-100" : "opacity-0"
        } transition duration-500 bg-slate-900 w-full`}
      >
        <p className="h-full flex items-center">
          <FontAwesomeIcon
            icon={videoPlaying ? faPause : faPlay}
            onClick={() => handleMediaPlay()}
            className={`${changeWidth ? "w-[20px] h-[20px]" : "w-[15px] h-[15px]"} p-2 hover:text-zinc-400 text-white transition duration-100 rounded-full cursor-pointer`}
          />
        </p>
        <p className="w-full h-full flex items-center">
          <input
            type="range"
            onChange={(e) => handleSeekMedia(e, "video")}
            ref={videoSeekBar}
            min={0}
            max={100}
            defaultValue={0}
            className={`w-full ml-1 bg-zinc-400 cursor-pointer accent-blue-700 mr-2 `}
          />
        </p>
        <p className={`mr-1 ${changeWidth ? "text-[16px]" : "text-[14px]"} h-full flex items-center ml-2 text-white`}>
          {mediaCurrentTime}/{videoDuration}
        </p>
        <p className="h-full flex items-center">
          {expand && (
            <FontAwesomeIcon
              icon={faExpand}
              onClick={
                changeWidth
                  ? () => setChangeWidth(null)
                  : () => {
                      videoRef.current.pause();
                      setVideoPlaying(false);
                      if (videoInterval) {
                        clearInterval(videoInterval);
                      }
                      setChangeWidth({ e, currentTime, videoPlaying });
                    }
              }
              className={`${changeWidth ? "w-[20px] h-[20px]" : "w-[15px] h-[15px]"} p-2 hover:text-zinc-400 text-white transition duration-100 rounded-full cursor-pointer`}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
