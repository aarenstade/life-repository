import React from "react";
import { FC, useState, useRef, useEffect, forwardRef, useMemo } from "react";

import { withReact, Slate, Editable, useSlate, useFocused } from "slate-react";
import { BaseEditor, Descendant, Editor, createEditor } from "slate";
import { withHistory } from "slate-history";
import { HoveringToolbar, Leaf } from "./core";
import { Range } from "slate";
import classnames from "classnames";

interface NotesListInputProps {
  initialValue?: Descendant[];
  onChange?: (notes: Descendant[]) => void;
}

const NotesListInput: FC<NotesListInputProps> = ({ initialValue, onChange }) => {
  const [data, setData] = useState<Descendant[]>(initialValue || []);
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  const [lines, setLines] = useState<string[]>([]);
  const lineHeight = 24;

  const initial_value: Descendant[] = useMemo(() => {
    let defaultValue = { type: "paragraph", children: [{ text: "" }] } as Descendant;
    return initialValue || [defaultValue];
  }, [initialValue]);

  useEffect(() => {
    if (onChange) onChange(data);
  }, [data]);

  useEffect(() => {
    const fillLines = (lineCount: number) => new Array(lineCount).fill("");
    const calculateLineCount = () => {
      const windowHeight = window.innerHeight;
      return Math.max(1, Math.floor(windowHeight / lineHeight));
    };

    const updateLines = () => {
      const lineCount = calculateLineCount();
      if (lines.length < lineCount) {
        setLines([...lines, ...fillLines(lineCount - lines.length)]);
      }
    };

    updateLines();

    const handleResize = () => {
      updateLines();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lines, lineHeight]);

  return (
    <div className='w-full h-full'>
      <div className='flex h-full overflow-auto'>
        <Slate editor={editor} initialValue={initial_value} onChange={setData}>
          {/* <HoveringToolbar /> */}
          {/* TODO fix */}
          <Editable className='w-full h-full outline-none px-1' style={{ lineHeight: `${lineHeight}px`, backgroundSize: `100% ${lineHeight}px` }} renderLeaf={(props) => <Leaf {...props} />} />
        </Slate>
      </div>
    </div>
  );
};

export default NotesListInput;
