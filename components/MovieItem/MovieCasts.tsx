import { useEffect, useRef } from "react";
import { useGetCast } from "@/hooks/use-get-cast";
import { useCastAnimation, CastMemberProps } from "@/hooks/use-cast-animation";
import Image from "next/image";

const MovieCasts = ({ id }: { id: string }) => {
  const { cast, loading, error, getCast } = useGetCast();
  const castContainerRef = useRef<HTMLDivElement | null>(null);
  const actorsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { visibleActors } = useCastAnimation({
    cast: cast?.cast,
    loading,
    castContainerRef,
    actorsRefs,
  });

  useEffect(() => {
    getCast(id);
  }, [id, getCast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p>Error loading cast information</p>
      </div>
    );
  }

  if (!cast?.cast || cast.cast.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No cast information available</p>
      </div>
    );
  }

  // Show top 12 cast members
  const topCast = cast.cast.slice(0, 12);

  return (
    <div ref={castContainerRef} className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center bg-gray-300/10 overflow-hidden rounded-lg py-2 pl-4 border-l-5 border-red-400">
        {/* <span className="w-1 h-8 bg-red-500 mr-3 rounded-full"></span> */}
        Cast
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {topCast.map((castMember: CastMemberProps, index: number) => (
          <div
            key={castMember.id}
            ref={(el) => {
              actorsRefs.current[index] = el;
            }}
            className="group cursor-pointer transition-all duration-300 hover:scale-105"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Container for flip effect */}
            <div
              className="relative aspect-[3/4] mb-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front side (actor's photo) */}
              <div
                className="absolute inset-0 rounded-lg bg-gray-800 overflow-hidden backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                {castMember.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${castMember.profile_path}`}
                    alt={castMember.name}
                    width={300}
                    height={450}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {castMember.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Back side (actor's name) */}
              <div
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-red-900/90 to-gray-900/90 flex flex-col items-center justify-center p-4 backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-white">
                      {castMember.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 leading-tight">
                    {castMember.name}
                  </h3>
                  <p className="text-gray-300 text-xs line-clamp-2 leading-tight">
                    {castMember.character}
                  </p>
                </div>
              </div>
            </div>

            {/* Information under the card (shown only after flip) */}
            <div
              className={`text-center transition-opacity duration-300 ${
                visibleActors.includes(index) ? "opacity-100" : "opacity-0"
              }`}
            >
              <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2 leading-tight">
                {castMember.name}
              </h3>
              <p className="text-gray-400 text-xs line-clamp-2 leading-tight">
                {castMember.character}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCasts;
