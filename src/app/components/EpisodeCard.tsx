import { tailwindColors } from "../constants/Color";

interface EpisodeCardProps {
  title: string;
  description: string;
  pubDate: string | number;
  audio?: string;
  onSummarize?: () => void;
  summarizing?: boolean;
  summary?: string;
  transcript?: string;
  onDelete?: () => void; // Add onDelete prop
  onShowTranscript?: () => void;
  showTranscriptButton?: boolean;
  transcriptLoading?: boolean;
}

export default function EpisodeCard({
  title,
  description,
  pubDate,
  audio,
  onSummarize,
  summarizing = false,
  summary,
  transcript,
  onDelete, // Add onDelete prop
}: EpisodeCardProps) {
  return (
    <div
      className={`p-4 rounded-lg ${tailwindColors.card.background} ${tailwindColors.card.hover} transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex-1">
          <h2
            className={`font-semibold text-lg ${tailwindColors.text.primary}`}
          >
            {title}
          </h2>
          <p
            className={`text-sm ${tailwindColors.text.secondary} line-clamp-2`}
          >
            {description}
          </p>
          <span className={`text-xs ${tailwindColors.text.muted}`}>
            {typeof pubDate === "number"
              ? new Date(pubDate).toLocaleDateString()
              : pubDate}
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {onSummarize && (
              <button
                onClick={onSummarize}
                className="bg-blue-500 text-white rounded px-4 py-1 font-medium hover:bg-blue-700 transition disabled:opacity-60"
                disabled={summarizing}
              >
                {summarizing ? "Summarizing..." : "Summarize"}
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-500 text-white rounded px-4 py-1 font-medium hover:bg-red-700 transition ml-2"
              >
                Delete
              </button>
            )}
          </div>
          {summary && (
            <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-800 dark:text-gray-200">
              <strong>Summary:</strong> {summary}
            </div>
          )}
          {transcript && (
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs text-gray-700 dark:text-gray-200 max-h-60 overflow-y-auto whitespace-pre-line">
              <strong>Transcript:</strong>
              <div className="mt-1">{transcript}</div>
            </div>
          )}
        </div>
        {audio && (
          <audio controls className="w-full sm:w-48 mt-2 sm:mt-0">
            <source src={audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}
