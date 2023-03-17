import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export interface DarkModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  size?: number;
}

export function DarkModeToggle({
  isDark,
  onToggle,
  size = 32,
}: DarkModeToggleProps) {
  return (
    <button
      type="button"
      title="Toggle Dark Mode"
      onClick={() => onToggle()}
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      className={`transition-colors duration-200 ${
        isDark
          ? "text-black hover:text-purple-300"
          : "text-white hover:text-yellow-400"
      }`}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
