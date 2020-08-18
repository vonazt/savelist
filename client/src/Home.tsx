import React from "react";
import { useQuery } from "@apollo/client";
import { DataList, LIST_DATA } from "./gql";

export const Home: React.FC<{}> = () => {
  // const { data } = useQuery<DataList>(LIST_DATA);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center">Welcome to the Spotify back up app</h1>
      <button>Login to Spotify</button>
    </div>
  );
};
