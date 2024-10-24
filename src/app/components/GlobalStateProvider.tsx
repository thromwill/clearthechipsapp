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
  removeState: (...keys: string[]) => void;  // Add this to the context
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateData] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedState = sessionStorage.getItem("globalState");
    if (savedState) {
      setStateData(JSON.parse(savedState));
    }
  }, []);

  const setState = (key: string, value: any) => {
    setStateData((prevState) => {
      const newState = { ...prevState, [key]: value };
      sessionStorage.setItem("globalState", JSON.stringify(newState));
      return newState;
    });
  };

  const getState = (key: string) => {
    return state[key];
  };

  // New removeState function
  const removeState = (...keys: string[]) => {
    setStateData((prevState) => {
      let newState;
      if (keys.length === 0) {
        // If no keys passed, reset the entire state
        newState = {};
      } else {
        // If keys are passed, remove only those keys
        newState = { ...prevState };
        keys.forEach((key) => {
          delete newState[key];
        });
      }
      sessionStorage.setItem("globalState", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <GlobalStateContext.Provider value={{ state, setState, getState, removeState }}>
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
