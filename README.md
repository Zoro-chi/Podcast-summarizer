# 🎧 Podcast Summarizer

> An intelligent podcast episode summarizer that transforms lengthy episodes into digestible insights using AI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

## ✨ Features

### 🔍 Podcast Discovery

- **Browse Trending Podcasts**: Discover the best podcasts using the Listen Notes API
- **Smart Search**: Find podcasts by keywords with debounced search functionality
- **Episode Browsing**: View latest episodes for any selected podcast

### 🤖 AI-Powered Summarization

- **Intelligent Summaries**: Generate comprehensive episode summaries using OpenAI GPT-4 and Google Gemini
- **Key Points Extraction**: Automatically identify and highlight the most important takeaways
- **Sentiment Analysis**: Understand the overall tone and mood of episodes
- **Multi-language Support**: Customize summary language through user preferences

### 👤 Personalized Experience

- **User Profiles**: Unique user identification with localStorage persistence
- **Save Summaries**: Store your favorite episode summaries for later reference
- **Personal Library**: Access all your saved summaries in one organized view
- **Bulk Management**: Clear all summaries with a single click

### 🎨 Modern Interface

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Clean UI**: Modern, intuitive interface built with Tailwind CSS
- **Accessibility**: WCAG compliant design with proper contrast and navigation

### ⚙️ User Preferences

- **Theme Selection**: Choose your preferred color scheme
- **Content Filtering**: Control explicit content visibility
- **Results Customization**: Set number of results per page
- **Genre Preferences**: Set your favorite podcast genres

## 🛠 Tech Stack

| Category             | Technologies                                   |
| -------------------- | ---------------------------------------------- |
| **Frontend**         | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend**          | Next.js API Routes, Node.js                    |
| **Database**         | MongoDB with Mongoose ODM                      |
| **AI Services**      | OpenAI GPT-4, Google Gemini                    |
| **External APIs**    | Listen Notes API                               |
| **Styling**          | Tailwind CSS with next-themes                  |
| **State Management** | React Hooks, localStorage                      |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- API keys for OpenAI, Google Gemini, and Listen Notes

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/podcast-summarizer.git
cd podcast-summarizer
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# Listen Notes API for podcast data
LISTEN_NOTES_API_KEY=your_listen_notes_api_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_gemini_api_key

# Database
MONGODB_URI=your_mongodb_connection_string

# Optional: Next.js configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
podcast-summarizer/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Header.tsx       # Navigation header
│   │   │   ├── SearchBar.tsx    # Podcast search component
│   │   │   ├── PodcastCard.tsx  # Podcast display card
│   │   │   ├── EpisodeCard.tsx  # Episode display card
│   │   │   └── ThemeToggle.tsx  # Dark/light mode toggle
│   │   ├── constants/           # App constants
│   │   │   └── Color.ts         # Tailwind color scheme
│   │   ├── models/              # MongoDB models
│   │   │   ├── Summary.ts       # Summary data model
│   │   │   └── User.ts          # User data model
│   │   ├── repositories/        # Data access layer
│   │   │   ├── summaryRepository.ts
│   │   │   └── userRepository.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── mongodb.ts       # Database connection
│   │   │   ├── openai.ts        # OpenAI API integration
│   │   │   ├── gemini.ts        # Google Gemini integration
│   │   │   └── listenNotesApi.ts # Listen Notes API
│   │   ├── api/                 # API routes
│   │   │   ├── best-podcasts/   # Trending podcasts
│   │   │   ├── search-podcasts/ # Podcast search
│   │   │   ├── episodes/        # Episode data
│   │   │   ├── summaries/       # Summary CRUD operations
│   │   │   └── summarize/       # AI summarization
│   │   ├── episodes/            # Episode browsing page
│   │   ├── summaries/           # Summary management page
│   │   ├── settings/            # User preferences page
│   │   └── globals.css          # Global styles
│   └── public/                  # Static assets
├── .env.local                   # Environment variables
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── README.md                   # Project documentation
```

## 🔗 API Endpoints

| Endpoint               | Method          | Description                |
| ---------------------- | --------------- | -------------------------- |
| `/api/best-podcasts`   | GET             | Fetch trending podcasts    |
| `/api/search-podcasts` | GET             | Search podcasts by query   |
| `/api/episodes`        | GET             | Get episodes for a podcast |
| `/api/summaries`       | GET/POST/DELETE | Manage user summaries      |
| `/api/summarize`       | POST            | Generate AI summaries      |

## 🌟 Key Features in Detail

### AI Summarization

The app uses multiple AI models to ensure high-quality summaries:

- **Primary**: OpenAI GPT-4 for comprehensive text understanding
- **Fallback**: Google Gemini for redundancy and comparison
- **Features**: Configurable summary length, language, and style

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimized with Next.js 15 and React 19
- **Accessibility**: WCAG 2.1 AA compliant interface
- **State Management**: Efficient state handling with React hooks

### Data Management

- **MongoDB**: Scalable document database for user data and summaries
- **Mongoose**: Object modeling for clean data operations
- **Local Storage**: Client-side preferences and user identification

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Listen Notes](https://www.listennotes.com/) for podcast data
- [OpenAI](https://openai.com/) for GPT-4 API
- [Google](https://ai.google.dev/) for Gemini API
- [Vercel](https://vercel.com/) for deployment platform
- [Tailwind CSS](https://tailwindcss.com/) for styling framework

---

<div align="center">
  <p>Built with ❤️ for podcast lovers everywhere</p>
  <p>
    <a href="#-podcast-summarizer">Back to top</a>
  </p>
</div>
