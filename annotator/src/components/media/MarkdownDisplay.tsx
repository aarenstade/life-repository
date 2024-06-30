import classNames from "classnames";
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownDisplayProps {
  source: string;
  noProse?: boolean;
  className?: string;
  textPadding?: boolean;
}

const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ source, noProse, className, textPadding }) => {
  const src = useMemo(() => {
    source = source.replace(/<br><br>/g, "\n\n").replace(/<br>/g, "\n");
    return source;
  }, [source]);

  return (
    <div className={"space-y-2" + " " + className}>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className='text-3xl font-bold' {...props} />,
          h2: ({ node, ...props }) => <h2 className='text-2xl font-bold' {...props} />,
          h3: ({ node, ...props }) => <h3 className='text-lg font-medium' {...props} />,
          h4: ({ node, ...props }) => <h4 className='text-lg' {...props} />,
          h5: ({ node, ...props }) => <h5 className='text-base' {...props} />,
          h6: ({ node, ...props }) => <h6 className='text-sm' {...props} />,
          p: ({ node, ...props }) => <p className={classNames({ "my-4": noProse && textPadding, "text-gray-500": true })} {...props} />,
          li: ({ node, ...props }) => <li className='list-none list-inside text-gray-400 text-sm' {...props} />,
          a: ({ node, ...props }) => <a className='text-base text-blue-500' {...props} />,
        }}
      >
        {src}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownDisplay;
