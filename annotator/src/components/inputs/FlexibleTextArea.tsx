import React, { useRef, useEffect, useState } from "react";
import LoadingIndicator from "../general/LoadingIndicator";

interface FlexibleTextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  button?: JSX.Element;
  onMouseUp?: (event: React.MouseEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

const FlexibleTextarea: React.FC<FlexibleTextareaProps> = ({ id, value, onChange, placeholder, loading, button, onMouseUp, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className='relative w-full flex'>
      <div className='absolute bottom-0 right-0 flex items-start text-sm z-[10]'>{button}</div>
      <textarea {...rest} id={id} ref={textareaRef} value={value} onChange={handleTextareaChange} placeholder={placeholder} onMouseUp={onMouseUp} className={`p-4 w-full bg-black border focus:outline-none resize-none overflow-hidden ${loading ? "opacity-50" : ""}`} disabled={loading} />
      {loading && (
        <div className='absolute inset-0 flex justify-center items-center bg-opacity-50'>
          <LoadingIndicator />
        </div>
      )}
    </div>
  );
};

export default FlexibleTextarea;
