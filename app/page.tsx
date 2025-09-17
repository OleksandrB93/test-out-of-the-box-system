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

  return (
    <div className="w-full">
      <StarWarList movies={movies} isLoading={loading} />
    </div>
  );
}
