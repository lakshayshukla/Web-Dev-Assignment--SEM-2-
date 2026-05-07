import { useState } from "react";
import { getIsDark, setIsDark } from "./themeStore";

export function useTheme() {
  const [isDark, setLocal] = useState(getIsDark());

  const toggle = () => {
    const newVal = !isDark;
    setIsDark(newVal);
  };

  return { isDark, toggle };
}