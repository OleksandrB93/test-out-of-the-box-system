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
    isLoading: false, // Завжди показуємо зірки
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

      {/* Modern Toggle Button */}
      <div className="fixed top-4 right-4 z-20">
        <button
          onClick={() => setUse3D(!use3D)}
          className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/20 transform hover:scale-105 hover:-translate-y-1"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />

          {/* Button text with icons */}
          <span className="relative flex items-center gap-2">
            {use3D ? (
              <>
                <span className="text-lg">🎭</span>
                2D View
              </>
            ) : (
              <>
                <span className="text-lg">🎪</span>
                3D View
              </>
            )}
          </span>

          {/* Pulse effect */}
          <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
        </button>
      </div>

      {/* 2D Content - only visible when 3D is disabled */}
      {!use3D && (
        <div className="relative z-10 w-full mx-auto p-8 md:p-16 lg:p-24 xl:p-32 min-h-screen">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20">
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
