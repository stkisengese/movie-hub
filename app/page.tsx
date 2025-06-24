export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-4">
          Welcome to MovieFlix
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Discover trending movies and TV shows, create your personal watchlist
        </p>
        <div className="w-16 h-16 mx-auto bg-primary-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM5 8a1 1 0 000 2h8a1 1 0 100-2H5z" />
          </svg>
        </div>
      </div>
    </main>
  )
}
