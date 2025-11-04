# MovieFlix - Movie Discovery App

A modern movie and TV show discovery application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎬 **Trending Movies & TV Shows:** Discover the latest and most popular movies and TV shows.
- 🔍 **Advanced Search:** Find movies and TV shows with powerful search and filtering options.
- 📚 **Personal Watchlist:** Manage your own watchlist of movies and TV shows to watch later.
- ℹ️ **Detailed Information:** Get detailed information about movies and TV shows, including ratings, cast, and crew.
- 🌙 **Dark/Light Theme:** Switch between dark and light themes for a comfortable viewing experience.
- 📱 **Responsive Design:** Enjoy a seamless experience on any device, from mobile to desktop.
- ⚡ **Optimized Performance:** Built with Next.js for fast loading times and a smooth user experience.

## Features in Detail

### Trending Section

The trending section on the home page showcases the most popular movies and TV shows right now. You can easily see what's hot and start exploring.

### Advanced Search

The search page allows you to find any movie or TV show by title. You can also filter the results by genre, year, and other criteria to narrow down your search.

### Personal Watchlist

With the watchlist feature, you can save movies and TV shows that you want to watch later. You can easily add and remove items from your watchlist, and it's a great way to keep track of your to-watch list.

### Detailed Information

When you click on a movie or TV show, you'll be taken to a detailed information page. Here you can find everything you need to know, including:

-   **Poster and backdrop images**
-   **Ratings from different sources**
-   **A summary of the plot**
-   **Information about the cast and crew**
-   **And much more!**

## Getting Started

### Prerequisites

-   Node.js 18.17 or later
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/stkisengese/movie-hub.git movieflix
    cd movieflix
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    ```bash
    cp .env.local.example .env.local
    ```

4.  Get your API keys:
    -   [TMDB API Key](https://www.themoviedb.org/settings/api)
    -   [OMDB API Key](http://www.omdbapi.com/apikey.aspx)

5.  Add your API keys to `.env.local`:
    ```env
    TMDB_API_KEY=your_tmdb_api_key_here
    OMDB_API_KEY=your_omdb_api_key_here
    ```

6.  Run the development server:
    ```bash
    npm run dev
    ```

7.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
movieflix/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── components-demo/    # Components demo page
│   ├── movie/              # Movie details page
│   ├── search/             # Search page
│   ├── trending/           # Trending page
│   ├── tv/                 # TV show details page
│   ├── watchlist/          # Watchlist page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable components
│   ├── home/               # Home page components
│   ├── movie/              # Movie components
│   ├── search/             # Search components
│   ├── ui/                 # UI components
│   └── watchlist/          # Watchlist components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and API clients
├── public/                 # Static assets
├── styles/                 # Styles folder
├── types/                  # TypeScript type definitions
└── ...config files
```

## Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run lint:fix` - Fix ESLint errors
-   `npm run type-check` - Run TypeScript type checking

## Tech Stack

-   **Framework:** Next.js 15
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Icons:** Lucide React
-   **Linting:** ESLint + Prettier
-   **APIs:** TMDB API, OMDB API

## Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).