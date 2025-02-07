import defaultProfile from "../../../assets/0d64989794b1a4c9d89bff571d3d5842-modified.png";
const BusinessTopBar = ({ loggedInUser, windowWidth, businessProfile }) => {
  return (
    <div className="bg-white z-10 sticky top-0 w-full h-[70px] px-4 flex justify-between items-center">
      <h1
        onClick={() => window.location.reload()}
        className="logoHead cursor-pointer text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600"
      >
        Renokon Business
      </h1>
      <div className="flex items-center justify-center ">
        <a href="mailto:0CtZ8@example.com">
          <button className="text-white hover:opacity-90 transition duration-200 bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 rounded-full px-4 py-2">Contact us</button>
        </a>
        <img
          src={businessProfile?.logo || loggedInUser?.profilePic || defaultProfile}
          // onClick={() => setOpenProfileDropdown(!openProfileDropdown)}
          className={`${windowWidth > 450 ? "w-[40px] h-[40px]" : "w-[33px] h-[33px]"} object-cover ml-6 mb-1 cursor-pointer rounded-full`}
          alt=""
        />
      </div>
    </div>
  );
};

export default BusinessTopBar;
