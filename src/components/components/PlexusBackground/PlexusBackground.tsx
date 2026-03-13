"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ── Configuration ──
const BASE_NUM_POINTS = 240;
const MOBILE_NUM_POINTS = 120;

const CONFIG = {
  SPACE_W: 100,
  SPACE_H: 65,
  SPACE_D: 35,
  CONNECTION_DIST: 12,
  TRIANGLE_DIST: 10,
  BASE_SPEED: 0.008,
  CURSOR_RADIUS: 26,
  FOG_NEAR: 35,
  FOG_FAR: 100,
  DUST_LAYERS: [
    { count: 30, zRange: [-25, -12] as [number, number], bright: 0.25, size: 0.5, speed: 0.3 },
    { count: 40, zRange: [-10, 5] as [number, number], bright: 0.4, size: 0.8, speed: 0.6 },
    { count: 40, zRange: [5, 18] as [number, number], bright: 0.6, size: 1.2, speed: 1.0 },
  ],
} as const;

// ── Color palettes ──
const PALETTES: [number, number, number][] = [
  [0.85, 0.75, 0.52], [0.55, 0.8, 0.5], [0.72, 0.75, 0.52], [0.3, 0.75, 0.5],
  [0.12, 0.7, 0.55], [0.0, 0.75, 0.52], [0.6, 0.8, 0.5], [0.42, 0.75, 0.52], [0.95, 0.75, 0.52],
];

function randomColor(): THREE.Color {
  const c = new THREE.Color();
  const p = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  c.setHSL(p[0] + (Math.random() - 0.5) * 0.06, p[1] + (Math.random() - 0.5) * 0.1, p[2] + (Math.random() - 0.5) * 0.06);
  return c;
}

function depthFog(z: number): number {
  const dist = 75 - z;
  if (dist < CONFIG.FOG_NEAR) return 1;
  if (dist > CONFIG.FOG_FAR) return 0.35;
  return 1 - ((dist - CONFIG.FOG_NEAR) / (CONFIG.FOG_FAR - CONFIG.FOG_NEAR)) * 0.65;
}

interface PlexusPoint {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  baseColor: THREE.Color;
  displayColor: THREE.Color;
  size: number;
  baseSize: number;
  brightness: number;
  phX: number; phY: number;
  frX: number; frY: number;
  ampX: number; ampY: number;
  hueOffset: number;
  hueCycleSpeed: number;
}

interface DustLayer {
  geom: THREE.BufferGeometry;
  positions: Float32Array;
  velocities: THREE.Vector3[];
  count: number;
  zRange: [number, number];
}

