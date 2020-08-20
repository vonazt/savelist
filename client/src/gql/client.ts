import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  ApolloLink,
  Operation,
  NextLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({ uri: `http://localhost:4000/graphql` });

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem(`accessToken`);
  if (accessToken)
    return {
      headers: {
        ...headers,
        accessToken,
      },
    };
});

const afterWare = new ApolloLink((operation: Operation, forward: NextLink) => {
  return forward(operation).map((result) => {
    const accessToken = operation
      .getContext()
      .response.headers.get(`accessToken`);
    if (accessToken) localStorage.setItem(`accessToken`, accessToken);
    return result;
  });
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: afterWare.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});
