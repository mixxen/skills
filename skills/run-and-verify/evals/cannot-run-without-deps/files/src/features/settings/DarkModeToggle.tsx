import { useState } from "react";

function initialDark(): boolean {
  return localStorage.getItem("theme") === "dark";
}

export function DarkModeToggle() {
  const [dark, setDark] = useState(initialDark);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("darkMode", next ? "dark" : "light");
  }

  return (
    <label>
      <input type="checkbox" checked={dark} onChange={toggle} /> Dark mode
    </label>
  );
}
