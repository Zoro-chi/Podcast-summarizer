import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { tailwindColors } from "../constants/Color";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  search?: string;
  onSearchChange?: (v: string) => void;
  onSearchEnter?: () => void;
  hideSearchBar?: boolean;
}

export default function Header({
  search = "",
  onSearchChange = () => {},
  onSearchEnter,
  hideSearchBar = false,
}: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header
      className={`flex flex-col sm:flex-row items-center justify-between w-full py-4 px-3 sm:px-6 ${tailwindColors.background} border-b ${tailwindColors.border}`}
    >
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <Image
          src="/images/podcast_summarizer_512.png"
          alt="Podcast Summarizer Logo"
          width={32}
          height={32}
          className="rounded"
        />
        <span className={`font-bold text-lg ${tailwindColors.text.primary}`}>
          Podcast Summarizer
        </span>
      </div>
      {/* Hamburger for mobile */}
      <div className="sm:hidden absolute right-6 top-5 z-20">
        <button
          aria-label="Open navigation menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="focus:outline-none"
        >
          <svg
            className="w-7 h-7 text-gray-700 dark:text-gray-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div
            className={`absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col z-30`}
          >
            <Link
              href="/"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/summaries"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              Summaries
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        )}
      </div>
      {/* Desktop nav */}
      <nav className="hidden sm:flex gap-4 sm:gap-6 items-center text-sm sm:text-base mb-2 sm:mb-0">
        <Link
          href="/"
          className={`hover:underline underline-offset-4 font-medium ${tailwindColors.text.secondary}`}
        >
          Home
        </Link>
        <Link
          href="/summaries"
          className={`hover:underline underline-offset-4 font-medium ${tailwindColors.text.secondary}`}
        >
          Summaries
        </Link>
      </nav>
      <div className="flex items-center gap-3 sm:gap-4">
        {!hideSearchBar && (
          <SearchBar
            value={search}
            onChange={onSearchChange}
            onEnter={onSearchEnter}
          />
        )}
        <Image
          src="/images/user.jpeg"
          alt="User avatar"
          width={36}
          height={36}
          className={`rounded-full border ${tailwindColors.border} cursor-pointer`}
          onClick={() => router.push("/settings")}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
