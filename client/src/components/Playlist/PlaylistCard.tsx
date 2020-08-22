import React, { Fragment } from "react";
import { SpotifyPlaylist } from "../../types";

import { PlaylistImage, PlaylistHeader } from "./";

type PlaylistCardProps = {
  playlist: SpotifyPlaylist;
};

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
}: PlaylistCardProps) => {
  const formatTracksTotal = (total: number): string =>
    total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <Fragment>
      <div className="border-4 border-spotifyGreen rounded m-4 pb-4">
        <PlaylistImage
          images={playlist.images}
          openSpotifyUrl={playlist.external_urls.spotify}
        />
        <div className="divide-y divide-gray-400 mx-4">
          <PlaylistHeader
            name={playlist.name}
            id={playlist.id}
            owner={playlist.owner}
            url={playlist.external_urls.spotify}
          />
          <h3 className="mx-4 py-2">
            Tracks: {formatTracksTotal(playlist.tracks.total)}
          </h3>
          <p
            className="italic mx-4 py-2"
            dangerouslySetInnerHTML={{ __html: playlist.description }}
          />
        </div>
      </div>
    </Fragment>
  );
};
