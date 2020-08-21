import React from "react";
import { SpotifyImage } from "./types";

type PlaylistImagesProps = {
  images: SpotifyImage[];
};

export const PlaylistImage: React.FC<PlaylistImagesProps> = ({
  images,
}: PlaylistImagesProps) => (
  <div className="flex content-center justify-center">
    <div
      className="bg-no-repeat bg-center bg-cover w-48 h-48 my-2"
      style={{
        backgroundImage: `url(${
          images.length
            ? images[0].url
            : `https://i.kinja-img.com/gawker-media/image/upload/c_scale,f_auto,fl_progressive,pg_1,q_80,w_1600/msfgxy64htxbaki9up4e.png`
        })`,
      }}
    ></div>
  </div>
);
