import React from "react";
import { useQuery } from "@apollo/client";
import { LIST_PLAYLISTS } from "./gql";

export const Home: React.FC<{}> = () => {
  const { data } = useQuery<string>(LIST_PLAYLISTS);
  const accessToken = localStorage.getItem(`accessToken`);
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center">
        Welcome to the Spotify back up app
      </h1>
      {!accessToken && (
        <a href="http://localhost:4000/login">Login to Spotify</a>
      )}
    </div>
  );
};
