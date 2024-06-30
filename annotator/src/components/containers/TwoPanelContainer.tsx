import classNames from "classnames";
import React from "react";
import { FC, useState } from "react";

interface TwoPanelContainerProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  leftPanelId?: string;
  rightPanelId?: string;
  defaultLeftWidthPercentage?: number; // Represented as a percentage
  column?: boolean;
}

const TwoPanelContainer: FC<TwoPanelContainerProps> = ({
  leftPanel,
  rightPanel,
  leftPanelId,
  rightPanelId,
  defaultLeftWidthPercentage = 0.33,
  column = false,
}) => {
  const [dimension, setDimension] = useState(defaultLeftWidthPercentage * 100);
  const [resizing, setResizing] = useState(false);

  const startResizing = (mouseDownEvent: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    const start = column ? mouseDownEvent.clientY : mouseDownEvent.clientX;

    const handleMouseMove = (mouseMoveEvent: MouseEvent) => {
      const newDimension = column
        ? ((mouseMoveEvent.clientY - start) / window.innerHeight) * 100 + dimension
        : ((mouseMoveEvent.clientX - start) / window.innerWidth) * 100 + dimension;
      setDimension(Math.max(0, Math.min(100, newDimension)));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const containerClasses = classNames({
    "flex w-full h-full relative": true,
    "select-none": resizing,
    "select-auto": !resizing,
    "flex-col": column,
    "flex-row": !column,
  });

  const firstPanelStyle = column ? { height: `${dimension}%` } : { width: `${dimension}%` };
  const secondPanelStyle = column ? { height: `${100 - dimension}%` } : { width: `${100 - dimension}%` };

  return (
    <div className={containerClasses}>
      <div id={leftPanelId} style={firstPanelStyle} className='overflow-y-scroll'>
        {leftPanel}
      </div>
      <div
        onMouseDown={startResizing}
        className={classNames({
          "cursor-ns-resize": column,
          "cursor-ew-resize": !column,
          "bg-gray-300": true,
          "w-full h-2": column,
          "w-2 h-full": !column,
        })}
      />
      <div id={rightPanelId} style={secondPanelStyle} className='overflow-auto'>
        {rightPanel}
      </div>
    </div>
  );
};

export default TwoPanelContainer;
