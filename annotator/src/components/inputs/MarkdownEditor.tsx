import React, { useCallback, useState } from "react";
import { SimpleMdeReact } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import EasyMDE from "easymde";

interface MarkdownEditorProps {
  initialValue?: string;
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialValue, value, onChange }) => {
  const handleChange = useCallback(
    (value: string) => {
      onChange(value);
    },
    [onChange]
  );

  return (
    <SimpleMdeReact
      options={{
        toolbarTips: true,
        toolbar: ["bold", "italic", "strikethrough", "heading", "unordered-list", "link", "undo", "redo"],
        autofocus: true,
        spellChecker: false,
        initialValue: initialValue,
        placeholder: "Write something here...",
      }}
      value={value}
      onChange={handleChange}
    />
  );
};
export default MarkdownEditor;
