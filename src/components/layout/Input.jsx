import React, { useState, useEffect } from "react";

const Input = React.forwardRef(({ placeholder, inputError = "", value = "", maxLength, type = "text", paddingRight = "70px", onChange, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputId = `input-${Math.random().toString(36).substring(2, 9)}`;
  useEffect(() => {
    setHasValue(value !== "");
  }, [value]);

  return (
    <div className="input-container mb-2 relative">
      <label
        htmlFor={inputId}
        className={`absolute cursor-pointer left-2 transition-all duration-200 ${isFocused ? "text-blue-700 text-xs top-[6px]" : "top-[16px] text-gray-500 text-sm"} ${
          hasValue && !isFocused && "top-[6px] text-xs text-gray-500"
        } `}
      >
        {placeholder}
      </label>
      <input
        id={inputId}
        ref={ref}
        {...props}
        maxLength={maxLength}
        style={{ paddingRight: paddingRight }}
        value={value}
        className={`inputField my-1 h-11 pt-3 px-[8px] focus:outline-blue-700 ${inputError.length > 0 ? "border-[1px] border-red-500" : "border-[1px] border-zinc-300"} `}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(e.target.value !== "");
        }}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
          setHasValue(e.target.value !== "" ? true : false);
        }}
        type={type}
      />
      <p className="inputError flex justify-start">{inputError}</p>
    </div>
  );
});

export default Input;
