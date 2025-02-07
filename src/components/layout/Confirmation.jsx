import React from "react";
import { motion } from "framer-motion";

const Confirmation = ({ cancel, proceed, ConfirmText, width }) => {
  return (
    <dialog className="fixed inset-0 z-50 h-[100%] w-[100%] flex justify-center items-center bg-black bg-opacity-60">
      <div
        className={`${width > 768 && "w-[550px] p-3"} ${width > 550 && width <= 768 && "w-[80vw] p-3"}
      ${width <= 550 && "w-[92vw] p-3"}  bg-white rounded-md `}
      >
        <h1
          className={`text-center font-semibold border-b-2 ${width > 768 && "pb-3 mb-3 text-[24px] "} ${width <= 768 && width > 460 && "pb-3 mb-3 text-[24px] "} ${
            width <= 460 && "text-[24px] pb-2 mb-2 "
          } border-zinc-300  text-black`}
        >
          Are you sure?
        </h1>
        <p className={`text-black ${width > 768 && "text-[20px] "} ${width <= 768 && width > 460 && "pb-3 mb-2 text-[20px] "} ${width <= 460 && "text-[18px] pb-0 mb-0 "}`}>
          {ConfirmText}
        </p>
        <div className={`flex mt-6 ${width > 550 ? "justify-end" : "justify-center"} `}>
          <button
            onClick={() => cancel(null)}
            className={` font-bold  hover:opacity-90 bg-gradient-to-r from-zinc-600 via-slate-700 to-slate-700 ${
              width > 550 ? "w-[80px] h-[36px] text-[16px]" : "w-[50%] h-[40px] text-[16px]"
            } rounded-md text-white flex justify-center items-center`}
          >
            No
          </button>
          <button
            onClick={() => proceed()}
            className={`font-bold  ml-6 hover:opacity-90 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 ${
              width > 550 ? "w-[80px] h-[36px] text-[16px]" : "w-[50%] h-[40px] text-[16px]"
            } rounded-md text-white flex justify-center items-center`}
          >
            Yes
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Confirmation;
