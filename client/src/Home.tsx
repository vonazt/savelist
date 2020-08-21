import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { LIST_PLAYLISTS } from "./gql";
import { handleGraphQLError } from "./utils";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Playlist } from "./Playlist";
import { SpotifyPlaylistQuery, SpotifyPlaylist } from "./types";

export const Home: React.FC<{}> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { data, loading } = useQuery<SpotifyPlaylistQuery>(LIST_PLAYLISTS, {
    onError: (error) => handleGraphQLError(error, setIsLoggedIn),
  });

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
              <Playlist id={id} name={name} setIsLoggedIn={setIsLoggedIn} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
