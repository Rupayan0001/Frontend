import React, { useState, useEffect, useRef } from "react";
import globalState from "../../../lib/globalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faStopCircle } from "@fortawesome/free-solid-svg-icons";

const VoiceRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const setVoiceRecord = globalState((state) => state.setVoiceRecord);
  const [audioRecording, setAudioRecording] = useState(false);
  const audioChunksRef = useRef([]);
  const audioBlob = useRef(null);

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

  const startRecording = async () => {
    setAudioRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioBlob.current = blob;
        const url = URL.createObjectURL(blob);
        setVoiceRecord({ target: { files: [blob] } });

        // Stop microphone stream to free resources
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setAudioRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      setAudioRecording(false);
      mediaRecorder.stop();
    }
  };

  return (
    <div>
      {!audioRecording ? (
        <FontAwesomeIcon
          icon={faMicrophone}
          onClick={startRecording}
          className="w-[22px] h-[22px] p-2 hover:text-zinc-400 text-zinc-100 font-bold transition duration-100 cursor-pointer"
        />
      ) : (
        <FontAwesomeIcon
          icon={faStopCircle}
          onClick={stopRecording}
          className="w-[22px] h-[22px] p-2 hover:text-red-700 animateStopButton text-red-600 font-bold transition duration-100 cursor-pointer"
        />
      )}
    </div>
  );
};

export default VoiceRecorder;
