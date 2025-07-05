import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import { tailwindColors } from "../constants/Color";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";

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
  return (
    <header
      className={`flex flex-col sm:flex-row items-center justify-between w-full py-4 px-3 sm:px-6 ${tailwindColors.background} border-b ${tailwindColors.border}`}
    >
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <Image
          src="/images/podcast_summarizer 512.png"
          alt="Podcast Summarizer Logo"
          width={32}
          height={32}
          className="rounded"
        />
        <span className={`font-bold text-lg ${tailwindColors.text.primary}`}>
          Podcast Summarizer
        </span>
      </div>
      <nav className="flex gap-4 sm:gap-6 items-center text-sm sm:text-base mb-2 sm:mb-0">
        <a
          href="/"
          className={`hover:underline underline-offset-4 font-medium ${tailwindColors.text.secondary}`}
        >
          Home
        </a>
        <a
          href="/summaries"
          className={`hover:underline underline-offset-4 font-medium ${tailwindColors.text.secondary}`}
        >
          Summaries
        </a>
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
