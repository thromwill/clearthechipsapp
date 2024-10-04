"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  data: any;
  loading: boolean;
  error: Error | null;
  setData: (newData: any) => void;
  updateField: (field: string, value: any) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const updateField = (field: string, value: any) => {
    setData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const value = {
    data,
    loading,
    error,
    setData,
    updateField,
  };

  console.log('Context Data:', { data, loading, error });

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};