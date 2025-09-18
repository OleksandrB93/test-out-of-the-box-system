"use client";

import { Movie } from "@/hooks/use-movie-search";
import { useStarFieldAnimation } from "@/hooks/use-star-field-animation";
import { use3DCardsAnimation } from "@/hooks/use-3d-cards-animation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StarWarItem from "./StarWarItem";

const StarWarList = ({
  movies,
  isLoading,
}: {
  movies: Movie[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const [use3D, setUse3D] = useState(true); // Toggle between 2D and 3D views

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

  return (
    <div className="relative w-full min-h-screen">
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

      {/* 3D Cards Scene */}
      {use3D && (
        <div
          ref={cards3DRef}
          className="fixed inset-0 z-5 w-full h-full"
          style={{
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            position: "fixed",
          }}
        />
      )}

      {/* Star Wars Toggle Button */}
      <div className="fixed top-4 right-4 z-20">
        <button
          onClick={() => setUse3D(!use3D)}
          className="group relative bg-black hover:bg-gray-900 text-yellow-400 px-8 py-4 rounded-sm shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 font-bold tracking-wider uppercase border-2 border-yellow-400 hover:border-yellow-300 transform hover:scale-110"
          style={{
            fontFamily: "monospace",
            textShadow: "0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24",
            boxShadow:
              "0 0 20px rgba(251, 191, 36, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.1)",
          }}
        >
          {/* Lightsaber glow effect */}
          <div
            className="absolute inset-0 border-2 border-yellow-400 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"
            style={{
              boxShadow:
                "0 0 30px #fbbf24, inset 0 0 30px rgba(251, 191, 36, 0.2)",
            }}
          />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-400 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-yellow-400 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-yellow-400 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-400 rounded-br-sm" />

          {/* Button text with Star Wars icons */}
          <span className="relative flex items-center gap-3 z-10">
            {use3D ? (
              <>
                <span className="text-xl">⚔️</span>
                Hologram View
              </>
            ) : (
              <>
                <span className="text-xl">🌌</span>
                Galaxy View
              </>
            )}
          </span>

          {/* Force effect on click */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-200 rounded-sm" />

          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
        </button>
      </div>

      {/* 2D Content - only visible when 3D is disabled */}
      {!use3D && (
        <div className="relative z-10 w-full flex justify-center items-center p-8 md:p-16 lg:p-24 xl:p-32 min-h-screen">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-20">
            {movies.map((movie) => (
              <StarWarItem key={movie.id} movie={movie} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StarWarList;
