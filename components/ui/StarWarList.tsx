"use client";

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { BlurFilter } from "pixi.js";

import { Movie } from "@/hooks/use-movie-search";
import StarWarItem from "./StarWarItem";

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

const StarWarList = ({
  movies,
  isLoading,
}: {
  movies: Movie[];
  isLoading: boolean;
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  const createParticle = (app: PIXI.Application): Particle => {
    // Створюємо різні типи частинок
    const particleTypes = [
      { size: 1, color: 0xffffff, alpha: 0.8 }, // Маленькі білі зірки
      { size: 2, color: 0xffd700, alpha: 0.9 }, // Золоті зірки
      { size: 1.5, color: 0x87ceeb, alpha: 0.7 }, // Блакитні зірки
      { size: 0.8, color: 0xffa500, alpha: 0.6 }, // Помаранчеві зірки
      { size: 3, color: 0xffffff, alpha: 1.0 }, // Великі білі зірки
      { size: 1.2, color: 0xdda0dd, alpha: 0.8 }, // Фіолетові зірки
    ];

    const type =
      particleTypes[Math.floor(Math.random() * particleTypes.length)];

    // Створюємо графіку для частинки
    const graphics = new PIXI.Graphics();
    graphics.beginFill(type.color, type.alpha);
    graphics.drawCircle(0, 0, type.size);
    graphics.endFill();

    // Додаємо ефект мерехтіння для великих зірок
    if (type.size > 2) {
      graphics.beginFill(type.color, 0.3);
      graphics.drawCircle(0, 0, type.size * 2);
      graphics.endFill();
    }

    const texture = app.renderer.generateTexture(graphics);
    const sprite = new PIXI.Sprite(texture);

    // Випадкова позиція
    sprite.x = Math.random() * app.screen.width;
    sprite.y = Math.random() * app.screen.height;

    // Центруємо anchor
    sprite.anchor.set(0.5);

    // Додаємо blur ефект для деяких частинок
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
      // Рух з прискоренням
      particle.vx += (Math.random() - 0.5) * particle.acceleration;
      particle.vy += (Math.random() - 0.5) * particle.acceleration;

      // Обмежуємо максимальну швидкість
      const maxSpeed = particle.baseSpeed * 2;
      const speed = Math.sqrt(
        particle.vx * particle.vx + particle.vy * particle.vy
      );
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }

      // Оновлюємо позицію
      particle.sprite.x += particle.vx;
      particle.sprite.y += particle.vy;

      // Ефект мерехтіння
      particle.twinklePhase += particle.twinkleSpeed;
      const twinkle = Math.sin(particle.twinklePhase) * 0.3 + 0.7;
      particle.sprite.alpha = twinkle;

      // Легке обертання для великих зірок
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
      // Ініціалізуємо PIXI додаток
      const app = new PIXI.Application();

      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000011, // Темно-синій космічний фон
        resolution: window.devicePixelRatio || 1,
        antialias: true,
        resizeTo: window, // Автоматично підлаштовується під розмір вікна
      });

      appRef.current = app;

      // Налаштовуємо canvas на весь екран
      app.canvas.style.position = "fixed";
      app.canvas.style.top = "0";
      app.canvas.style.left = "0";
      app.canvas.style.width = "100vw";
      app.canvas.style.height = "100vh";
      app.canvas.style.zIndex = "0";

      mountRef.current?.appendChild(app.canvas);

      // Створюємо контейнер для частинок
      const particlesContainer = new PIXI.Container();
      app.stage.addChild(particlesContainer);

      // Створюємо багато частинок
      const particleCount = 200;
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(app);
        particlesContainer.addChild(particle.sprite);
        particlesRef.current.push(particle);
      }

      // Запускаємо анімацію
      animateParticles(app);

      // Обробка зміни розміру вікна
      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        // Оновлюємо стилі canvas при зміні розміру
        app.canvas.style.width = "100vw";
        app.canvas.style.height = "100vh";
      };

      window.addEventListener("resize", handleResize);

      // Cleanup функція
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

    // Викликаємо асинхронну функцію та зберігаємо cleanup
    let cleanup: (() => void) | undefined;
    initPixi().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [isLoading]);

  return (
    <div className="relative w-full min-h-screen">
      {/* PIXI Canvas фон - на весь екран */}
      <div
        ref={mountRef}
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

      {/* Контент поверх фону */}
      <div className="relative z-10 w-full mx-auto p-8 md:p-16 lg:p-24 xl:p-32 min-h-screen">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20">
          {movies.map((movie) => (
            <StarWarItem key={movie.id} movie={movie} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StarWarList;
