"use client";

import { useEffect, useRef } from "react";

/**
 * Animated neon light-trail background for the podcast hero.
 * Bottom-left: organic blob/loop shape in thick cyan + magenta/white accents.
 * Top-right: straight diagonal slash lines in cyan/magenta/white.
 * Draw-in animation on load, then gentle organic sway.
 */
export default function PodcastWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let sx = 1;
    let sy = 1;
    const startTime = performance.now();
    let isVisible = true;

    // Pause animation when scrolled out of view
    const visObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    visObserver.observe(canvas);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas!.offsetWidth;
      h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      sx = w / 1920;
      sy = h / 1080;
    }

    // Organic sway per point
    function animatePoint(
      x: number, y: number, i: number, time: number, seed: number
    ): [number, number] {
      const phase = seed + i * 0.7;
      const dx = Math.sin(time * 0.4 + phase) * 6 + Math.sin(time * 0.7 + phase * 1.3) * 3;
      const dy = Math.cos(time * 0.35 + phase * 0.9) * 5 + Math.cos(time * 0.6 + phase * 1.1) * 2;
      return [x + dx, y + dy];
    }

    // Calculate total path length for draw-in
    function pathLength(path: [number, number][]): number {
      let len = 0;
      for (let i = 1; i < path.length; i++) {
        const dx = (path[i][0] - path[i - 1][0]) * sx;
        const dy = (path[i][1] - path[i - 1][1]) * sy;
        len += Math.sqrt(dx * dx + dy * dy);
      }
      return len;
    }

    function drawNeonStroke(
      basePath: [number, number][],
      color: string,
      coreWidth: number,
      glowColor: string,
      glowWidth: number,
      time: number,
      seed: number,
      progress: number, // 0→1 draw-in
    ) {
      if (progress <= 0) return;

      // Animate each point
      const path = basePath.map(([x, y], i) => animatePoint(x, y, i, time, seed));
      const totalLen = pathLength(path);
      const dashLen = totalLen * progress;

      ctx!.save();
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";

      function tracePath() {
        ctx!.beginPath();
        const [x0, y0] = path[0];
        ctx!.moveTo(x0 * sx, y0 * sy);

        for (let i = 1; i < path.length - 1; i++) {
          const [cx, cy] = path[i];
          const [nx, ny] = path[i + 1];
          const midX = (cx * sx + nx * sx) / 2;
          const midY = (cy * sy + ny * sy) / 2;
          ctx!.quadraticCurveTo(cx * sx, cy * sy, midX, midY);
        }
        const [lx, ly] = path[path.length - 1];
        ctx!.lineTo(lx * sx, ly * sy);
      }

      // Use dash to reveal progressively
      const dash = progress < 1 ? [dashLen, totalLen * 2] : [];

      // Outer glow
      tracePath();
      ctx!.setLineDash(dash);
      ctx!.strokeStyle = glowColor;
      ctx!.lineWidth = glowWidth * 3 * sx;
      ctx!.globalAlpha = 0.15;
      ctx!.filter = `blur(${20 * sx}px)`;
      ctx!.stroke();

      // Mid glow
      tracePath();
      ctx!.setLineDash(dash);
      ctx!.strokeStyle = glowColor;
      ctx!.lineWidth = glowWidth * 1.5 * sx;
      ctx!.globalAlpha = 0.3;
      ctx!.filter = `blur(${8 * sx}px)`;
      ctx!.stroke();

      // Inner glow
      tracePath();
      ctx!.setLineDash(dash);
      ctx!.strokeStyle = color;
      ctx!.lineWidth = glowWidth * sx;
      ctx!.globalAlpha = 0.7;
      ctx!.filter = `blur(${3 * sx}px)`;
      ctx!.stroke();

      // Core
      tracePath();
      ctx!.setLineDash(dash);
      ctx!.strokeStyle = color;
      ctx!.lineWidth = coreWidth * sx;
      ctx!.globalAlpha = 0.95;
      ctx!.filter = "none";
      ctx!.stroke();

      // White-hot center
      tracePath();
      ctx!.setLineDash(dash);
      ctx!.strokeStyle = "#FFFFFF";
      ctx!.lineWidth = (coreWidth * 0.4) * sx;
      ctx!.globalAlpha = 0.8;
      ctx!.filter = "none";
      ctx!.stroke();

      ctx!.restore();
    }

    // ── Stroke definitions ──
    // Paths in 1920×1080 coordinate space

    const strokes: {
      path: [number, number][];
      color: string;
      core: number;
      glow: string;
      glowW: number;
      seed: number;
      drawDelay: number;  // seconds delay before draw-in starts
      drawDuration: number; // seconds for full draw-in
    }[] = [
      // ═══ BOTTOM-LEFT CORNER — organic blob/loop ═══
      // BL thick cyan blob (the main organic rounded shape)
      { path: [[-30,500],[-20,560],[-10,630],[0,700],[5,760],[0,810],[-10,860],[10,910],[50,950],[100,980],[160,1000],[230,1010],[300,1000],[350,970],[370,920],[360,860],[330,810],[280,780],[220,770],[160,790],[120,830],[100,880],[110,940],[150,990],[210,1030],[290,1060],[380,1080],[470,1095]],
        color: "#00E5FF", core: 10, glow: "#0088CC", glowW: 22, seed: 0, drawDelay: 0, drawDuration: 2.0 },
      // BL thinner cyan companion (follows blob loosely)
      { path: [[-50,480],[-40,550],[-30,620],[-20,690],[-15,750],[-25,810],[-5,870],[30,920],[80,960],[140,985],[210,995],[280,985],[330,955],[350,910],[340,855],[310,810],[260,785],[200,780],[150,805],[120,850],[115,910],[140,970],[190,1020],[260,1055],[340,1075],[430,1090]],
        color: "#00CFFF", core: 4, glow: "#006699", glowW: 10, seed: 2.1, drawDelay: 0.2, drawDuration: 2.0 },
      // BL magenta (straighter, running alongside blob)
      { path: [[-60,520],[-50,590],[-35,660],[-20,730],[-10,800],[10,870],[45,930],[95,975],[160,1010],[240,1035],[330,1050],[420,1060],[510,1070]],
        color: "#FF20DD", core: 3.5, glow: "#990066", glowW: 10, seed: 1.5, drawDelay: 0.3, drawDuration: 1.8 },
      // BL thin magenta
      { path: [[-75,540],[-65,610],[-50,680],[-35,750],[-20,820],[5,885],[40,940],[90,985],[155,1020],[235,1045],[325,1060],[415,1070]],
        color: "#FF08CC", core: 1.5, glow: "#660044", glowW: 4, seed: 3.7, drawDelay: 0.5, drawDuration: 1.6 },
      // BL white accent
      { path: [[-40,510],[-30,575],[-15,645],[0,715],[10,785],[20,850],[50,910],[95,960],[155,1000],[230,1030],[315,1050],[405,1065]],
        color: "#FFFFFF", core: 0.8, glow: "#444444", glowW: 1.5, seed: 5.2, drawDelay: 0.4, drawDuration: 1.5 },

      // ═══ TOP-RIGHT CORNER — straight diagonal slashes ═══
      // TR thick cyan main (diagonal from upper-center-right to right edge)
      { path: [[1150,-60],[1250,-20],[1350,20],[1450,60],[1550,100],[1650,140],[1750,180],[1850,230],[1950,290]],
        color: "#00E5FF", core: 10, glow: "#0088CC", glowW: 22, seed: 6.0, drawDelay: 0.1, drawDuration: 1.8 },
      // TR thinner cyan companion
      { path: [[1200,-80],[1300,-40],[1400,0],[1500,40],[1600,80],[1700,120],[1800,165],[1900,220],[2000,280]],
        color: "#00CFFF", core: 4, glow: "#006699", glowW: 10, seed: 8.1, drawDelay: 0.3, drawDuration: 1.8 },
      // TR magenta (diagonal slash)
      { path: [[1250,-50],[1350,-5],[1450,40],[1550,85],[1650,130],[1750,175],[1850,225],[1960,290]],
        color: "#FF20DD", core: 3.5, glow: "#990066", glowW: 10, seed: 7.5, drawDelay: 0.4, drawDuration: 1.6 },
      // TR thin magenta
      { path: [[1300,-70],[1400,-25],[1500,20],[1600,65],[1700,110],[1800,160],[1900,215],[2010,280]],
        color: "#FF08CC", core: 1.5, glow: "#660044", glowW: 4, seed: 9.7, drawDelay: 0.6, drawDuration: 1.5 },
      // TR white accent
      { path: [[1180,-90],[1280,-45],[1380,0],[1480,45],[1580,90],[1680,135],[1780,185],[1880,240],[1980,300]],
        color: "#FFFFFF", core: 0.8, glow: "#444444", glowW: 1.5, seed: 11.2, drawDelay: 0.5, drawDuration: 1.5 },
    ];

    function frame(t: number) {
      rafRef.current = requestAnimationFrame(frame);
      if (!isVisible) return;

      const elapsed = (t - startTime) * 0.001; // seconds since mount
      const time = t * 0.001;

      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, w, h);

      for (const s of strokes) {
        // Draw-in progress: 0 before delay, ramps 0→1 over duration
        const drawElapsed = elapsed - s.drawDelay;
        const progress = Math.min(1, Math.max(0, drawElapsed / s.drawDuration));
        // Ease-out for natural lightning feel
        const eased = 1 - Math.pow(1 - progress, 2.5);

        drawNeonStroke(s.path, s.color, s.core, s.glow, s.glowW, time, s.seed, eased);
      }

    }

    resize();
    rafRef.current = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      visObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-black"
    />
  );
}
