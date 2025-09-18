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
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md border border-white/20 dark:border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-700 ease-out cursor-pointer transform hover:-translate-y-3 hover:scale-[1.03] hover:rotate-1"
      onClick={() => router.push(`/movie/${movie.id}`)}
      style={{
        background: isHover
          ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      {/* Animated Border */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"
        style={{ padding: "2px" }}
      />

      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
        <Image
          src={`${process.env.NEXT_PUBLIC_URL_POSTER}${
            movie.poster_path ||
            "https://banffventureforum.com/wp-content/uploads/2019/08/No-Image.png"
          }`}
          alt={movie.title}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
          priority={false}
        />

        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

        {/* Modern Rating Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm border border-white/30 transform group-hover:scale-110 transition-transform duration-300">
          <span className="flex items-center gap-1">
            <span className="text-yellow-900">★</span>
            {movie.vote_average?.toFixed(1) || "N/A"}
          </span>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-pulse delay-300" />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-700" />
        </div>
      </div>

      {/* Modern Content Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-6 transition-all duration-700 ease-out backdrop-blur-sm",
          isHover ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        )}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent rounded-t-2xl p-5 -mx-4 -mb-6 border-t border-white/10">
          {/* Title with modern typography */}
          <h2 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent mb-3 line-clamp-2 group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500 tracking-wide">
            {movie.title}
          </h2>

          {/* Description with enhanced readability */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            {truncateText(movie.overview || "", 120)}
          </p>

          {/* Modern info badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
              <span className="text-cyan-400 text-xs">📅</span>
              <span className="text-xs text-gray-300 font-medium">
                {formatDate(movie.release_date)}
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
              <span className="text-purple-400 text-xs">👥</span>
              <span className="text-xs text-gray-300 font-medium">
                {movie.vote_count?.toLocaleString() || "0"}
              </span>
            </div>
          </div>

          {/* Interactive elements */}
          <div className="mt-3 flex items-center justify-center">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>

      {/* Modern Status Indicators */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {/* Hover Indicator */}
        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg transform group-hover:scale-125" />

        {/* Pulse indicator when hovered */}
        <div className="w-3 h-3 bg-cyan-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </li>
  );
};

export default StarWarItem;
