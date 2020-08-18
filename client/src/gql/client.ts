import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({ uri: `http://localhost:4000/graphql` });

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem(`accessToken`);
  return {
    headers: {
      ...headers,
      accessToken
    }
  }
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
