"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { VolumeX, Volume2, ArrowLeft } from "lucide-react";

import { Button } from "../ui/button";
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
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Check if mobile
      const isMobile = window.innerWidth < 1024;

      // Set init state
      gsap.set(".gradient-overlay", { opacity: 0 });

      if (isMobile) {
        // Mobile: vertical animations
        gsap.set(".poster", { y: 50, opacity: 0 });
        gsap.set(".details", { y: 50, opacity: 0 });
      } else {
        // Desktop: horizontal animations
        gsap.set(".poster", { x: -100, opacity: 0 });
        gsap.set(".details", { x: 100, opacity: 0 });
      }

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

      if (isMobile) {
        // Mobile: sequential vertical animations
        tl.to(
          ".poster",
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          0.3
        );

        tl.to(
          ".details",
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          0.5
        );
      } else {
        // Desktop: horizontal animations
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
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} className="relative" style={{ height: "200vh" }}>
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

      <div className="fixed inset-0 z-20 flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-h-screen overflow-x-hidden">
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
    </div>
  );
};

export default MovieItem;
