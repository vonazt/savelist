import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { LIST_PLAYLISTS, SAVE_PLAYLIST } from "./gql";
import { LoadingSkeleton } from "./LoadingSkeleton";
import FileSaver from "file-saver";

type ExternalUrls = {
  spotify: string;
};

type SpotiftyImage = {
  height: number;
  url: string;
  width: number;
};

type SpotifyOwner = {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

type SpotifyPlaylistTracks = {
  href: string;
  total: number;
};

type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: SpotiftyImage[];
  name: string;
  owner: SpotifyOwner;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTracks;
  type: string;
  uri: string;
};

type SpotifyPlaylistQuery = {
  listPlaylists: SpotifyPlaylist[];
};

export const Home: React.FC<{}> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { data, error, loading } = useQuery<SpotifyPlaylistQuery>(
    LIST_PLAYLISTS,
    {
      onError: () => {
        if (
          error?.graphQLErrors.some(({ message }) =>
            message.startsWith(`Access token and refresh token have expired`)
          )
        ) {
          localStorage.removeItem(`accessToken`);
          setIsLoggedIn(false);
        }
      },
    }
  );
  const [savePlaylist, { data: savedPlaylist }] = useMutation(SAVE_PLAYLIST);

  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem(`accessToken`);
    setIsLoggedIn(accessToken ? true : false);
  }, []);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setIsLoggingIn(false);
      setPlaylists(data?.listPlaylists);
    }
  }, [data]);

  const [playlistToSave, setPlaylistToSave] = useState<string>(``);

  useEffect(() => {
    if (savedPlaylist) {
      setPlaylistToSave(savedPlaylist.savePlaylist);
      const blob = new Blob([savedPlaylist.savePlaylist], { type: `json` });
      FileSaver.saveAs(blob, `playlist.json`)
    }
  }, [savedPlaylist]);

  console.log("playlists is", data?.listPlaylists);

  console.log("saved playlist", savedPlaylist);

  return (
    <div className="container mx-auto flex flex-col items-center h-full content-center justify-center">
      <h1 className="text-3xl text-center m-5 font-extrabold">Backupify</h1>
      {!isLoggedIn && !isLoggingIn && (
        <a
          href="http://localhost:4000/login"
          className="bg-spotifyGreen p-3 rounded-sm"
          onClick={() => setIsLoggingIn(true)}
        >
          Get my playlists
        </a>
      )}
      {isLoggingIn || (isLoggedIn && loading) ? (
        <LoadingSkeleton />
      ) : (
        <table className="table-auto">
          <tbody>
            {playlists?.map(({ id, name }: SpotifyPlaylist) => (
              <tr key={id} className="border-4 border-spotifyGreen">
                <td className="p-4">{name}</td>
                <td
                  className="p-4"
                  onClick={() => savePlaylist({ variables: { id } })}
                >
                  Save
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
