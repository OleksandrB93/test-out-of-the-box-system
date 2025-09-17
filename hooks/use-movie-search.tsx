"use client";

import { useState, useCallback } from "react";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface UseMovieSearchReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  searchMovies: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMovies = useCallback(async (query: string) => {
    query = "star wars";

    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=en-US&page=1`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_ACCESS}`,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setMovies([]);
    setError(null);
  }, []);

  return {
    movies,
    loading,
    error,
    searchMovies,
    clearResults,
  };
};
