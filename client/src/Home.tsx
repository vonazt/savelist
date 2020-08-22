import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { LIST_PLAYLISTS } from "./gql";
import { handleGraphQLError } from "./utils";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { PlaylistCard } from "./PlaylistCard";
import { LoggedInContext, LoggedInContextProps } from "./LoggedInContext";
import { SpotifyPlaylistQuery, SpotifyPlaylist } from "./types";

export const Home: React.FC<{}> = () => {
  const { isLoggedIn, setIsLoggedIn, isLoggingIn, setIsLoggingIn } = useContext<
    LoggedInContextProps
  >(LoggedInContext);

  const { data, loading } = useQuery<SpotifyPlaylistQuery>(LIST_PLAYLISTS, {
    onError: (error) => handleGraphQLError(error, setIsLoggedIn),
  });

  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem(`accessToken`);
    setIsLoggedIn(accessToken ? true : false);
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (data) {
      setIsLoggingIn(false);
      setPlaylists(data?.listPlaylists);
    }
  }, [data, setIsLoggingIn]);

  return (
    <div className="container mx-auto">
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
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          {new Array(6).fill(<LoadingSkeleton />).map((skeleton) => skeleton)}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-3 grid-rows-6">
          {playlists?.map((playlist: SpotifyPlaylist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
};
