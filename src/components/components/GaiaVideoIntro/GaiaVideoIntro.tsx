"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import cn from "classnames";
import { PlayIcon, SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react";
import styles from "./GaiaVideoIntro.module.css";

/* ─── Config ─── */

const GRID_COLS = 80;          // dots across
const GRID_ROWS = 80;          // square grid for even coverage
const MOBILE_GRID_COLS = 45;
const MOBILE_GRID_ROWS = 45;
const DOT_SPACING = 1.6;       // wider spacing for subtlety

/* Characters of "Meet Gaia" with metadata */
const TITLE_CHARS = "Meet Gaia".split("").map((ch, i) => ({
  ch,
  // "ai" = indices 6,7 in "Meet Gaia"
  isAi: i === 6 || i === 7,
  // Stagger delay: each char reveals slightly after the previous
  delay: i * 50, // ms
}));

/* ─── Component ─── */

interface GaiaVideoIntroProps {
  videoSrc: string;
  children: React.ReactNode;
}

const GaiaVideoIntro: React.FC<GaiaVideoIntroProps> = ({
  videoSrc,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animRef = useRef<number>(0);

  // Phase: "intro" (text + button) → "video" → "done"
  const [phase, setPhase] = useState<"intro" | "video" | "done">("intro");
  const [charsRevealed, setCharsRevealed] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState("");
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  /* ── iOS keyboard: resize fixed wrapper to visual viewport ── */
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !wrapperRef.current) return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const update = () => {
      const el = wrapperRef.current;
      if (!el) return;
      // visualViewport.height excludes the keyboard
      el.style.height = `${vv.height - 70}px`;
      el.style.top = `${vv.offsetTop + 70}px`;
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  const finishIntro = useCallback(() => {
    if (phaseRef.current === "done") return;
    setPhase("done");
  }, []);

  /* ── Staggered character reveal — delayed to sync with dot entrance ── */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Text begins at 0.4s as dots start filling in
    const textStart = 400;
    TITLE_CHARS.forEach((_, i) => {
      timers.push(setTimeout(() => setCharsRevealed(i + 1), textStart + TITLE_CHARS[i].delay));
    });

    // Show button after all chars revealed + small pause
    const totalCharTime = textStart + TITLE_CHARS[TITLE_CHARS.length - 1].delay;
    timers.push(setTimeout(() => setButtonVisible(true), totalCharTime + 250));

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── User clicks "Experience Gaia" → play video with audio ── */
  const handlePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current.play().catch(() => {
      // If unmuted play fails, try muted
      videoRef.current!.muted = true;
      videoRef.current!.play().catch(() => {});
    });
    setPhase("video");
  }, []);

  /* ── Mute toggle ── */
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }, []);

  /* ── Captions via <track> cuechange ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCueChange = () => {
      const track = video.textTracks[0];
      if (!track || !track.activeCues || track.activeCues.length === 0) {
        setCaption("");
        return;
      }
      const cue = track.activeCues[0] as VTTCue;
      setCaption(cue.text);
    };

    const checkTrack = () => {
      const track = video.textTracks[0];
      if (track) {
        track.mode = "hidden"; // we render captions ourselves
        track.addEventListener("cuechange", handleCueChange);
      }
    };

    // Track may load async
    video.addEventListener("loadedmetadata", checkTrack);
    checkTrack();

    return () => {
      video.removeEventListener("loadedmetadata", checkTrack);
      const track = video.textTracks[0];
      if (track) track.removeEventListener("cuechange", handleCueChange);
    };
  }, []);

  /* ── Three.js dot-grid wave plane ── */
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const getSize = () => ({
      w: wrapper.clientWidth,
      h: wrapper.clientHeight || window.innerHeight,
    });

    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? MOBILE_GRID_COLS : GRID_COLS;
    const rows = isMobile ? MOBILE_GRID_ROWS : GRID_ROWS;
    const count = cols * rows;

    const { w, h } = getSize();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 300);
    camera.position.set(0, 35, 50);
    camera.lookAt(0, 0, -5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 2); // store grid x,z

    const halfW = (cols - 1) * DOT_SPACING * 0.5;
    const halfD = (rows - 1) * DOT_SPACING * 0.5;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = row * cols + col;
        const x = col * DOT_SPACING - halfW;
        const z = row * DOT_SPACING - halfD;
        basePositions[i * 2] = x;
        basePositions[i * 2 + 1] = z;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Pass grid extents as uniforms for edge fade
    // Max radial distance for reveal sweep
    const maxRadius = Math.sqrt(halfW * halfW + halfD * halfD);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uHalfW: { value: halfW },
        uHalfD: { value: halfD },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uReveal: { value: 0.0 },       // 0→1 radial entrance
        uMaxRadius: { value: maxRadius },
        uGlobalAlpha: { value: 1.0 },  // dims dots during video/chat
      },
      vertexShader: `
        uniform float uHalfW;
        uniform float uHalfD;
        uniform float uReveal;
        uniform float uMaxRadius;
        uniform vec3 uMouse;
        uniform float uGlobalAlpha;
        varying float vHeight;
        varying float vDist;
        varying float vEdgeFade;
        varying float vCursorProximity;
        varying float vRevealAlpha;
        void main() {
          vHeight = position.y;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDist = -mv.z;
          gl_PointSize = max(1.5, 3.0 * (120.0 / vDist));
          gl_Position = projectionMatrix * mv;

          // Soft fade at all edges based on world position
          float fx = 1.0 - smoothstep(uHalfW * 0.6, uHalfW, abs(position.x));
          float fz = 1.0 - smoothstep(uHalfD * 0.5, uHalfD, abs(position.z));
          vEdgeFade = fx * fz;

          // Cursor proximity (xz distance)
          float dx = position.x - uMouse.x;
          float dz = position.z - uMouse.z;
          float cursorDist = sqrt(dx * dx + dz * dz);
          vCursorProximity = exp(-cursorDist * cursorDist / 120.0);

          // Radial reveal: dots near center appear first, sweep outward
          float dotRadius = length(vec2(position.x, position.z));
          float revealEdge = uReveal * uMaxRadius * 1.3; // overshoot so all dots fully in
          vRevealAlpha = smoothstep(revealEdge - 12.0, revealEdge, dotRadius);
          vRevealAlpha = 1.0 - vRevealAlpha;
        }
      `,
      fragmentShader: `
        uniform float uGlobalAlpha;
        varying float vHeight;
        varying float vDist;
        varying float vEdgeFade;
        varying float vCursorProximity;
        varying float vRevealAlpha;
        void main() {
          if (vRevealAlpha < 0.01 || uGlobalAlpha < 0.01) discard;

          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float core = smoothstep(0.3, 0.0, d);

          // Map height to color: low = dim blue, high = bright cyan
          float h = clamp((vHeight + 2.0) / 5.0, 0.0, 1.0);
          vec3 colLow  = vec3(0.15, 0.30, 0.55);
          vec3 colHigh = vec3(0.30, 0.65, 1.0);
          vec3 col = mix(colLow, colHigh, h);

          // Warm cyan-teal tint near cursor
          vec3 cursorTint = vec3(0.3, 0.85, 0.95);
          col = mix(col, cursorTint, vCursorProximity * 0.7);

          // Brighten dots near cursor
          float brightBoost = 1.0 + vCursorProximity * 0.6;

          // Distance + edge fade + reveal + global dim
          float distFade = smoothstep(160.0, 60.0, vDist);
          float a = core * distFade * vEdgeFade * 0.85 * brightBoost * vRevealAlpha * uGlobalAlpha;

          gl_FragColor = vec4(col * brightBoost, a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    scene.add(new THREE.Points(geometry, material));

    // Raycaster for cursor → world position
    const raycaster = new THREE.Raycaster();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const mouseWorld = new THREE.Vector3();

    let hasMouseMoved = false;
    function onPointerMove(e: PointerEvent) {
      if (!wrapper) return;
      hasMouseMoved = true;
      const rect = wrapper.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    window.addEventListener("pointermove", onPointerMove);

    function onResize() {
      const { w: rw, h: rh } = getSize();
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    }
    window.addEventListener("resize", onResize);

    let time = 0;
    let reveal = 0;      // 0→1 radial entrance
    let waveScale = 0;   // starts at 0, builds up with reveal
    let globalAlpha = 1.0;
    const startTime = performance.now();
    const REVEAL_DURATION = 2000; // ms — dots sweep in over 2s

    function animate() {
      animRef.current = requestAnimationFrame(animate);
      time += 0.008;

      // Drive radial reveal (eased)
      const elapsed = performance.now() - startTime;
      const rawReveal = Math.min(elapsed / REVEAL_DURATION, 1.0);
      reveal = rawReveal * rawReveal * (3 - 2 * rawReveal); // smoothstep ease
      material.uniforms.uReveal.value = reveal;

      // Wave amplitude: builds up with reveal, then calms during video/done
      const introTarget = reveal; // waves build as dots appear
      const phaseTarget = phaseRef.current === "intro" ? introTarget : 0.25;
      waveScale += (phaseTarget - waveScale) * 0.03;

      // Dim dots during video (15%) and chat (40% for visible texture)
      const alphaTarget = phaseRef.current === "intro" ? 1.0
        : phaseRef.current === "video" ? 0.15 : 0.4;
      globalAlpha += (alphaTarget - globalAlpha) * 0.03;
      material.uniforms.uGlobalAlpha.value = globalAlpha;

      // Project mouse into world space on the y=0 plane (only after user moves)
      if (hasMouseMoved) {
        raycaster.setFromCamera(
          new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
          camera
        );
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(mousePlane, intersectPoint);
        mouseWorld.lerp(intersectPoint || mouseWorld, 0.05);
        material.uniforms.uMouse.value.copy(mouseWorld);
      }

      for (let i = 0; i < count; i++) {
        const bx = basePositions[i * 2];
        const bz = basePositions[i * 2 + 1];

        // Ambient wave: layered sine waves (scaled by phase)
        const wave1 = Math.sin(bx * 0.12 + time * 1.8) * 1.2 * waveScale;
        const wave2 = Math.sin(bz * 0.15 + time * 1.4) * 0.9 * waveScale;
        const wave3 = Math.sin((bx + bz) * 0.08 + time * 2.2) * 0.6 * waveScale;
        let y = wave1 + wave2 + wave3;

        // Cursor ripple: raise dots near the cursor (also scaled)
        const dx = bx - mouseWorld.x;
        const dz = bz - mouseWorld.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const cursorEffect = Math.exp(-dist * dist / 80) * 4.0 * waveScale;
        const cursorRipple = Math.sin(dist * 0.5 - time * 4.0) * Math.exp(-dist * 0.06) * 1.5 * waveScale;
        y += cursorEffect + cursorRipple;

        positions[i * 3 + 1] = y;
      }

      geometry.attributes.position.needsUpdate = true;

      // Gentle camera drift
      camera.position.x = Math.sin(time * 0.3) * 1.5;
      camera.position.y = 35 + Math.sin(time * 0.2) * 0.8;
      camera.lookAt(0, 0, -5);

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", styles.wrapper)}>
      {/* ── Persistent particle background ── */}
      <canvas
        ref={canvasRef}
        className={styles.particlesCanvas}
      />
      <div className={styles.particlesFade} aria-hidden="true" />

      {/* ── Video — behind particles, fades in during video phase ── */}
      <div className={cn(
        styles.videoLayer,
        phase === "video" && styles.videoVisible,
        phase === "done" && styles.fadeOut,
      )}>
        <div className={styles.videoFrame}>
          <video
            ref={videoRef}
            src={videoSrc}
            className={styles.videoEl}
            playsInline
            muted
            preload="auto"
            onEnded={finishIntro}
          >
            <track kind="captions" src="/captions/gaia-intro.vtt" srcLang="en" label="English" />
          </video>
          <div className={cn(styles.vignette, styles.vignetteTop)} aria-hidden="true" />
          <div className={cn(styles.vignette, styles.vignetteBottom)} aria-hidden="true" />
          <div className={cn(styles.vignette, styles.vignetteLeft)} aria-hidden="true" />
          <div className={cn(styles.vignette, styles.vignetteRight)} aria-hidden="true" />
        </div>

      </div>

      {/* ── Video controls overlay — click area to mute + captions ── */}
      {phase === "video" && (
        <div
          className={styles.videoControls}
          onClick={toggleMute}
          role="button"
          tabIndex={0}
          aria-label={muted ? "Unmute video" : "Mute video"}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleMute(); }}
        >
          {/* Captions */}
          {caption && (
            <div className={styles.captionBar}>
              <p className={styles.captionText}>{caption}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Mute circle — anchored top-right of the video frame ── */}
      {phase === "video" && (
        <button
          className={styles.muteBtn}
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          <span className={styles.muteBtnInner}>
            {muted ? (
              <SpeakerSlashIcon size={20} weight="fill" />
            ) : (
              <SpeakerHighIcon size={20} weight="fill" />
            )}
          </span>
        </button>
      )}

      {/* ── Intro overlay (title + button) ── */}
      <div className={cn(styles.introWrap, phase === "done" && styles.introDone)}>
        <div className={cn(
          styles.titleOverlay,
          phase === "intro" && styles.titleVisible,
          phase !== "intro" && styles.titleExiting,
        )}>
          <div className={styles.titleContent}>
            <h1 className={styles.meetTitle}>
              {TITLE_CHARS.map(({ ch, isAi }, i) => (
                <span
                  key={i}
                  className={cn(
                    styles.char,
                    i < charsRevealed && styles.charRevealed,
                    isAi && i < charsRevealed && styles.aiChar,
                  )}
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h1>

            <button
              className={cn(styles.playBtn, buttonVisible && styles.playBtnVisible)}
              onClick={handlePlay}
            >
              <span className={styles.playIcon}>
                <PlayIcon size={18} weight="fill" />
              </span>
              <span>Watch Introduction</span>
            </button>
            <p className={cn(styles.audioHint, buttonVisible && styles.audioHintVisible)}>
              Audio will play
            </p>
          </div>
        </div>
      </div>

      {/* ── Chat — fades in after intro finishes ── */}
      <div className={cn(styles.chatSection, phase === "done" && styles.chatVisible)}>
        {children}
      </div>
    </div>
  );
};

export default GaiaVideoIntro;
