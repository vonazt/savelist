import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { LIST_PLAYLISTS, SAVE_PLAYLIST } from "./gql";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { LoadingSpinner } from "./LoadingSpinner";
import FileSaver from "file-saver";
import { Parser } from "json2csv";

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

type FormattedPlaylist = {
  track: string;
  album: string;
  artists: string[];
  spotifyId: string;
};

type CurrentlySaving = {
  [key: string]: boolean;
};

type SavedPlaylist = {
  savePlaylist: string;
};

const handleGraphQLError = (
  error: ApolloError,
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
) => {
  if (
    error?.graphQLErrors.some(({ message }) =>
      message.startsWith(`Access token and refresh token have expired`)
    )
  ) {
    localStorage.removeItem(`accessToken`);
    setIsLoggedIn(false);
  }
};

export const Home: React.FC<{}> = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  //HAVE TO MOVE TO USEAPISERVICE FOR MULTIPLE DOWNLOADS
  const { data, loading } = useQuery<SpotifyPlaylistQuery>(LIST_PLAYLISTS, {
    onError: (error) => handleGraphQLError(error, setIsLoggedIn),
  });
  const [
    savePlaylist,
    { data: savedPlaylist, loading: savingPlaylist },
  ] = useMutation<SavedPlaylist>(SAVE_PLAYLIST, {
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

  useEffect(() => {
    if (savedPlaylist) {
      //to save multiple files https://stackoverflow.com/questions/58904569/managing-multiple-calls-to-the-same-apollo-mutation
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
      FileSaver.saveAs(blob, `playlist.csv`);
    }
  }, [savedPlaylist]);

  console.log('saved playlist', savedPlaylist)

  const [currentlySaving, setCurrentlySaving] = useState<CurrentlySaving>({});

  const handleSavePlaylist = (id: string) => {
    setCurrentlySaving({ ...currentlySaving, [id]: true });
    savePlaylist({ variables: { id } });
  };

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
                {savingPlaylist && currentlySaving[id] ? (
                  <LoadingSpinner />
                ) : (
                  <td className="p-4" onClick={() => handleSavePlaylist(id)}>
                    Save
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
