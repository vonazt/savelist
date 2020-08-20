import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { LIST_PLAYLISTS } from "./gql";

export const Home: React.FC<{}> = () => {
  const [isLoginAgain, setIsLoginAgain] = useState<boolean>(false);
  const { data, error } = useQuery<string>(LIST_PLAYLISTS, {
    onError: () => {
      if (
        error?.graphQLErrors.some(({ message }) =>
          message.startsWith(`Access token and refresh token have expired`)
        )
      )
        setIsLoginAgain(true);
    },
  });
  const accessToken = localStorage.getItem(`accessToken`);
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center">
        Welcome to the Spotify back up app
      </h1>
      {(!accessToken || isLoginAgain) && (
        <a href="http://localhost:4000/login">Login to Spotify</a>
      )}
    </div>
  );
};
