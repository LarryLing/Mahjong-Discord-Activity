import { useContext } from "react";

import ThemeContext from "@/contexts/ThemeContext";

const useTheme = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("useTheme must be used within an ThemeProvider");
  }

  return themeContext;
};

export default useTheme;
