import React from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./gql";
import { Home } from "./Home";

export const App: React.FC<{}> = () => {
  return (
    <ApolloProvider client={client}>
      <Home />
    </ApolloProvider>
  );
};
