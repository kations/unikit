import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

export const AppContext = React.createContext<any>({});

export const AppContextProvider = ({ children }: Props) => {
  const [state, setState] = React.useState({
    dark: false,
  });

  const set = (obj: any) => {
    setState({ ...state, ...obj });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        set,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const appState = React.useContext(AppContext);
  return appState;
};
