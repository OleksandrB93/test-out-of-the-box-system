import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Movie } from "@/hooks/use-movie-search";

const StarWarItem = ({ movie }: { movie: Movie }) => {
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "No overview available";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
      onClick={() => router.push(`/movie/${movie.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_URL_POSTER}${
            movie.poster_path ||
            "https://banffventureforum.com/wp-content/uploads/2019/08/No-Image.png"
          }`}
          alt={movie.title}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          priority={false}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-bold shadow-lg">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
        </div>
      </div>

      {/* Content Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-6 transition-all duration-500 ease-out",
          isHover ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent rounded-t-xl p-4 -mx-4 -mb-6">
          <h2 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300">
            {movie.title}
          </h2>

          <p className="text-gray-300 text-sm mb-3 line-clamp-3 leading-relaxed">
            {truncateText(movie.overview || "", 120)}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              📅 {formatDate(movie.release_date)}
            </span>
            <span className="flex items-center gap-1">
              👥 {movie.vote_count?.toLocaleString() || "0"} votes
            </span>
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg" />
    </li>
  );
};

export default StarWarItem;
