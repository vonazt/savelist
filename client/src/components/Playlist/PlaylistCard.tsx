import React, { useEffect, useContext, Fragment } from "react";
import { useMutation } from "@apollo/client";
import FileSaver from "file-saver";
import { Parser } from "json2csv";
import { SAVE_PLAYLIST } from "../../gql";
import { SavedPlaylist, FormattedPlaylist, SpotifyPlaylist } from "../../types";
import { handleGraphQLError } from "../../utils";
import { LoadingSpinner, LoggedInContext, LoggedInContextProps } from "../";
import { PlaylistImage } from "./";

type PlaylistCardProps = {
  playlist: SpotifyPlaylist;
};

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
}: PlaylistCardProps) => {
  const { setIsLoggedIn } = useContext<LoggedInContextProps>(LoggedInContext);
  const [
    savePlaylist,
    { data: savedPlaylist, loading: savingPlaylist },
  ] = useMutation<SavedPlaylist>(SAVE_PLAYLIST, {
    onError: (error) => handleGraphQLError(error, setIsLoggedIn),
  });

  useEffect(() => {
    if (savedPlaylist) {
      const json2csvParser = new Parser();
      const playlistCsv = json2csvParser.parse(
        JSON.parse(savedPlaylist.savePlaylist).map(
          (playlist: FormattedPlaylist) => ({
            ...playlist,
            artists: playlist.artists.join(`, `),
          })
        )
      );
      const blob = new Blob([playlistCsv], { type: `text/csv;charset=utf-8` });
      FileSaver.saveAs(blob, `${playlist.name}.csv`);
    }
  }, [savedPlaylist, playlist.name]);

  const handleSavePlaylist = (id: string) => {
    savePlaylist({ variables: { id } });
  };

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
          <div className="relative">
            <h2 className="mx-4 mt-2 italic text-xl font-bold w-8/12 leading-tight">
              {playlist.name}
            </h2>
            <h4 className="text-sm italic mx-4 mb-4 text-gray-400">
              by{" "}
              <a
                href={playlist.owner.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {playlist.owner.display_name}
              </a>
            </h4>
            <button
              className="font-bold bg-spotifyGreen absolute top-0 right-0 mr-4 p-1 rounded clear-left"
              onClick={() => handleSavePlaylist(playlist.id)}
              disabled={savingPlaylist}
            >
              {savingPlaylist ? <LoadingSpinner /> : `save`}
            </button>
          </div>
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
