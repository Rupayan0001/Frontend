import React, { useEffect, useState, useRef } from "react";
import Topbar from "../components/layout/Topbar";
import "./../styles/HomePage.css";
import { axiosInstance } from "../lib/axios";
import globalState from "../lib/globalState.js";
import postTimeLogic from "../lib/Post_Time_Logic.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import post_uploaded from "../../src/assets/notification_sound/post_uploaded.mp3";
import { faXmark, faArrowLeft, faPlus, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faTwitter, faWhatsapp, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";
import delete_notification from "../assets/notification_sound/delete_notification.wav";
import Logout from "../components/layout/Logout.jsx";
import Confirmation from "../components/layout/Confirmation.jsx";
import Notify from "../components/layout/Notify.jsx";

import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent } from "../components/layout/ui/Card.jsx";
import { Button } from "../components/layout/ui/Button.jsx";
import { Avatar } from "../components/layout/ui/Avatar.jsx";
import { Bell, Settings, Filter, Calendar, Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PiechartComponent from "../components/layout/PiechartComponent.jsx";
import BarChartComponent from "../components/layout/BarChartComponent.jsx";
import AdPerformanceChart from "../components/layout/AdPerformanceChart.jsx";
import BusinessTopBar from "../components/layout/business/topBar.jsx";

const barData = [
  { name: "Jan", Clicks: 4000, Impressions: 2400, Revenue: 2400 },
  { name: "Feb", Clicks: 3000, Impressions: 1398, Revenue: 2210 },
  { name: "Mar", Clicks: 2000, Impressions: 9800, Revenue: 2290 },
];

const pieData = [
  { name: "Mobile", value: 60 },
  { name: "Desktop", value: 30 },
  { name: "Tablet", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function AdsAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setOpenProfileDropdown = globalState((state) => state.setOpenProfileDropdown);
  const topBarRightProfilePicRefState = globalState((state) => state.topBarRightProfilePicRefState);
  const notify = globalState((state) => state.notify);
  const setNotify = globalState((state) => state.setNotify);
  const loggedInUser = globalState((state) => state.loggedInUser);
  const setLoggedInUser = globalState((state) => state.setLoggedInUser);
  const logOut = globalState((state) => state.logOut);
  const closeModal = globalState((state) => state.closeModal);
  const setCloseModal = globalState((state) => state.setCloseModal);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const socketHolder = globalState((state) => state.socketHolder);
  const connectSocket = globalState((state) => state.connectSocket);
  const setClickedLogOut = globalState((state) => state.setClickedLogOut);
  const clickedLogOut = globalState((state) => state.clickedLogOut);
  const setLogOut = globalState((state) => state.setLogOut);
  const setNotifyClicked = globalState((state) => state.setNotifyClicked);
  const addNotification = globalState((state) => state.addNotification);
  const setIsLoggedOut = globalState((state) => state.setIsLoggedOut);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [noProfile, setNoProfile] = useState(null);
  const [seletedSection, setSeletedSection] = useState("ads");

  const notifyTimer = useRef();
  const profileDropdownRef = useRef();
  const postUploadedSoundRef = useRef();
  const deleteSoundRef = useRef();

  useEffect(() => {
    response();
    getBusinessProfile();
    return () => {};
  }, []);
  const response = async () => {
    let result = null;
    try {
      result = await axiosInstance.get(`/user/getLoggedInuser`);
      setLoggedInUser(result.data.user);
    } catch (err) {
      if (!result.data.user) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (loggedInUser && businessProfile) {
      setLoading(false);
    }
  }, [loggedInUser, businessProfile]);

  const getBusinessProfile = async () => {
    try {
      const response = await axiosInstance.get(`/business/getProfile`);
      if (response.data.success) {
        setBusinessProfile(response.data.businessProfile);
        console.log("business: ", response.data.businessProfile);
      } else if (response.data.noProfile) {
        setNoProfile(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    function resize() {
      const width = window.innerWidth;
      setWindowWidth(width);
    }
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (notifyTimer.current) {
        clearTimeout(notifyTimer.current);
        setNotify(null);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !topBarRightProfilePicRefState.contains(e.target)) {
        setOpenProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [topBarRightProfilePicRefState]);

  useEffect(() => {
    if (noProfile) {
      navigate("/business-landing");
    }
  }, [noProfile]);
  useEffect(() => {
    socketData();
    function socketData() {
      if (!loggedInUser) return;
      if (!socketHolder) {
        connectSocket();
        return;
      }
    }
    const socket = socketHolder;

    if (socket) {
      //   socket.onmessage = handleMessage;
    }
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socketHolder, connectSocket, loggedInUser]);

  //    resize habdler

  // click outside handler
  useEffect(() => {
    function handleClickOutside(e) {}
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setNotify(null);
    };
  }, []);

  async function logout() {
    if (notifyTimer.current) {
      clearTimeout(notifyTimer.current);
      setNotify(null);
    }
    setClickedLogOut(null);
    setLogOut(true);
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.data.message === "Logged out successfully") {
        setIsLoggedOut(true);
        notifyTimer.current = setTimeout(() => {
          setLogOut(null);
          navigate("/login");
        }, 1000);
      } else {
        throw Error;
      }
    } catch (error) {
      setLogOut(null);
      setNotify("Failed to logout, please try again");
      notifyTimer.current = setTimeout(() => {
        setNotify(null);
      }, 5 * 1000);
    }
  }

  if (loading || !loggedInUser) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="spinOnButton h-[30px] w-[30px]"></p>
      </div>
    );
  }

  return (
    <div className="h-full inter relative bg-gray-50 overflow-hidden">
      {notify && windowWidth > 450 && <Notify page="Home" reference={notifyTimer} width={windowWidth} notify={notify} />}
      {notify && windowWidth <= 450 && (
        <div className="absolute w-[100%] bottom-10 flex justify-center">
          <Notify page="Home" reference={notifyTimer} width={windowWidth} notify={notify} />
        </div>
      )}
      {clickedLogOut && (
        <Confirmation width={windowWidth} cancel={setClickedLogOut} proceed={logout} ConfirmText={`${loggedInUser.name.split(" ")[0]}, are you sure you want to log out?`} />
      )}
      {logOut && <Logout width={windowWidth} />}
      <audio ref={postUploadedSoundRef} preload="auto" className="hidden" src={post_uploaded} />
      <audio src={delete_notification} preload="auto" ref={deleteSoundRef} className="hidden" />

      <BusinessTopBar loggedInUser={loggedInUser} businessProfile={businessProfile} windowWidth={windowWidth} />
      <div className="flex h-[calc(100vh-70px)]">
        <aside className="w-[20vw] h-[100%] overflow-y-auto sticky top-0 scrollbar scrollbar-thin bg-white shadow-md p-4">
          <button
            onClick={() => navigate("/create-advertisement")}
            className="text-lg font-bold w-full h-[42px] mb-2 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white hover:opacity-90 rounded-md flex items-center justify-center"
          >
            Create Ads <FontAwesomeIcon icon={faPlus} className="ml-2" />{" "}
          </button>
          <ul>
            <li onClick={() => setSeletedSection("Campaigns")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Campaigns
            </li>
            <li onClick={() => setSeletedSection("Sponsored Contests")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Sponsored Contests
            </li>
            <li onClick={() => setSeletedSection("Customer Support Inbox")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Customer Support Inbox
            </li>
            <li onClick={() => setSeletedSection("Billing")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Billing
            </li>
            <li onClick={() => setSeletedSection("")} className="p-2 text-lg                    cursor-pointer font-bold">
              Ecommerce
            </li>
            <li onClick={() => setSeletedSection("Sales")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Sales
            </li>
            <li onClick={() => setSeletedSection("Products")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Products
            </li>
            <li onClick={() => setSeletedSection("Orders")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Orders
            </li>
            <li onClick={() => setSeletedSection("Reviews")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Reviews
            </li>
            <li onClick={() => setSeletedSection("Payments")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Payments
            </li>
            <li onClick={() => setSeletedSection("")} className="p-2 text-lg                    cursor-pointer font-bold">
              Creators
            </li>
            <li onClick={() => setSeletedSection("Brands Promotion")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Brands Promotion
            </li>
            <li onClick={() => setSeletedSection("Channel Analytics")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Channel Analytics
            </li>
            <li onClick={() => setSeletedSection("")} className="p-2 text-lg                    cursor-pointer font-bold">
              Renokon
            </li>
            <li onClick={() => setSeletedSection("Renokon Support")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Renokon Support
            </li>
            <li onClick={() => setSeletedSection("Renokon Overview")} className="p-2 text-lg hover:bg-slate-200 cursor-pointer">
              Renokon Overview
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Cards */}
          <h1 className="cursor-pointer text-2xl mb-4 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600">
            Renokon Business
          </h1>
          <div className="grid grid-cols-3 gap-6 ">
            <Card>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="">
                    <h3 className="text-md font-semibold">Total Sales Generated</h3>
                    <p className="text-2xl font-bold">$325 Million+</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-white w-[80px] h-[40px] flex justify-center items-center font-semibold rounded-full">
                    <p>
                      + 75% <FontAwesomeIcon icon={faCaretUp} className="text-green-700" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="">
                    <h3 className="text-md font-semibold">User Base</h3>
                    <p className="text-2xl font-bold">50 Million+ Worldwide</p>
                  </div>
                  {/* <div className="bg-gradient-to-r from-green-400 to-white font-semibold rounded-full">
                    <p>
                      + 75% <FontAwesomeIcon icon={faCaretUp} className="text-green-700" />
                    </p>
                  </div> */}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="">
                    <h3 className="text-md font-semibold">Users Spent</h3>
                    <p className="text-2xl font-bold">200 Million+ Minutes</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-400 to-white w-[80px] h-[40px] flex justify-center items-center font-semibold rounded-full">
                    <p>
                      + 37% <FontAwesomeIcon icon={faCaretUp} className="text-green-700" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <BarChartComponent />
            <PiechartComponent />
          </div>
          <AdPerformanceChart />
        </main>
        {/* {seletedSection === "CreateAds" && <CreateAd />} */}
      </div>
    </div>
  );
}

// const AdsPage = () => {

//   return (
//     <>
//

//       <div className={`parent inter flex flex-col w-full ${windowWidth > 550 ? "bg-zinc-100 bg-opacity-60" : "bg-zinc-300"} `}>
//
//         <div className="relative">
//           <div className="bg-white w-full h-[70px] px-4 flex justify-between items-center">
//             <h1
//               onClick={() => window.location.reload()}
//               className="logoHead cursor-pointer text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
//             >
//               Renokon Business
//             </h1>
//             <div className="flex items-center justify-center ">
//               {/* <Link to="/create-business-account">
//                 <button className="text-white hover:opacity-90 transition duration-200 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-full px-4 py-2">
//                   Create account
//                 </button>
//               </Link> */}
//               <img
//                 src={loggedInUser?.profilePic}
//                 // onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
//                 className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"} object-cover ml-6 mb-1 cursor-pointer rounded-full`}
//                 alt=""
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdsPage;
