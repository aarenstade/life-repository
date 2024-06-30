import { FC, forwardRef, useEffect, useRef } from "react";
import { BaseEditor, Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";

import { MdFormatBold, MdFormatItalic, MdFormatUnderlined } from "react-icons/md";
import classnames from "classnames";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const Menu = forwardRef<HTMLDivElement, React.PropsWithChildren<BaseProps>>(({ className, ...props }, ref) => <div {...props} data-test-id='menu' ref={ref} className={`inline-block ${className}`} />);

export const Toolbar = forwardRef<HTMLDivElement, React.PropsWithChildren<BaseProps>>(({ className, ...props }, ref) => <Menu {...props} ref={ref} className={`relative p-1 px-18 mb-5 border-b-2 border-gray-200 ${className}`} />);

export const Leaf: FC<any> = ({ attributes, children, leaf }) => {
  return (
    <span {...attributes} className={classnames({ "font-bold": leaf.bold, italic: leaf.italic, underline: leaf.underlined })}>
      {children}
    </span>
  );
};

export const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (!selection || !inFocus || Range.isCollapsed(selection) || Editor.string(editor, selection) === "") {
      el.removeAttribute("style");
      return;
    }

    try {
      const domSelection = window.getSelection();
      const domRange = domSelection?.getRangeAt(0);
      const rect = domRange?.getBoundingClientRect();

      if (rect) {
        el.style.opacity = "1";
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
        el.style.left = `${rect.left + window.scrollX + rect.width / 2 - el.offsetWidth / 2}px`;
      }
    } catch (error) {
      console.error("Error positioning the hovering toolbar:", error);
    }
  });

  return (
    <div className=''>
      <Menu ref={ref} className='flex space-x-1 absolute z-10 text-xl -top-[10000px] -left-[10000px] -mt-2 opacity-0 transition-opacity duration-500' onMouseDown={(e: any) => e.preventDefault()}>
        <button
          onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            toggleMark(editor, "bold");
          }}
          className={`w-6 h-6 hover:bg-gray-700 ${isMarkActive(editor, "bold") ? "bg-gray-600" : ""}`}
        >
          <MdFormatBold className='text-white' />
        </button>
        <button
          onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            toggleMark(editor, "italic");
          }}
          className={`w-6 h-6 hover:bg-gray-700 ${isMarkActive(editor, "italic") ? "bg-gray-600" : ""}`}
        >
          <MdFormatItalic className='text-white' />
        </button>
        <button
          onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            toggleMark(editor, "underlined");
          }}
          className={`w-6 h-6 hover:bg-gray-700 ${isMarkActive(editor, "underlined") ? "bg-gray-600" : ""}`}
        >
          <MdFormatUnderlined className='text-white' />
        </button>
      </Menu>
    </div>
  );
};
