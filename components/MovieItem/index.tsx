"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { VolumeX, Volume2, ArrowLeft } from "lucide-react";

import { Button } from "../ui/button";
import MoviePoster from "./MoviePoster";
import MovieDetails from "./MovieDetails";
import MovieTrailer from "./MovieTrailer";
import MovieReviews from "./MovieReviews";
import MovieCasts from "./MovieCasts";
import MovieCrew from "./MovieCrew";
import { useMovieAnimations } from "../../hooks/use-movie-animations";
import { ItemProps } from "./MoviePoster";

interface MovieItemProps {
  item: ItemProps["item"];
  trailer: {
    key: string;
    id?: number;
    name?: string;
    site?: string;
    type?: string;
    official?: boolean;
  } | null;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  toggleSound: () => void;
  isMuted: boolean;
}

const MovieItem = ({
  item,
  trailer,
  toggleSound,
  isMuted,
  iframeRef,
}: MovieItemProps) => {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);

  useMovieAnimations(container);

  return (
    <div  ref={container} className="relative custom-mouse-cursor" style={{ height: "200vh" }}>
      <Button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-200"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <Button
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-200"
        variant="ghost"
        size="icon"
      >
        <div className="relative flex items-center justify-center">
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-white" />
          ) : (
            <Volume2 className="h-5 w-5 text-white" />
          )}
        </div>
      </Button>

      <div className="fixed inset-0 z-0">
        <MovieTrailer trailer={trailer} iframeRef={iframeRef} />
      </div>

      <div className="backdrop-blur-sm gradient-overlay fixed inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

      {/* Main content - poster and details */}
      <div className="fixed inset-0 z-20 flex items-center justify-center">
        <div className="main-content container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center lg:items-center">
            <div className="poster flex justify-center lg:justify-start">
              <div className="w-full max-w-sm lg:max-w-none">
                <MoviePoster item={item} />
              </div>
            </div>
            <div className="details">
              <MovieDetails item={item} />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable additional content */}
      <div className="relative z-20 pt-[250vh]">
        <div className="bg-black/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 space-y-16 py-16">
            <div className="casts">
              <MovieCasts id={item.id?.toString() || ""} />
            </div>
            <div className="crew">
              <MovieCrew id={item.id?.toString() || ""} />
            </div>
            <div className="reviews">
              <MovieReviews id={item.id?.toString() || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieItem;
