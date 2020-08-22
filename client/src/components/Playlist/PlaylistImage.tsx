import React, { useState } from "react";
import { SpotifyImage } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type PlaylistImagesProps = {
  images: SpotifyImage[];
  openSpotifyUrl: string;
};

export const PlaylistImage: React.FC<PlaylistImagesProps> = ({
  images,
  openSpotifyUrl,
}: PlaylistImagesProps) => {
  const [isShowPlayIcon, setIsShowPlayIcon] = useState<boolean>(false);
  return (
    <div className="flex content-center justify-center relative">
      {isShowPlayIcon && (
        <a href={openSpotifyUrl} target="_blank" rel="noopener noreferrer" className="absolute self-center z-10">
          <FontAwesomeIcon
            icon={faPlay}
            size={`3x`}
            onMouseEnter={() => setIsShowPlayIcon(true)}
            onMouseLeave={() => setIsShowPlayIcon(false)}
          />
        </a>
      )}
      <a
        href={openSpotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-no-repeat bg-center hover:opacity-50 ${
          isShowPlayIcon ? `opacity-50` : ``
        } bg-cover w-48 h-48 my-2`}
        style={{
          backgroundImage: `url(${
            images.length
              ? images[0].url
              : `https://i.kinja-img.com/gawker-media/image/upload/c_scale,f_auto,fl_progressive,pg_1,q_80,w_1600/msfgxy64htxbaki9up4e.png`
          })`,
        }}
        onMouseEnter={() => setIsShowPlayIcon(true)}
        onMouseLeave={() => setIsShowPlayIcon(false)}
      />
    </div>
  );
};
