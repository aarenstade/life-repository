import React from "react";
import { FC } from "react";

interface ProgressBarProps {
  value: number; // value is expected to be between 0 and 1
}

const ProgressBar: FC<ProgressBarProps> = ({ value }) => {
  const percentage = Math.round(value * 100);
  return (
    <div className='relative pt-1'>
      <div className='flex mb-2 items-center justify-between'>
        <div>
          <span className='text-xs font-semibold inline-block py-1 px-2 uppercase text-blue-600 bg-blue-200'>{percentage}%</span>
        </div>
      </div>
      <div className='overflow-hidden h-2 mb-4 text-xs flex bg-blue-200'>
        <div
          style={{ width: `${percentage}%` }}
          className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500'
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
