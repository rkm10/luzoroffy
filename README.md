# Luzoroffy - Anime & Manga Discovery Platform

A modern, responsive web application for discovering and tracking anime and manga, built with Next.js 14 and powered by the Jikan API.

## 🌟 Features

- **User Authentication**
  - Email/Password and Google Sign-in
  - Protected routes and user profiles
  - Secure authentication with Firebase

- **Anime & Manga Discovery**
  - Current season anime listings
  - Top-rated anime and manga
  - Personalized recommendations
  - Random anime suggestions
  - Detailed information pages
  - Advanced search functionality

- **User Features**
  - Favorite anime/manga tracking
  - Personal watchlist
  - Responsive user interface
  - Dark theme design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Styling**: 
  - Tailwind CSS
  - Shadcn/ui components
  - Custom animations
  - Responsive design

### Backend & Database
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **API**: Jikan API (MyAnimeList)
- **State Management**: 
  - TanStack Query (React Query)
  - React Context

### Development Tools
- **Package Manager**: npm
- **Code Quality**:
  - ESLint
  - Prettier
- **Version Control**: Git

### Key Libraries
- **UI Components**:
  - @radix-ui/react-* (Various UI primitives)
  - class-variance-authority
  - clsx
  - tailwind-merge
  - lucide-react (Icons)
  - embla-carousel-react

- **Data Fetching & State**:
  - @tanstack/react-query
  - axios
  - firebase

- **Utilities**:
  - sonner (Toast notifications)
  - next-themes (Dark theme)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── anime/             # Anime-related pages
│   ├── manga/             # Manga-related pages
│   ├── seasons/           # Seasonal anime pages
│   ├── favorites/         # User favorites page
│   └── login/            # Authentication pages
│
├── components/
│   ├── ui/               # Shadcn UI components
│   └── custom/           # Custom components
│       ├── AnimeCard.jsx
│       ├── AnimeBanner.jsx
│       ├── SeasonalAnime.jsx
│       └── ...
├── contexts/             # React contexts
│   └── AuthContext.jsx   # Authentication context
├── hooks/               # Custom React hooks
│   └── useFavorites.js  # Favorites management
└── lib/                # Utility functions and API
    ├── firebase.js     # Firebase configuration
    ├── jikan.js        # Jikan API integration
    └── utils.js        # Helper functions
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rkm10/luzoroffy.git
   cd luzoroffy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🌐 Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fluzoroffy)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🔒 Authentication Flow

1. User signs up/logs in
2. Firebase authentication creates/validates credentials
3. User document created/accessed in Firestore
4. Auth context provides user state throughout app
5. Protected routes check auth status

## 🎨 Theme Customization

- Dark/Light mode support but have used only Dark
- Custom color schemes via Tailwind
- Consistent component styling with Shadcn/ui
- Smooth transitions and animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) for anime/manga data
- [Shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Firebase](https://firebase.google.com/) for authentication and database
- [Vercel](https://vercel.com/) for hosting

## 📧 Contact

Project Link: [https://github.com/rkm10/luzoroffy](https://github.com/rkm10/luzoroffy)

## 🔍 Key Features Breakdown

### Home Page
- Featured anime banner carousel
- Seasonal anime section
- Top-rated anime and manga sections
- Recommended content

### Anime/Manga Pages
- Comprehensive filtering options
- Detailed information display
- Character listings
- Related content recommendations

### Search Functionality
- Real-time search results
- Advanced filtering options
- Sort by popularity, rating, or title

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) for providing the anime/manga data
- [MyAnimeList](https://myanimelist.net/) for being the source database
- All the amazing open-source libraries that made this project possible

## ⚡ Performance Optimizations

### API Rate Limiting & Caching Strategy
- **Client-side Caching**: Implements TanStack Query's powerful caching mechanism
- **Stale Time**: 5 minutes for most queries, 1 hour for static data
- **Persistent Storage**: Leverages localStorage for offline data persistence
- **Rate Limit Handling**: Smart request queuing and retry mechanism
- **Batch Requests**: Optimized data fetching to minimize API calls
- **Error Recovery**: Graceful fallback to cached data during rate limits

### Cache Configuration
```javascript
// Default cache configuration
staleTime: 5 * 60 * 1000,        // Data stays fresh for 5 minutes
cacheTime: 60 * 60 * 1000,       // Cache persists for 1 hour
refetchOnWindowFocus: false,      // Prevent unnecessary refetches
refetchOnReconnect: false,        // Prevent refetch on reconnect
```
