"use client";

import { Movie } from "@/hooks/use-movie-search";
import { useStarFieldAnimation } from "@/hooks/use-star-field-animation";
import { use3DCardsAnimation } from "@/hooks/use-3d-cards-animation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mouse } from "lucide-react";
// import StarWarItem from "./StarWarItem";

const StarWarList = ({
  movies,
  isLoading,
}: {
  movies: Movie[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const [use3D, setUse3D] = useState(true); // Toggle between 2D and 3D views
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scene3DRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { mountRef: starFieldRef } = useStarFieldAnimation({
    isLoading: false, // Always show stars
    particleCount: 200,
    backgroundColor: 0x000000,
  });

  const { mountRef: cards3DRef } = use3DCardsAnimation({
    movies,
    isLoading: isLoading || !use3D,
    onCardClick: (movie) => {
      router.push(`/movie/${movie.id}`);
    },
  });

  // Register ScrollTrigger plugin and setup animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Ensure we have all necessary elements
    if (!titleRef.current || !scene3DRef.current || !containerRef.current)
      return;

    // Set initial states
    gsap.set(titleRef.current, { opacity: 1, scale: 1, z: 10 });
    gsap.set(scene3DRef.current, { opacity: 0, scale: 0.8, z: -10 });

    // Create scroll-triggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom center",
        scrub: 1,
        pin: false,
        anticipatePin: 1,
      },
    });

    // Animate title out and 3D scene in
    tl.to(titleRef.current, {
      opacity: 0,
      scale: 0.5,
      z: -50,
      duration: 1,
      ease: "power2.out",
    }).to(
      scene3DRef.current,
      {
        opacity: 1,
        scale: 1,
        z: 0,
        duration: 1,
        ease: "power2.out",
      },
      0.3
    ); // Start 3D scene animation slightly after title starts fading

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [use3D, movies.length]); // Re-run when 3D mode changes or movies load

  return (
    <div ref={containerRef} className="relative w-full min-h-[200vh]">
      {/* Star field background - always visible */}
      <div
        ref={starFieldRef}
        className="fixed inset-0 z-0 w-full h-full"
        style={{
          pointerEvents: "none",
          width: "100vw",
          height: "100vh",
          top: 0,
          left: 0,
          position: "fixed",
        }}
      />

      {/* Star Wars Title - starts visible, fades on scroll */}
      <div className="relative z-10">
        <h1
          ref={titleRef}
          style={{
            fontFamily: "Star Wars",
            textShadow: "0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24",
          }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] leading-none font-bold text-center text-black z-20 pointer-events-none"
        >
          Star Wars
        </h1>
        <Mouse className="fixed top-4 right-4 z-30 animate-bounce" />
      </div>

      {/* 3D Cards Scene - starts hidden, appears on scroll */}
      {use3D && (
        <div
          ref={scene3DRef}
          className="fixed inset-0 z-10 w-full h-full"
          style={{
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            position: "fixed",
          }}
        >
          <div ref={cards3DRef} className="w-full h-full" />
        </div>
      )}
    </div>
  );
};

export default StarWarList;
