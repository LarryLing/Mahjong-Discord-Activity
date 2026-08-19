import { createContext } from "react";

export type Theme = "dark" | "light";

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => null,
});

export default ThemeContext;
