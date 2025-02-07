import React from 'react';

const PostSkeleton = ({ width }) => {
    return (
        <>
        <div className={` ${width >= 1280 ? "w-[550px] mt-4 rounded-lg" : width >= 550 && width < 1280 ? "w-[520px] mt-4 rounded-lg" : "w-[100vw] mt-1"}`}>
            <div className=" p-4 bg-white rounded-lg shadow-sm">
                {/* Top Section */}
                <div className="flex items-center">
                    <div className="w-[60px] h-[50px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className="flex flex-col ml-4 w-full">
                        <div className=" w-[150px] h-[14px] bg-gray-300 animatePulse rounded"></div>
                        <div className=" w-[100px] h-[12px] bg-gray-300 animatePulse rounded mt-1"></div>
                        <div className=" w-[70px] h-[10px] bg-gray-300 animatePulse rounded mt-1"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mt-5">
                    <div className=" w-full h-[14px] bg-gray-300 animatePulse rounded"></div>
                    <div className=" w-[90%] h-[14px] bg-gray-300 animatePulse rounded mt-2"></div>
                    <div className=" w-[85%] h-[14px] bg-gray-300 animatePulse rounded mt-2"></div>
                </div>

                {/* Media Section */}
                <div className="mt-4">
                    <div className=" w-full h-[150px] bg-gray-300 animatePulse rounded-lg"></div>
                </div>

                {/* Reactions Section */}
                <div className="flex justify-between mt-4">
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    {width > 450 && <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>}
                </div>
            </div>
        </div>
        <div className={` ${width >= 1280 ? "w-[550px] mt-4 rounded-lg" : width >= 550 && width < 1280 ? "w-[520px] mt-4 rounded-lg" : "w-[100vw] mt-1"}`}>
            <div className=" p-4 bg-white rounded-lg shadow-sm">
                {/* Top Section */}
                <div className="flex items-center">
                    <div className="w-[60px] h-[50px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className="flex flex-col ml-4 w-full">
                        <div className=" w-[150px] h-[14px] bg-gray-300 animatePulse rounded"></div>
                        <div className=" w-[100px] h-[12px] bg-gray-300 animatePulse rounded mt-1"></div>
                        <div className=" w-[70px] h-[10px] bg-gray-300 animatePulse rounded mt-1"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mt-5">
                    <div className=" w-full h-[14px] bg-gray-300 animatePulse rounded"></div>
                    <div className=" w-[90%] h-[14px] bg-gray-300 animatePulse rounded mt-2"></div>
                    <div className=" w-[85%] h-[14px] bg-gray-300 animatePulse rounded mt-2"></div>
                </div>

                {/* Media Section */}
                <div className="mt-4">
                    <div className=" w-full h-[250px] bg-gray-300 animatePulse rounded-lg"></div>
                </div>

                {/* Reactions Section */}
                <div className="flex justify-between mt-4">
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    {width > 450 && <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>}
                </div>
            </div>
        </div>
        <div className={` ${width >= 1280 ? "w-[550px] mt-4 rounded-lg" : width >= 550 && width < 1280 ? "w-[520px] mt-4 rounded-lg" : "w-[100vw] mt-1"}`}>
            <div className=" p-4 bg-white rounded-lg shadow-sm">
                {/* Top Section */}
                <div className="flex items-center">
                    <div className="w-[60px] h-[50px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className="flex flex-col ml-4 w-full">
                        <div className=" w-[150px] h-[14px] bg-gray-300 animatePulse rounded"></div>
                        <div className=" w-[100px] h-[12px] bg-gray-300 animatePulse rounded mt-1"></div>
                        <div className=" w-[70px] h-[10px] bg-gray-300 animatePulse rounded mt-1"></div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="mt-5">
                    <div className=" w-full h-[14px] bg-gray-300 animatePulse rounded"></div>
                    <div className=" w-[90%] h-[14px] bg-gray-300 animatePulse rounded mt-2"></div>
                    <div className=" w-[85%] h-[14px] bg-gray-300 animatePulse rounded mt-2"></div>
                </div>

                {/* Media Section */}
                <div className="mt-4">
                    <div className=" w-full h-[200px] bg-gray-300 animatePulse rounded-lg"></div>
                </div>

                {/* Reactions Section */}
                <div className="flex justify-between mt-4">
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>
                    {width > 450 && <div className=" w-[40px] h-[40px] bg-gray-300 animatePulse rounded-full"></div>}
                </div>
            </div>
        </div>
        </>
    );
};

export default PostSkeleton;
