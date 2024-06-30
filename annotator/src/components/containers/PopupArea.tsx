import classNames from "classnames";
import useOutsideAlerter from "../../hooks/dom/useOutsideClick";
import React, { ReactNode, useRef, useEffect } from "react";

interface PopupProps {
  buttonComponent: ReactNode;
  children: ReactNode;
  maxWidth: string;
  maxHeight: string;
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  zIndex?: string;
  outsideClickClose?: boolean;
  alignment: "bottom-left" | "bottom-center" | "bottom-right" | "top-left" | "top-center" | "top-right";
}

const Popup: React.FC<PopupProps> = ({
  buttonComponent,
  isOpen,
  children,
  maxWidth,
  maxHeight,
  alignment,
  zIndex,
  outsideClickClose,
  onOpen,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const alerter = useOutsideAlerter(ref);

  useEffect(() => {
    if (isOpen && outsideClickClose && alerter.outside) onClose && onClose();
  }, [alerter.outside]);

  const getAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case "top-right":
        return "origin-top-left left-0 bottom-full";
      case "top-center":
        return "origin-top left-1/2 transform -translate-x-1/2 bottom-full";
      case "top-left":
        return "origin-top-right right-0 bottom-full";
      case "bottom-right":
        return "origin-bottom-left left-0 top-full";
      case "bottom-center":
        return "origin-bottom left-1/2 transform -translate-x-1/2 top-full";
      case "bottom-left":
        return "origin-bottom-right right-0 top-full";
      default:
        return "";
    }
  };

  return (
    <div className='relative'>
      <div onClick={isOpen ? onClose : onOpen} className='h-full flex flex-col justify-center'>
        {buttonComponent}
      </div>
      {isOpen && (
        <div
          ref={ref}
          className={
            classNames({
              "absolute bg-white shadow-md px-4 py-3 mt-2 overflow-auto": true,
              [maxWidth]: maxWidth,
              [maxHeight]: maxHeight,
              "z-10": !zIndex,
              [zIndex as string]: zIndex,
            }) +
            " " +
            getAlignmentClasses(alignment)
          }
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Popup;
