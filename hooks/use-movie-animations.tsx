import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export const useMovieAnimations = (
  container: RefObject<HTMLDivElement | null>
) => {
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Check if mobile
      const isMobile = window.innerWidth < 1024;

      // Set init state
      gsap.set(".gradient-overlay", { opacity: 0 });
      gsap.set(".reviews", { y: 100, opacity: 0 });
      gsap.set(".casts", { y: 100, opacity: 0 });
      gsap.set(".crew", { y: 100, opacity: 0 });

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

      // Add fade out animation for main content when scrolling
      gsap.to(".main-content", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: container.current,
          start: "30% top",
          end: "80% top",
          scrub: 1,
        },
      });

      // Create separate ScrollTriggers for additional content - delayed appearance
      gsap.to(".casts", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".casts",
          start: "top 60%",
          end: "top 30%",
          scrub: 2,
        },
      });

      gsap.to(".crew", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".crew",
          start: "top 60%",
          end: "top 30%",
          scrub: 2,
        },
      });

      gsap.to(".reviews", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reviews",
          start: "top 60%",
          end: "top 30%",
          scrub: 2,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);
};
