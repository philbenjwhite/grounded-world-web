'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ArrowUpRight, MagnifyingGlass, Strategy, Palette, ChartLineUp } from 'phosphor-react';

interface NavItem {
  id: string;
  label: string;
  color: string;
  description: string;
  url: string;
  icon: React.ComponentType<{ size?: number; weight?: string; color?: string }>;
}

const navItems: NavItem[] = [
  {
    id: 'research',
    label: 'Research',
    color: '#00AEEF',
    description: 'Deep dive into user needs, behaviors, and pain points to inform strategic decisions and create user-centered solutions.',
    url: 'https://visualboston.com/research',
    icon: MagnifyingGlass
  },
  {
    id: 'strategy',
    label: 'Strategy',
    color: '#FFA603',
    description: 'Develop comprehensive product roadmaps and strategic frameworks that align business objectives with user value.',
    url: 'https://visualboston.com/strategy',
    icon: Strategy
  },
  {
    id: 'activation',
    label: 'Activation',
    color: '#FF08CC',
    description: 'Transform strategies into tangible experiences through design systems, prototyping, and user interface development.',
    url: 'https://visualboston.com/activation',
    icon: Palette
  },
  {
    id: 'impact',
    label: 'Impact',
    color: '#1CC35B',
    description: 'Measure success through analytics, user feedback, and continuous optimization to drive meaningful business outcomes.',
    url: 'https://visualboston.com/impact',
    icon: ChartLineUp
  },
];

