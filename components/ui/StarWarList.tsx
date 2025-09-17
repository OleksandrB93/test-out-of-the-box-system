"use client";

import { Movie } from "@/hooks/use-movie-search";
import StarWarItem from "./StarWarItem";

const StarWarList = ({ movies }: { movies: Movie[] }) => {
  return (
    <div className="container mx-auto p-8">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <StarWarItem key={movie.id} movie={movie} />
        ))}
      </ul>
    </div>
  );
};

export default StarWarList;
