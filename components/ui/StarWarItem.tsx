import Image from "next/image";

import { Movie } from "@/hooks/use-movie-search";
const StarWarItem = ({ movie }: { movie: Movie }) => {
  return (
    <li className="border border-gray-300 rounded-md p-4">
      <Image
        src={`${process.env.NEXT_PUBLIC_URL_POSTER}${movie.poster_path || ""}`}
        alt={movie.title}
        width={100}
        height={100}
      />
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>{movie.release_date}</p>
      <p>{movie.vote_average}</p>
      <p>{movie.vote_count}</p>
    </li>
  );
};

export default StarWarItem;
