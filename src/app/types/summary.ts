export interface Summary {
  _id: string;
  episodeId: string;
  title: string;
  content: string;
  keyPoints: string[];
  sentiment: string;
  episodeImage?: string;
  podcastTitle?: string;
  pubDate?: string | number;
}
