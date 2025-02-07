import { useEffect, useRef } from "react";

const usePrev = (value) => {
  const previousValue = useRef(value);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return previousValue.current;
};

export default usePrev;
