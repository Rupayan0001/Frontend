import React, { forwardRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Purple from "./../../assets/800080.png"

const LeftBarComponent = forwardRef(({ logo, featurename, onClick = ()=>{}, icon, color, radius = 0 }, ref) => {
    return (
        <div>
            <p ref={ref} onClick={onClick} className=" xl:p-[10px] xl:h-[55px] xl:w-[17vw] w-[50px] h-[50px] flex justify-center items-center xl:justify-start hover:bg-zinc-300 xl:mb-2 mb-[10px] cursor-pointer rounded-[10px] ">
                {logo && <img src={logo} className={` xl:mr-[15px] xl:ml-[-5px] bg-black xl:w-[40px] xl:h-[40px] w-[35px] h-[35px] `} style={{ color: color, borderRadius: radius, }} alt="" />}
                {icon && <FontAwesomeIcon className=' xl:mr-[15px] xl:pb-[7px] xl:w-[25px] xl:h-[25px] h-[24px] w-[24px] ' style={{ color: color }} icon={icon} />}
                {/* xl:text-[24px] text-[22px]  */}
                <span className='leftBarName xl:block hidden'>{featurename}</span>
            </p>
        </div>
    )
});

export default LeftBarComponent
