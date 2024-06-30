import { FC } from "react";
import cn from "classnames";
import { AiOutlineLoading } from "react-icons/ai";
import React from "react";

type LoadingIndicatorProps = { text?: string; className?: string };

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ text, className }) => {
  return (
    <p className={cn({ "flex items-center rounded-xl": true, "text-blue-300 text-md": !className }) + ` ${className}`}>
      <span className='text-lg'>
        <AiOutlineLoading className='animate-spin' />
      </span>
      {text && text}
    </p>
  );
};

export default LoadingIndicator;
