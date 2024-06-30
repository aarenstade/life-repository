import { useEffect, useState } from "react";

function useOutsideAlerter(ref: any) {
  const [outside, setOutside] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOutside(true);
      } else {
        setOutside(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return { outside };
}

export default useOutsideAlerter;
