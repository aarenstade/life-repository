import useOutsideAlerter from "../../hooks/dom/useOutsideClick";
import React, { FC, useRef, useEffect, useState } from "react";
import { TextareaHTMLAttributes } from "react";

interface CellTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  tooltipComponent?: JSX.Element;
}

const CellTextArea: FC<CellTextAreaProps> = ({ tooltipComponent, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const outside = useOutsideAlerter(textareaRef);

  useEffect(() => {
    if (outside.outside) {
      setShowTooltip(false);
    }
  }, [outside.outside]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);

  const handleMouseUp = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    // event.preventDefault();
    if (textareaRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!textareaRef?.current) return;
        const textareaRect = textareaRef.current?.getBoundingClientRect();
        setTooltipPosition({
          top: event.clientY - rect.height - textareaRect.top + textareaRef.current.scrollTop,
          left: event.clientX - textareaRect.left + textareaRef.current.scrollLeft - rect.width / 2,
        });
        setTimeout(() => textareaRef.current?.focus(), 0);
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setShowTooltip(false);
  };

  return (
    <div className='relative w-full'>
      {showTooltip && tooltipComponent && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            background: "transparent",
            border: "none",
            zIndex: 10,
          }}
        >
          {tooltipComponent}
        </div>
      )}
      <textarea
        ref={textareaRef}
        autoFocus
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        // onBlur={() => setShowTooltip(false)}
        {...props}
        className={`p-4 w-full overflow-hidden resize-none ${props.disabled ? "opacity-50" : ""}`}
      />
    </div>
  );
};

export default CellTextArea;
