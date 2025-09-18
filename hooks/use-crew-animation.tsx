import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  groupCrewByDepartment,
  sortDepartmentsByImportance,
} from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

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

interface UseCrewAnimationProps {
  crew: CrewMemberProps[] | undefined;
  loading: boolean;
  crewContainerRef: React.RefObject<HTMLDivElement | null>;
  crewMembersRefs: React.MutableRefObject<Map<string, HTMLDivElement | null>>;
}

export const useCrewAnimation = ({
  crew,
  loading,
  crewContainerRef,
  crewMembersRefs,
}: UseCrewAnimationProps) => {
  const [visibleCrewMembers, setVisibleCrewMembers] = useState<string[]>([]);
  const visibleCrewMembersRef = useRef<string[]>([]);

  // Sync ref with state
  useEffect(() => {
    visibleCrewMembersRef.current = visibleCrewMembers;
  }, [visibleCrewMembers]);

  // Function to update visible crew members
  const updateVisibleCrewMember = useCallback(
    (memberId: string, isVisible: boolean) => {
      setVisibleCrewMembers((prev) => {
        const current = [...prev];
        const exists = current.includes(memberId);

        if (isVisible && !exists) {
          return [...current, memberId];
        } else if (!isVisible && exists) {
          return current.filter((id) => id !== memberId);
        }
        return current;
      });
    },
    []
  );

  // Animation of crew members after loading data
  useEffect(() => {
    if (crew && crew.length > 0 && !loading) {
      // Clear previous state
      setVisibleCrewMembers([]);

      // Use setTimeout to give time for refs to be set
      const timeoutId = setTimeout(() => {
        const ctx = gsap.context(() => {
          // Prepare data for animation
          const groupedCrew = groupCrewByDepartment(crew);
          const sortedDepartments = sortDepartmentsByImportance(
            Object.keys(groupedCrew)
          );

          const totalMembers: { id: string; ref: HTMLDivElement | null }[] = [];

          // Collect all crew members for animation
          sortedDepartments.slice(0, 6).forEach((department) => {
            const departmentCrew = groupedCrew[department].slice(0, 8);
            departmentCrew.forEach((crewMember: CrewMemberProps) => {
              const memberId = `${crewMember.id}-${crewMember.credit_id}`;
              const memberRef = crewMembersRefs.current.get(memberId);
              if (memberRef) {
                totalMembers.push({ id: memberId, ref: memberRef });
              }
            });
          });

          // Set initial state for all crew members
          totalMembers.forEach(({ ref }) => {
            if (ref) {
              gsap.set(ref, {
                opacity: 1,
                scale: 1,
                rotationY: 180,
                transformOrigin: "center center",
              });
            }
          });

          // Create ScrollTrigger for each crew member separately
          totalMembers.forEach(({ id, ref }, index) => {
            if (ref) {
              const totalCount = totalMembers.length;
              const progressStep = 60 / totalCount; // Distribute 60% of viewport height
              const memberStart = 90 - index * progressStep;
              const memberEnd = memberStart - progressStep;

              ScrollTrigger.create({
                trigger: crewContainerRef.current,
                start: `top ${memberStart}%`,
                end: `top ${memberEnd}%`,
                scrub: 2,
                animation: gsap.to(ref, {
                  rotationY: 0,
                  duration: 1,
                  ease: "power2.out",
                  paused: true,
                  onUpdate: function () {
                    const progress = this.progress();
                    const isVisible = progress > 0.3;
                    const currentlyVisible =
                      visibleCrewMembersRef.current.includes(id);

                    if (isVisible !== currentlyVisible) {
                      updateVisibleCrewMember(id, isVisible);
                    }
                  },
                }),
              });
            }
          });
        }, crewContainerRef);

        return () => ctx.revert();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [
    crew,
    loading,
    updateVisibleCrewMember,
    crewContainerRef,
    crewMembersRefs,
  ]);

  // Hook handles all animation logic internally
  return {};
};
