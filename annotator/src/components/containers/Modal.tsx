import { FC, useEffect, useRef } from "react";
import useOutsideAlerter from "../../hooks/dom/useOutsideClick";
import classNames from "classnames";
import React from "react";

type ModalProps = {
  open: boolean;
  wide?: boolean;
  medium?: boolean;
  noScroll?: boolean;
  children: React.ReactNode;
  topLevel?: boolean;
  onCloseOutsideClick?: () => void;
};

const Modal: FC<ModalProps> = ({ open, wide, medium, onCloseOutsideClick, noScroll, topLevel, children }) => {
  const ref = useRef(null);
  const outside = useOutsideAlerter(ref);

  useEffect(() => {
    if (outside.outside && onCloseOutsideClick) onCloseOutsideClick();
  }, [outside]);

  return (
    <div className='relative'>
      {open && (
        <div
          className={classNames({
            "fixed left-0 w-full h-full bg-black/40 backdrop-blur-sm": true,
            "top-[var(--controlbar-height)]": true,
            "z-[500]": !topLevel,
            "z-[1000]": topLevel,
          })}
        >
          <div className='flex flex-col justify-center items-center mt-[1.5rem] md:mt-[3rem]'>
            <div
              ref={ref}
              className={classNames({
                "p-3 bg-gray-100/100 relative shadow-md": true,
                "overflow-y-scroll": !noScroll,
                "md:w-[40%] w-[90%] max-h-[calc(100vh-8rem)]": !wide && !medium,
                "w-[60%] h-[calc(100vh-16rem)]": medium,
                "w-[90%] h-[calc(100vh-8rem)] ": wide,
              })}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
