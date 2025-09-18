"use client";

import StarWarList from "@/components/ui/StarWarList";
import { useMovieSearch } from "@/hooks/use-movie-search";
import { useEffect } from "react";

export default function Home() {
  const { movies, loading, error, searchMovies, clearResults } =
    useMovieSearch();

  useEffect(() => {
    searchMovies("star wars");
  }, [searchMovies]);

  // Replace the third card (index 5) with the eighth card (index 7)
  const displayMovies =
    movies.length >= 8
      ? [movies[3], movies[4], movies[8], movies[6], movies[7]].filter(Boolean)
      : movies.slice(3, 8);

  return (
    <div className="w-full">
      <StarWarList movies={displayMovies} isLoading={loading} />
    </div>
  );
}
