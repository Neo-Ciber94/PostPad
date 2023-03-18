import { useDarkMode } from "@/lib/client/contexts/DarkModeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export interface DarkModeToggleProps {
  size?: number;
}

export function DarkModeToggle({ size = 32 }: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      title="Toggle Dark Mode"
      onClick={() => toggleDarkMode()}
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      className={`transition-colors duration-200 ${
        isDarkMode
          ? "text-white hover:text-yellow-400"
          : "text-black hover:text-purple-300"
      }`}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
