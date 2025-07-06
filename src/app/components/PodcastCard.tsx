import Image from "next/image";
import { tailwindColors } from "../constants/Color";
import { stripHtmlTags } from "../utils/htmlCleaner";

interface PodcastCardProps {
  image: string;
  title: string;
  description: string;
  publisher: string;
  onClick?: () => void;
}

export default function PodcastCard({
  image,
  title,
  description,
  publisher,
  onClick,
}: PodcastCardProps) {
  return (
    <div
      className={`flex gap-4 items-start p-4 rounded-lg ${tailwindColors.card.background} ${tailwindColors.card.hover} transition-colors cursor-pointer w-full flex-col sm:flex-row overflow-hidden`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      aria-label={`View episodes for podcast: ${title}`}
    >
      <Image
        src={image}
        alt={title ? title : "Podcast cover image"}
        width={64}
        height={64}
        className="rounded-lg object-contain flex-shrink-0 mb-2 sm:mb-0"
      />
      <div className="flex flex-col gap-1 flex-1 min-w-0 overflow-hidden">
        <h3
          className={`font-semibold text-base leading-tight ${tailwindColors.text.primary} truncate`}
        >
          {title}
        </h3>
        <p
          className={`text-sm ${tailwindColors.text.secondary} line-clamp-2 break-words overflow-hidden max-w-full`}
        >
          {stripHtmlTags(description)}
        </p>
        <span className={`text-xs ${tailwindColors.text.muted} mt-1`}>
          {publisher}
        </span>
      </div>
    </div>
  );
}
