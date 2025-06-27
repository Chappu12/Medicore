import { createContext } from "react";

export const DoctorContext = createContext();

const DoctorProvider = (props) => {
  const value = {
    // Add any state or functions you want to provide to the context
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};
export default DoctorProvider;