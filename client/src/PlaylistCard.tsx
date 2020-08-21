import React, { useEffect, useContext, Fragment } from "react";
import { useMutation } from "@apollo/client";
import { SAVE_PLAYLIST } from "./gql";
import { LoadingSpinner } from "./LoadingSpinner";
import FileSaver from "file-saver";
import { Parser } from "json2csv";
import { SavedPlaylist, FormattedPlaylist, SpotifyPlaylist } from "./types";
import { handleGraphQLError } from "./utils";
import { LoggedInContext, LoggedInContextProps } from "./LoggedInContext";
import { PlaylistImage } from "./PlaylistImage";

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

  console.log("playlist", playlist);

  return (
    <Fragment>
      <div className="border-2 border-spotifyGreen w-1/3 m-4">
        <PlaylistImage images={playlist.images} />

        <div className="divide-y divide-gray-400 mx-4">
          <div className="relative">
            <h2 className="mx-4 mt-2 mb-4 italic text-xl font-bold w-8/12 leading-tight">
              {playlist.name}
            </h2>
            <button
              className="font-bold bg-spotifyGreen absolute top-0 right-0 mr-4 p-1 rounded clear-left"
              onClick={() => handleSavePlaylist(playlist.id)}
              disabled={savingPlaylist}
            >
              {savingPlaylist ? <LoadingSpinner /> : `save`}
            </button>
          </div>
          <h3 className="mx-4 pt-2">Tracks: {playlist.tracks.total}</h3>
        </div>
      </div>
    </Fragment>
  );
};
