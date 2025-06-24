import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "MovieFlix - Discover Movies & TV Shows",
    template: "%s | MovieFlix",
  },
  description:
    "Discover trending movies and TV shows, create your personal watchlist, and explore detailed information about your favorite entertainment.",
  keywords: [
    "movies",
    "tv shows",
    "entertainment",
    "watchlist",
    "trending",
    "cinema",
    "streaming",
    "reviews",
    "ratings",
  ],
  authors: [{ name: "MovieFlix Team" }],
  creator: "MovieFlix",
  publisher: "MovieFlix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "MovieFlix - Discover Movies & TV Shows",
    description:
      "Discover trending movies and TV shows, create your personal watchlist, and explore detailed information about your favorite entertainment.",
    url: "/",
    siteName: "MovieFlix",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieFlix - Discover Movies & TV Shows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieFlix - Discover Movies & TV Shows",
    description:
      "Discover trending movies and TV shows, create your personal watchlist, and explore detailed information about your favorite entertainment.",
    creator: "@movieflix",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
