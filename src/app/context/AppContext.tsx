"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  sessionData: Record<string, any>;
  setSessionData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<Record<string, any>>({});

  return (
    <AppContext.Provider value={{ sessionData, setSessionData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};