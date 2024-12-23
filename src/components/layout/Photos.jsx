import React, { useEffect, useState, useRef } from 'react'
import { axiosInstance } from '../../lib/axios'
import Carousel from './Carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import "./../../styles/SignUpPage.css"

const Photos = ({ user }) => {
    const [photosList, setPhotosList] = useState([])
    const [images, setImages] = useState([])
    const [comments, setComments] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false); // New state to control modal visibility
    const [selectedPhoto, setSelectedPhoto] = useState(null); // State to hold selected photo
    const [loading, setLoading] = useState(true);
    const dialogRef = useRef();
    const prevRef = useRef();
    const nextRef = useRef();

    useEffect(() => {
        async function getPhotos() {
            try {
                const response = await axiosInstance.get("/post/getThisUserPostPhotos")
                const photos = response.data.posts.filter(e => e.image.length > 0)
                // const postIds = response.data.posts.filter(e=> e.image.length > 0).map(e=> e._id);
                setPhotosList(photos)
                setLoading(false);
                // console.log(photos)
                // console.log(postIds)
                // console.log(response.data.posts)
            }
            catch (error) {
                console.log(error)
            }
        }
        getPhotos();

    }, [user])

    useEffect(() => {
        function handleOutsideClicks(e) {
            if (dialogRef.current && !dialogRef.current.contains(e.target) && !prevRef.current.contains(e.target) && !nextRef.current.contains(e.target)) {
                // console.log("fired...")
                closeModal();
            }
        }
        document.addEventListener("mousedown", handleOutsideClicks)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClicks)
        }
    }, [])

    async function showPic(i) {
        try {
            // console.log(photosList[i])
            // setLoading(true);
            const comments = await axiosInstance.get(`/post/${photosList[i]._id}/getComment`)
            setImages(photosList[i].image)
            // console.log(photosList[i].image)
            setComments(comments.data.comments)
            setIsModalOpen(true);
            setSelectedPhoto(i);
            // setLoading(false);
            // console.log("comments: ", comments.data.comments)

        }
        catch (error) {
            console.log(error);
        }
    }
    function closeModal() {
        setIsModalOpen(false);
        setSelectedPhoto(null);
        setComments([]);
        setImages([]);

    }
    async function previousPic() {
        const newIndex = selectedPhoto === 0 ? photosList.length - 1 : selectedPhoto - 1;
        await showPic(newIndex);
    }

    async function nextPic() {
        const newIndex = selectedPhoto === photosList.length - 1 ? 0 : selectedPhoto + 1;
        await showPic(newIndex);
    }


    return (
        <div className='w-full flex-1 justify-center'>
            <div className='w-[100%] flex flex-col items-center bg-zinc-200 mt-4 mx-auto'>
                <h1 className='text-center text-lg text-zinc-800 font-bold enterOTP mt-5'>Photos and Videos</h1>
                {loading && !isModalOpen && <h1 className='text-center text-lg text-zinc-800 font-bold mt-5'>Loading...</h1>}
              {!loading &&  <div className='border-t-2 border-zinc-400 mt-2 w-full h-[600px] px-4 pt-8 pb-[200px] flex flex-wrap overflow-y-scroll'>
                    {photosList.map((e, i) => <div className='w-[280px] h-[250px] flex justify-center items-center'><img src={e.image[0]} key={i} onClick={() => showPic(i)} className='w-[200px] rounded-sm h-[200px] cursor-pointer' alt="" /></div>)}

                </div>}
                {isModalOpen && (
                    <dialog open className="fixed inset-0 z-50 flex justify-center w-[100%] h-[100%] items-center bg-black bg-opacity-50">
                        {photosList.length > 1 &&
                            <button ref={prevRef} className="prev text-white text[30px] h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 left-2" onClick={previousPic}><FontAwesomeIcon icon={faAngleLeft} /></button>}
                        <div ref={dialogRef} className="bg-white rounded-md p-4 flex space-x-4">
                            <div className="image w-[60%] overflow-hidden">
                                <Carousel images={images} />
                            </div>
                            <div className="comment ">
                                <h1 className="text-lg font-bold text-center text-black">Comments</h1>
                                <div className="overflow-y-auto max-h-[400px]">
                                    {comments.map((comment, index) => (
                                        <p key={index} className="my-2 border-b pb-2 text-black">{comment.content}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-white text-xl">✖</button>
                        {photosList.length > 1 &&
                            <button ref={nextRef} className="next text-white text[30px] h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 right-2" onClick={nextPic}><FontAwesomeIcon icon={faAngleRight} /></button>}
                    </dialog>
                )}

            </div>
        </div>
    )
}

export default Photos