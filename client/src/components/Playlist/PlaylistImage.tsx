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
      {(isShowPlayIcon || window.innerWidth <= 1024) && (
        <a
          href={openSpotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute self-center z-10 border-2 ${
            window.innerWidth <= 1024 ? `p-6` : `p-8`
          } rounded-full bg-black bg-opacity-50`}
          onMouseEnter={() => setIsShowPlayIcon(true)}
          onMouseLeave={() => setIsShowPlayIcon(false)}
        >
          <FontAwesomeIcon
            icon={faPlay}
            size={window.innerWidth <= 1024 ? `2x` : `3x`}
          />
        </a>
      )}
      <a
        href={openSpotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-transparent rounded bg-no-repeat bg-center bg-cover w-48 h-48 my-2`}
        style={{
          backgroundImage: `url(${
            images.length
              ? images[0].url
              : `https://i.kinja-img.com/gawker-media/image/upload/c_scale,f_auto,fl_progressive,pg_1,q_80,w_1600/msfgxy64htxbaki9up4e.png`
          })`,
        }}
        onMouseEnter={() => setIsShowPlayIcon(true)}
        onMouseLeave={() => setIsShowPlayIcon(false)}
      >
        Link to Spotify playlist
      </a>
    </div>
  );
};
