import React from "react";

const Logout = () => {
  return (
    <dialog className="fixed inset-0 z-50 h-[100%] w-[100%]  flex justify-center items-center bg-black bg-opacity-80">
      <div className="h-[150px] w-[300px] rounded-xl flex flex-col justify-center items-center text-[20px]">
        <p className="spinOnButton mb-4 h-[30px] w-[30px]"></p>
      </div>
    </dialog>
  );
};

export default Logout;
