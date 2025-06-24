// API Endpoints
export const API_ENDPOINTS = {
    TMDB: {
      BASE_URL: "https://api.themoviedb.org/3",
      IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
      TRENDING: "/trending",
      SEARCH: "/search",
      MOVIE: "/movie",
      TV: "/tv",
      DISCOVER: "/discover",
      GENRE: "/genre",
    },
    OMDB: {
      BASE_URL: "https://www.omdbapi.com",
    },
  } as const
  
  // Image sizes
  export const IMAGE_SIZES = {
    POSTER: ["w92", "w154", "w185", "w342", "w500", "w780", "original"] as const,
    BACKDROP: ["w300", "w780", "w1280", "original"] as const,
    PROFILE: ["w45", "w185", "h632", "original"] as const,
  } as const
  
  // Media types
  export const MEDIA_TYPES = {
    MOVIE: "movie",
    TV: "tv",
    PERSON: "person",
    ALL: "all",
  } as const
  
  // Time windows for trending
  export const TIME_WINDOWS = {
    DAY: "day",
    WEEK: "week",
  } as const
  
  