import React from "react";
const CommentSkeleton = ({ width }) => {
    return (
        <>
            <div className='mt-8 relative flex '>
                <div className='mt-[-6px] mr-1'>
                    <div className='w-[35px] h-[35px] animatePulse bg-gray-300 rounded-full'></div>
                </div>

                <div className={`bg-slate-200 bg-opacity-60 max-w-[75%] ml-2 ${width > 600 ? "w-[40%]" : "w-[100%]"}  pr-0 py-2 rounded-md`}>
                    <div className='flex justify-between items-center mt-2 px-4'>
                        <div className='w-1/4 h-4 bg-gray-300 animatePulse rounded'></div>
                        <div className='w-1/5 h-3 bg-gray-300 animatePulse rounded'></div>
                    </div>

                    <div className='mt-2 px-4 space-y-2'>
                        <div className='h-3 bg-gray-300 animatePulse rounded'></div>
                        <div className='h-3 bg-gray-300 animatePulse rounded'></div>
                        <div className='h-3 bg-gray-300 animatePulse rounded w-3/4'></div>
                    </div>
                </div>
            </div>
            <div className='mt-8 relative flex '>
                <div className='mt-[-6px] mr-1'>
                    <div className='w-[35px] h-[35px] animatePulse bg-gray-300 rounded-full'></div>
                </div>

                <div className={`bg-slate-200 bg-opacity-60 max-w-[75%] ml-2 ${width > 600 ? "w-[60%]" : "w-[100%]"} pr-0 py-2 rounded-md`}>

                    <div className='flex justify-between items-center mt-2 px-4'>
                        <div className='w-1/4 h-4 bg-gray-300 animatePulse rounded'></div>
                        <div className='w-1/5 h-3 bg-gray-300 animatePulse rounded'></div>
                    </div>

                    <div className='mt-2 px-4 space-y-2'>
                        <div className='h-3 bg-gray-300 animatePulse rounded'></div>
                        <div className='h-3 bg-gray-300 animatePulse rounded'></div>
                        <div className='h-3 bg-gray-300 animatePulse rounded w-3/4'></div>
                    </div>
                </div>
            </div>
            <div className='mt-8 relative flex '>
                <div className='mt-[-6px] mr-1'>
                    <div className='w-[35px] h-[35px] bg-gray-300 rounded-full animatePulse'></div>
                </div>

                <div className='bg-slate-200 bg-opacity-60 max-w-[75%] ml-2 w-[100%] pr-0 py-2 rounded-md'>
                    <div className='flex justify-between items-center mt-2 px-4'>
                        <div className='w-1/4 h-4 bg-gray-300 animatePulse rounded'></div>
                        <div className='w-1/5 h-3 bg-gray-300 animatePulse rounded'></div>
                    </div>

                    <div className='mt-2 px-4 space-y-2'>
                        <div className='h-3 bg-gray-300 animatePulse rounded'></div>
                        <div className='h-3 bg-gray-300 animatePulse rounded'></div>
                        <div className='h-3 bg-gray-300 animatePulse rounded w-3/4'></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommentSkeleton;