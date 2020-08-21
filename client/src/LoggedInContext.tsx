import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export type LoggedInContextProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  isLoggingIn: boolean;
  setIsLoggingIn: Dispatch<SetStateAction<boolean>>;
};

export const LoggedInContext = createContext<LoggedInContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => null,
  isLoggingIn: false,
  setIsLoggingIn: () => null,
});

type Props = {
  children: React.ReactNode;
};

export const LoggedInContextProvider: React.FC<Props> = ({
  children,
}: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const context = {
    isLoggedIn,
    setIsLoggedIn,
    isLoggingIn,
    setIsLoggingIn,
  };

  return (
    <LoggedInContext.Provider value={context}>
      {children}
    </LoggedInContext.Provider>
  );
};
