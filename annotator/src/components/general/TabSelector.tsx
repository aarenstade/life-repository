import React, { useState } from "react";

type TabSelectorProps = {
  tabs: string[];
  defaultSelected: number;
  onTabSelect: (selectedTab: string) => void;
};

const TabSelector: React.FC<TabSelectorProps> = ({ tabs, defaultSelected, onTabSelect }) => {
  const [selectedTab, setSelectedTab] = useState<string>(tabs[defaultSelected]);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
    onTabSelect(tab);
  };

  return (
    <div className='w-full flex items-center justify-center space-x-2 overflow-x-scroll'>
      {tabs.map((tab, index) => (
        <button key={index} className={`py-1 px-2 text-sm ${selectedTab === tab ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => handleTabClick(tab)}>
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;
