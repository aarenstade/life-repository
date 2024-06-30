import { FC } from "react";
import React from "react";
import { filePath } from "../../../../shared/utilities/general";

interface ImageMediaDisplayProps {
  path: string;
}

const ImageMediaDisplay: FC<ImageMediaDisplayProps> = ({ path }) => {
  return (
    <div>
      <img className='w-full h-auto' src={filePath(path)} alt={path} />
    </div>
  );
};

export default ImageMediaDisplay;
