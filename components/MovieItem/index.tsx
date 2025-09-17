"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { Button } from "../ui/button";
import { VolumeX, Volume2 } from "lucide-react";
import MoviePoster from "./MoviePoster";
import MovieDetails from "./MovieDetails";
import MovieTrailer from "./MovieTrailer";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MovieItem = ({
  item,
  trailer,
  toggleSound,
  isMuted,
  iframeRef,
}: {
  item: any;
  trailer: any;
  iframeRef: any;
  toggleSound: any;
  isMuted: any;
}) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Set init state
      gsap.set(".gradient-overlay", { opacity: 0 });
      gsap.set(".poster", { x: -100, opacity: 0 });
      gsap.set(".details", { x: 100, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: false,
        },
      });

      // gradient
      tl.to(
        ".gradient-overlay",
        {
          opacity: 1,
          duration: 0.3,
        },
        0.2
      );

      // poster
      tl.to(
        ".poster",
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.3
      );

      // details
      tl.to(
        ".details",
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.3
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative" style={{ height: "200vh" }}>
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

      <div className="fixed inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="poster">
              <MoviePoster item={item} />
            </div>
            <div className="details">
              <MovieDetails item={item} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieItem;
