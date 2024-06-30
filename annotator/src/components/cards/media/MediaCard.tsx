import { FC } from "react";
import React from "react";
import VideoMediaDisplay from "../../media/display/VideoMediaDisplay";
import ImageMediaDisplay from "../../media/display/ImageMediaDisplay";

// TODO change type to MediaItem or FileItem

const renderMediaDisplay = (media: ProjectMedia) => {
  switch (media.media_type) {
    case "video":
      return <VideoMediaDisplay path={media.media_path} />;
    case "image":
      return <ImageMediaDisplay path={media.media_path} />;
    // case 'audio':
    //   return <AudioMediaDisplay media={media} />;
    // case 'text':
    //   return <TextMediaDisplay media={media} />;
    // case 'data':
    //   return <DataMediaDisplay media={media} />;
    default:
      return null;
  }
};

interface MediaCardProps {
  media: ProjectMedia;
}

const MediaCard: FC<MediaCardProps> = ({ media }) => {
  return (
    <div className='w-full md:w-[25rem] lg:w-[30rem] bg-gray-800 text-white flex flex-col justify-between items-center'>
      {renderMediaDisplay(media)}
      <div className='px-2'>
        <p className='text-xs'>{media.media_path}</p>
      </div>
    </div>
  );
};

export default MediaCard;
