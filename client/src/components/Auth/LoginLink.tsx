import React, { useContext } from "react";
import { LoggedInContext } from "./";

export const LoginLink: React.FC<{}> = () => {
  const { setIsLoggingIn } = useContext(LoggedInContext);
  return (
    <div className="flex justify-center">
      <a
        href={`${process.env.REACT_APP_SERVER_URL}/login`}
        className="bg-spotifyGreen p-3 rounded-sm"
        onClick={() => setIsLoggingIn(true)}
      >
        Get my playlists
      </a>
    </div>
  );
};
