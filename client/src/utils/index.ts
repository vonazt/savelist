import { ApolloError } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";

export const handleGraphQLError = (
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
