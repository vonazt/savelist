import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import qs, { ParsedQs } from "qs";

export const LoginCallback: React.FC<{}> = () => {
  const { search } = useLocation();
  const [areTokensSet, setAreTokensSet] = useState<boolean>(false);

  useEffect(() => {
    const {
      access_token,
      refresh_token,
    }: ParsedQs = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    localStorage.setItem(`accessToken`, access_token as string);
    localStorage.setItem(`refreshToken`, refresh_token as string);
    setAreTokensSet(true);
  }, [search]);

  return areTokensSet ? <Redirect to={`/`} /> : <h1>Logging in</h1>;
};
