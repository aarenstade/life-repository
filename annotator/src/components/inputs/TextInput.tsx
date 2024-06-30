import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = (props) => {
  return <input {...props} className={`p-4 w-full bg-black border focus:outline-none ${props.className}`} />;
};

export default TextInput;
