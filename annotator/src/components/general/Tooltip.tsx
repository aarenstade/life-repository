import classNames from "classnames";
import React from "react";
import { FC, ReactNode, useMemo, useState } from "react";

interface TooltipProps {
  text?: string;
  delay?: boolean | number;
  disabled?: boolean;
  className?: string;
  containerClassname?: string;
  position?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

const Tooltip: FC<TooltipProps> = ({ text, delay: delay_param, position, disabled, containerClassname, className, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hidden, setHidden] = useState(disabled);

  const delay = useMemo(() => {
    if (typeof delay_param === "number") return delay_param;
    if (delay_param) return 250;
    return 0;
  }, [delay_param]);

  const handleMouseEnter = () => {
    if (disabled) return;
    setHidden(false);
    if (delay) return setTimeout(() => setShowTooltip(true), delay);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setShowTooltip(false);
    setHidden(true);
  };

  const handleClick = () => {
    if (disabled) return;
    setShowTooltip(!showTooltip);
  };

  const triangle_rotation = useMemo(() => {
    if (position === "right") return "rotate(-90 50 50)";
    if (position === "left") return "rotate(90 50 50)";
    if (position === "bottom") return "rotate(0 50 50)";
    return "rotate(180 50 50)";
  }, [position]);

  return (
    <div
      className={classNames({
        relative: true,
        [containerClassname as string]: containerClassname,
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {!disabled && !hidden && showTooltip && (
        <div
          className={classNames({
            "bg-white shadow-md border-2 border-gray-200 text-slate-600 w-fit text-sm px-3 py-2 absolute transform ": true,
            "bottom-full left-1/2 -translate-x-1/2": position === "top" || !position,
            "top-1/2 -translate-y-1/2 left-auto right-full": position === "left",
            "top-1/2 -translate-y-1/2 left-full right-auto": position === "right",
            "top-full left-1/2 -translate-x-1/2": position === "bottom",
            invisible: hidden || disabled,
            [className as string]: className,
          })}
        >
          {position && (
            <div
              className={classNames({
                "absolute w-2 h-2": true,
                "bottom-0 left-1/2 right-1/2 top-auto translate-y-2 -translate-x-1/2": position === "top",
                "bottom-auto left-1/2 right-1/2 top-0 -translate-y-2 -translate-x-1/2": position === "bottom",
                "bottom-1/2 top-1/2 left-0 right-auto -translate-y-1/2 -translate-x-2 ": position === "right",
                "bottom-1/2 top-1/2 left-auto right-0 -translate-y-1/2 translate-x-2 ": position === "left",
              })}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <polygon points='50,0 100,100 0,100' transform={triangle_rotation} fill='lightgray' style={{ opacity: "70%" }} />
              </svg>
            </div>
          )}
          {typeof text === "string" ? <p>{text}</p> : text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
