import { useEffect, useRef } from "react";

const useUnmounted = (callback: () => void) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (callbackRef.current) callbackRef.current();
    };
  }, []);
};

export default useUnmounted;
