import { SettingOption } from "../../types/general";
import classNames from "classnames";
import React, { ButtonHTMLAttributes, FC, useEffect, useRef, useState } from "react";
import { AiOutlineEllipsis } from "react-icons/ai";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button {...rest} className='px-5 py-3 text-base font-medium text-white bg-black border border-white shadow hover:bg-gray-700'>
      {children}
    </button>
  );
};

const SecondaryButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className='px-4 py-2 text-sm font-medium text-black bg-white border border-black shadow hover:bg-gray-200 focus:outline-none focus:bg-gray-200'
    >
      {children}
    </button>
  );
};

const TextButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className='px-4 py-2 text-sm font-medium text-black bg-transparent border-none hover:text-gray-900 focus:outline-none focus:text-gray-900'
    >
      {children}
    </button>
  );
};

export const SquareIconButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className={classNames({
        "flex items-center justify-center w-8 h-8 text-sm font-medium bg-white border shadow hover:bg-gray-50 focus:outline-none": true,
        "border-gray-300 text-gray-200": rest.disabled,
        "border-black text-black": !rest.disabled,
      })}
    >
      {children}
    </button>
  );
};

type IconButtonDropdownProps = {
  icon?: JSX.Element;
  className?: string;
  dropdownClassName?: string;
  otherSide?: boolean;
  dark?: boolean;
  options: SettingOption[];
  onClick: (setting: SettingOption) => void;
};

const IconButtonDropdown: FC<IconButtonDropdownProps> = ({ icon, className, dropdownClassName, options, otherSide, dark, onClick }) => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: any) {
      if (ref.current && !ref.current.contains(event.target)) setShow(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div className='cursor-pointer px-0.5 py-0.2 w-fit text-lg grow ' onClick={() => setShow(!show)}>
        {icon ? icon : <AiOutlineEllipsis />}
      </div>
      {show && (
        <div
          className={
            classNames({
              "absolute top-[1rem] z-[500] p-1.5 shadow-md": true,
              "right-0": !otherSide,
              "left-0": otherSide,
              "bg-white text-slate-700": !dark,
              "bg-blue-800 text-slate-200": dark,
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
              onClick={() => {
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

export { PrimaryButton, SecondaryButton, TextButton, IconButtonDropdown };
