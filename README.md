# 🎧 Podcast Summarizer

> An intelligent podcast episode summarizer that transforms lengthy episodes into digestible insights using AI.

**Desktop View:**
<img width="1470" alt="Desktop Screen" src="https://github.com/user-attachments/assets/01bc3843-2dba-4fc1-9a2c-ae1ed4a3d59e" />

**Mobile View(In dark mode):**


<img width="335" alt="Mobile Screen" src="https://github.com/user-attachments/assets/c517f442-0e13-43f6-a5e0-78bb5165e33d" />

---

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Clean-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/)
[![Type Safe](https://img.shields.io/badge/Type_Safe-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## ✨ Features

### 🔍 Podcast Discovery

- **Browse Trending Podcasts**: Discover the best podcasts using the Listen Notes API with pagination support
- **Smart Search**: Find podcasts by keywords with debounced search functionality and paginated results
- **Episode Browsing**: View latest episodes for any selected podcast with proper pagination
- **Duplicate Prevention**: Advanced deduplication system ensures no duplicate content across pages
- **API Flexibility**: Easy switching between Live and Mock ListenNotes APIs via environment configuration

### 🤖 AI-Powered Summarization

- **Intelligent Summaries**: Generate comprehensive episode summaries using Google Gemini and OpenAI GPT-4
- **Smart Fallback System**: Automatically uses episode descriptions when transcripts aren't available (especially with Live ListenNotes API)
- **Key Points Extraction**: Automatically identify and highlight the most important takeaways
- **Sentiment Analysis**: Understand the overall tone and mood of episodes
- **Multi-language Support**: Customize summary language through user preferences
- **Dual AI Provider Support**: Automatic failover between Gemini and OpenAI for reliability
- **Content Source Transparency**: Clear indicators when summaries are based on descriptions vs. full transcripts

### 👤 Personalized Experience

- **User Profiles**: Unique user identification with localStorage persistence
- **Save Summaries**: Store your favorite episode summaries for later reference
- **Personal Library**: Access all your saved summaries in one organized view
- **Smart Pagination**: Navigate through large collections with proper deduplication
- **Bulk Management**: Clear all summaries with a single click
- **Toast Notifications**: Real-time feedback for all user actions (save, delete, errors)
- **Individual Summary Management**: Delete specific summaries with instant feedback

### 🎨 Modern Interface

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Clean UI**: Modern, intuitive interface built with Tailwind CSS
- **Toast Notifications**: Elegant slide-in notifications for user feedback
- **Accessibility**: WCAG compliant design with proper contrast and navigation
- **Next.js Image Optimization**: Optimized image loading with automatic format conversion
- **Suspense Boundaries**: Proper loading states for better user experience
- **Smart Pagination Controls**: Consistent pagination with proper disabled states across all pages

### ⚙️ User Preferences

- **Theme Selection**: Choose your preferred color scheme
- **Content Filtering**: Control explicit content visibility
- **Results Customization**: Set number of results per page
- **Genre Preferences**: Set your favorite podcast genres
- **Language Preferences**: Set default language for AI summaries

## 🛠 Tech Stack

| Category             | Technologies                                     |
| -------------------- | ------------------------------------------------ |
| **Frontend**         | Next.js 15, React 19, TypeScript 5, Tailwind CSS |
| **Backend**          | Next.js API Routes, Node.js                      |
| **Database**         | MongoDB with Mongoose ODM                        |
| **AI Services**      | OpenAI GPT-4, Google Gemini                      |
| **External APIs**    | Listen Notes API                                 |
| **Styling**          | Tailwind CSS with next-themes                    |
| **State Management** | React Hooks, localStorage                        |
| **Code Quality**     | ESLint, TypeScript strict mode                   |
| **Type Safety**      | 100% TypeScript, shared type definitions         |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- API keys for OpenAI, Google Gemini, and Listen Notes

**Note**: If you don't have an API key for Listen Notes, you can still run the app in development with the Listen Notes API mocked. Set `USE_MOCK_API=true` in your `.env.local` file. However, Mock data is static and will not provide real-time podcast information or full transcripts for summarization. The app will automatically fall back to using episode descriptions for summarization when transcripts aren't available.

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
USE_MOCK_API=false  # Set to 'true' to use mock data for development

# AI Services
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_MODEL=gpt-4o  # Optional: specify model
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash  # Optional: specify model

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

5. **Build for production**

```bash
npm run build
npm start
```

6. **Development commands**

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npx tsc --noEmit
```

7. **Open your browser**
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
│   │   │   ├── SkeletonCard.tsx # Loading skeleton
│   │   │   ├── SummarySkeleton.tsx # Summary loading state
│   │   │   ├── ThemeToggle.tsx  # Dark/light mode toggle
│   │   │   └── ToastContainer.tsx # Toast notification system
│   │   ├── constants/           # App constants
│   │   │   └── Color.ts         # Tailwind color scheme
│   │   ├── types/               # Shared type definitions
│   │   │   ├── podcast.ts       # Podcast & Episode interfaces
│   │   │   └── summary.ts       # Summary interface
│   │   ├── models/              # MongoDB models
│   │   │   ├── Summary.ts       # Summary data model
│   │   │   ├── User.ts          # User data model
│   │   │   └── index.ts         # Model exports
│   │   ├── repositories/        # Data access layer
│   │   │   ├── summaryRepository.ts
│   │   │   └── userRepository.ts
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useBestPodcasts.ts
│   │   │   ├── usePodcastMetadata.ts
│   │   │   └── useToast.ts      # Toast notification hook
│   │   ├── utils/               # Utility functions
│   │   │   ├── mongodb.ts       # Database connection
│   │   │   ├── openai.ts        # OpenAI API integration
│   │   │   ├── gemini.ts        # Google Gemini integration
│   │   │   ├── listenNotesApi.ts # Listen Notes API
│   │   │   ├── deduplication.ts # Data deduplication utilities
│   │   │   └── userPreferences.ts # User preference management
│   │   ├── api/                 # API routes
│   │   │   ├── best-podcasts/   # Trending podcasts
│   │   │   ├── search-podcasts/ # Podcast search
│   │   │   ├── episodes/        # Episode data & transcripts
│   │   │   ├── summaries/       # Summary CRUD operations
│   │   │   └── summarize/       # AI summarization
│   │   ├── episodes/            # Episode browsing page
│   │   ├── summaries/           # Summary management page
│   │   ├── settings/            # User preferences page
│   │   ├── page.tsx             # Home page
│   │   ├── layout.tsx           # App layout
│   │   └── globals.css          # Global styles
│   └── public/                  # Static assets
│       ├── images/              # App images
│       └── favicon.png          # App icon
├── .env.local                   # Environment variables
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
└── README.md                   # Project documentation
```

## 🔗 API Endpoints

| Endpoint                   | Method          | Description                            |
| -------------------------- | --------------- | -------------------------------------- |
| `/api/best-podcasts`       | GET             | Fetch trending podcasts (paginated)    |
| `/api/search-podcasts`     | GET             | Search podcasts by query (paginated)   |
| `/api/episodes`            | GET             | Get episodes for a podcast (paginated) |
| `/api/episodes/transcript` | GET             | Get episode transcript or description  |
| `/api/summaries`           | GET/POST/DELETE | Manage user summaries (paginated)      |
| `/api/summarize`           | POST            | Generate AI summaries with fallback    |

## 🌟 Key Features in Detail

### AI Summarization

The app uses multiple AI models with intelligent fallback systems to ensure high-quality summaries:

- **Primary**: Google Gemini 2.0 Flash for fast, accurate summarization
- **Fallback**: OpenAI GPT-4 for comprehensive text understanding
- **Smart Content Handling**: Uses transcripts when available, automatically falls back to episode descriptions
- **Content Source Transparency**: Clear user notifications when summaries are based on descriptions vs. full transcripts
- **HTML Content Cleaning**: Automatic removal of HTML tags and entities from all podcast content before display and AI processing
- **Multi-language Support**: Configurable summary language and style preferences
- **Robust Error Recovery**: Graceful handling when AI services are unavailable
- **Response Processing**: Smart parsing of JSON-wrapped responses and markdown formatting

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimized with Next.js 15 and React 19
- **Accessibility**: WCAG 2.1 AA compliant interface
- **Toast Notifications**: Real-time feedback system for all user actions
- **Smart Pagination**: Proper page navigation with deduplication across all lists
- **State Management**: Efficient state handling with React hooks and localStorage
- **Loading States**: Skeleton components and suspense boundaries
- **Error Handling**: User-friendly error messages and recovery options
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Data Management

- **MongoDB**: Scalable document database for user data and summaries
- **Mongoose**: Object modeling for clean data operations
- **Local Storage**: Client-side preferences and user identification
- **Advanced Deduplication**: Prevents duplicate episodes/podcasts across paginated results
- **Type Safety**: Strongly typed data models and API responses
- **Data Validation**: Input sanitization and validation at all levels
- **Efficient Pagination**: Proper offset-based pagination with ListenNotes API compatibility

---

<div align="center">
  <p><b>Built with ❤️ for podcast lovers everywhere<b></p>
  <p>
    <a href="#-podcast-summarizer">Back to top</a>
  </p>
</div>
