import React, { useState, useEffect, useContext, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { LIST_PLAYLISTS } from "../gql";
import { handleGraphQLError } from "../utils";
import { LoadingSkeleton, LoggedInContext, LoggedInContextProps, PlaylistCard } from "./";
import { SpotifyPlaylistQuery, SpotifyPlaylist } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type Playlists = {
  allPlaylists: SpotifyPlaylist[];
  filteredPlaylists: SpotifyPlaylist[];
};

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = e;
    const filteredPlaylists = playlists.allPlaylists.filter(({ name }) =>
      name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
    setPlaylists({ ...playlists, filteredPlaylists });
  };

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
          {Array.from(Array(6), (_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Fragment>
          <div className="flex justify-end relative">
            <FontAwesomeIcon icon={faSearch} className="absolute mr-6 mt-2" />
            <input
              type="search"
              className="mx-4 pl-2 py-1 pr-8 bg-gray-800 border-2 border-spotifyGreen rounded"
              onChange={handleSearch}
            />
          </div>
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