const ServiceHeroNav: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<THREE.Scene | undefined>();
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>();
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>();
  const animationFrameRef = useRef<number | undefined>();
  const [activeNav, setActiveNav] = useState<string>('research');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Store references to Three.js objects for color animation
  const dotsRef = useRef<THREE.Mesh[]>([]);
  const shapesRef = useRef<THREE.Mesh[]>([]);

  // Ensure we're on client side and detect touch device
  useEffect(() => {
    setIsClient(true);

    // Detect touch device
    const checkTouch = () => {
      return 'ontouchstart' in window ||
             navigator.maxTouchPoints > 0 ||
             /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    setIsTouchDevice(checkTouch());
  }, []);

  // Ensure video always plays
  useEffect(() => {
    if (!videoRef.current || !isClient) return;

    const video = videoRef.current;

    const ensureVideoPlays = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (error) {
        console.log('Video autoplay prevented:', error);
      }
    };

    // Initial play attempt
    ensureVideoPlays();

    // Handle pause events - restart playback
    const handlePause = () => {
      setTimeout(() => {
        ensureVideoPlays();
      }, 100);
    };

    // Handle visibility change - restart when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        ensureVideoPlays();
      }
    };

    // Add event listeners
    video.addEventListener('pause', handlePause);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', ensureVideoPlays);

    // Periodic check to ensure video is playing
    const playbackInterval = setInterval(() => {
      if (video.paused) {
        ensureVideoPlays();
      }
    }, 2000);

    return () => {
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', ensureVideoPlays);
      clearInterval(playbackInterval);
    };
  }, [isClient]);

  // Track rotation for perfect text alignment
  useEffect(() => {
    if (!isClient || isAnyHovered) return;

    const startTime = Date.now();
    const rotationSpeed = 360 / 60000; // 360 degrees in 60 seconds (milliseconds)

    const updateRotation = () => {
      const elapsed = Date.now() - startTime;
      const rotation = (elapsed * rotationSpeed) % 360;
      setCurrentRotation(rotation);

      if (!isAnyHovered) {
        requestAnimationFrame(updateRotation);
      }
    };

    requestAnimationFrame(updateRotation);
  }, [isClient, isAnyHovered]);

  useEffect(() => {
    // Ensure we're on the client side
    if (!canvasRef.current || typeof window === 'undefined' || !isClient) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: false,
        antialias: true
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 1);
      camera.position.z = 30;

      sceneRef.current = scene;
      rendererRef.current = renderer;
      cameraRef.current = camera;

      // Create default lightning effect background
      createLightningBackground(scene);

      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);

        // Bird flocking behavior
        dotsRef.current.forEach((bird, index) => {
          const userData = bird.userData;

          if (!hoveredNav) {
            // Smooth, elastic wave motion when not hovered
            const time = Date.now() * 0.001;
            const velocity = userData.velocity;

            // Create wave patterns for natural movement
            const waveX = Math.sin(time + index * 0.1) * 0.03;
            const waveY = Math.cos(time * 1.2 + index * 0.15) * 0.025;
            const waveZ = Math.sin(time * 0.8 + index * 0.2) * 0.02;

            // Add elastic spring force toward original position
            const springForce = userData.originalPosition.clone()
              .sub(bird.position)
              .multiplyScalar(0.001);

            // Combine wave motion with spring force
            velocity.set(waveX, waveY, waveZ).add(springForce);

            // Add some subtle flocking with nearby birds
            const neighbors = [];
            dotsRef.current.forEach(otherBird => {
              if (otherBird !== bird && bird.position.distanceTo(otherBird.position) < 4) {
                neighbors.push(otherBird);
              }
            });

            if (neighbors.length > 0) {
              const center = new THREE.Vector3();
              neighbors.forEach(neighbor => center.add(neighbor.position));
              center.divideScalar(neighbors.length);
              const cohesion = center.sub(bird.position).normalize().multiplyScalar(0.002);
              velocity.add(cohesion);
            }

            // Apply smooth, damped movement
            bird.position.add(velocity);

            // Soft boundaries with elastic bounce
            const distance = bird.position.length();
            if (distance > 25) {
              const bounceForce = bird.position.clone().normalize().multiplyScalar(-0.1);
              bird.position.add(bounceForce);
            }

            // Gentle center avoidance
            const centerDistance = Math.sqrt(bird.position.x * bird.position.x + bird.position.y * bird.position.y);
            if (centerDistance < 12) {
              const pushAway = bird.position.clone().normalize().multiplyScalar(0.02);
              bird.position.add(pushAway);
            }
          } else if (userData.targetPosition) {
            // Move toward target when hovered with more dynamic movement
            const direction = userData.targetPosition.clone().sub(bird.position);
            const distance = direction.length();

            // Create vanishing effect as dots approach target
            const material = bird.material as THREE.MeshBasicMaterial;
            const vanishDistance = Math.max(0.1, Math.min(1, distance / 10));
            const currentOpacity = material.opacity;

            // Gradually fade as approaching target (vanish into thin air)
            material.opacity = currentOpacity * vanishDistance;

            if (distance > 0.2) {
              // Gentler movement toward target with smoother easing
              const t = Math.min(distance / 25, 1); // Slower approach for smoother transition
              const ease = 1 - Math.pow(1 - t, 2); // Gentler ease-out quadratic instead of cubic

              direction.normalize().multiplyScalar(0.008 * ease); // Much gentler movement speed

              // Apply smooth spring force
              const springForce = direction.clone().multiplyScalar(0.05); // Reduced spring intensity
              bird.position.add(springForce);

              // Add gentle flowing movement
              const time = Date.now() * 0.001; // Slower time scale
              const flow = new THREE.Vector3(
                Math.sin(time * 0.5 + index * 0.1) * 0.003, // Reduced amplitude and frequency
                Math.cos(time * 0.7 + index * 0.15) * 0.003,
                Math.sin(time * 0.3 + index * 0.2) * 0.002
              );
              bird.position.add(flow);
            } else {
              // Become nearly invisible when very close (vanished)
              material.opacity *= 0.1;
            }
          }
        });

        // No energy orbs to animate anymore

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        renderer.dispose();
      };
    } catch (error) {
      console.error('Error initializing Three.js scene:', error);
    }
  }, [isClient]);

  const createLightningBackground = (scene: THREE.Scene) => {
    // Clear existing elements first
    clearScene(scene);

    // Create electrical nodes scattered around
    const nodeCount = 300;
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      // Distribute across the full screen, avoiding center area
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 50;
        y = (Math.random() - 0.5) * 30;
        z = (Math.random() - 0.5) * 20;
      } while (Math.sqrt(x*x + y*y) < 12); // Avoid center circle

      const geometry = new THREE.SphereGeometry(0.04 + Math.random() * 0.02, 8, 8);

      // Calculate distance from bottom for opacity gradient effect
      const distanceFromBottom = (y + 15) / 30; // Normalize to 0-1 range
      const distanceFromEdge = Math.min(
        (x + 25) / 50, // Distance from left edge
        (25 - x) / 50, // Distance from right edge
        (y + 15) / 30, // Distance from bottom
        (15 - y) / 30  // Distance from top
      );

      // Create subtle default state - much more subtle and faded
      const baseOpacity = Math.max(0.02, (1.5 - distanceFromBottom) * distanceFromEdge * 0.15); // Much more subtle

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6, 0.2, 0.7), // Desaturated and darker
        transparent: true,
        opacity: Math.min(0.15, baseOpacity) // Much lower maximum opacity
      });

      const node = new THREE.Mesh(geometry, material);
      node.position.set(x, y, z);

      // Store original position for animation
      node.userData = {
        originalPosition: node.position.clone(),
        phase: Math.random() * Math.PI * 2,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        ),
        targetPosition: null,
        flockingSpeed: 0.003 + Math.random() * 0.002
      };

      scene.add(node);
      dotsRef.current.push(node);
      nodes.push(node);
    }

    // All nodes now have their velocity set during creation above

    // No large energy orbs - keeping all dots consistent
  };

  const createThemedElements = (scene: THREE.Scene, navId: string) => {
    const navItem = navItems.find(item => item.id === navId);
    if (!navItem) return;

    // Clear existing elements
    clearScene(scene);

    const baseColor = navItem.color;

    switch (navId) {
      case 'research':
        createMolecularElements(scene, baseColor);
        break;
      case 'strategy':
        createNetworkElements(scene, baseColor);
        break;
      case 'activation':
        createCreativeElements(scene, baseColor);
        break;
      case 'impact':
        createDataElements(scene, baseColor);
        break;
    }
  };

  const clearScene = (scene: THREE.Scene) => {
    dotsRef.current.forEach(dot => scene.remove(dot));
    shapesRef.current.forEach(shape => scene.remove(shape));
    dotsRef.current = [];
    shapesRef.current = [];
  };


  const generateColorVariation = (baseColor: string) => {
    const color = new THREE.Color(baseColor);
    const variation = Math.random() * 0.6 + 0.2; // 0.2 to 0.8 variation
    return color.clone().multiplyScalar(variation);
  };

  const animateColorChange = (newColor: string) => {
    const targetColor = new THREE.Color(newColor);

    // Animate dots
    dotsRef.current.forEach((dot, index) => {
      const material = dot.material as THREE.MeshBasicMaterial;
      const currentColor = material.color;
      const newVariationColor = generateColorVariation(newColor);

      gsap.to(currentColor, {
        duration: 1.5,
        r: newVariationColor.r,
        g: newVariationColor.g,
        b: newVariationColor.b,
        ease: "power2.out",
        delay: index * 0.02
      });
    });

    // Animate lines
    linesRef.current.forEach((line, index) => {
      const material = line.material as THREE.LineBasicMaterial;
      const currentColor = material.color;
      const newVariationColor = generateColorVariation(newColor);

      gsap.to(currentColor, {
        duration: 1.5,
        r: newVariationColor.r,
        g: newVariationColor.g,
        b: newVariationColor.b,
        ease: "power2.out",
        delay: index * 0.03
      });
    });

    // Animate shapes
    shapesRef.current.forEach((shape, index) => {
      const material = shape.material as THREE.MeshBasicMaterial;
      const currentColor = material.color;
      const newVariationColor = generateColorVariation(newColor);

      gsap.to(currentColor, {
        duration: 1.5,
        r: newVariationColor.r,
        g: newVariationColor.g,
        b: newVariationColor.b,
        ease: "power2.out",
        delay: index * 0.04
      });
    });
  };

  const handleNavClick = (navId: string) => {
    setActiveNav(navId);
    const navItem = navItems.find(item => item.id === navId);
    if (navItem) {
      animateColorChange(navItem.color);
    }
  };

  const handleNavHover = (navId: string | null) => {
    setHoveredNav(navId);
    setIsAnyHovered(navId !== null);

    if (sceneRef.current) {
      if (navId) {
        // Animate existing elements to themed pattern
        animateToThemedPattern(sceneRef.current, navId);
      } else {
        // Return to default lightning background
        animateToLightningPattern(sceneRef.current);
      }
    }
  };

  const animateToThemedPattern = (scene: THREE.Scene, navId: string) => {
    const navItem = navItems.find(item => item.id === navId);
    if (!navItem) return;

    // Get the navigation dot position
    const navIndex = navItems.findIndex(item => item.id === navId);
    const navAngle = navIndex * 90 * (Math.PI / 180); // Convert to radians
    const orbitalRadius = 300; // Approximate orbital radius
    const navPosition = new THREE.Vector3(
      Math.cos(navAngle) * orbitalRadius * 0.1,
      Math.sin(navAngle) * orbitalRadius * 0.1,
      0
    );

    // Animate existing birds to move toward the hovered navigation
    const targetColor = new THREE.Color(navItem.color);

    dotsRef.current.forEach((bird, index) => {
      const material = bird.material as THREE.MeshBasicMaterial;

      // Animate color change with smooth power easing
      gsap.to(material.color, {
        duration: 1.8,
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        ease: "power2.out"
      });

      // Dramatically increase visibility when targeting - come to life!
      gsap.to(material, {
        duration: 1.8,
        opacity: 0.9 + Math.random() * 0.1, // Bright and vivid on hover
        ease: "power2.out"
      });

      // Create recognizable patterns based on navigation type
      let targetPos;

      switch (navId) {
        case 'research':
          // DNA helix pattern
          const helixT = (index / dotsRef.current.length) * Math.PI * 4;
          const helixRadius = 8;
          const helixHeight = 12;
          targetPos = new THREE.Vector3(
            navPosition.x + Math.cos(helixT) * helixRadius,
            navPosition.y + (index / dotsRef.current.length - 0.5) * helixHeight,
            navPosition.z + Math.sin(helixT) * helixRadius
          );
          break;

        case 'strategy':
          // Geometric grid pattern
          const gridSize = Math.ceil(Math.sqrt(dotsRef.current.length / 4));
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          targetPos = new THREE.Vector3(
            navPosition.x + (col - gridSize/2) * 2.5,
            navPosition.y + (row - gridSize/2) * 2.5,
            navPosition.z + Math.sin((row + col) * 0.5) * 3
          );
          break;

        case 'activation':
          // Flower/mandala pattern
          const petalAngle = (index / dotsRef.current.length) * Math.PI * 2;
          const petalLayer = Math.floor(index / 50);
          const petalRadius = 4 + petalLayer * 3;
          const petalOffset = Math.sin(petalAngle * 6) * 2;
          targetPos = new THREE.Vector3(
            navPosition.x + Math.cos(petalAngle) * (petalRadius + petalOffset),
            navPosition.y + Math.sin(petalAngle) * (petalRadius + petalOffset),
            navPosition.z + Math.sin(petalAngle * 3) * 4
          );
          break;

        case 'impact':
          // Ascending spiral (like growth chart)
          const spiralAngle = (index / dotsRef.current.length) * Math.PI * 6;
          const spiralRadius = 3 + (index / dotsRef.current.length) * 8;
          const spiralHeight = (index / dotsRef.current.length) * 10;
          targetPos = new THREE.Vector3(
            navPosition.x + Math.cos(spiralAngle) * spiralRadius,
            navPosition.y + spiralHeight - 5,
            navPosition.z + Math.sin(spiralAngle) * spiralRadius
          );
          break;

        default:
          targetPos = navPosition.clone();
      }

      bird.userData.targetPosition = targetPos;
    });
  };

  const animateToLightningPattern = (scene: THREE.Scene) => {
    // Return birds to natural flocking behavior
    dotsRef.current.forEach((bird, index) => {
      const material = bird.material as THREE.MeshBasicMaterial;

      // Return to subtle, faded default state
      gsap.to(material.color, {
        duration: 2.0,
        r: 0.4,
        g: 0.5,
        b: 0.7,
        ease: "power2.out"
      });

      gsap.to(material, {
        duration: 2.0,
        opacity: 0.05 + Math.random() * 0.1, // Much more subtle default state
        ease: "power2.out"
      });

      // Clear target position to return to natural flocking
      bird.userData.targetPosition = null;

      // Reset velocity for natural movement with higher speeds
      bird.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      );
    });
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Full Page Color Overlay - perfectly matched with video overlay */}
      {hoveredNav && (
        <div
          className="absolute inset-0 z-5 transition-all duration-700 ease-out pointer-events-none"
          style={{
            background: `linear-gradient(0deg, ${navItems.find(item => item.id === hoveredNav)?.color}60 0%, ${navItems.find(item => item.id === hoveredNav)?.color}20 50%, transparent 80%)`
          }}
        />
      )}
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes counter-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes fadeInRing {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes fadeInDot {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes orbitDots {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes headerTextIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(20px) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-10px) scale(0.95);
          }
        }
        @keyframes helperTextIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0px);
          }
        }
      `}</style>
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Helper Text - positioned at actual page bottom */}
      <div
        className="absolute z-25 pointer-events-none"
        style={{
          bottom: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'helperTextIn 0.8s ease-out forwards',
          animationDelay: '4.5s', // Start at the very end after all animations complete
          opacity: 0
        }}
      >
        <p
          className="text-lg md:text-xl text-gray-400 text-center font-medium whitespace-nowrap"
          style={{
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.02em'
          }}
        >
          Select an option
        </p>
      </div>

      {/* Navigation Overlay - Centered Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Animated Header Text */}
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'headerTextIn 2.5s ease-in-out forwards',
              animationDelay: '0.2s',
              opacity: 0
            }}
          >
            <h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white text-center tracking-tight"
              style={{
                textShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              <span className="block sm:hidden">
                Activating<br />Purpose
              </span>
              <span className="hidden sm:block whitespace-nowrap">
                Activating Purpose
              </span>
            </h1>
          </div>

          {/* Center Video */}
          <div className="absolute z-10 pointer-events-auto" style={{
            top: '36%', // Moved up a bit more
            left: '28%', // Moved further left to better center the globe
            transform: 'translate(-50%, -50%)',
            animation: 'fadeInScale 0.8s ease-out forwards',
            animationDelay: '0.1s',
            opacity: 0
          }}>
            <div
              className="rounded-full overflow-hidden relative"
              style={{
                width: 'min(525px, max(68vw, 340px))', // 25% smaller: 700*0.75=525, 90*0.75=68, 450*0.75=340
                height: 'min(525px, max(68vw, 340px))',
                clipPath: 'circle(50%)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://player.vimeo.com/progressive_redirect/playback/1161946524/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=ff985305bacd44ceec1d96f384a10daa44f54d5055afc72a0b9ec4ab171053ab"
                  type="video/mp4"
                />
              </video>

              {/* Video Color Overlay - EXACTLY matching page gradient direction and values */}
              {hoveredNav && (
                <div
                  className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none"
                  style={{
                    background: `linear-gradient(0deg, ${navItems.find(item => item.id === hoveredNav)?.color}60 0%, ${navItems.find(item => item.id === hoveredNav)?.color}20 50%, transparent 80%)`,
                    clipPath: 'circle(50%)'
                  }}
                />
              )}
            </div>
          </div>

          {/* Dotted Orbit Circle */}
          <div
            className="absolute z-15 pointer-events-none"
            style={{
              width: 'min(575px, max(74vw, 370px))', // Much closer to smaller video: 525+50
              height: 'min(575px, max(74vw, 370px))',
              border: '3px dotted rgba(120, 120, 130, 0.8)',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'fadeInRing 0.8s ease-out forwards, orbitDots 120s linear infinite',
              animationDelay: '2.8s, 3.5s', // Start after header text completes (2.5s + buffers)
              opacity: 0,
              filter: 'drop-shadow(0 0 10px rgba(120, 120, 130, 0.3))'
            }}
          />


          {/* Orbiting Navigation Dots */}
          <div className="absolute z-20 pointer-events-none" style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            {navItems.map((item, index) => {
              const isActive = activeNav === item.id;
              const isHovered = hoveredNav === item.id;

              // Calculate starting angle for each dot (90 degrees apart)
              const baseAngle = index * 90;
              // Calculate current position based on rotation state
              const currentAngle = baseAngle + currentRotation;
              // Calculate exact counter-rotation to keep content at 0 degrees (always horizontal)
              const counterRotation = -(baseAngle + currentRotation);

              return (
                <div
                  key={item.id}
                  className="absolute pointer-events-auto"
                  style={{
                    top: '0',
                    left: '0'
                  }}
                >
                  {/* Orbiting Dot Container */}
                  <div
                    className={`absolute`}
                    style={{
                      width: 'min(575px, max(74vw, 370px))', // Match closer ring size
                      height: 'min(575px, max(74vw, 370px))',
                      transform: `translate(-50%, -50%) rotate(${baseAngle}deg)`,
                      animationName: 'orbit',
                      animationDuration: '60s',
                      animationTimingFunction: 'linear',
                      animationIterationCount: 'infinite',
              animationDelay: `${3.5 - index * 15}s`, // Start orbit animation after other elements are visible
                      animationPlayState: isAnyHovered ? 'paused' : 'running',
                      animationFillMode: 'forwards'
                    }}
                  >
                  <button
                    className="absolute group transition-all duration-500 ease-out"
                    style={{
                      top: '0',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: 'fadeInDot 0.6s ease-out forwards',
              animationDelay: `${3 + index * 0.1}s`, // Start after header text completes (2.5s + 0.5s buffer)
                      opacity: 0
                    }}
                    onClick={() => {
                      if (isTouchDevice) {
                        // On touch devices, single tap navigates directly
                        const navItem = navItems.find(navItem => navItem.id === item.id);
                        if (navItem) {
                          window.open(navItem.url, '_blank');
                        }
                      } else {
                        // On desktop, maintain existing behavior
                        handleNavClick(item.id);
                        const navItem = navItems.find(navItem => navItem.id === item.id);
                        if (navItem) {
                          window.open(navItem.url, '_blank');
                        }
                      }
                    }}
                    onMouseEnter={() => !isTouchDevice && handleNavHover(item.id)}
                    onMouseLeave={() => !isTouchDevice && handleNavHover(null)}
                  >
                    {/* Counter-rotating container to keep content at 0 degrees */}
                    <div
                      style={{
                        transform: `rotate(${-baseAngle}deg)`,
                        animationName: 'counter-orbit',
                        animationDuration: '60s',
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                animationDelay: `${3.5 - index * 15}s`, // Start counter-rotation with orbit animation
                        animationPlayState: isAnyHovered ? 'paused' : 'running',
                        animationFillMode: 'forwards'
                      }}
                    >
                      {/* Navigation Dot with Content */}
                      <div
                        className={`relative rounded-full transition-all duration-500 ease-out flex items-center justify-center overflow-hidden ${
                          isTouchDevice
                            ? 'w-16 h-16 sm:w-20 sm:h-20' // Larger on touch devices for better tap targets
                            : isHovered
                            ? 'w-32 h-12 sm:w-36 sm:h-12'
                            : 'w-11 h-11 sm:w-12 sm:h-12'
                        }`}
                        style={{
                          backgroundColor: item.color,
                          boxShadow: isTouchDevice
                            ? `0 0 20px ${item.color}50, 0 0 40px ${item.color}30` // More prominent on touch
                            : isHovered
                            ? `0 0 30px ${item.color}80, 0 0 60px ${item.color}60, 0 0 90px ${item.color}40`
                            : isActive
                            ? `0 0 20px ${item.color}50, 0 0 40px ${item.color}30`
                            : `0 0 10px ${item.color}30`
                        }}
                      >
                        {/* Default Icon - always visible on touch, hover-dependent on desktop */}
                        <div
                          className={`absolute transition-all duration-300 ${
                            isTouchDevice
                              ? 'opacity-100 transform scale-100' // Always visible on touch
                              : isHovered ? 'opacity-0 transform scale-75' : 'opacity-100 transform scale-100'
                          }`}
                        >
                          <item.icon
                            size={isTouchDevice ? 28 : 20} // Larger icon on touch devices
                            weight="bold"
                            color="white"
                          />
                        </div>

                        {/* Arrow Icon - only shows on desktop hover */}
                        {!isTouchDevice && (
                          <div
                            className={`absolute transition-all duration-300 ${
                              isHovered ? 'opacity-100 transform translate-x-10' : 'opacity-0 transform translate-x-8'
                            }`}
                          >
                            <ArrowUpRight
                              size={18}
                              weight="bold"
                              color="white"
                            />
                          </div>
                        )}

                        {/* Title Text - only shows on desktop hover */}
                        {!isTouchDevice && (
                          <div
                            className={`absolute left-3 text-white font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                              isHovered ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-4'
                            }`}
                          >
                            {item.label}
                          </div>
                        )}
                      </div>
                    </div>

                  </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceHeroNav;