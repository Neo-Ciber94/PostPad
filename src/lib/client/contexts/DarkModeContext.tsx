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

export const DarkModeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const darkMode = useLocalStorageItem<boolean>("dark", {
    defaultValue: prefersDarkMode,
  });

  const isDarkMode = useMemo(() => darkMode.value, [darkMode.value]);

  const setDarkMode = useCallback(
    (value: boolean) => {
      darkMode.set(value);
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
