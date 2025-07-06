"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { tailwindColors } from "../constants/Color";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="rounded-full p-2 w-10 h-10 border border-gray-200 bg-gray-100">
        🌙
      </div>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  const handleToggle = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("ps_theme", newTheme); // Save preference immediately
  };

  return (
    <button
      className={`rounded-full p-2 border ${tailwindColors.border} ${tailwindColors.input.background} ${tailwindColors.card.hover} transition-colors`}
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
