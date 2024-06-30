import { SettingOption } from "../../types/general";
import classNames from "classnames";
import React from "react";
import { FC, useEffect, useRef, useState } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";

type SettingsDropdownProps = {
  component?: JSX.Element;
  className?: string;
  dropdownClassName?: string;
  otherSide?: boolean;
  dark?: boolean;
  options: SettingOption[];
  onClick: (setting: SettingOption) => void;
};

const SettingsDropdown: FC<SettingsDropdownProps> = ({ component, className, dropdownClassName, options, otherSide, dark, onClick }) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: any) {
      event.stopPropagation();
      if (ref.current && !ref.current.contains(event.target)) setShow(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        className='cursor-pointer px-0.5 py-0.2 w-fit text-lg grow '
        onClick={(event: any) => {
          event.stopPropagation();
          setShow(!show);
        }}
      >
        {component ? component : <AiOutlineEllipsis />}
      </div>
      {show && (
        <div
          className={
            classNames({
              "absolute top-[1rem] z-[500] p-1.5 shadow-md": true,
              "right-0": !otherSide,
              "left-0": otherSide,
              "bg-white text-slate-700": !dark,
              "bg-slate-800 text-slate-200": dark,
            }) +
            " " +
            dropdownClassName
          }
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={classNames({
                "flex flex-row items-center gap-2 text-sm cursor-pointer p-1": true,
                "hover:bg-slate-200": !dark,
                "hover:bg-slate-700": dark,
              })}
              onClick={(event: any) => {
                event.stopPropagation();
                onClick(option);
                setShow(false);
              }}
            >
              {option.icon}
              <p>{option.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
