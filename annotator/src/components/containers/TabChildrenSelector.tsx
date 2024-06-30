import React from "react";
import TabSelector from "../general/TabSelector";

interface Tab {
  label: string;
  value: string;
  closable?: boolean;
  icon?: JSX.Element;
  subtitle?: string;
}

interface TabChildrenSelectorProps {
  tabs: Tab[];
  selected: number;
  onSelect: (index: number) => void;
  onClose?: (index: number) => void;
  childrenContainerClassName?: string;
  children: React.ReactNode[];
}

const TabChildrenSelector: React.FC<TabChildrenSelectorProps> = ({ tabs, selected, onSelect, onClose, children, childrenContainerClassName }) => {
  const handleTabSelect = (selectedTab: string) => {
    const index = tabs.findIndex((tab) => tab.value === selectedTab);
    if (index !== -1) onSelect(index);
  };

  const tabLabels = tabs.map((tab) => tab.label);

  return (
    <div className='flex flex-col items-center justify-start w-full h-full overflow-y-scroll'>
      <TabSelector tabs={tabLabels} defaultSelected={selected} onTabSelect={handleTabSelect} />
      {children.map((child, index) => (
        <div key={index} className={"w-full h-[calc(100%-40px)] " + childrenContainerClassName} style={{ display: index === selected ? "block" : "none" }}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default TabChildrenSelector;
