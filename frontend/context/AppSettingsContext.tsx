
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AppSettingsContextType {
  appName: string;
  setAppName: (name: string) => void;
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
}

export const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appName, setAppName] = useState<string>(() => {
    return localStorage.getItem('appName') || 'MobilePOS';
  });

  const [backgroundImage, setBackgroundImage] = useState<string | null>(() => {
    return localStorage.getItem('backgroundImage');
  });

  useEffect(() => {
    localStorage.setItem('appName', appName);
  }, [appName]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem('backgroundImage', backgroundImage);
    } else {
      localStorage.removeItem('backgroundImage');
    }
  }, [backgroundImage]);

  return (
    <AppSettingsContext.Provider value={{ appName, setAppName, backgroundImage, setBackgroundImage }}>
      {children}
    </AppSettingsContext.Provider>
  );
};