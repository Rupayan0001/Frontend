import React, { useState, useRef, useEffect } from 'react'
import "./../../styles/Topbar.css"
import logo from "./../../assets/U.png"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userProfilePicStore from '../../lib/userProfilePicStore.js';
import newPostStore from '../../lib/NewPost.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faHouse, faMessage, faStore, faGamepad, faCircleChevronDown, faVideo, faBars, faBell, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import defaultProfilePic from "./../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
const Topbar = ({ page = "Home" }) => {
    // const [selected, setSelected] = useState("Home");
    const selected = newPostStore((state) => state.selected);
    const setSelected = newPostStore((state) => state.setSelected);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);
    const [isHovered4, setIsHovered4] = useState(false);
    const [isHovered5, setIsHovered5] = useState(false);
    const openProfileDropdown = userProfilePicStore((state) => state.openProfileDropdown);
    const setOpenProfileDropdown = userProfilePicStore((state) => state.setOpenProfileDropdown);
    const topBarRightProfilePicRefState = userProfilePicStore((state) => state.topBarRightProfilePicRefState);
    const setTopBarRightProfilePicRefState = userProfilePicStore((state) => state.setTopBarRightProfilePicRefState);
    const loggedInUser = userProfilePicStore((state) => state.loggedInUser);
    const setLoggedInUser = userProfilePicStore((state) => state.setLoggedInUser);
    const openSearch = userProfilePicStore((state) => state.openSearch);
    const setOpenSearch = userProfilePicStore((state) => state.setOpenSearch);
    const topBarsearch = userProfilePicStore((state) => state.topBarsearch);
    const setTopBarsearch = userProfilePicStore((state) => state.setTopBarsearch);
    const [windowSm, setWindowSm] = useState(window.innerWidth < 768);
    const [below500, setBelow500] = useState(window.innerWidth < 500);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // const [openProfileDropdown, setOpenProfileDropdown] = useState(false);
    // const user = userProfilePicStore((state) => state.user)
    const setSelectedTab = userProfilePicStore((state) => state.setSelected);
    const topBarRightProfilePicRef = useRef();
    const topBarsearchRef = useRef();

    // console.log("Topbar: ", loggedInUser)

    // const navigate = useNavigate();

    // function handleSelectedOnHome(){
    //     setSelected("Home");
    //     setSelectedTab("Home");
    // }
    // console.log("Topbar: ", loggedInUser)

    useEffect(() => {
        function resize() {
            const width = window.innerWidth;
            setWindowWidth(width);
            if (width < 768) {
                // alert("true")
                setWindowSm(true);
            }
            if (width > 768) {
                setWindowSm(false);
            }
            if (width < 500) {
                setBelow500(true)
            }
            if (width > 500) {
                setBelow500(false)
            }
        }
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        }
    }, [])

    useEffect(() => {
        setTopBarsearch(topBarsearchRef);
    }, [])
    useEffect(() => {
        setTopBarRightProfilePicRefState(topBarRightProfilePicRef.current);

    }, [setTopBarRightProfilePicRefState]);

    // useEffect(()=> {
    //     if(page === "Messages")
    // }, [page])


    function handleClickOnHome() {
        setSelected("Home");
        setSelectedTab("Posts");
    }

    return (
        <div >
            <div className={`topbar  ${windowWidth > 450 ? "h-[65px]" : "h-[50px]"} `}>
                <div className="topBox ">
                    <div className=" flex  items-center">
                        <Link to="/home">
                            <p className="logo">
                                <img src={logo} onClick={() => setSelectedTab("Posts")} className={windowWidth > 450 ? "w-[50px]" : "w-[40px]"} alt="" />
                            </p>
                        </Link>
                        {/* {console.log("openSearch: ", openSearch , topBarsearchRef.current)} ref={topBarsearchRef} onClick={() => setOpenSearch(true)} */}
                        {page === "Messages" && <p className="search lg:w-[15vw] sm:w-[20vw] block sm:block md:hidden lg:block opacity-0 relative " >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon absolute top-3 left-3' />
                        </p>}
                        {!below500 && page !== "Messages" && <p className="search lg:w-[15vw] w-[30vw] block sm:block md:hidden lg:block relative cursor-pointer" ref={topBarsearchRef} onClick={() => setOpenSearch(true)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon absolute top-3 left-3' />
                        </p>}
                        {page !== "Messages" && <p className="hidden md:block lg:hidden  relative cursor-pointer" ref={topBarsearchRef} onClick={() => setOpenSearch(true)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon absolute top-[-8px] left-[15px]' />
                        </p>}
                        {below500 && page !== "Messages" && <p className="block relative cursor-pointer" ref={topBarsearchRef} onClick={() => setOpenSearch(true)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon absolute top-[-8px] left-[15px]' />
                        </p>}
                    </div>
                    {!windowSm && <div className="middle ">
                        <div className="middlebox ml-[100px] mr-[40px] md:mr-0 md:w-[42vw] lg:w-[34vw]">
                            <Link to="/home">
                                <div className={`text-[20px] md:text-[25px] px-[25px]  py-[8px] ${selected === "Home" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600"}`} onClick={handleClickOnHome} onMouseEnter={() => setIsHovered1(true)} onMouseLeave={() => setIsHovered1(false)}><FontAwesomeIcon icon={faHouse} />
                                    {/* <h3 >Home</h3> */}
                                    {/* className={isHovered1 ? "opacity-100 transition-opacity duration-500  " : "transition-opacity duration-300 opacity-0"} */}
                                </div>
                            </Link>
                            <Link to="/message">
                                <div className={`text-[20px] md:text-[25px]  px-[25px] py-[8px] ${selected === "Messages" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600"}`} onClick={() => setSelected("Messages")} onMouseEnter={() => setIsHovered2(true)} onMouseLeave={() => setIsHovered2(false)}><FontAwesomeIcon icon={faMessage} />
                                    {/* <h3 className={isHovered2 ? "block" : "hidden"}>Messages</h3> */}
                                </div>
                            </Link>

                            <div className={`text-[20px] md:text-[25px]  px-[25px] py-[8px] ${selected === "Shop" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600"}`} onClick={() => setSelected("Shop")} onMouseEnter={() => setIsHovered3(true)} onMouseLeave={() => setIsHovered3(false)}><FontAwesomeIcon icon={faStore} />
                                {/* <h3 className={isHovered3 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Shop</h3> */}
                            </div>
                            {/* <div><FontAwesomeIcon icon={faVideo} />
                            <h3>Video Call</h3>
                        </div> */}
                            <div className={`text-[20px] md:text-[25px] px-[25px] py-[8px] ${selected === "Games" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600"}`} onClick={() => setSelected("Games")} onMouseEnter={() => setIsHovered4(true)} onMouseLeave={() => setIsHovered4(false)}><FontAwesomeIcon icon={faGamepad} />
                                {/* <h3 className={isHovered4 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Games</h3> */}
                            </div>
                        </div>
                    </div>}
                    <div className="right ">
                        <p className={`dropdown ${windowWidth > 450 ? "h-[41px] w-[41px] text-[25px]" : "h-[35px] w-[35px] text-[23px]"} ml-4 hover:bg-zinc-600 rounded-full cursor-pointer`}><FontAwesomeIcon icon={faCircleChevronDown} /></p>
                        <div className={`notification ${windowWidth > 450 ? "h-[40px] w-[40px] text-[22px] " : "h-[34px] w-[34px] text-[20px] "} ml-4`} onMouseEnter={() => setIsHovered5(true)} onMouseLeave={() => setIsHovered5(false)}><FontAwesomeIcon className='notificationIcon ' icon={faBell} />
                            {/* <h3 className={` ${isHovered5 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"} `} >Notification</h3><h3 className={isHovered5 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Notifications</h3> */}
                        </div>
                        <div ref={topBarRightProfilePicRef} className="userLogo ml-4">
                            {/* <Link to="/myProfile"><img src={user.profilePic} className='topbarRightProfilePic transition duration-400 w-[40px] h-[40px] cursor-pointer rounded-full' alt="" /></Link> */}
                            <img src={loggedInUser.profilePic} onClick={() => setOpenProfileDropdown(!openProfileDropdown)} className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"}  mb-1 cursor-pointer rounded-full`} alt="" />

                        </div>
                    </div>
                </div>

            </div>
            {windowSm && <div>
                <div className="middle pb-2 md:hidden bg-white">
                    <div className={`middlebox ${windowWidth > 600 ? "w-[65vw]" : "w-[100vw]"} `}>
                        <Link to="/home">
                            <div className={` ${windowWidth > 450 ? "text-[25px]" : "text-[22px]"} ml-2 px-[25px] py-[8px] ${selected === "Home" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600 border-b-2 border-transparent"}`} onClick={handleClickOnHome} onMouseEnter={() => setIsHovered1(true)} onMouseLeave={() => setIsHovered1(false)}><FontAwesomeIcon icon={faHouse} />
                                {/* <h3 >Home</h3> */}
                                {/* className={isHovered1 ? "opacity-100 transition-opacity duration-500  " : "transition-opacity duration-300 opacity-0"} */}
                            </div>
                        </Link>
                        <Link to="/message">
                            <div className={`${windowWidth > 450 ? "text-[25px]" : "text-[22px]"} px-[25px] py-[8px] ${selected === "Messages" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"}`} onClick={() => setSelected("Messages")} onMouseEnter={() => setIsHovered2(true)} onMouseLeave={() => setIsHovered2(false)}><FontAwesomeIcon icon={faMessage} />
                                {/* <h3 className={isHovered2 ? "block" : "hidden"}>Messages</h3> */}
                            </div>
                        </Link>

                        <div className={`${windowWidth > 450 ? "text-[25px]" : "text-[22px]"}  px-[25px] py-[8px] ${selected === "Shop" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"}`} onClick={() => setSelected("Shop")} onMouseEnter={() => setIsHovered3(true)} onMouseLeave={() => setIsHovered3(false)}><FontAwesomeIcon icon={faStore} />
                            {/* <h3 className={isHovered3 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Shop</h3> */}
                        </div>
                        {/* <div><FontAwesomeIcon icon={faVideo} />
                            <h3>Video Call</h3>
                        </div> */}
                        <div className={`${windowWidth > 450 ? "text-[25px]" : "text-[22px]"} px-[25px] py-[8px] ${selected === "Games" ? "text-[#6A0DAD] border-b-2 border-blue-600" : "text-zinc-600  border-b-2 border-transparent"}`} onClick={() => setSelected("Games")} onMouseEnter={() => setIsHovered4(true)} onMouseLeave={() => setIsHovered4(false)}><FontAwesomeIcon icon={faGamepad} />
                            {/* <h3 className={isHovered4 ? "opacity-100 transition-opacity duration-500" : "transition-opacity duration-300 opacity-0"}>Games</h3> */}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
{/* <i class="fa-solid faCircleChevronDown"></i> */ }

export default Topbar
