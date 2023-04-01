import type { Config } from "tailwindcss";
import tailwindScrollbar from "tailwind-scrollbar";
import customColors from "./theme/colors";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...customColors,
      },
    },
  },
  plugins: [tailwindScrollbar({ nocompatible: true })],
} satisfies Config;
