import { createContext } from "react";

export const AppContext = createContext();

const AppProvider = (props) => {
  const value = {
    // Add any state or functions you want to provide to the context
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppProvider;
