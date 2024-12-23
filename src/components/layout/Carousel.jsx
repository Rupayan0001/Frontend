import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
const Carousel = ({ images }) => {
    const [ind, setInd] = useState(0);
    function previousPic() {
        if (ind === 0) {
            setInd(images.length - 1);
        } else {
            setInd(ind - 1)
        }
    }

    function nextPic() {
        if (ind === images.length - 1) {
            setInd(0);
        }
        else {
            setInd(ind + 1);
        }
    }


    return (
        <div className="flex relative">
            {images.length > 0 && <>
                {images.length > 1 &&
                    <button className="prev text-white text[30px] h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 left-2" onClick={previousPic}><FontAwesomeIcon icon={faAngleLeft} /></button>}
                <img src={images[ind]} className="max-h-[500px] rounded-2xl object-cover" alt="" />
              {images.length > 1 && <button className="next text-white text[30px] h-[30px] w-[30px] hover:bg-zinc-900 transition duration-100 bg-zinc-700 rounded-full absolute top-1/2 right-2" onClick={nextPic}><FontAwesomeIcon icon={faAngleRight} /></button> }
             {images.length > 1 && <div className='absolute bottom-2 flex justify-center w-full' ><div className="dots flex justify-center">{images.map((e, i) => <p key={i} className={`h-[6px] w-[6px] rounded-full mx-1 ${ind === i ? "bg-white" : "bg-zinc-500"} `}></p>)}</div> </div>}
            </>} </div>
    );
};

export default Carousel;