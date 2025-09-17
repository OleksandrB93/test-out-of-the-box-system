import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Movie } from "@/hooks/use-movie-search";

const StarWarItem = ({ movie }: { movie: Movie }) => {
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="relative border border-gray-300 rounded-md max-h-[600px] overflow-hidden cursor-pointer"
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_URL_POSTER}${
          movie.poster_path ||
          "https://banffventureforum.com/wp-content/uploads/2019/08/No-Image.png"
        }`}
        alt={movie.title}
        width={100}
        height={100}
      />
      <div
        className={cn(
          "absolute p-4 transition-all duration-300",
          isHover
            ? "bottom-0 opacity-100 bg-black/90"
            : "-bottom-[100%] opacity-0"
        )}
      >
        <h2 className="text-2xl font-bold">{movie.title}</h2>
        <p className="text-gray-500">{movie.overview}</p>
        <p className="text-gray-500">{movie.release_date}</p>
        <p className="text-gray-500">{movie.vote_average}</p>
        <p className="text-gray-500">{movie.vote_count}</p>
      </div>
    </li>
  );
};

export default StarWarItem;
