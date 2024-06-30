import { SettingOption } from "../../types/general";
import classNames from "classnames";
import React from "react";
import { FC, useEffect, useState, useRef } from "react";

interface TooltipToolbarProps {
  options: SettingOption[];
  position?: { top: number; left: number };
}

export const TooltipToolbar: FC<TooltipToolbarProps> = ({ options, position }) => {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  buttons.current = options.map((_, i) => buttons.current[i] ?? null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        setSelected((prev) => (prev + 1) % options.length);
      } else if (event.key === "ArrowUp") {
        setSelected((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (event.key === "Enter" && buttons.current[selected]) {
        buttons.current[selected]?.click();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected, options.length]);

  useEffect(() => {
    if (buttons.current[selected]) {
      buttons.current[selected]?.focus();
    }
  }, [selected]);

  return (
    <div
      className={classNames("z-[12] flex flex-col p-1 bg-gray-800 text-white rounded shadow-lg", position && "fixed")}
      style={position ? { top: `${position.top}px`, left: `${position.left}px` } : {}}
    >
      {options.map((option, i) => {
        const { icon } = option;

        return option.method ? (
          <button
            key={i}
            ref={(el) => (buttons.current[i] = el)}
            onClick={option.method}
            className={`p-2 flex hover:bg-slate-500 items-center text-xs ${selected === i ? "bg-gray-700" : ""}`}
            onMouseEnter={() => setSelected(i)}
          >
            {icon}
          </button>
        ) : null;
      })}
    </div>
  );
};

export default TooltipToolbar;
