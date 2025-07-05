"use client";
import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "../components/ThemeToggle";
import { tailwindColors } from "../constants/Color";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { useTheme } from "next-themes";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  // Add more as needed
];

const GENRES = [
  "Technology",
  "News",
  "Comedy",
  "Education",
  "Business",
  "Health",
  "Sports",
  "Music",
  "True Crime",
  // Add more as needed
];

export default function SettingsPage() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("ps_theme") || "system"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("ps_language") || "en"
  );
  const [genre, setGenre] = useState(
    () => localStorage.getItem("ps_genre") || ""
  );
  const [resultsPerPage, setResultsPerPage] = useState(
    () => Number(localStorage.getItem("ps_resultsPerPage")) || 8
  );
  const [showExplicit, setShowExplicit] = useState(
    () => localStorage.getItem("ps_showExplicit") === "true"
  );
  const [saved, setSaved] = useState(false);

  // Save to localStorage on change
  function persistSetting(key: string, value: string | number | boolean) {
    localStorage.setItem(key, String(value));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    persistSetting("ps_theme", theme);
    persistSetting("ps_language", language);
    persistSetting("ps_genre", genre);
    persistSetting("ps_resultsPerPage", resultsPerPage);
    persistSetting("ps_showExplicit", showExplicit);
    setTheme(theme); // Apply theme immediately
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div
      className={`min-h-screen ${tailwindColors.background} transition-colors`}
    >
      <Header hideSearchBar />
      <main className="w-full max-w-xl mx-auto py-6 px-3 sm:py-10 sm:px-6">
        <form className="flex flex-col gap-6" onSubmit={handleSave}>
          <div>
            <label
              className={`block mb-1 font-medium ${tailwindColors.text.primary}`}
            >
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setThemeState(e.target.value)}
              className="w-full rounded px-3 py-2 border focus:outline-none"
            >
              <option value="system">System Default</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label
              className={`block mb-1 font-medium ${tailwindColors.text.primary}`}
            >
              Summary Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded px-3 py-2 border focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block mb-1 font-medium ${tailwindColors.text.primary}`}
            >
              Favorite Podcast Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded px-3 py-2 border focus:outline-none"
            >
              <option value="">No preference</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block mb-1 font-medium ${tailwindColors.text.primary}`}
            >
              Results Per Page
            </label>
            <input
              type="number"
              min={4}
              max={20}
              value={resultsPerPage}
              onChange={(e) => setResultsPerPage(Number(e.target.value))}
              className="w-full rounded px-3 py-2 border focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showExplicit}
              onChange={(e) => setShowExplicit(e.target.checked)}
              id="explicit"
            />
            <label htmlFor="explicit" className={tailwindColors.text.primary}>
              Show explicit podcasts
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white rounded px-6 py-2 font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Save
          </button>
          {saved && (
            <div className="text-green-600 font-medium mt-2 text-center sm:text-left">
              Preferences saved!
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
