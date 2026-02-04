'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface NavItem {
  id: string;
  label: string;
  color: string;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'research', label: 'Research', color: '#00AEEF', description: 'User Research & Analysis' },
  { id: 'strategy', label: 'Strategy', color: '#FFA603', description: 'Product Strategy' },
  { id: 'activation', label: 'Activation', color: '#FF08CC', description: 'Design Activation' },
  { id: 'impact', label: 'Impact', color: '#1CC35B', description: 'Measuring Impact' },
];

const ServiceHeroNav: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | undefined>();
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>();
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>();
  const animationFrameRef = useRef<number | undefined>();
  const [activeNav, setActiveNav] = useState<string>('research');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isAnyHovered, setIsAnyHovered] = useState(false);

  // Store references to Three.js objects for color animation
  const dotsRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  const shapesRef = useRef<THREE.Mesh[]>([]);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

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

      // Create scattered elements
      createScatteredElements(scene);

      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);

        // Gentle rotation and floating animation
        dotsRef.current.forEach((dot, index) => {
          dot.rotation.x += 0.001 * (index % 2 === 0 ? 1 : -1);
          dot.rotation.y += 0.001 * (index % 3 === 0 ? 1 : -1);
          dot.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        });

        shapesRef.current.forEach((shape, index) => {
          shape.rotation.x += 0.0005 * (index % 2 === 0 ? 1 : -1);
          shape.rotation.z += 0.0005 * (index % 3 === 0 ? 1 : -1);
        });

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

  const createScatteredElements = (scene: THREE.Scene) => {
    const activeColor = navItems.find(item => item.id === activeNav)?.color || '#00AEEF';

    // Clear existing elements
    dotsRef.current.forEach(dot => scene.remove(dot));
    linesRef.current.forEach(line => scene.remove(line));
    shapesRef.current.forEach(shape => scene.remove(shape));
    dotsRef.current = [];
    linesRef.current = [];
    shapesRef.current = [];

    // Create dots
    const dotCount = 50;
    for (let i = 0; i < dotCount; i++) {
      const geometry = new THREE.SphereGeometry(
        Math.random() * 0.1 + 0.05, // Random size
        8,
        8
      );

      const material = new THREE.MeshBasicMaterial({
        color: generateColorVariation(activeColor),
        transparent: true,
        opacity: Math.random() * 0.8 + 0.2
      });

      const dot = new THREE.Mesh(geometry, material);

      // Position in a circle around center, avoiding the center nav area
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 25 + 10; // Keep away from center
      dot.position.x = Math.cos(angle) * distance;
      dot.position.y = Math.sin(angle) * distance;
      dot.position.z = (Math.random() - 0.5) * 10;

      scene.add(dot);
      dotsRef.current.push(dot);
    }

    // Create connecting lines
    const lineCount = 20;
    for (let i = 0; i < lineCount; i++) {
      const points = [];
      const startDot = dotsRef.current[Math.floor(Math.random() * dotsRef.current.length)];
      const endDot = dotsRef.current[Math.floor(Math.random() * dotsRef.current.length)];

      if (startDot && endDot && startDot !== endDot) {
        points.push(startDot.position.clone());
        points.push(endDot.position.clone());

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: generateColorVariation(activeColor),
          transparent: true,
          opacity: Math.random() * 0.3 + 0.1
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);
        linesRef.current.push(line);
      }
    }

    // Create abstract shapes
    const shapeCount = 15;
    for (let i = 0; i < shapeCount; i++) {
      let geometry;
      const shapeType = Math.floor(Math.random() * 3);

      switch (shapeType) {
        case 0:
          geometry = new THREE.RingGeometry(1, 2, 8);
          break;
        case 1:
          geometry = new THREE.PlaneGeometry(2, 2);
          break;
        default:
          geometry = new THREE.TorusGeometry(1, 0.3, 8, 16);
      }

      const material = new THREE.MeshBasicMaterial({
        color: generateColorVariation(activeColor),
        transparent: true,
        opacity: Math.random() * 0.2 + 0.05,
        wireframe: Math.random() > 0.5
      });

      const shape = new THREE.Mesh(geometry, material);

      // Position around the scene
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 30 + 15;
      shape.position.x = Math.cos(angle) * distance;
      shape.position.y = Math.sin(angle) * distance;
      shape.position.z = (Math.random() - 0.5) * 15;

      shape.rotation.x = Math.random() * Math.PI;
      shape.rotation.y = Math.random() * Math.PI;
      shape.rotation.z = Math.random() * Math.PI;

      scene.add(shape);
      shapesRef.current.push(shape);
    }
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
      `}</style>
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Navigation Overlay - Centered Container */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Center Video */}
          <div className="absolute z-10 pointer-events-auto" style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <div
              className="w-[420px] h-[420px] rounded-full overflow-hidden"
              style={{
                clipPath: 'circle(50%)'
              }}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="https://player.vimeo.com/progressive_redirect/playback/910945254/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=91edb0069e9894c93c49423428ea451136b6b2f4fedf93a848e1bbce331c59d3"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          {/* Dotted Orbit Circle */}
          <div
            className="absolute z-5 pointer-events-none"
            style={{
              width: '580px',
              height: '580px',
              border: '2px dotted rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
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
                      width: '580px',
                      height: '580px',
                      transform: `translate(-50%, -50%) rotate(${baseAngle}deg)`,
                      animationName: 'orbit',
                      animationDuration: '60s',
                      animationTimingFunction: 'linear',
                      animationIterationCount: 'infinite',
                      animationDelay: `${-index * 15}s`,
                      animationPlayState: isAnyHovered ? 'paused' : 'running',
                      animationFillMode: 'forwards'
                    }}
                  >
                  <button
                    className="absolute group transition-all duration-300"
                    style={{
                      top: '0',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => handleNavHover(item.id)}
                    onMouseLeave={() => handleNavHover(null)}
                  >
                    {/* Navigation Dot */}
                    <div
                      className={`w-11 h-11 rounded-full transition-all duration-300 ${
                        isHovered ? 'scale-125' : isActive ? 'scale-110' : 'scale-100'
                      }`}
                      style={{
                        backgroundColor: item.color,
                        boxShadow: isHovered
                          ? `0 0 30px ${item.color}80, 0 0 60px ${item.color}60, 0 0 90px ${item.color}40`
                          : isActive
                          ? `0 0 20px ${item.color}50, 0 0 40px ${item.color}30`
                          : `0 0 10px ${item.color}30`
                      }}
                    />

                    {/* Label - only show on hover */}
                    {isHovered && (
                      <div
                        className="absolute whitespace-nowrap text-center z-30"
                        style={{
                          top: '-60px',
                          left: '50%',
                          transform: `translate(-50%, 0) rotate(-${baseAngle}deg)`,
                          transformOrigin: '50% 350px'
                        }}
                      >
                        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                          <h3
                            className="text-sm font-medium text-white"
                            style={{ color: item.color }}
                          >
                            {item.label}
                          </h3>
                          <p className="text-xs text-white/70 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )}
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