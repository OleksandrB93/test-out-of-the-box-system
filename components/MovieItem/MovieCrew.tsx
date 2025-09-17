import { useEffect } from "react";
import { useGetCast } from "@/hooks/use-get-cast";
import {
  groupCrewByDepartment,
  sortDepartmentsByImportance,
} from "@/lib/utils";

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

const MovieCrew = ({ id }: { id: string }) => {
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
        <p>Error loading crew information</p>
      </div>
    );
  }

  if (!cast?.crew || cast.crew.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No crew information available</p>
      </div>
    );
  }

  const groupedCrew = groupCrewByDepartment(cast.crew);
  const sortedDepartments = sortDepartmentsByImportance(
    Object.keys(groupedCrew)
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-1 h-8 bg-blue-500 mr-3 rounded-full"></span>
        Crew
      </h2>

      <div className="space-y-6">
        {sortedDepartments.slice(0, 6).map((department) => {
          const departmentCrew = groupedCrew[department].slice(0, 8); // Limit to 8 per department

          return (
            <div key={department} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-200 border-l-2 border-blue-400 pl-3">
                {department}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {departmentCrew.map((crewMember: CrewMemberProps) => (
                  <div
                    key={`${crewMember.id}-${crewMember.credit_id}`}
                    className="group flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative overflow-hidden rounded-full w-12 h-12 bg-gray-700 flex-shrink-0">
                      {crewMember.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${crewMember.profile_path}`}
                          alt={crewMember.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
                          <span className="text-sm font-bold text-gray-300">
                            {crewMember.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">
                        {crewMember.name}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">
                        {crewMember.job}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovieCrew;
