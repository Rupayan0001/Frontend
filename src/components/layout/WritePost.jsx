import React, { forwardRef } from 'react'
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faSliders, faVideo } from '@fortawesome/free-solid-svg-icons';
import userProfilePicStore from '../../lib/userProfilePicStore.js';

const WritePost = forwardRef(({ onClick, width }, ref) => {
    // const [loading, setLoading] = useState(false);
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);

    // const { userId } = useParams();
    // console.log("userId: ", userId)
    return (
        <div className={`writePost xl:w-[550px] ${(width >= 550 && width < 1280) && "w-[520px]"} ${width < 550 && "w-[98vw]"} mt-2 bg-white px-4 pt-4 pb-1 rounded-lg`}>
            <div className="writePostTop pb-2 border-b-2 border-zinc-300">
                <div className="profileImg flex items-center">
                    <Link to={`/userProfile/${loggedInUser._id}`}>
                        <img src={loggedInUser.profilePic} className='w-[40px] h-[40px] sm:h-[50px] sm:w-[50px] cursor-pointer rounded-full mr-3' alt="" />
                    </Link>
                    <input type="text" ref={ref} onClick={onClick} readOnly className='w-full outline-none placeholder-black bg-zinc-200 h-[40px] sm:h-[45px] cursor-pointer hover:bg-zinc-300 placeholder:text-[15px] rounded-full px-1 pl-4 text-black text-xl' placeholder={`What's on your mind? ${loggedInUser && loggedInUser.name.split(" ")[0]}`} />
                </div>
            </div>
            <div className="writePostBottom flex text-zinc-500 justify-between pt-2">
                <div onClick={onClick} ref={ref} className='cursor-pointer flex  hover:bg-zinc-200 px-3 sm:px-5 py-2 rounded-lg'>
                    <FontAwesomeIcon className='text-xl text-[#FF007F] ' icon={faImage} /> <div className='ml-2 text-md'>Photo</div>
                </div>
                <div onClick={onClick} ref={ref} className='cursor-pointer flex hover:bg-zinc-200 px-3 sm:px-5 py-2 rounded-lg'>
                    <FontAwesomeIcon className='text-xl text-[#DC143C] ' icon={faVideo} /> <div className='ml-2 text-md'>Video</div>
                </div>
                <div onClick={onClick} ref={ref} className='cursor-pointer flex hover:bg-zinc-200 px-3 sm:px-5 py-2 rounded-lg'>
                    <FontAwesomeIcon className='text-xl text-[#800020]' icon={faSliders} /> <div className='ml-2 text-md'>Poll</div>
                </div>
            </div>
        </div>
    )
})

export default WritePost
