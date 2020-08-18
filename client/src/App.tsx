import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "./gql";
import { Home } from "./Home";
import { LoginCallback } from "./LoginCallback";

export const App: React.FC<{}> = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/login_callback" component={LoginCallback} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};
