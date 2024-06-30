import React from "react";

interface DropdownChildrenProps {
  children: React.ReactNode;
  height?: string;
  isExpanded: boolean;
}

const DropdownChildren: React.FC<DropdownChildrenProps> = ({ children, height = "20", isExpanded }) => {
  return (
    <div className={`relative ${isExpanded ? "" : "overflow-hidden"} transition-all duration-500`} style={{ height: isExpanded ? "auto" : `${height}px` }}>
      {children}
      {!isExpanded && (
        <div
          className='absolute inset-0'
          style={{
            background: "linear-gradient(to bottom, transparent, white)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default DropdownChildren;
