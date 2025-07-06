export interface Podcast {
  id: string;
  image: string;
  title: string;
  description: string;
  publisher: string;
}

export interface Episode {
  id: string;
  title: string;
  description: string;
  pub_date_ms?: number;
  pub_date?: string;
  audio?: string;
  image?: string;
  thumbnail?: string;
  // Add other fields as needed
}
