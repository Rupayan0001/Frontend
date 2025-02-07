import React from "react";

export const Photos_Profile_Skeleton = ({ width }) => {
  return (
    <div
      className={`animatePulse bg-gray-300 ${width < 450 ? "w-[100%] mb-2" : "w-[49%] mb-2"} 
      ${width <= 550 && width >= 450 && "mx-[4px]"} h-[200px] rounded-sm`}
    ></div>
  );
};
export const Videos_Profile_Skeleton = () => {
  return <div className={`animatePulse w-[100%] mb-2 bg-gray-300 h-[200px] rounded-sm`}></div>;
};
