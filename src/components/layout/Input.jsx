import React from 'react'


const Input = React.forwardRef(({ placeholder, inputError, maxLength, type = "text", paddingRight = "70px", ...props }, ref) => {
 
  return (
    <div className='input-container'>
      <input ref={ref} {...props} maxLength={maxLength} style={{ paddingRight: paddingRight }} className={`inputField ${inputError.length > 0 ? "border-[1px] border-red-500" : "border-[1px] border-zinc-300"} `} placeholder={placeholder} type={type} />
      <p className='inputError'>{inputError}</p>

    </div>
  )
});

export default Input;