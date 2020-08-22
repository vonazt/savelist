import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import qs, { ParsedQs } from "qs";

export const LoginCallback: React.FC<{}> = () => {
  const { search } = useLocation();
  const [isAccessTokenSet, setIsAccessTokensSet] = useState<boolean>(false);

  useEffect(() => {
    const { access_token }: ParsedQs = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    localStorage.setItem(`accessToken`, access_token as string);
    setIsAccessTokensSet(true);
  }, [search]);

  return isAccessTokenSet ? <Redirect to={`/`} /> : <h1>Logging in</h1>;
};
