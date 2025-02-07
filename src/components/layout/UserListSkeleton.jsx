import React from 'react'
import { motion } from "framer-motion"
const UserListSkeleton = ({ width }) => {
  return (
    <motion.div  initial={{ opacity: 1, scale: 1 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1}}
    transition={{
        duration: 0.1,
    }}>
      <div className={`relative ${width > 460 ? "h-[70px]" : "h-[86px]"} mt-0 mb-2 rounded-md transition duration-300 ml-0 px-2 w-full flex items-center animatePulse`}>
        <div className="relative w-[50px] h-[50px] rounded-full bg-gray-300"></div>
        <div className="ml-2 flex flex-col w-[70%]">
          <div className="h-4 bg-gray-300 rounded w-[50%]"></div>
          <div className="h-3 bg-gray-300 rounded w-[40%] mt-2"></div>
        </div>

        <div className={`absolute ${width > 460 ? "top-3 right-2" : "bottom-0 right-0"} w-[80px] h-[30px] rounded-md bg-gray-300`}></div>
      </div>

      <div className={`relative ${width > 460 ? "h-[70px]" : "h-[86px]"} mt-0 mb-2 rounded-md transition duration-300 ml-0 px-2 w-full flex items-center animatePulse`}>
        <div className="relative w-[50px] h-[50px] rounded-full bg-gray-300"></div>
        <div className="ml-2 flex flex-col w-[70%]">
          <div className="h-4 bg-gray-300 rounded w-[50%]"></div>
          <div className="h-3 bg-gray-300 rounded w-[40%] mt-2"></div>
        </div>

        <div className={`absolute ${width > 460 ? "top-3 right-2" : "bottom-0 right-0"} w-[80px] h-[30px] rounded-md bg-gray-300`}></div>
      </div>

      <div className={`relative ${width > 460 ? "h-[70px]" : "h-[86px]"} mt-0 mb-2 rounded-md transition duration-300 ml-0 px-2 w-full flex items-center animatePulse`}>
        <div className="relative w-[50px] h-[50px] rounded-full bg-gray-300"></div>
        <div className="ml-2 flex flex-col w-[70%]">
          <div className="h-4 bg-gray-300 rounded w-[50%]"></div>
          <div className="h-3 bg-gray-300 rounded w-[40%] mt-2"></div>
        </div>

        <div className={`absolute ${width > 460 ? "top-3 right-2" : "bottom-0 right-0"} w-[80px] h-[30px] rounded-md bg-gray-300`}></div>
      </div>
    </motion.div>
  )
}

export default UserListSkeleton;
