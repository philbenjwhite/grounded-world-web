"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import cn from "classnames";
import styles from "./GaiaVideoIntro.module.css";

/* ─── Particle config ─── */

const PARTICLE_COUNT = 90;
const MOBILE_PARTICLE_COUNT = 45;

/* ─── Vimeo URL parser ─── */

function parseVimeoUrl(url: string): { id: string; hash?: string } | null {
  const patterns = [
    /vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/,
    /player\.vimeo\.com\/video\/(\d+)\?.*?h=([a-zA-Z0-9]+)/,
    /vimeo\.com\/(\d+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return { id: m[1], hash: m[2] || undefined };
  }
  return null;
}

/* ─── Component ─── */

interface GaiaVideoIntroProps {
  vimeoUrl: string;
  videoDuration?: number;
  children: React.ReactNode;
}

const GaiaVideoIntro: React.FC<GaiaVideoIntroProps> = ({
  vimeoUrl,
  videoDuration = 30,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [introComplete, setIntroComplete] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const completedRef = useRef(false);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIntroComplete(true);
  }, []);

  /* ── Listen for Vimeo "ended" event via postMessage ── */
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data !== "string") return;
      try {
        const data = JSON.parse(e.data);
        if (data.event === "ended") completeIntro();
      } catch {
        /* not JSON */
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [completeIntro]);

  /* ── Fallback timer ── */
  useEffect(() => {
    const timer = setTimeout(completeIntro, videoDuration * 1000);
    return () => clearTimeout(timer);
  }, [videoDuration, completeIntro]);

  /* ── Three.js orbiting particle field ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_PARTICLE_COUNT : PARTICLE_COUNT;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Particle data — elliptical orbits circling around the video area */
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const orbits: {
      radiusX: number;
      radiusY: number;
      speed: number;
      phase: number;
      tilt: number;
      yOffset: number;
      wobbleAmp: number;
      wobbleFreq: number;
    }[] = [];

    for (let i = 0; i < count; i++) {
      // Elliptical orbits sized to frame the video area
      const radiusX = 18 + Math.random() * 16;
      const radiusY = 12 + Math.random() * 10;
      const speed = 0.12 + Math.random() * 0.2;
      const phase = Math.random() * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 0.4;
      const yOffset = (Math.random() - 0.5) * 3;
      const wobbleAmp = 0.3 + Math.random() * 1.0;
      const wobbleFreq = 0.4 + Math.random() * 1.2;

      orbits.push({ radiusX, radiusY, speed, phase, tilt, yOffset, wobbleAmp, wobbleFreq });

      const angle = phase;
      positions[i * 3] = Math.cos(angle) * radiusX;
      positions[i * 3 + 1] = Math.sin(angle) * radiusY + yOffset;
      positions[i * 3 + 2] = Math.sin(angle + tilt) * 6;

      // Blue-cyan-white palette
      const t = Math.random();
      colors[i * 3] = 0.3 + t * 0.4;
      colors[i * 3 + 1] = 0.55 + t * 0.35;
      colors[i * 3 + 2] = 0.85 + t * 0.15;

      sizes[i] = 0.8 + Math.random() * 2.0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float dist = -mv.z;
          vAlpha = smoothstep(80.0, 20.0, dist) * 0.7;
          gl_PointSize = size * (160.0 / dist);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float core = smoothstep(0.12, 0.0, d);
          float glow = smoothstep(0.5, 0.0, d) * 0.3;
          float a = (core + glow) * vAlpha;
          gl_FragColor = vec4(vColor * (0.6 + core * 0.5), a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    let time = 0;

    function animate() {
      animRef.current = requestAnimationFrame(animate);
      time += 0.016;

      for (let i = 0; i < count; i++) {
        const o = orbits[i];
        const angle = o.phase + time * o.speed;
        const wobble = Math.sin(time * o.wobbleFreq + i) * o.wobbleAmp;

        positions[i * 3] = Math.cos(angle) * o.radiusX + wobble * 0.3;
        positions[i * 3 + 1] = Math.sin(angle) * o.radiusY + o.yOffset + wobble * 0.4;
        positions[i * 3 + 2] = Math.sin(angle + o.tilt) * 6 + wobble * 0.15;

        sizes[i] = (0.8 + Math.sin(time * 2.0 + i * 2.7) * 0.5) * (1.0 + Math.random() * 0.05);
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      camera.position.x = Math.sin(time * 0.06) * 1.0;
      camera.position.y = Math.cos(time * 0.04) * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  /* ── Build Vimeo iframe src — hide all Vimeo UI ── */
  const vimeo = parseVimeoUrl(vimeoUrl);
  const iframeSrc = vimeo
    ? `https://player.vimeo.com/video/${vimeo.id}?autoplay=1&loop=0&muted=0&quality=auto&api=1&title=0&byline=0&portrait=0&sidedock=0&controls=0${vimeo.hash ? `&h=${vimeo.hash}` : ""}`
    : undefined;

  return (
    <div>
      {/* ── Video intro section ── */}
      <div
        className={cn(styles.introWrap, introComplete && styles.faded)}
        style={
          introComplete
            ? {
                height: 0,
                minHeight: 0,
                overflow: "hidden",
                transition: "height 1.2s ease-out 0.4s, min-height 1.2s ease-out 0.4s",
              }
            : undefined
        }
      >
        {/* Orbiting particles canvas */}
        <canvas
          ref={canvasRef}
          className={cn(styles.particlesCanvas, introComplete && styles.hidden)}
        />

        {/* Centered video with vignette */}
        <div className={styles.videoCenter}>
          <div className={cn(styles.videoFrame, introComplete && styles.hidden)}>
            {/* "Meet Gaia..." loader shown before iframe loads */}
            <div
              className={cn(
                styles.loaderText,
                iframeLoaded && styles.loaderTextHide
              )}
            >
              <h1 className={styles.meetTitle}>
                Meet G<span className={styles.aiSpan}>ai</span>a...
              </h1>
            </div>

            {iframeSrc && (
              <iframe
                src={iframeSrc}
                allow="autoplay; fullscreen"
                title="Meet Gaia"
                className={cn(styles.vimeoIframe, iframeLoaded && styles.iframeVisible)}
                onLoad={() => setIframeLoaded(true)}
              />
            )}

            {/* Radial vignette on all edges */}
            <div className={styles.vignette} aria-hidden="true" />
          </div>

          {/* "Meet Gaia..." below the video once loaded */}
          <div
            className={cn(
              styles.textBelow,
              iframeLoaded && styles.textBelowVisible,
              introComplete && styles.hidden
            )}
          >
            <h1 className={styles.meetTitle}>
              Meet G<span className={styles.aiSpan}>ai</span>a...
            </h1>
          </div>
        </div>

        {/* Skip button */}
        <button
          className={cn(styles.skipBtn, introComplete && styles.hidden)}
          onClick={completeIntro}
        >
          Skip intro
        </button>
      </div>

      {/* ── Chat / content section ── */}
      <div className={cn(styles.chatSection, introComplete && styles.visible)}>
        {children}
      </div>
    </div>
  );
};

export default GaiaVideoIntro;
