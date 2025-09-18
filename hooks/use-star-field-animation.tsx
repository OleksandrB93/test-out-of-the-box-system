import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { BlurFilter } from "pixi.js";

interface Particle {
  sprite: PIXI.Sprite;
  vx: number;
  vy: number;
  baseSpeed: number;
  acceleration: number;
  twinklePhase: number;
  twinkleSpeed: number;
  size: number;
  color: number;
}

interface UseStarFieldAnimationProps {
  isLoading: boolean;
  particleCount?: number;
  backgroundColor?: number;
}

export const useStarFieldAnimation = ({
  isLoading,
  particleCount = 200,
  backgroundColor = 0x000000,
}: UseStarFieldAnimationProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const createParticle = (app: PIXI.Application): Particle => {
    // create different types of particles
    const particleTypes = [
      { size: 1, color: 0xffffff, alpha: 0.8 }, // small white stars
      { size: 2, color: 0xffd700, alpha: 0.9 }, // golden stars
      { size: 1.5, color: 0x87ceeb, alpha: 0.7 }, // blue stars
      { size: 0.8, color: 0xffa500, alpha: 0.6 }, // orange stars
      { size: 3, color: 0xffffff, alpha: 1.0 }, // big white stars
      { size: 1.2, color: 0xdda0dd, alpha: 0.8 }, // purple stars
    ];

    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];

    // create graphics for particle
    const graphics = new PIXI.Graphics();
    graphics.beginFill(type.color, type.alpha);
    graphics.drawCircle(0, 0, type.size);
    graphics.endFill();

    // add twinkling effect for big stars
    if (type.size > 2) {
      graphics.beginFill(type.color, 0.3);
      graphics.drawCircle(0, 0, type.size * 2);
      graphics.endFill();
    }

    const texture = app.renderer.generateTexture(graphics);
    const sprite = new PIXI.Sprite(texture);

    // random position
    sprite.x = Math.random() * app.screen.width;
    sprite.y = Math.random() * app.screen.height;

    // center anchor
    sprite.anchor.set(0.5);

    // add blur effect for some particles
    if (Math.random() > 0.7) {
      sprite.filters = [new BlurFilter(0.5)];
    }

    return {
      sprite,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      baseSpeed: Math.random() * 0.3 + 0.1,
      acceleration: Math.random() * 0.001 + 0.0005,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.05 + 0.02,
      size: type.size,
      color: type.color,
    };
  };

  const animateParticles = (app: PIXI.Application) => {
    particlesRef.current.forEach((particle) => {
      // movement with acceleration
      particle.vx += (Math.random() - 0.5) * particle.acceleration;
      particle.vy += (Math.random() - 0.5) * particle.acceleration;

      // limit maximum speed
      const maxSpeed = particle.baseSpeed * 2;
      const speed = Math.sqrt(
        particle.vx * particle.vx + particle.vy * particle.vy
      );
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }

      // update position
      particle.sprite.x += particle.vx;
      particle.sprite.y += particle.vy;

      // twinkling effect
      particle.twinklePhase += particle.twinkleSpeed;
      const twinkle = Math.sin(particle.twinklePhase) * 0.3 + 0.7;
      particle.sprite.alpha = twinkle;

      // light rotation for big stars
      if (particle.size > 2) {
        particle.sprite.rotation += 0.01;
      }

      // Wrap around screen edges
      if (particle.sprite.x < -50) particle.sprite.x = app.screen.width + 50;
      if (particle.sprite.x > app.screen.width + 50) particle.sprite.x = -50;
      if (particle.sprite.y < -50) particle.sprite.y = app.screen.height + 50;
      if (particle.sprite.y > app.screen.height + 50) particle.sprite.y = -50;
    });

    animationRef.current = requestAnimationFrame(() => animateParticles(app));
  };

  useEffect(() => {
    if (!mountRef.current || isLoading || appRef.current) return;

    const initPixi = async () => {
      // initialize PIXI application
      const app = new PIXI.Application();

      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor, // configurable background color
        resolution: window.devicePixelRatio || 1,
        antialias: true,
        resizeTo: window, // automatically adjust to window size
      });

      appRef.current = app;

      // configure canvas to cover the entire screen
      app.canvas.style.position = "fixed";
      app.canvas.style.top = "0";
      app.canvas.style.left = "0";
      app.canvas.style.width = "100vw";
      app.canvas.style.height = "100vh";
      app.canvas.style.zIndex = "0";

      mountRef.current?.appendChild(app.canvas);

      // create container for particles
      const particlesContainer = new PIXI.Container();
      app.stage.addChild(particlesContainer);

      // create many particles
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(app);
        particlesContainer.addChild(particle.sprite);
        particlesRef.current.push(particle);
      }

      // start animation
      animateParticles(app);

      // handle window size change
      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        // update canvas styles when size changes
        app.canvas.style.width = "100vw";
        app.canvas.style.height = "100vh";
      };

      window.addEventListener("resize", handleResize);

      // cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (appRef.current) {
          appRef.current.destroy(true);
          appRef.current = null;
        }
        particlesRef.current = [];
      };
    };

    // call asynchronous function and save cleanup
    let cleanup: (() => void) | undefined;
    initPixi().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [isLoading, particleCount, backgroundColor]);

  return { mountRef };
};
