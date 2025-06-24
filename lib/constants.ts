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
  
  // Sort options
  export const SORT_OPTIONS = {
    POPULARITY_DESC: "popularity.desc",
    POPULARITY_ASC: "popularity.asc",
    RELEASE_DATE_DESC: "release_date.desc",
    RELEASE_DATE_ASC: "release_date.asc",
    VOTE_AVERAGE_DESC: "vote_average.desc",
    VOTE_AVERAGE_ASC: "vote_average.asc",
    TITLE_ASC: "title.asc",
    TITLE_DESC: "title.desc",
  } as const
  
  // Genre IDs (TMDB)
  export const MOVIE_GENRES = {
    ACTION: 28,
    ADVENTURE: 12,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    ROMANCE: 10749,
    SCIENCE_FICTION: 878,
    TV_MOVIE: 10770,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37,
  } as const
  
  export const TV_GENRES = {
    ACTION_ADVENTURE: 10759,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    KIDS: 10762,
    MYSTERY: 9648,
    NEWS: 10763,
    REALITY: 10764,
    SCIENCE_FICTION_FANTASY: 10765,
    SOAP: 10766,
    TALK: 10767,
    WAR_POLITICS: 10768,
    WESTERN: 37,
  } as const
  