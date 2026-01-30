'use client'; 
import { createContext, useContext, useState, ReactNode } from 'react';

interface SharedData {
  restaurantDetails: {
    restaurantName: string;
    restaurantLogo: string;
    eposLocationId:string;
  } | null;

}

interface DataContextType {
  sharedData: SharedData | null;
  setSharedData: (data: SharedData | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [sharedData, setSharedData] = useState<SharedData | null>(null);

  return (
    <DataContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};