export default function PlexusBackground() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const init = useCallback(() => {
    if (!bgCanvasRef.current || !mainCanvasRef.current) return;

    const bgCanvas = bgCanvasRef.current as HTMLCanvasElement;
    const mainCanvas = mainCanvasRef.current as HTMLCanvasElement;
    const bgCtx = bgCanvas.getContext("2d")!;
    const isMobile = window.innerWidth < 768;
    const NUM_POINTS = isMobile ? MOBILE_NUM_POINTS : BASE_NUM_POINTS;
    const { SPACE_W, SPACE_H, SPACE_D, CONNECTION_DIST, TRIANGLE_DIST, BASE_SPEED, CURSOR_RADIUS } = CONFIG;
    const halfW = SPACE_W / 2, halfH = SPACE_H / 2, halfD = SPACE_D / 2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.z = 75;
    const renderer = new THREE.WebGLRenderer({ canvas: mainCanvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function resize() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // ── Background aura blobs ──
    const auraBlobs = Array.from({ length: 10 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: 100 + Math.random() * 300,
      hue: Math.random() * 360,
      hueSpeed: (Math.random() - 0.5) * 0.06,
      pulsePhase: Math.random() * Math.PI * 2,
      pulseFreq: 0.3 + Math.random() * 0.4,
    }));

    function drawBackground(mx: number, my: number, time: number) {
      bgCtx.fillStyle = "#000";
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      for (const b of auraBlobs) {
        b.x += b.vx; b.y += b.vy; b.hue += b.hueSpeed;
        if (b.x < -200 || b.x > bgCanvas.width + 200) b.vx *= -1;
        if (b.y < -200 || b.y > bgCanvas.height + 200) b.vy *= -1;
        const pulse = 0.5 + 0.5 * Math.sin(time * b.pulseFreq + b.pulsePhase);
        const opacity = 0.05 + pulse * 0.05;
        const g = bgCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        g.addColorStop(0, `hsla(${b.hue},50%,20%,${opacity})`);
        g.addColorStop(0.5, `hsla(${b.hue},40%,12%,${opacity * 0.4})`);
        g.addColorStop(1, "transparent");
        bgCtx.fillStyle = g;
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      }
      if (mx > 0 && mx < bgCanvas.width) {
        const mg = bgCtx.createRadialGradient(mx, my, 0, mx, my, 220);
        mg.addColorStop(0, `hsla(${(time * 15) % 360},45%,35%,0.035)`);
        mg.addColorStop(0.4, `hsla(${(time * 15 + 50) % 360},35%,20%,0.02)`);
        mg.addColorStop(1, "transparent");
        bgCtx.fillStyle = mg;
        bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      }
      const vg = bgCtx.createRadialGradient(
        bgCanvas.width / 2, bgCanvas.height / 2, bgCanvas.height * 0.3,
        bgCanvas.width / 2, bgCanvas.height / 2, bgCanvas.height * 0.8
      );
      vg.addColorStop(0, "transparent");
      vg.addColorStop(1, "rgba(0,0,0,0.3)");
      bgCtx.fillStyle = vg;
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    }

    // ── Points ──
    const points: PlexusPoint[] = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      const col = randomColor();
      points.push({
        pos: new THREE.Vector3((Math.random() - 0.5) * SPACE_W, (Math.random() - 0.5) * SPACE_H, (Math.random() - 0.5) * SPACE_D),
        vel: new THREE.Vector3((Math.random() - 0.5) * BASE_SPEED, (Math.random() - 0.5) * BASE_SPEED, (Math.random() - 0.5) * BASE_SPEED * 0.3),
        baseColor: col.clone(), displayColor: col.clone(),
        size: 1.8 + Math.random() * 2.2, baseSize: 1.8 + Math.random() * 2.2,
        brightness: 0,
        phX: Math.random() * Math.PI * 2, phY: Math.random() * Math.PI * 2,
        frX: 0.2 + Math.random() * 0.3, frY: 0.15 + Math.random() * 0.25,
        ampX: 0.002 + Math.random() * 0.003, ampY: 0.002 + Math.random() * 0.002,
        hueOffset: 0, hueCycleSpeed: (Math.random() - 0.5) * 0.003,
      });
    }

    // ── Dot geometry ──
    const dotGeom = new THREE.BufferGeometry();
    const dotPos = new Float32Array(NUM_POINTS * 3);
    const dotCol = new Float32Array(NUM_POINTS * 3);
    const dotSz = new Float32Array(NUM_POINTS);
    dotGeom.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
    dotGeom.setAttribute("color", new THREE.BufferAttribute(dotCol, 3));
    dotGeom.setAttribute("size", new THREE.BufferAttribute(dotSz, 1));
    scene.add(new THREE.Points(dotGeom, new THREE.ShaderMaterial({
      vertexShader: `attribute float size;attribute vec3 color;varying vec3 vColor;
        void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=size*(220.0/-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying vec3 vColor;void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;
        float core=smoothstep(0.12,0.0,d);float glow=smoothstep(0.5,0.0,d)*0.5;
        gl_FragColor=vec4(vColor*(0.7+core*1.0),core+glow);}`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    // ── Lines ──
    const MAX_LINES = NUM_POINTS * 12;
    const lineGeom = new THREE.BufferGeometry();
    const linePos = new Float32Array(MAX_LINES * 6);
    const lineCol = new Float32Array(MAX_LINES * 6);
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeom.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    lineGeom.setDrawRange(0, 0);
    scene.add(new THREE.LineSegments(lineGeom, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    // ── Triangles (NormalBlending fill + AdditiveBlending glow — same as prod) ──
    const MAX_TRIS = 2500;
    function makeTriGeom() {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(MAX_TRIS * 9), 3));
      g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(MAX_TRIS * 12), 4));
      g.setDrawRange(0, 0);
      return g;
    }
    const triGeom = makeTriGeom(), glowGeom = makeTriGeom();
    const triSh = {
      vertexShader: `attribute vec4 color;varying vec4 vColor;void main(){vColor=color;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec4 vColor;void main(){gl_FragColor=vColor;}`,
    };
    scene.add(new THREE.Mesh(triGeom, new THREE.ShaderMaterial({ ...triSh, transparent: true, blending: THREE.NormalBlending, depthWrite: false, side: THREE.DoubleSide })));
    scene.add(new THREE.Mesh(glowGeom, new THREE.ShaderMaterial({ ...triSh, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })));

    // ── Spatial hash ──
    function buildGrid(pts: PlexusPoint[], cs: number) {
      const g: Record<string, number[]> = {};
      for (let i = 0; i < pts.length; i++) {
        const k = `${Math.floor(pts[i].pos.x / cs)},${Math.floor(pts[i].pos.y / cs)},${Math.floor(pts[i].pos.z / cs)}`;
        if (!g[k]) g[k] = [];
        g[k].push(i);
      }
      return g;
    }
    function getNbrs(grid: Record<string, number[]>, pt: PlexusPoint, cs: number) {
      const cx = Math.floor(pt.pos.x / cs), cy = Math.floor(pt.pos.y / cs), cz = Math.floor(pt.pos.z / cs);
      const r: number[] = [];
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        const k = `${cx + dx},${cy + dy},${cz + dz}`;
        if (grid[k]) r.push(...grid[k]);
      }
      return r;
    }

    // ── Dust layers ──
    const dustLayers: DustLayer[] = CONFIG.DUST_LAYERS.map(cfg => {
      const geom = new THREE.BufferGeometry();
      const p = new Float32Array(cfg.count * 3);
      const c = new Float32Array(cfg.count * 3);
      const s = new Float32Array(cfg.count);
      const v: THREE.Vector3[] = [];
      for (let i = 0; i < cfg.count; i++) {
        p[i * 3] = (Math.random() - 0.5) * SPACE_W * 1.5;
        p[i * 3 + 1] = (Math.random() - 0.5) * SPACE_H * 1.5;
        p[i * 3 + 2] = cfg.zRange[0] + Math.random() * (cfg.zRange[1] - cfg.zRange[0]);
        const col = randomColor();
        c[i * 3] = col.r * cfg.bright; c[i * 3 + 1] = col.g * cfg.bright; c[i * 3 + 2] = col.b * cfg.bright;
        s[i] = (0.15 + Math.random() * 0.5) * cfg.size;
        v.push(new THREE.Vector3((Math.random() - 0.5) * 0.003 * cfg.speed, (Math.random() - 0.5) * 0.003 * cfg.speed, (Math.random() - 0.5) * 0.001 * cfg.speed));
      }
      geom.setAttribute("position", new THREE.BufferAttribute(p, 3));
      geom.setAttribute("color", new THREE.BufferAttribute(c, 3));
      geom.setAttribute("size", new THREE.BufferAttribute(s, 1));
      return { geom, positions: p, velocities: v, count: cfg.count, zRange: cfg.zRange };
    });
    const dustMat = new THREE.ShaderMaterial({
      vertexShader: `attribute float size;attribute vec3 color;varying vec3 vColor;void main(){vColor=color;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=size*(150.0/-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying vec3 vColor;void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;gl_FragColor=vec4(vColor,smoothstep(0.5,0.08,d)*0.5);}`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    for (const dl of dustLayers) scene.add(new THREE.Points(dl.geom, dustMat));

    // ── Mouse & virtual cursor (for mobile) ──
    const mouseScreen = { x: -999, y: -999 };
    const mouse3D = new THREE.Vector3(999, 999, 0);
    const cursorPos = new THREE.Vector3(0, 0, 0);
    const mouseNDC = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const planeHit = new THREE.Vector3();
    let mouseActive = false;

    const effectiveRadius = isMobile ? CURSOR_RADIUS * 1.5 : CURSOR_RADIUS;
    const virtualCursor = {
      x: 0, y: 0,
      targetX: (Math.random() - 0.5) * SPACE_W * 0.6,
      targetY: (Math.random() - 0.5) * SPACE_H * 0.6,
      timer: 0,
      interval: 4 + Math.random() * 3,
    };

    function updateMouse3D() {
      raycaster.setFromCamera(mouseNDC, camera);
      if (raycaster.ray.intersectPlane(zPlane, planeHit)) mouse3D.copy(planeHit);
    }
    function onMouseMove(e: MouseEvent) {
      mouseScreen.x = e.clientX; mouseScreen.y = e.clientY;
      mouseNDC.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      mouseActive = true;
      updateMouse3D();
    }
    function onMouseLeave() { mouseActive = false; }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    // ── Animation loop ──
    const brightCol = new THREE.Color();
    let time = 0;

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate);
      time += 0.016;
      drawBackground(mouseScreen.x, mouseScreen.y, time);
      if (mouseActive) updateMouse3D();

      // Virtual cursor drift (always runs, provides ambient life on mobile)
      virtualCursor.timer += 0.016;
      if (virtualCursor.timer > virtualCursor.interval) {
        virtualCursor.timer = 0;
        virtualCursor.interval = 4 + Math.random() * 3;
        virtualCursor.targetX = (Math.random() - 0.5) * SPACE_W * 0.6;
        virtualCursor.targetY = (Math.random() - 0.5) * SPACE_H * 0.6;
      }
      virtualCursor.x += (virtualCursor.targetX - virtualCursor.x) * 0.008;
      virtualCursor.y += (virtualCursor.targetY - virtualCursor.y) * 0.008;

      if (mouseActive) {
        cursorPos.lerp(mouse3D, 0.12);
      } else {
        cursorPos.x += (virtualCursor.x - cursorPos.x) * 0.01;
        cursorPos.y += (virtualCursor.y - cursorPos.y) * 0.01;
        cursorPos.z = 0;
      }

      // Move points
      for (const p of points) {
        p.phX += p.frX * 0.016; p.phY += p.frY * 0.016;
        p.vel.x += Math.sin(p.phX) * p.ampX;
        p.vel.y += Math.cos(p.phY) * p.ampY;
        const speed = p.vel.length();
        if (speed > BASE_SPEED * 2) p.vel.multiplyScalar(BASE_SPEED * 2 / speed);
        p.pos.add(p.vel);

        if (p.pos.x > halfW) p.vel.x -= (p.pos.x - halfW) * 0.025;
        if (p.pos.x < -halfW) p.vel.x -= (p.pos.x + halfW) * 0.025;
        if (p.pos.y > halfH) p.vel.y -= (p.pos.y - halfH) * 0.025;
        if (p.pos.y < -halfH) p.vel.y -= (p.pos.y + halfH) * 0.025;
        if (p.pos.z > halfD) p.vel.z -= (p.pos.z - halfD) * 0.025;
        if (p.pos.z < -halfD) p.vel.z -= (p.pos.z + halfD) * 0.025;

        // Cursor proximity
        const dx = p.pos.x - cursorPos.x;
        const dy = p.pos.y - cursorPos.y;
        const dist2D = Math.sqrt(dx * dx + dy * dy);
        if (dist2D < effectiveRadius) {
          p.brightness = Math.min(1, p.brightness + (1 - dist2D / effectiveRadius) * 0.1);
        }
        p.brightness *= 0.94;

        p.hueOffset += p.hueCycleSpeed;
        const hsl = { h: 0, s: 0, l: 0 };
        p.baseColor.getHSL(hsl);
        const fog = depthFog(p.pos.z);
        const b = p.brightness;
        brightCol.setHSL(
          (hsl.h + p.hueOffset) % 1,
          Math.min(1, (hsl.s + b * 0.2) * fog),
          Math.min(0.75, (hsl.l + b * 0.35) * fog)
        );
        p.displayColor.copy(brightCol);
        p.size = p.baseSize * (0.5 + fog * 0.5) * (1 + b * 0.5);
      }

      // Dust
      for (const dl of dustLayers) {
        for (let i = 0; i < dl.count; i++) {
          dl.positions[i * 3] += dl.velocities[i].x;
          dl.positions[i * 3 + 1] += dl.velocities[i].y;
          dl.positions[i * 3 + 2] += dl.velocities[i].z;
          if (Math.abs(dl.positions[i * 3]) > halfW * 1.5) dl.velocities[i].x *= -1;
          if (Math.abs(dl.positions[i * 3 + 1]) > halfH * 1.5) dl.velocities[i].y *= -1;
          if (dl.positions[i * 3 + 2] < dl.zRange[0] || dl.positions[i * 3 + 2] > dl.zRange[1]) dl.velocities[i].z *= -1;
        }
        dl.geom.attributes.position.needsUpdate = true;
      }

      // Update dots
      for (let i = 0; i < NUM_POINTS; i++) {
        dotPos[i * 3] = points[i].pos.x; dotPos[i * 3 + 1] = points[i].pos.y; dotPos[i * 3 + 2] = points[i].pos.z;
        dotCol[i * 3] = points[i].displayColor.r; dotCol[i * 3 + 1] = points[i].displayColor.g; dotCol[i * 3 + 2] = points[i].displayColor.b;
        dotSz[i] = points[i].size;
      }
      dotGeom.attributes.position.needsUpdate = true;
      dotGeom.attributes.color.needsUpdate = true;
      dotGeom.attributes.size.needsUpdate = true;

      // Connections
      const grid = buildGrid(points, CONNECTION_DIST);
      let lnCt = 0, triCt = 0;
      const triSet = new Set<string>();
      const tp = triGeom.attributes.position.array as Float32Array;
      const tc = triGeom.attributes.color.array as Float32Array;
      const gp = glowGeom.attributes.position.array as Float32Array;
      const gc = glowGeom.attributes.color.array as Float32Array;

      for (let i = 0; i < NUM_POINTS && lnCt < MAX_LINES; i++) {
        const nbrs = getNbrs(grid, points[i], CONNECTION_DIST);
        const nearby: { idx: number; dist: number }[] = [];
        for (const j of nbrs) {
          if (j <= i) continue;
          const dist = points[i].pos.distanceTo(points[j].pos);
          if (dist < CONNECTION_DIST) {
            nearby.push({ idx: j, dist });
            const fade = 0.15 + 0.85 * (1 - dist / CONNECTION_DIST);
            const avgFog = (depthFog(points[i].pos.z) + depthFog(points[j].pos.z)) * 0.5;
            const avgBright = 1 + (points[i].brightness + points[j].brightness) * 0.35;
            const f = fade * avgFog * avgBright;
            const li = lnCt * 6;
            linePos[li] = points[i].pos.x; linePos[li + 1] = points[i].pos.y; linePos[li + 2] = points[i].pos.z;
            linePos[li + 3] = points[j].pos.x; linePos[li + 4] = points[j].pos.y; linePos[li + 5] = points[j].pos.z;
            lineCol[li] = points[i].displayColor.r * f; lineCol[li + 1] = points[i].displayColor.g * f; lineCol[li + 2] = points[i].displayColor.b * f;
            lineCol[li + 3] = points[j].displayColor.r * f; lineCol[li + 4] = points[j].displayColor.g * f; lineCol[li + 5] = points[j].displayColor.b * f;
            lnCt++;
          }
        }

        for (let a = 0; a < nearby.length && triCt < MAX_TRIS; a++) {
          for (let b = a + 1; b < nearby.length && triCt < MAX_TRIS; b++) {
            const ja = nearby[a].idx, jb = nearby[b].idx;
            const dab = points[ja].pos.distanceTo(points[jb].pos);
            if (dab < TRIANGLE_DIST) {
              const ids = [i, ja, jb].sort((x, y) => x - y);
              const key = `${ids[0]}-${ids[1]}-${ids[2]}`;
              if (triSet.has(key)) continue;
              triSet.add(key);

              const avgDist = (nearby[a].dist + nearby[b].dist + dab) / 3;
              const closeness = 1 - avgDist / TRIANGLE_DIST;
              const avgBright = (points[i].brightness + points[ja].brightness + points[jb].brightness) / 3;
              const avgFog = (depthFog(points[i].pos.z) + depthFog(points[ja].pos.z) + depthFog(points[jb].pos.z)) / 3;

              const alpha = (0.22 + 0.25 * closeness) * (0.35 + avgFog * 0.65) * (1 + avgBright * 0.7);
              const glowAlpha = (0.03 + avgBright * 0.08) * closeness * avgFog;

              const t9 = triCt * 9, t12 = triCt * 12;
              const px = [points[i], points[ja], points[jb]];
              for (let v = 0; v < 3; v++) {
                const pf = depthFog(px[v].pos.z);
                const dim = 0.4 + pf * 0.3 + px[v].brightness * 0.3;
                tp[t9 + v * 3] = px[v].pos.x; tp[t9 + v * 3 + 1] = px[v].pos.y; tp[t9 + v * 3 + 2] = px[v].pos.z;
                gp[t9 + v * 3] = px[v].pos.x; gp[t9 + v * 3 + 1] = px[v].pos.y; gp[t9 + v * 3 + 2] = px[v].pos.z;
                tc[t12 + v * 4] = px[v].displayColor.r * dim; tc[t12 + v * 4 + 1] = px[v].displayColor.g * dim; tc[t12 + v * 4 + 2] = px[v].displayColor.b * dim; tc[t12 + v * 4 + 3] = Math.min(alpha, 0.6);
                gc[t12 + v * 4] = px[v].displayColor.r; gc[t12 + v * 4 + 1] = px[v].displayColor.g; gc[t12 + v * 4 + 2] = px[v].displayColor.b; gc[t12 + v * 4 + 3] = glowAlpha;
              }
              triCt++;
            }
          }
        }
      }

      lineGeom.setDrawRange(0, lnCt * 2);
      lineGeom.attributes.position.needsUpdate = true;
      lineGeom.attributes.color.needsUpdate = true;
      triGeom.setDrawRange(0, triCt * 3);
      triGeom.attributes.position.needsUpdate = true;
      triGeom.attributes.color.needsUpdate = true;
      glowGeom.setDrawRange(0, triCt * 3);
      glowGeom.attributes.position.needsUpdate = true;
      glowGeom.attributes.color.needsUpdate = true;

      const t = time * 0.2;
      camera.position.x = Math.sin(t * 0.12) * 3.5;
      camera.position.y = Math.cos(t * 0.08) * 2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          if (obj.material instanceof THREE.Material) obj.material.dispose();
        }
      });
    };
  }, []);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  return (
    <>
      <canvas ref={bgCanvasRef} className="absolute inset-0 z-0 w-full h-full" />
      <canvas ref={mainCanvasRef} className="absolute inset-0 z-[1] w-full h-full" />
    </>
  );
}
