import { useEffect } from "react";
import { useGetCast } from "@/hooks/use-get-cast";

export interface CastMemberProps {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface CrewMemberProps {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number | null;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

const MovieCasts = ({ id }: { id: string }) => {
  const { cast, loading, error, getCast } = useGetCast();

  useEffect(() => {
    getCast(id);
  }, [id]);

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
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-1 h-8 bg-red-500 mr-3 rounded-full"></span>
        Cast
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {topCast.map((castMember: CastMemberProps) => (
          <div
            key={castMember.id}
            className="group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-800 aspect-[3/4] mb-3">
              {castMember.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${castMember.profile_path}`}
                  alt={castMember.name}
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

            <div className="text-center">
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
