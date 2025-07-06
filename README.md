# 🎧 Podcast Summarizer

> An intelligent podcast episode summarizer that transforms lengthy episodes into digestible insights using AI.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Clean-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/)
[![Type Safe](https://img.shields.io/badge/Type_Safe-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

## ✨ Features

### 🔍 Podcast Discovery

- **Browse Trending Podcasts**: Discover the best podcasts using the Listen Notes API
- **Smart Search**: Find podcasts by keywords with debounced search functionality
- **Episode Browsing**: View latest episodes for any selected podcast

### 🤖 AI-Powered Summarization

- **Intelligent Summaries**: Generate comprehensive episode summaries using Google Gemini and OpenAI GPT-4
- **Key Points Extraction**: Automatically identify and highlight the most important takeaways
- **Sentiment Analysis**: Understand the overall tone and mood of episodes
- **Multi-language Support**: Customize summary language through user preferences
- **Fallback System**: Automatic failover between AI providers for reliability

### 👤 Personalized Experience

- **User Profiles**: Unique user identification with localStorage persistence
- **Save Summaries**: Store your favorite episode summaries for later reference
- **Personal Library**: Access all your saved summaries in one organized view
- **Bulk Management**: Clear all summaries with a single click
- **Pagination**: Navigate through large collections of saved summaries

### 🎨 Modern Interface

- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Clean UI**: Modern, intuitive interface built with Tailwind CSS
- **Accessibility**: WCAG compliant design with proper contrast and navigation
- **Next.js Image Optimization**: Optimized image loading with automatic format conversion
- **Suspense Boundaries**: Proper loading states for better user experience

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

**Note**: If you don't have an API key for Listen Notes, you can still run the app in development with the Listen Notes API mocked. However, these are Mock / Static data and will not provide real-time podcast information. You can do this in `utils/listenNotesApi.ts`. See below:

Comment out the Listen Notes API key and use the mock URL instead:

```typescript
// const LISTEN_NOTES_API_KEY = process.env.LISTEN_NOTES_API_KEY;
// const BASE_URL = "https://listen-api.listennotes.com/api/v2";
const MOCK_URL = "https://listen-api-test.listennotes.com/api/v2";
```

No API key is required for the mock data.

```typescript
const res = await axios.get(url, {
  params,
  headers: {
    // "X-ListenAPI-Key": LISTEN_NOTES_API_KEY!,
  },
});
```

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
│   │   │   └── ThemeToggle.tsx  # Dark/light mode toggle
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
│   │   │   └── usePodcastMetadata.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── mongodb.ts       # Database connection
│   │   │   ├── openai.ts        # OpenAI API integration
│   │   │   ├── gemini.ts        # Google Gemini integration
│   │   │   └── listenNotesApi.ts # Listen Notes API
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

| Endpoint                   | Method          | Description                |
| -------------------------- | --------------- | -------------------------- |
| `/api/best-podcasts`       | GET             | Fetch trending podcasts    |
| `/api/search-podcasts`     | GET             | Search podcasts by query   |
| `/api/episodes`            | GET             | Get episodes for a podcast |
| `/api/episodes/transcript` | GET             | Get episode transcript     |
| `/api/summaries`           | GET/POST/DELETE | Manage user summaries      |
| `/api/summarize`           | POST            | Generate AI summaries      |

## 🌟 Key Features in Detail

### AI Summarization

The app uses multiple AI models to ensure high-quality summaries:

- **Primary**: Google Gemini for redundancy and comparison
- **Fallback**: OpenAI GPT-4 for comprehensive text understanding
- **Features**: Configurable summary length, language, and style
- **Smart Parsing**: Handles JSON-wrapped responses and markdown formatting
- **Error Recovery**: Graceful fallback when AI services are unavailable

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance**: Optimized with Next.js 15 and React 19
- **Accessibility**: WCAG 2.1 AA compliant interface
- **State Management**: Efficient state handling with React hooks
- **Loading States**: Skeleton components and suspense boundaries
- **Error Handling**: User-friendly error messages and recovery options

### Data Management

- **MongoDB**: Scalable document database for user data and summaries
- **Mongoose**: Object modeling for clean data operations
- **Local Storage**: Client-side preferences and user identification
- **Type Safety**: Strongly typed data models and API responses
- **Data Validation**: Input sanitization and validation at all levels

### Code Quality

- **100% TypeScript**: Complete type safety with zero `any` types
- **ESLint Clean**: Zero linting errors or warnings
- **Shared Types**: Consistent interfaces across components and APIs
- **Clean Architecture**: Separation of concerns with clear boundaries
- **Error Boundaries**: Proper error handling throughout the application
- **Performance Optimized**: Code splitting and lazy loading where appropriate

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Follow our coding standards**
   - Maintain 100% TypeScript coverage (no `any` types)
   - Ensure ESLint passes with zero warnings
   - Add proper type definitions for new features
   - Use shared types from `src/app/types/`
4. **Test your changes**
   ```bash
   npm run build  # Ensure build passes
   npm run lint   # Ensure no linting errors
   npx tsc --noEmit  # Type check
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
7. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow existing patterns for API routes and components
- Implement proper error handling
- Add loading states for async operations
- Use Next.js Image component for images
- Wrap components using `useSearchParams` in Suspense boundaries

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
