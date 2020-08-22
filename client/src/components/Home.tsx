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
  PlaylistNavigation,
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
    offsetPlaylists: [],
  });

  useEffect(() => {
    const accessToken = localStorage.getItem(`accessToken`);
    setIsLoggedIn(accessToken ? true : false);
  }, [setIsLoggedIn]);

  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setIsLoggingIn(false);
      setPlaylists({
        allPlaylists: data?.listPlaylists,
        filteredPlaylists: data?.listPlaylists,
        offsetPlaylists: [...data?.listPlaylists].slice(0, 12),
      });
    }
  }, [data, setIsLoggingIn]);

  useEffect(() => {
    setPlaylists((playlists) => ({
      ...playlists,
      offsetPlaylists: [...playlists.filteredPlaylists].slice(
        offset,
        offset + 12
      ),
    }));
  }, [offset, playlists.filteredPlaylists]);

  return (
    <div className="container mx-auto mb-8">
      <h1 className="text-4xl italic text-center m-5 font-extrabold">
        Backupify
      </h1>
      {!isLoggedIn && !isLoggingIn && <LoginLink />}
      {isLoggingIn || (isLoggedIn && loading) ? (
        window.innerWidth <= 640 ? (
          <LoadingSkeleton />
        ) : window.innerWidth <= 768 ? (
          <div className="grid gap-4 grid-cols-2 grid-rows-2">
            {Array.from(Array(4), (_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-3 grid-rows-3">
            {Array.from(Array(6), (_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )
      ) : (
        isLoggedIn && (
          <Fragment>
            <Search
              playlists={playlists}
              setPlaylists={setPlaylists}
              setOffset={setOffset}
            />
            <div
              className={`grid gap-4 grid-cols-1 md:grid-cols-2 md:grid-rows-${Math.ceil(
                playlists.offsetPlaylists.length / 2
              )} lg:grid-cols-3 lg:grid-rows-${Math.ceil(
                playlists.offsetPlaylists.length / 3
              )}`}
            >
              {playlists?.offsetPlaylists.map((playlist: SpotifyPlaylist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
            <PlaylistNavigation
              offset={offset}
              setOffset={setOffset}
              playlists={playlists}
            />
          </Fragment>
        )
      )}
    </div>
  );
};
