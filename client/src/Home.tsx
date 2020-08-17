import React from "react";
import { useQuery } from "@apollo/client";
import { DataList, LIST_DATA } from "./gql";

export const Home: React.FC<{}> = () => {
  const { data } = useQuery<DataList>(LIST_DATA);
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center">Hello world</h1>
      {data?.list.map((data) => (
        <h2 className="text-2xl">
          name: {data.name}, age: {data.age}
        </h2>
      ))}
    </div>
  );
};
