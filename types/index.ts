// Core movie and TV show types from TMDB API
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
  video: boolean
  runtime?: number
  budget?: number
  revenue?: number
  status?: string
  tagline?: string
  homepage?: string
  imdb_id?: string
  belongs_to_collection?: Collection | null
  production_companies?: ProductionCompany[]
  production_countries?: ProductionCountry[]
  spoken_languages?: SpokenLanguage[]
}

export interface TVShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date?: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
  origin_country: string[]
  number_of_episodes?: number
  number_of_seasons?: number
  episode_run_time?: number[]
  status?: string
  type?: string
  homepage?: string
  in_production?: boolean
  languages?: string[]
  networks?: Network[]
  production_companies?: ProductionCompany[]
  production_countries?: ProductionCountry[]
  spoken_languages?: SpokenLanguage[]
  created_by?: Creator[]
  seasons?: Season[]
}

// Multi-search result type (can be movie or TV show)
export interface MediaItem {
  id: number
  media_type: "movie" | "tv" | "person"
  title?: string // for movies
  name?: string // for TV shows
  original_title?: string
  original_name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string // for movies
  first_air_date?: string // for TV shows
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  popularity: number
  original_language: string
  video?: boolean // for movies
  origin_country?: string[] // for TV shows
}

// Detailed movie/TV show types with additional information
export interface MovieDetails extends Movie {
  genres: Genre[]
  credits: Credits
  videos: VideoResponse
  similar: TMDBResponse<Movie>
  recommendations: TMDBResponse<Movie>
  external_ids: ExternalIds
}

export interface TVShowDetails extends TVShow {
  genres: Genre[]
  credits: Credits
  videos: VideoResponse
  similar: TMDBResponse<TVShow>
  recommendations: TMDBResponse<TVShow>
  external_ids: ExternalIds
}

// Supporting types
export interface Genre {
  id: number
  name: string
}

export interface Collection {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Network {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface Creator {
  id: number
  credit_id: string
  name: string
  gender: number
  profile_path: string | null
}

export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
}

// Credits and cast types
export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  credit_id: string
  order: number
  adult: boolean
  gender: number | null
  known_for_department: string
  original_name: string
  popularity: number
  profile_path: string | null
  cast_id?: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  credit_id: string
  adult: boolean
  gender: number | null
  known_for_department: string
  original_name: string
  popularity: number
  profile_path: string | null
}

// Video types
export interface VideoResponse {
  results: Video[]
}

export interface Video {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  official: boolean
  published_at: string
  site: string
  size: number
  type: string
}

// External IDs
export interface ExternalIds {
  imdb_id: string | null
  facebook_id: string | null
  instagram_id: string | null
  twitter_id: string | null
}

// API Response types
export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TMDBError {
  success: false
  status_code: number
  status_message: string
}

// OMDB API types
export interface OMDBMovie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: OMDBRating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response: "True" | "False"
  Error?: string
}

export interface OMDBRating {
  Source: string
  Value: string
}

export interface OMDBError {
  Response: "False"
  Error: string
}

// Search and filter types
export interface SearchFilters {
  type: "all" | "movie" | "tv"
  year: string
  genre: string
  sortBy: "popularity" | "vote_average" | "release_date" | "title"
  sortOrder: "asc" | "desc"
}
