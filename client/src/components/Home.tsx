import React, { useState, useEffect, useContext, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { LIST_PLAYLISTS } from "../gql";
import { handleGraphQLError } from "../utils";
import {
  LoadingSkeleton,
  LoggedInContext,
  LoginLink,
  LoggedInContextProps,
  PlaylistCard,
  Search,
} from "./";
import { SpotifyPlaylistQuery, SpotifyPlaylist, Playlists } from "../types";

export const Home: React.FC<{}> = () => {
  const { isLoggedIn, setIsLoggedIn, isLoggingIn, setIsLoggingIn } = useContext<
    LoggedInContextProps
  >(LoggedInContext);

  const { data, loading } = useQuery<SpotifyPlaylistQuery>(LIST_PLAYLISTS, {
    onError: (error) => handleGraphQLError(error, setIsLoggedIn),
  });

  const [playlists, setPlaylists] = useState<Playlists>({
    allPlaylists: [],
    filteredPlaylists: [],
  });

  useEffect(() => {
    const accessToken = localStorage.getItem(`accessToken`);
    setIsLoggedIn(accessToken ? true : false);
  }, [setIsLoggedIn]);

  useEffect(() => {
    if (data) {
      setIsLoggingIn(false);
      setPlaylists({
        allPlaylists: data?.listPlaylists,
        filteredPlaylists: data?.listPlaylists,
      });
    }
  }, [data, setIsLoggingIn]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center m-5 font-extrabold">Backupify</h1>
      {!isLoggedIn && !isLoggingIn && <LoginLink />}
      {isLoggingIn || (isLoggedIn && loading) ? (
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          {Array.from(Array(6), (_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Fragment>
          <Search playlists={playlists} setPlaylists={setPlaylists} />
          <div className="grid gap-4 grid-cols-3 grid-rows-6">
            {playlists?.filteredPlaylists.map((playlist: SpotifyPlaylist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};
