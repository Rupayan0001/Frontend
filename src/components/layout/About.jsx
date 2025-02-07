import React, { useRef, useEffect } from "react";
import globalState from "../../lib/globalState";
import "./../../styles/About.css";
import { axiosInstance } from "../../lib/axios";

const About = ({ width }) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const mobileRef = useRef();
  const dobRef = useRef();
  const cityRef = useRef();
  const schoolRef = useRef();
  const skillsRef = useRef();
  const collegeRef = useRef();
  const jobRef = useRef();
  const expRef = useRef();
  const headlineRef = useRef();
  const notifyTimer = useRef();
  const user = globalState((state) => state.user);
  const setUser = globalState((state) => state.setUser);
  const setNotify = globalState((state) => state.setNotify);

  const editProfile = globalState((state) => state.editProfile);
  const setEditProfile = globalState((state) => state.setEditProfile);
  useEffect(() => {
    if (editProfile) {
      nameRef.current.focus();
    }
    if (editProfile === "clicked") {
      const formatDate = dobRef.current.value.split("-").reverse().join("-").toString();
      const obj = {
        name: nameRef.current.value,
        headline: headlineRef.current.value,
        email: emailRef.current.value,
        mobile: mobileRef.current.value,
        dateOfBirth: formatDate,
        city: cityRef.current.value,
        school: schoolRef.current.value,
        skills: skillsRef.current.value,
        college: collegeRef.current.value,
        job: jobRef.current.value,
        exp: expRef.current.value,
      };
      async function updateUser() {
        try {
          const response = await axiosInstance.put("/user/updateUser", obj);
          const updateUserNameOfPost = await axiosInstance.put("/post/updateUserNameOfPost", {
            name: nameRef.current.value,
          });
          setUser(response.data);
          setEditProfile(false);
        } catch (error) {
          setNotify(`Failed to update profile, Please try again later`);
          notifyTimer.current = setTimeout(() => {
            setNotify(null);
          }, 5 * 1000);
        }
      }
      updateUser();
    }
  }, [editProfile]);
  return (
    <div
      className={`about inter ${width >= 1280 && "w-[550px] mt-2"} ${width >= 550 && width < 1280 && " w-[520px] mt-2"} ${
        width < 550 && " w-[98.5vw] mt-1"
      } rounded-lg flex justify-center `}
    >
      <div className={` ${width >= 1280 && "w-[550px]"} ${width >= 550 && width < 1280 && " w-[520px] "} ${width < 550 && " w-[98.5vw]"} px-6 pb-6 pt-4`}>
        <div className="fields">
          <div className={`username ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Name</p>{" "}
            {editProfile ? (
              <input type="text" ref={nameRef} defaultValue={user.name} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 opacity-85 text-black ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.name}
              </p>
            )}{" "}
          </div>
          <div className={`username ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Intro Line</p>{" "}
            {editProfile ? (
              <input type="text" ref={headlineRef} defaultValue={user.headline} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.headline}
              </p>
            )}{" "}
          </div>
          <div className={`useremail ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Email</p>
            {editProfile ? (
              <input type="text" ref={emailRef} defaultValue={user.email} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.email}
              </p>
            )}
          </div>
          {/* <div className="flex items-center ">
            <p className="text-xl">Keep my email private</p> <input className="ml-4 text-[16px]" type="checkbox" name="" id="" />
          </div> */}
          <div className={`mobile ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Mobile</p>{" "}
            {editProfile ? (
              <input type="text" ref={mobileRef} defaultValue={user.mobile} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.mobile}
              </p>
            )}
          </div>
          {/* <div>
            Keep my mobile no private <input type="checkbox" name="" id="" />
          </div> */}
          <div className={`dob ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Date Of Birth</p>{" "}
            {editProfile ? (
              <input type="date" ref={dobRef} defaultValue={user.dateOfBirth} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.dateOfBirth}
              </p>
            )}
          </div>
          <div className={`city ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>City</p>
            {editProfile ? (
              <input type="text" ref={cityRef} defaultValue={user.city && user.city} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.city && user.city}
              </p>
            )}
          </div>
          <div className={`skills ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Skills</p>
            {editProfile ? (
              <input type="text" ref={skillsRef} defaultValue={user.skills} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.skills}
              </p>
            )}
          </div>
          <div className={`school ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>School</p>
            {editProfile ? (
              <input type="text" ref={schoolRef} defaultValue={user.school} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.school}
              </p>
            )}
          </div>
          <div className={`college ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>College</p>
            {editProfile ? (
              <input type="text" ref={collegeRef} defaultValue={user.college} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.college}
              </p>
            )}
          </div>
          <div className={`college ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Current job</p>
            {editProfile ? (
              <input type="text" ref={jobRef} defaultValue={user.job} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.job}
              </p>
            )}
          </div>
          <div className={`college ${width > 540 && "flex justify-between"}`}>
            <p className={`questions ${width > 540 ? "text-black bg-zinc-100 w-[200px]" : "mb-2"}`}>Experience</p>
            {editProfile ? (
              <input type="text" ref={expRef} defaultValue={user.exp} className={`inputs ${width <= 540 ? "w-full" : "w-[240px]"} `} />
            ) : (
              <p
                className={`answers bg-gradient-to-r from-zinc-300 via-slate-200 to-slate-200 text-black opacity-85 ${
                  width > 540 ? " w-[240px] p-[10px]" : "w-full px-2 h-[42px] flex items-center "
                }`}
              >
                {user.exp}
              </p>
            )}
          </div>
          {/* <div className="relationship flex justify-between"><p>Relationship status</p> <p>{user.relationship && user.relationship}</p></div> */}
        </div>
        {/* <div className="fieldAnswers">

         </div> */}
      </div>
    </div>
  );
};

export default About;
