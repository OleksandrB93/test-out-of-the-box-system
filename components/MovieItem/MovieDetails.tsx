import { ItemProps } from "./MoviePoster";

const MovieDetails = ({ item }: ItemProps) => {
  return (
    <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            {item.title}
          </span>
        </h1>
        {item.tagline && (
          <p className="text-lg md:text-xl text-gray-300 font-light italic">
            "{item.tagline}"
          </p>
        )}
      </div>

      {/* Movie Stats */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm md:text-base">
        <div className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <span className="text-yellow-400">⭐</span>
          <span className="text-white ml-2 font-semibold">
            {item.vote_average?.toFixed(1)}/10
          </span>
          <span className="text-gray-300 ml-1">
            ({item.vote_count?.toLocaleString()} votes)
          </span>
        </div>

        <div className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <span className="text-blue-400">📅</span>
          <span className="text-white ml-2">
            {new Date(item.release_date || "").getFullYear()}
          </span>
        </div>

        {item.runtime && (
          <div className="backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <span className="text-green-400">⏱️</span>
            <span className="text-white ml-2">
              {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
            </span>
          </div>
        )}
      </div>

      {/* Genres */}
      {item.genres && item.genres.length > 0 && (
        <div className="flex flex-wrap justify-center lg:justify-start gap-2">
          {item.genres.map((genre: any) => (
            <span
              key={genre.id}
              className="backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-3 py-1 rounded-full text-sm border border-white/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}

      {/* Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Overview</h2>
        <div className="backdrop-blur-md bg-black/30 p-6 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-gray-200 text-base md:text-lg leading-relaxed">
            {item.overview || ""}
          </p>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {item.release_date && (
          <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-1">
              Release Date
            </h3>
            <p className="text-white text-lg font-medium">
              {new Date(item.release_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        {item.budget && item.budget > 0 && (
          <div className="backdrop-blur-md bg-white/5 p-4 rounded-xl border border-white/10">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wide mb-1">
              Budget
            </h3>
            <p className="text-white text-lg font-medium">
              ${item.budget.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
