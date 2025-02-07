import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import globalState from "../../lib/globalState";
import { motion } from "framer-motion";

const Notify = ({ notify, reference, width, page }) => {
  const setNotify = globalState((state) => state.setNotify);
  function close() {
    setNotify(null);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 0 }}
      transition={{ duration: 0.3 }}
      className={` notifyShadow messageText flex items-center justify-between ${width > 450 && "absolute left-6 bottom-10 pl-4 pr-2 h-[42px] text-[15px]"} ${
        width <= 450 && width > 400 && " w-[95%] h-[42px] pl-4 text-[14px]"
      } ${width <= 400 && "w-[95%] h-[46px] pl-4 py-2 text-[13px]"}
        z-50 ${page === "Message" && "bg-white text-black"} ${(page === "Home" || page === "Profile") && "bg-gradient-to-t from-slate-800 to-slate-900 text-white"} rounded-md`}
    >
      {notify}
      <button className="cursor-pointer hover:opacity-50 transition duration-200 border-0 px-2 py-1 ml-3 rounded-md font-semibold" onClick={() => close()}>
        <FontAwesomeIcon className="font-bold" icon={faXmark} />
      </button>
    </motion.div>
  );
};

export default Notify;
