import { LegacyRef, RefObject, useEffect } from "react";

function useOutsideClickHandler(ref: RefObject<HTMLInputElement>, onClickOutside: Function) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // @ts-ignore
      if (ref?.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClickHandler