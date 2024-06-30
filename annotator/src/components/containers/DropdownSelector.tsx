import React from "react";
import { SettingOption } from "../../types/general";
import { FC, useState, useEffect } from "react";

interface DropdownSelectorProps {
  options: SettingOption[];
  onSelect: (option: SettingOption) => void;
}

const DropdownSelector: FC<DropdownSelectorProps> = ({ options, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (event: any) => {
    switch (event.key) {
      case "ArrowUp":
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : options.length - 1));
        break;
      case "ArrowDown":
        setSelectedIndex((prevIndex) => (prevIndex < options.length - 1 ? prevIndex + 1 : 0));
        break;
      case "Enter":
        onSelect(options[selectedIndex]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, options, onSelect]);

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} className='outline-none border border-gray-700 rounded min-w-[200px] bg-gray-800'>
      <ul className='list-none m-0 p-0'>
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`flex items-center p-2 cursor-pointer ${
              selectedIndex === index ? "bg-blue-500 text-white" : "text-gray-200 hover:bg-gray-700"
            }`}
            onClick={() => onSelect(option)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <span className='mr-2'>{option.icon}</span>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownSelector;
