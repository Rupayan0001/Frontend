import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Purple from "./../../assets/800080.png";

const LeftBarComponent = forwardRef(({ logo, featurename, width, onClick = () => {}, icon, color, radius = 0 }, ref) => {
  return (
    <div className="messageText">
      <p
        ref={ref}
        onClick={onClick}
        className=" xl:px-[25px] xl:h-[55px] xl:w-full w-[60px] h-[50px] flex justify-center items-center xl:justify-start hover:bg-slate-200 hover:bg-opacity-70 xl:mb-1 mb-[5px] cursor-pointer rounded-[4px] "
      >
        {logo && (
          <img
            src={logo}
            className={` xl:mr-[15px] object-cover xl:ml-[-5px] bg-black xl:w-[40px] xl:h-[40px] w-[35px] h-[35px] `}
            style={{ color: color, borderRadius: radius }}
            alt=""
          />
        )}
        {icon && (
          <FontAwesomeIcon
            className={` ${width >= 1280 && "mr-[15px] pb-[7px] w-[25px] h-[25px]"} ${width < 1280 && "h-[24px] w-[24px]"}  `}
            style={{ color: color }}
            icon={icon}
          />
        )}
        <span className="leftBarName xl:block hidden">{featurename.length > 17 ? featurename.slice(0, 17) + "..." : featurename}</span>
      </p>
    </div>
  );
});

export default LeftBarComponent;
