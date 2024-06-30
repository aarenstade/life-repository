import { FC } from "react";
import { Selectable } from "../../types/general";
import classnames from "classnames";
import { AiOutlineAudio, AiOutlineDatabase, AiOutlineFile, AiOutlineFileImage, AiOutlineFileText, AiOutlineVideoCamera } from "react-icons/ai";
import React from "react";

interface MediaItemRowProps {
  media: Selectable<ProjectMedia>; // TODO change type
  hover: boolean;
  active: boolean;
}

const MediaItemRow: FC<MediaItemRowProps> = ({ media, hover, active }) => {
  const bgClassName = hover ? "bg-gray-100" : active ? "bg-gray-300" : media.selected ? "bg-blue-100" : "bg-white";
  const iconSize = 20;

  const mediaIcon = (media: ProjectMedia) => {
    if (media.thumbnail_paths && media.thumbnail_paths.length > 0) {
      return <img src={filePath(media.thumbnail_paths[0])} alt='thumbnail' className='min-w-[4rem] max-w-[8rem] object-cover' />;
    }
    switch (media.media_type) {
      case "image":
        return <AiOutlineFileImage size={iconSize} />;
      case "video":
        return <AiOutlineVideoCamera size={iconSize} />;
      case "audio":
        return <AiOutlineAudio size={iconSize} />;
      case "text":
        return <AiOutlineFileText size={iconSize} />;
      case "data":
        return <AiOutlineDatabase size={iconSize} />;
      default:
        return <AiOutlineFile size={iconSize} />;
    }
  };

  return (
    <div
      className={classnames(
        "flex flex-col justify-between px-2 py-4 border-b border-gray-200",
        bgClassName,
        { "ring ring-blue-300 ring-opacity-50": media.selected },
        "dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      )}
    >
      <div className='flex items-center space-x-4'>
        <div className='flex justify-center items-center min-w-[4rem] max-w-[8rem]'>
          <span className='font-medium text-gray-900 dark:text-white'>{mediaIcon(media.data)}</span>
        </div>
        <div className='p-2'>
          <span className='text-xs text-gray-700 py-2 dark:text-gray-300 block'>{media.data.media_path}</span>
        </div>
      </div>
    </div>
  );
};

export default MediaItemRow;
