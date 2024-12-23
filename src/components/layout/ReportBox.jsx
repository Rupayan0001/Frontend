import React, { useState, useRef, forwardRef } from 'react'
import { axiosInstance } from '../../lib/axios'
import userProfilePicStore from '../../lib/userProfilePicStore'

const ReportBox = forwardRef((props, ref) => {
    const [value, setValue] = useState("")
    const setReport = userProfilePicStore((state) => state.setReport);
    const report = userProfilePicStore((state) => state.report);
    const setNotify = userProfilePicStore((state) => state.setNotify);

    const notifyTimer = useRef();
    async function reportPost() {
        if (!value) return;
        if (notifyTimer.current) {
            clearTimeout(notifyTimer.current);
            setNotify(null);
        }
        try {
            const response = await axiosInstance.post(`/post/${report}/reportPost`, { reason: value });
            if (response.data.message === "Post reported") {

                setNotify("Post reported successfully");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000);
            }

        } catch (error) {
            // console.log("error: ", error);
            if (error.response.data.message === "Post already reported") {
                setNotify("Post already reported");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000);
            }
            else {
                setNotify("Something went wrong, Please try again later");
                notifyTimer.current = setTimeout(() => {
                    setNotify(null);
                }, 5 * 1000);
            }
        }
        finally {
            setReport(null);
        }
    }
    return (
        <dialog className='fixed inset-0 h-[100%] w-[100%] z-50 flex justify-center items-center bg-white bg-opacity-60'>
            <div ref={ref} className='h-[470px] w-[400px] bg-white rounded-md reportShadow'>
                <div className='flex justify-center items-center py-4 border-b-2 border-zinc-300'>
                    <h1 className='text-[20px] font-semibold'>Report Post</h1>
                </div>
                <div className='mt-4 px-4'>
                    {["Offensive content", "Spreading misinformation", "Spreading hate or negativity", "Sexual content", "Violence", "Other"].map((e, i) => <p key={i} onClick={() => setValue(e)} className={`text-[21px] font-semibold cursor-pointer ${value === e ? "bg-zinc-200" : ""} hover:bg-zinc-200 py-[5px] mt-[5px] text-center`}>{e}</p>)}
                    {/* <p className='text-[21px] cursor-pointer hover:bg-zinc-200 py-2 mt-2 text-center'>Offensive content</p>
                    <p className='text-[21px] cursor-pointer hover:bg-zinc-200 py-2 mt-2 text-center'>Spreading misinformation</p>
                    <p className='text-[21px] cursor-pointer hover:bg-zinc-200 py-2 mt-2 text-center'>Spreading hate or negativity</p>
                    <p className='text-[21px] cursor-pointer hover:bg-zinc-200 py-2 mt-2 transition duration-100 text-center'>Sexual content</p>
                    <p className='text-[21px] cursor-pointer hover:bg-zinc-200 py-2 mt-2 text-center'>Violence</p>
                    <p className='text-[21px] cursor-pointer hover:bg-zinc-200 py-2 mt-2 text-center'>Other</p> */}
                </div>
                <div className='mt-6 px-4 flex justify-center'>
                    <button onClick={() => setReport(null)} className=' px-6 py-2 ml-0 rounded-lg bg-[#6A0DAD] text-white'>Cancel</button>
                    <button onClick={reportPost} disabled={value ? false : true} className={` px-6 py-2 ml-0 rounded-lg ${value ? "bg-[#6A0DAD]" : "bg-zinc-500"} ml-8 text-white`}>Submit</button>
                </div>
                <div className='mt-4 px-4'>
                    <p className='text-[14px] text-zinc-600'>*Select the reason why you want to report this post</p>
                </div>
            </div>
        </dialog>
    )
});

export default ReportBox
