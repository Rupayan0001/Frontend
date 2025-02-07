import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble, faFilePdf, faPlay, faPause, faExpand } from "@fortawesome/free-solid-svg-icons";
import globalState from "../../../lib/globalState.js";
import messageTimeLogic from "../../../lib/MessageTime.js";
import VideoPlayer from "../VideoPlayer.jsx";
// import SkeletonLoader from './SkeletonLoader.jsx';

const MessageComponent = ({ message, isSender, senderName, windowWidth }) => {
  const showImage = globalState((state) => state.showImage);
  const setShowImage = globalState((state) => state.setShowImage);
  const [audioInterval, setAudioInterval] = useState(null);
  const [videoInterval, setVideoInterval] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState("0:00");
  const [videoDuration, setVideoDuration] = useState("0:00");
  const [mediaCurrentTime, setMediaCurrentTime] = useState("0:00");
  const [mediaProgress, setMediaProgress] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const audioRef = useRef();
  const videoRef = useRef();
  const imageRef = useRef();
  const audioSeekBar = useRef();
  const videoSeekBar = useRef();
  const playingInterval = useRef();

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

  const { content, imageUrl, videoUrl, audioUrl, documentFiles, receiverId, groupId, status, senderPic } = message;

  function handleMediaPlay(mediaType) {
    const mediaRef = mediaType === "audio" ? audioRef : videoRef;
    const seekBarRef = mediaType === "audio" ? audioSeekBar : videoSeekBar;
    const playingState = mediaType === "audio" ? audioPlaying : videoPlaying;
    const setPlayingState = mediaType === "audio" ? setAudioPlaying : setVideoPlaying;
    const intervalState = mediaType === "audio" ? audioInterval : videoInterval;
    const setIntervalState = mediaType === "audio" ? setAudioInterval : setVideoInterval;

    if (mediaRef.current && !playingState) {
      setPlayingState(true);
      mediaRef.current.play();
      const interval = setInterval(() => {
        if (seekBarRef.current) {
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

  const handleSeekMedia = (e, mediaType) => {
    const mediaRef = mediaType === "audio" ? audioRef : videoRef;
    const seekBarRef = mediaType === "audio" ? audioSeekBar : videoSeekBar;
    const mediaDuration = mediaType === "audio" ? audioRef.current?.duration : videoRef.current?.duration;

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

  const mediaType = imageUrl.length > 0 ? "image" : videoUrl.length > 0 ? "video" : audioUrl.length > 0 ? "audio" : documentFiles.length > 0 ? "pdf" : null;

  return (
    <div className={`flex mt-[12px]  items-center ${isSender ? "justify-end" : "justify-start"}`}>
      {/* ${groupId && !isSender && (content.length > 30 ? 'flex flex-col' : 'flex items-center')} */}

      {content?.length > 0 && (
        <div className="flex">
          {senderPic && groupId && !isSender && (
            <div className="">
              <img src={senderPic} alt="Profile" className={`${windowWidth > 500 ? "w-[40px] h-[40px] mr-2 mt-[-6px]" : "w-[30px] h-[30px] mr-1"}  rounded-full object-cover`} />
            </div>
          )}

          <div
            className={`messageText relative ${receiverId ? (content.length > 30 ? "flex flex-col" : "flex items-center") : content.length < 16 && groupId && isSender && "flex"} 
            ${groupId && !isSender && "flex flex-col"} transition duration-100 ${windowWidth > 500 ? "text-[17px]" : "text-[16px]"} max-w-[500px] ${
              isSender ? "bg-gradient-to-r from-blue-800 to-blue-800" : "bg-gradient-to-r from-slate-700 to-slate-800"
            } cursor-pointer text-white rounded-lg pl-2 pr-2 ${content.length > 100 ? "pt-2" : "pt-1"} pb-1`}
          >
            {groupId && !isSender && senderName && <p className="pt-1 text-[14px] font-semibold pr-16">{senderName}</p>}
            {showFullText && (
              <p
                onClick={() => setShowFullText(!showFullText)}
                className={`word-wrap pr-2
               ${windowWidth >= 900 && "max-w-[400px]"}
                ${windowWidth < 900 && windowWidth >= 600 && "max-w-[380px]"} 
               ${windowWidth < 600 && windowWidth >= 450 && "max-w-[300px]"} 
               ${windowWidth < 450 && "max-w-[220px] "} cursor-pointer break-words`}
              >
                {content} <span className="font-semibold text-[14px]"> ...View less</span>
              </p>
            )}
            {windowWidth > 600 && content.length > 200 && !showFullText && (
              <p
                onClick={() => setShowFullText(!showFullText)}
                className={`word-wrap pr-2 $ ${windowWidth >= 900 && "max-w-[400px]"} ${windowWidth < 900 && windowWidth > 600 && "max-w-[380px]"} 
               ${windowWidth < 600 && windowWidth > 450 && "max-w-[300px]"} 
               ${windowWidth < 450 && "max-w-[220px] "} cursor-pointer break-words`}
              >
                {content.slice(0, 200)} <span className="font-semibold text-[14px]"> ... Read more</span>
              </p>
            )}
            {windowWidth > 600 && content.length > 100 && content.length < 200 && !showFullText && (
              <p
                onClick={() => setShowFullText(!showFullText)}
                className={`word-wrap pr-2 $ ${windowWidth >= 900 && "max-w-[400px]"} ${windowWidth < 900 && windowWidth > 600 && "max-w-[380px]"} 
               cursor-pointer break-words`}
              >
                {content.slice(0, 100)} <span className="font-semibold text-[14px]"> ... Read more</span>
              </p>
            )}
            {windowWidth <= 600 && content.length > 100 && !showFullText && (
              <p
                onClick={() => setShowFullText(!showFullText)}
                className={`word-wrap pr-2 $ 
               ${windowWidth <= 600 && windowWidth >= 450 && "max-w-[300px]"} 
               ${windowWidth < 450 && "max-w-[220px] "} cursor-pointer break-words`}
              >
                {content.slice(0, 100)} <span className="font-semibold text-[14px]"> ... Read more</span>
              </p>
            )}
            {content.length <= 100 && (
              <p
                className={`word-wrap break-words ${receiverId && (content.length > 30 ? "pr-2" : "pb-0")} 
               ${windowWidth > 900 && "max-w-[400px]"} 
               ${windowWidth <= 900 && windowWidth >= 600 && "max-w-[380px]"} 
               ${windowWidth < 600 && windowWidth >= 450 && "max-w-[300px]"} 
               ${windowWidth < 450 && windowWidth >= 350 && "max-w-[220px] "}
               ${windowWidth < 350 && "max-w-[200px] "} cursor-pointer `}
              >
                {content}
              </p>
            )}
            <div
              className={` ${windowWidth > 600 && content.length < 33 && !groupId && "mb-[-8px]"} ${!groupId && windowWidth <= 600 && content.length < 30 && "mb-[-8px]"} ${
                groupId && isSender && content.length < 33 && "mb-[-8px]"
              } ${groupId && !isSender ? "" : "ml-2"} flex justify-end items-center `}
            >
              <p className="text-[12px] text-right">{messageTimeLogic(message)}</p>
              {isSender && (
                <p className="text-[16px] ml-2">
                  {!groupId && status === "sent" && <FontAwesomeIcon icon={faCheck} />}
                  {!groupId && status === "delivered" && <FontAwesomeIcon icon={faCheckDouble} />}
                  {groupId && <FontAwesomeIcon icon={faCheckDouble} />}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {mediaType && (
        <div className="flex">
          {senderPic && groupId && !isSender && (
            <div className="">
              <img src={senderPic} alt="Profile" className={`${windowWidth > 500 ? "w-[40px] h-[40px] mr-2 mt-[-6px]" : "w-[30px] h-[30px] mr-1"}  rounded-full object-cover`} />
            </div>
          )}
          <div
            className={`relative  group cursor-pointer transition duration-100 text-[16px] ${windowWidth > 900 && "max-w-[400px]"} ${windowWidth > 600 && "max-w-[400px]"} ${
              windowWidth < 600 && windowWidth > 450 && "max-w-[320px]"
            }
             ${windowWidth < 450 && "max-w-[240px]"} 
              ${isSender ? "bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900" : "bg-gradient-to-r from-slate-700 to-slate-800"} text-white rounded-lg px-1 pt-[1px]`}
          >
            {groupId && !isSender && senderName && <p className="pt-1 pl-1 text-[12px] font-semibold pr-6">{senderName}</p>}
            {mediaType === "audio" && (
              <div
                className={` ${windowWidth >= 900 && "w-[370px]"} ${windowWidth >= 600 && "w-[340px]"}
             ${windowWidth < 600 && windowWidth > 450 && "w-[320px]"} ${windowWidth < 450 && "w-[240px]"} rounded-lg pb-3 pt-1`}
              >
                <div className="flex  items-center mt-[-8px] w-[100%] h-[50px]">
                  {status !== "sending" ? (
                    <FontAwesomeIcon onClick={() => handleMediaPlay("audio")} icon={audioPlaying ? faPause : faPlay} className="text-white text-[20px] mx-2 cursor-pointer" />
                  ) : (
                    <p className="spinOnButton ml-1 mr-1 h-[30px] w-[35px]"></p>
                  )}
                  <input
                    type="range"
                    onChange={(e) => handleSeekMedia(e, "audio")}
                    ref={audioSeekBar}
                    min={0}
                    max={100}
                    defaultValue={0}
                    className="w-[100%] bg-zinc-400 accent-slate-900 mr-2"
                  />
                </div>
                <audio
                  controls
                  ref={audioRef}
                  onLoadStart={() => setIsMediaLoaded(true)}
                  src={audioUrl[0]}
                  onLoadedMetadata={(e) => setAudioDuration(formatTime(e.target.duration))}
                  className="hidden rounded-sm"
                />
              </div>
            )}
            {mediaType === "video" && (
              <div
                className={` pb-3 ${windowWidth >= 900 && "w-[380px]"} ${windowWidth >= 600 && "max-w-[380px]"}
             ${windowWidth < 600 && windowWidth > 450 && "max-w-[300px]"} 
             ${windowWidth <= 450 && "max-w-[220px]"} relative rounded-xl mb-0 pt-1`}
              >
                <VideoPlayer onLoad={() => setIsMediaLoaded(true)} status={status} e={videoUrl[0]} maxHeight="200px" />
              </div>
            )}
            {mediaType === "image" && (
              <div className="relative">
                <img
                  ref={imageRef}
                  src={imageUrl[0]}
                  onLoad={() => setIsMediaLoaded(true)}
                  onClick={() => setShowImage(imageUrl[0])}
                  className={`${isMediaLoaded ? "block" : "hidden"} ${windowWidth > 900 && "max-w-[380px]"} ${windowWidth >= 600 && "max-w-[380px]"} 
                  ${windowWidth < 600 && windowWidth > 450 && "max-w-[300px]"} 
                  ${windowWidth <= 450 && "max-w-[220px]"} rounded-xl pt-1 pb-1`}
                />
                {status === "sending" && <p className={`spinOnButton absolute top-[43%] left-[44%] h-[40px] w-[40px] ${isMediaLoaded ? "block" : "hidden"}`}></p>}
              </div>
            )}
            {mediaType === "pdf" && (
              <div className={`flex mb-2 mt-0 ${groupId ? "px-0" : "px-1"} items-center ${status === "sending" && " mb-2 mt-1 px-1"} `}>
                {status !== "sending" ? (
                  <a href={documentFiles[0]} download="file.pdf" className={`text-[16px] pt-1 pl-1 mr-2 hover:opacity-70 text-white`} target="_blank" rel="noopener noreferrer">
                    View PDF File <FontAwesomeIcon icon={faFilePdf} className="ml-2  mt-0 mr-0 text-2xl text-red-200" />
                  </a>
                ) : (
                  <>
                    <p className="spinOnButton h-[26px] w-[26px] mr-6"></p>
                    <FontAwesomeIcon icon={faFilePdf} className="ml-2  mt-0 mr-0 text-2xl text-red-200" />
                  </>
                )}

                <div className={`mb-[-20px] ml-2 flex justify-end items-center `}>
                  {status !== "sending" && (
                    <>
                      {" "}
                      <p className="text-[12px] text-right">{messageTimeLogic(message)}</p>
                      {isSender && (
                        <p className="text-[16px] ml-2 ">
                          {!groupId && status === "sent" && <FontAwesomeIcon icon={faCheck} />}
                          {!groupId && status === "delivered" && <FontAwesomeIcon icon={faCheckDouble} />}
                          {groupId && <FontAwesomeIcon icon={faCheckDouble} />}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            {mediaType !== "pdf" && (
              <div
                className={`${mediaType === "video" ? "block" : isMediaLoaded ? "block" : "hidden"} flex justify-end items-center absolute ${isSender ? "right-2" : "right-0"} ${
                  mediaType !== "video" ? "bottom-1" : "bottom-[-2px]"
                } text-white`}
              >
                {status !== "sending" && (
                  <>
                    {" "}
                    <p className="text-[13px] text-right">{messageTimeLogic(message)}</p>
                    {isSender && (
                      <p className="text-[16px] ml-2 ">
                        {!groupId && status === "sent" && <FontAwesomeIcon icon={faCheck} />}
                        {!groupId && status === "delivered" && <FontAwesomeIcon icon={faCheckDouble} />}
                        {groupId && <FontAwesomeIcon icon={faCheckDouble} />}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
