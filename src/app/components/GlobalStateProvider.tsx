"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface GlobalStateContextType {
  state: Record<string, any>;
  setState: (key: string, value: any) => void;
  getState: (key: string) => any;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateData] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedState = localStorage.getItem("globalState");
    if (savedState) {
      setStateData(JSON.parse(savedState));
    }
  }, []);

  const setState = (key: string, value: any) => {
    setStateData((prevState) => {
      const newState = { ...prevState, [key]: value };
      localStorage.setItem("globalState", JSON.stringify(newState));
      return newState;
    });
  };

  const getState = (key: string) => {
    return state[key];
  };

  return (
    <GlobalStateContext.Provider value={{ state, setState, getState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
