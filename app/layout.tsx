import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieFlix - Discover Movies & TV Shows",
  description:
    "Discover trending movies and TV shows, create your personal watchlist, and explore detailed information about your favorite entertainment.",
  keywords: ["movies", "tv shows", "entertainment", "watchlist", "trending"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieFlix - Discover Movies & TV Shows",
    description:
      "Discover trending movies and TV shows, create your personal watchlist, and explore detailed information about your favorite entertainment.",
    creator: "@movieflix",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      </body>
    </html>
  )
}
