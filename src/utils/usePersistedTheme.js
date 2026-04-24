import { useEffect, useState } from "react";

const STORAGE_KEY = "theme"; // "light" | "dark" | "auto"

function applyTheme(value) {
  document.documentElement.setAttribute("data-bs-theme", value);
}

export default function usePersistedTheme(defaultTheme = "auto") {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || defaultTheme;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return [theme, setTheme];
}
