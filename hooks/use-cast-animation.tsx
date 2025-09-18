import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

interface UseCastAnimationProps {
  cast: CastMemberProps[] | undefined;
  loading: boolean;
  castContainerRef: React.RefObject<HTMLDivElement | null>;
  actorsRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const useCastAnimation = ({
  cast,
  loading,
  castContainerRef,
  actorsRefs,
}: UseCastAnimationProps) => {
  const [visibleActors, setVisibleActors] = useState<number[]>([]);
  const visibleActorsRef = useRef<number[]>([]);

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
    if (cast && cast.length > 0 && !loading) {
      // Clear previous state
      setVisibleActors([]);

      // Initialize array of refs
      actorsRefs.current = actorsRefs.current.slice(
        0,
        Math.min(cast.length, 12)
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
        const topCast = cast.slice(0, 12);

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
  }, [cast, loading, updateVisibleActor, castContainerRef, actorsRefs]);

  return {
    visibleActors,
  };
};
