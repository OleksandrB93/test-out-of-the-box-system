import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { Movie } from "@/hooks/use-movie-search";

interface Card3DData {
  mesh: THREE.Mesh;
  movie: Movie;
  originalPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  isHovered: boolean;
}

interface Use3DCardsAnimationProps {
  movies: Movie[];
  isLoading: boolean;
  onCardClick?: (movie: Movie) => void;
}

export const use3DCardsAnimation = ({
  movies,
  isLoading,
  onCardClick,
}: Use3DCardsAnimationProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cardsRef = useRef<Card3DData[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const hoveredCardRef = useRef<Card3DData | null>(null);
  const dynamicLightRef = useRef<THREE.DirectionalLight | null>(null);

  const createCardMaterial = useCallback(async (movie: Movie) => {
    return new Promise<THREE.MeshStandardMaterial>((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = 512;
      canvas.height = 768;

      // Create a brighter gradient background for better visibility
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#1a1a3a");
      gradient.addColorStop(0.2, "#2a2a4e");
      gradient.addColorStop(0.5, "#26314e");
      gradient.addColorStop(0.8, "#3d2b79");
      gradient.addColorStop(1, "#1a1a3a");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add softer holographic effects
      const holoGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      holoGradient.addColorStop(0, "rgba(100, 200, 255, 0.08)");
      holoGradient.addColorStop(0.5, "rgba(180, 100, 255, 0.04)");
      holoGradient.addColorStop(1, "rgba(255, 100, 180, 0.08)");

      ctx.fillStyle = holoGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Try to load the poster
      const baseUrl =
        process.env.NEXT_PUBLIC_URL_POSTER || "https://image.tmdb.org/t/p/w500";
      const posterUrl = movie.poster_path
        ? `${baseUrl}${movie.poster_path}`
        : null;

      if (posterUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          // Draw the poster brighter without multiply mode
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Add a light overlay for better contrast
          ctx.globalCompositeOperation = "overlay";
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "source-over";

          // Add a holographic border
          const borderGradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
          );
          borderGradient.addColorStop(0, "rgba(0, 255, 255, 0.3)");
          borderGradient.addColorStop(0.33, "rgba(255, 0, 255, 0.3)");
          borderGradient.addColorStop(0.66, "rgba(255, 255, 0, 0.3)");
          borderGradient.addColorStop(1, "rgba(0, 255, 255, 0.3)");

          ctx.strokeStyle = borderGradient;
          ctx.lineWidth = 4;
          ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

          // Add a modern overlay with information
          const overlayGradient = ctx.createLinearGradient(
            0,
            canvas.height * 0.5,
            0,
            canvas.height
          );
          overlayGradient.addColorStop(0, "rgba(0,0,0,0)");
          overlayGradient.addColorStop(0.3, "rgba(0,0,0,0.3)");
          overlayGradient.addColorStop(1, "rgba(0,0,0,0.9)");

          ctx.fillStyle = overlayGradient;
          ctx.fillRect(
            0,
            canvas.height * 0.5,
            canvas.width,
            canvas.height * 0.5
          );

          // rating badge
          if (movie.vote_average) {
            // Gradient background for the rating
            const ratingGradient = ctx.createLinearGradient(
              canvas.width - 90,
              10,
              canvas.width - 10,
              40
            );
            ratingGradient.addColorStop(0, "rgba(255, 215, 0, 0.95)");
            ratingGradient.addColorStop(1, "rgba(255, 165, 0, 0.95)");

            ctx.fillStyle = ratingGradient;
            ctx.beginPath();
            ctx.roundRect(canvas.width - 90, 10, 80, 35, 15);
            ctx.fill();

            // Border for the badge
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = "#1a1a1a";
            ctx.font = "bold 18px Arial";
            ctx.textAlign = "center";
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 2;
            ctx.fillText(
              `★ ${movie.vote_average.toFixed(1)}`,
              canvas.width - 50,
              32
            );
            ctx.shadowBlur = 0;
          }

          // title with gradient
          const titleGradient = ctx.createLinearGradient(
            0,
            canvas.height - 80,
            0,
            canvas.height - 20
          );
          titleGradient.addColorStop(0, "#ffffff");
          titleGradient.addColorStop(0.5, "#00ffff");
          titleGradient.addColorStop(1, "#ff00ff");

          ctx.fillStyle = titleGradient;
          ctx.font = "bold 22px Arial";
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 6;

          const title = movie.title || "Unknown Movie";
          const maxTitleWidth = canvas.width - 40;

          if (ctx.measureText(title).width > maxTitleWidth) {
            const words = title.split(" ");
            let line1 = "";
            let line2 = "";

            for (const word of words) {
              const testLine = line1 + word + " ";
              if (ctx.measureText(testLine).width > maxTitleWidth && line1) {
                line2 = words.slice(words.indexOf(word)).join(" ");
                break;
              } else {
                line1 = testLine;
              }
            }

            ctx.fillText(line1, canvas.width / 2, canvas.height - 50);
            if (line2) {
              ctx.font = "bold 18px Arial";
              ctx.fillText(
                line2.substring(0, 25) + (line2.length > 25 ? "..." : ""),
                canvas.width / 2,
                canvas.height - 25
              );
            }
          } else {
            ctx.fillText(title, canvas.width / 2, canvas.height - 35);
          }
          ctx.shadowBlur = 0;

          const texture = new THREE.CanvasTexture(canvas);
          texture.needsUpdate = true;
          texture.flipY = true;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          resolve(
            new THREE.MeshStandardMaterial({
              map: texture,
              transparent: true,
              opacity: 1.0,
              roughness: 0.3, // For softer light
              metalness: 0.05,
              emissive: new THREE.Color(0x001122),
              emissiveIntensity: 0.08,
              side: THREE.FrontSide,
            })
          );
        };

        img.onerror = () => {
          // Fallback to the text version
          createFallbackMaterial();
        };

        img.src = posterUrl;
      } else {
        createFallbackMaterial();
      }

      function createFallbackMaterial() {
        // Add a border
        ctx.strokeStyle = "#4a5568";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Movie title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";

        const title = movie.title || "Unknown Movie";
        const words = title.split(" ");
        let line = "";
        let y = 80;
        const maxWidth = canvas.width - 40;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, canvas.width / 2, y);
            line = words[n] + " ";
            y += 35;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, canvas.width / 2, y);

        // Rating
        if (movie.vote_average) {
          ctx.fillStyle = "#ffd700";
          ctx.font = "bold 20px Arial";
          ctx.fillText(
            `★ ${movie.vote_average.toFixed(1)}`,
            canvas.width / 2,
            y + 50
          );
        }

        // Release date
        if (movie.release_date) {
          ctx.fillStyle = "#a0aec0";
          ctx.font = "16px Arial";
          const date = new Date(movie.release_date).getFullYear();
          ctx.fillText(`${date}`, canvas.width / 2, y + 80);
        }

        // Description (truncated)
        if (movie.overview) {
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "14px Arial";
          ctx.textAlign = "left";

          const maxLines = 12;
          const lineHeight = 18;
          const words = movie.overview.split(" ");
          let currentLine = "";
          let lines: string[] = [];

          for (const word of words) {
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth - 20) {
              lines.push(currentLine);
              currentLine = word + " ";
            } else {
              currentLine = testLine;
            }

            if (lines.length >= maxLines) break;
          }

          if (currentLine && lines.length < maxLines) {
            lines.push(currentLine);
          }

          lines.forEach((line, index) => {
            ctx.fillText(line, 20, y + 120 + index * lineHeight);
          });
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.flipY = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        resolve(
          new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95,
            roughness: 0.3,
            metalness: 0.1,
            emissive: new THREE.Color(0x001122),
            emissiveIntensity: 0.05,
            side: THREE.FrontSide,
          })
        );
      }
    });
  }, []);

  // Create card geometry
  const createCardGeometry = useCallback(() => {
    const geometry = new THREE.PlaneGeometry(4, 6, 1, 1);
    // No need to flip the geometry if the texture is correctly set
    return geometry;
  }, []);

  // Positioning cards on the arc - all equidistant from the camera
  const calculateCardPosition = useCallback((index: number, total: number) => {
    const radius = 10; // Radius of the circle from the camera
    const centerZ = -10; // Center of the circle on Z (distance from the camera)
    const totalCards = Math.min(total, 5);

    // Angle for each card (distribute along the arc from -60° to +60°)
    const angleRange = (Math.PI / 180) * 120; // 120 degrees in radians
    const angleStep = angleRange / (totalCards - 1);
    const angle = -angleRange / 2 + index * angleStep;

    // Calculate the position on the arc (reversed arc)
    const x = Math.sin(angle) * radius;
    const z = centerZ - Math.cos(angle) * radius + radius;
    const y = 0;

    // Rotation of the card to the center (to the camera)
    const rotationY = -angle; // Cards rotated to the center of the circle

    return {
      position: new THREE.Vector3(x, y, z),
      rotation: rotationY,
    };
  }, []);

  // Initialize 3D scene
  const initScene = useCallback(() => {
    if (!mountRef.current || isLoading) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, // increase FOV for better view of cards on the edges
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 4); // set camera position
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0x606090, 0.7);
    scene.add(ambientLight);

    // Dynamic directional light, following the hover card
    const dynamicLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dynamicLight.position.set(0, 5, 8); // Initial position
    dynamicLight.target.position.set(0, 0, -5); // Initial target - center of the scene
    dynamicLight.castShadow = true;
    dynamicLight.shadow.mapSize.width = 2048;
    dynamicLight.shadow.mapSize.height = 2048;
    // Make shadows softer
    dynamicLight.shadow.camera.near = 0.1;
    dynamicLight.shadow.camera.far = 50;
    dynamicLight.shadow.camera.left = -12;
    dynamicLight.shadow.camera.right = 12;
    dynamicLight.shadow.camera.top = 12;
    dynamicLight.shadow.camera.bottom = -12;
    scene.add(dynamicLight);
    scene.add(dynamicLight.target); // Add target to the scene
    dynamicLightRef.current = dynamicLight;

    // Soft frontal light (less intensity)
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    frontLight.position.set(2, 1, 8); // Shift to the other side
    scene.add(frontLight);

    // Very soft side light
    const pointLight1 = new THREE.PointLight(0x00aaff, 0.15, 20);
    pointLight1.position.set(-8, 2, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xaa00ff, 0.15, 20);
    pointLight2.position.set(8, 2, 4);
    scene.add(pointLight2);

    // Additional diffuse point lights for even lighting
    const softLight1 = new THREE.PointLight(0xffffff, 0.2, 25);
    softLight1.position.set(0, 6, 10);
    scene.add(softLight1);

    const softLight2 = new THREE.PointLight(0xffffff, 0.1, 20);
    softLight2.position.set(-6, 3, 8);
    scene.add(softLight2);

    const softLight3 = new THREE.PointLight(0xffffff, 0.1, 20);
    softLight3.position.set(6, 3, 8);
    scene.add(softLight3);

    // Very soft rim light
    const rimLight = new THREE.DirectionalLight(0x6600aa, 0.1);
    rimLight.position.set(-4, 1, -2);
    scene.add(rimLight);

    // Create cards asynchronously
    cardsRef.current = [];
    const createCards = async () => {
      const cardPromises = movies.slice(0, 5).map(async (movie, index) => {
        const geometry = createCardGeometry();
        const material = await createCardMaterial(movie);
        const mesh = new THREE.Mesh(geometry, material);

        const { position, rotation } = calculateCardPosition(
          index,
          Math.min(movies.length, 5)
        );
        mesh.position.copy(position);
        mesh.rotation.y = rotation;

        // Add shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add(mesh);

        const cardData: Card3DData = {
          mesh,
          movie,
          originalPosition: position.clone(),
          targetPosition: position.clone(),
          isHovered: false,
        };

        return cardData;
      });

      const cards = await Promise.all(cardPromises);
      cardsRef.current = cards;
    };

    createCards();

    // Handle window resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    movies,
    isLoading,
    createCardGeometry,
    createCardMaterial,
    calculateCardPosition,
  ]);

  // Handle mouse move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current) return;

    mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(
      cardsRef.current.map((card) => card.mesh)
    );

    // Reset hover for all cards
    cardsRef.current.forEach((card) => {
      card.isHovered = false;
      // Return to the original position fully
      card.targetPosition.copy(card.originalPosition);
    });

    // Set hover for the current card
    if (intersects.length > 0) {
      const hoveredMesh = intersects[0].object as THREE.Mesh;
      const hoveredCard = cardsRef.current.find(
        (card) => card.mesh === hoveredMesh
      );

      if (hoveredCard) {
        hoveredCard.isHovered = true;
        hoveredCard.targetPosition.z = hoveredCard.originalPosition.z + 1.0;
        hoveredCard.targetPosition.y = hoveredCard.originalPosition.y + 0.2;

        // Limit horizontal offset for edge cards
        const cardIndex = cardsRef.current.indexOf(hoveredCard);
        if (cardIndex === 0) {
          // Left edge card - shift slightly to the right
          hoveredCard.targetPosition.x = hoveredCard.originalPosition.x + 0.5;
        } else if (cardIndex === cardsRef.current.length - 1) {
          // Right edge card - shift slightly to the left
          hoveredCard.targetPosition.x = hoveredCard.originalPosition.x - 0.5;
        } else {
          // Central cards remain in place
          hoveredCard.targetPosition.x = hoveredCard.originalPosition.x;
        }

        hoveredCardRef.current = hoveredCard;
        document.body.style.cursor = "pointer";

        // Direct dynamic light to the hover card (smoothly)
        if (dynamicLightRef.current) {
          const targetPos = hoveredCard.mesh.position.clone();
          targetPos.z += 0.5; // Slightly in front of the card for better lighting
          // Don't copy the position sharply, allow lerp in the animate cycle
          // dynamicLightRef.current.target.position.copy(targetPos);
          // Also don't change the intensity sharply - this is done in the animate cycle
        }
      }
    } else {
      hoveredCardRef.current = null;
      document.body.style.cursor = "default";

      // Return the light to the center of the scene (smoothly through the animate cycle)
      if (dynamicLightRef.current) {
        // Don't change the position sharply - this is done smoothly in the animate cycle
        // dynamicLightRef.current.target.position.set(0, 0, -5);
        // dynamicLightRef.current.intensity = 1.2;
      }
    }
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current) return;

      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        cardsRef.current.map((card) => card.mesh)
      );

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const clickedCard = cardsRef.current.find(
          (card) => card.mesh === clickedMesh
        );

        if (clickedCard && onCardClick) {
          onCardClick(clickedCard.movie);
        }
      }
    },
    [onCardClick]
  );

  // Modern animated cycle
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const time = Date.now() * 0.001;

    // Smooth animation of card positions
    cardsRef.current.forEach((card, index) => {
      card.mesh.position.lerp(card.targetPosition, 0.08);

      // Add complex effects for hover
      if (card.isHovered) {
        const hoverTime = time * 2;

        // Light oscillation
        card.mesh.rotation.x = Math.sin(hoverTime) * 0.03;
        card.mesh.rotation.z = Math.cos(hoverTime * 0.7) * 0.02;

        // Limited scale pulsation for edge cards
        const cardIndex = cardsRef.current.indexOf(card);
        let maxScale = 1.08;

        if (cardIndex === 0 || cardIndex === cardsRef.current.length - 1) {
          // Edge cards - less scaling
          maxScale = 1.05;
        }

        const scaleMultiplier = maxScale + Math.sin(hoverTime * 3) * 0.015;
        card.mesh.scale.setScalar(scaleMultiplier);

        // Soft modulation of emissive for holographic effect
        if (card.mesh.material instanceof THREE.MeshStandardMaterial) {
          const emissiveIntensity = 0.08 + Math.sin(hoverTime * 2) * 0.03;
          card.mesh.material.emissiveIntensity = emissiveIntensity;
        }
      } else {
        // Smooth return to normal state
        card.mesh.rotation.x *= 0.95;
        card.mesh.rotation.z *= 0.95;
        card.mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);

        // Basic emissive effect (very soft)
        if (card.mesh.material instanceof THREE.MeshStandardMaterial) {
          card.mesh.material.emissiveIntensity *= 0.98;
          if (card.mesh.material.emissiveIntensity < 0.03) {
            card.mesh.material.emissiveIntensity = 0.03;
          }
        }
      }

      // Light oscillation for all cards (ambient animation)
      const ambientFloat = Math.sin(time * 0.5 + index * 0.3) * 0.01;
      card.mesh.position.y += ambientFloat;
    });

    // Very smooth animation of dynamic light with different effects
    if (dynamicLightRef.current && hoveredCardRef.current) {
      // Smoothly follow the hover card with easing
      const targetPos = hoveredCardRef.current.mesh.position.clone();
      targetPos.z += 0.5; // Slightly in front of the card

      // Use a smoother lerp for target
      dynamicLightRef.current.target.position.lerp(targetPos, 0.04);

      // Soft pulsation with different waves for naturalness
      const pulse1 = Math.sin(time * 1.8) * 0.15;
      const pulse2 = Math.sin(time * 2.3) * 0.08;
      const pulse3 = Math.sin(time * 3.1) * 0.05;
      const combinedPulse = pulse1 + pulse2 + pulse3;
      const targetIntensity = 1.4 + combinedPulse;

      dynamicLightRef.current.intensity = THREE.MathUtils.lerp(
        dynamicLightRef.current.intensity,
        targetIntensity,
        0.03 // Very smooth transition
      );

      // Complex light position oscillation with multiple waves
      const swayX = Math.sin(time * 1.2) * 0.8 + Math.sin(time * 2.7) * 0.3;
      const swayY = 5 + Math.sin(time * 0.9) * 0.4;
      const swayZ = 8 + Math.sin(time * 1.6) * 0.2;
      const basePos = new THREE.Vector3(swayX, swayY, swayZ);

      dynamicLightRef.current.position.lerp(basePos, 0.02); // Very smooth

      // Add soft color oscillation for greater expressiveness
      const colorShift = Math.sin(time * 0.8) * 0.1 + 0.9;
      dynamicLightRef.current.color.setRGB(
        colorShift,
        colorShift * 0.95,
        colorShift * 0.98
      );
    } else if (dynamicLightRef.current) {
      // Very smoothly return to the central position
      const centerTarget = new THREE.Vector3(0, 0, -5);

      // Soft base position oscillation even without hover
      const ambientSwayX = Math.sin(time * 0.5) * 0.3;
      const ambientSwayY = 5 + Math.sin(time * 0.7) * 0.2;
      const ambientSwayZ = 8 + Math.sin(time * 0.4) * 0.1;
      const centerPos = new THREE.Vector3(
        ambientSwayX,
        ambientSwayY,
        ambientSwayZ
      );

      dynamicLightRef.current.target.position.lerp(centerTarget, 0.02);
      dynamicLightRef.current.position.lerp(centerPos, 0.015);

      // Soft base intensity pulsation
      const basePulse = Math.sin(time * 0.6) * 0.1;
      const targetIntensity = 1.2 + basePulse;

      dynamicLightRef.current.intensity = THREE.MathUtils.lerp(
        dynamicLightRef.current.intensity,
        targetIntensity,
        0.02
      );

      // Return the color to white
      const currentColor = dynamicLightRef.current.color;
      const whiteColor = new THREE.Color(1, 1, 1);
      currentColor.lerp(whiteColor, 0.02);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Initialize effect
  useEffect(() => {
    if (isLoading || movies.length === 0) return;

    const cleanup = initScene();

    // Add event handlers
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    // Start the animation
    animate();

    return () => {
      if (cleanup) cleanup();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current && rendererRef.current.domElement.parentNode) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      // Clean up resources
      cardsRef.current.forEach((card) => {
        if (card.mesh.geometry) card.mesh.geometry.dispose();
        if (card.mesh.material) {
          if (Array.isArray(card.mesh.material)) {
            card.mesh.material.forEach((material) => material.dispose());
          } else {
            card.mesh.material.dispose();
          }
        }
      });

      cardsRef.current = [];
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      dynamicLightRef.current = null;
    };
  }, [movies, isLoading, initScene, handleMouseMove, handleClick, animate]);

  return { mountRef };
};
