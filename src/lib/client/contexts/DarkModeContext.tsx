"use client";

import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useLocalStorageItem } from "../hooks/useLocalStorageItem";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface DarkModeContextProps {
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps>(
  {} as unknown as DarkModeContextProps
);

interface DarkModeProviderProps {
  prefersDarkMode?: boolean | null;
}

export const DarkModeProvider: React.FC<
  PropsWithChildren<DarkModeProviderProps>
> = ({ children, ...props }) => {
  let { prefersDarkMode } = props;

  // By default we use dark mode
  if (prefersDarkMode == null) {
    prefersDarkMode = true;
  }

  const prefersDarkColorScheme = useMediaQuery(
    "(prefers-color-scheme: dark)",
    prefersDarkMode
  );

  const darkMode = useLocalStorageItem<boolean>("dark", {
    defaultValue: prefersDarkColorScheme,
  });

  const isDarkMode = useMemo(() => darkMode.get(), [darkMode]);

  const setDarkMode = useCallback(
    (value: boolean) => {
      darkMode.set(value);
      fetch(`/api/p?dark=${value}`, { method: "POST" }).catch(console.error);
    },
    [darkMode]
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode, setDarkMode]);

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, setDarkMode, toggleDarkMode }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
