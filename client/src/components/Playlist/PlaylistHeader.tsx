import React, { useEffect, useContext } from "react";
import { useMutation } from "@apollo/client";
import FileSaver from "file-saver";
import { Parser } from "json2csv";
import { SAVE_PLAYLIST } from "../../gql";
import { SavedPlaylist, FormattedPlaylist, SpotifyOwner } from "../../types";
import { handleGraphQLError } from "../../utils";
import { LoadingSpinner, LoggedInContext, LoggedInContextProps } from "../";

type PlaylistHeaderProps = {
  name: string;
  id: string;
  owner: SpotifyOwner;
  url: string;
};

export const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({
  name,
  id,
  owner,
  url,
}: PlaylistHeaderProps) => {
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
      FileSaver.saveAs(blob, `${name}.csv`);
    }
  }, [savedPlaylist, name]);

  const handleSavePlaylist = (id: string) => {
    savePlaylist({ variables: { id } });
  };

  return (
    <div className="relative">
      <h2 className="mx-4 mt-2 italic text-xl font-bold w-8/12 leading-tight">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {" "}
          {name}
        </a>
      </h2>
      <h4 className="text-sm italic mx-4 mb-4 text-gray-400">
        by{" "}
        <a
          href={owner.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          {owner.display_name}
        </a>
      </h4>
      <button
        className="font-bold bg-spotifyGreen absolute top-0 right-0 mr-4 p-1 rounded clear-left"
        onClick={() => handleSavePlaylist(id)}
        disabled={savingPlaylist}
      >
        {savingPlaylist ? <LoadingSpinner /> : `save`}
      </button>
    </div>
  );
};
