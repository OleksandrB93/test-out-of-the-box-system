import { useEffect, useState, useRef, useCallback } from "react";
import { useGetCast } from "@/hooks/use-get-cast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

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
  const [visibleActors, setVisibleActors] = useState<number[]>([]);
  const castContainerRef = useRef<HTMLDivElement>(null);
  const actorsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visibleActorsRef = useRef<number[]>([]);

  useEffect(() => {
    getCast(id);
  }, [id, getCast]);

  // Sync ref with state
  useEffect(() => {
    visibleActorsRef.current = visibleActors;
  }, [visibleActors]);

  // Function to update visible actors
  const updateVisibleActor = useCallback(
    (index: number, isVisible: boolean) => {
      setVisibleActors((prev) => {
        const current = [...prev];
        const exists = current.includes(index);

        if (isVisible && !exists) {
          return [...current, index];
        } else if (!isVisible && exists) {
          return current.filter((i) => i !== index);
        }
        return current;
      });
    },
    []
  );

  // Animation of actors after loading data
  useEffect(() => {
    if (cast?.cast && cast.cast.length > 0 && !loading) {
      // Clear previous state
      setVisibleActors([]);

      // Initialize array of refs
      actorsRefs.current = actorsRefs.current.slice(
        0,
        Math.min(cast.cast.length, 12)
      );

      // Create ScrollTrigger for animation of actors
      const ctx = gsap.context(() => {
        // Set initial state for all actors (show back side with name)
        actorsRefs.current.forEach((ref) => {
          if (ref) {
            gsap.set(ref, {
              opacity: 1,
              scale: 1,
              rotationY: 180,
              transformOrigin: "center center",
            });
          }
        });

        // Create ScrollTrigger for each actor separately with scrub animation
        const topCast = cast?.cast?.slice(0, 12) || [];

        topCast.forEach((_: CastMemberProps, index: number) => {
          const actorRef = actorsRefs.current[index];
          if (actorRef) {
            // Each actor has its own ScrollTrigger with cascading start points
            const totalActors = topCast.length;
            const progressStep = 40 / totalActors; // Distribute 40% of viewport height between actors
            const actorStart = 80 - index * progressStep; // Start from 80% and go down
            const actorEnd = actorStart - progressStep; // End of animation for this actor

            ScrollTrigger.create({
              trigger: castContainerRef.current,
              start: `top ${actorStart}%`,
              end: `top ${actorEnd}%`,
              scrub: 2, // More smooth animation
              animation: gsap.to(actorRef, {
                rotationY: 0,
                duration: 1,
                ease: "power2.out",
                paused: true,
                onUpdate: function () {
                  // Update visibility state based on animation progress
                  const progress = this.progress();
                  const isVisible = progress > 0.3; // Show information slightly earlier
                  const currentlyVisible =
                    visibleActorsRef.current.includes(index);

                  if (isVisible !== currentlyVisible) {
                    updateVisibleActor(index, isVisible);
                  }
                },
              }),
            });
          }
        });
      }, castContainerRef);

      return () => ctx.revert();
    }
  }, [cast, loading, updateVisibleActor]);

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
