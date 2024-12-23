import React, {useRef, useEffect} from 'react'
import userProfilePicStore from '../../lib/userProfilePicStore'
import './../../styles/About.css';
import { axiosInstance } from '../../lib/axios';

const About = () => {
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
  const user = userProfilePicStore((state) => state.user);
  const setUser = userProfilePicStore((state) => state.setUser);

  const editProfile = userProfilePicStore((state)=> state.editProfile);
  const setEditProfile = userProfilePicStore((state)=> state.setEditProfile);
  useEffect(()=> {
    if(editProfile){
      nameRef.current.focus();
    }
    if(editProfile === "clicked"){
      console.log("Started...")
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
        exp: expRef.current.value
      }
      // console.log(obj)
      async function updateUser(){
        try{
          const response = await axiosInstance.put("/user/updateUser", obj);
          const updateUserNameOfPost = await axiosInstance.put("/post/updateUserNameOfPost", {
            name: nameRef.current.value
          })
          // console.log(response.data);
          // console.log(updateUserNameOfPost.data);
          setUser(response.data);
          setEditProfile(false);
        }
        catch(error){
          console.log(error)
        }
      }
      updateUser();
    }
  },[editProfile])
  return (
    <div className='about w-[600px] rounded-lg flex justify-center mt-4'>
      <div className="w-[600px] p-6">
        <h1 className='text-2xl text-black font-bold text-center'>Details</h1>
        <div className='fields border-t-2 border-zinc-300 pt-4'>
          <div className="username flex justify-between"><p className='questions'>Name</p> {editProfile ? <input type="text" ref={nameRef} defaultValue={user.name} className="inputs" /> : <p className='answers'>{user.name}</p>} </div>
          <div className="username flex justify-between"><p className='questions'>Intro Line</p> {editProfile ? <input type="text" ref={headlineRef} defaultValue={user.headline} className="inputs" /> : <p className='answers'>{user.headline}</p>} </div>
          <div className="useremail flex justify-between"><p className='questions'>Email</p>{editProfile ? <input type="text" ref={emailRef} defaultValue={user.email} className="inputs" /> : <p className='answers'>{user.email}</p>}</div>
          <div className="mobile flex justify-between"><p className='questions'>Mobile</p> {editProfile ? <input type="text" ref={mobileRef} defaultValue={user.mobile} className="inputs" /> : <p className='answers'>{user.mobile}</p>}</div>
          <div className="dob flex justify-between"><p className='questions'>Date Of Birth</p> {editProfile ? <input type="date" ref={dobRef} defaultValue={user.dateOfBirth} className="inputs" /> : <p className='answers'>{user.dateOfBirth}</p>}</div>
          <div className="city flex justify-between"><p className='questions'>City</p>{editProfile ? <input type="text" ref={cityRef} defaultValue={user.city && user.city} className="inputs" /> : <p className='answers'>{user.city && user.city}</p>}</div>
          <div className="skills flex justify-between"><p className='questions'>Skills</p>{editProfile ? <input type="text" ref={skillsRef} defaultValue={user.skills} className="inputs" /> : <p className='answers'>{user.skills}</p>}</div>
          <div className="school flex justify-between"><p className='questions'>School</p>{editProfile ? <input type="text" ref={schoolRef} defaultValue={user.school} className="inputs" /> : <p className='answers'>{user.school}</p>}</div>
          <div className="college flex justify-between"><p className='questions'>College</p>{editProfile ? <input type="text" ref={collegeRef} defaultValue={user.college} className="inputs" /> : <p className='answers'>{user.college}</p>}</div>
          <div className="college flex justify-between"><p className='questions'>Current job</p>{editProfile ? <input type="text" ref={jobRef} defaultValue={user.job} className="inputs" /> : <p className='answers'>{user.job}</p>}</div>
          <div className="college flex justify-between"><p className='questions'>Experience</p>{editProfile ? <input type="text" ref={expRef} defaultValue={user.exp} className="inputs" /> : <p className='answers'>{user.exp}</p>}</div>
          {/* <div className="relationship flex justify-between"><p>Relationship status</p> <p>{user.relationship && user.relationship}</p></div> */}

        </div>
        {/* <div className="fieldAnswers">

         </div> */}
      </div>
    </div>
  )
}

export default About
