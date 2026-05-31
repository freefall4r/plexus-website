"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// ---- shared carved-wood materials (no envMap → never drops WebGL context) ----
function makeWood(color: string) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.45,
    metalness: 0.0,
    emissive: new THREE.Color(color).multiplyScalar(0.06),
  });
}
const woods = [
  makeWood("#7a4f29"),
  makeWood("#9a6a38"),
  makeWood("#5a3a1f"),
  makeWood("#b07d44"),
];

type BeamDef = { pos: [number, number, number]; size: [number, number, number]; mat: number };
const L = 8.4;
const T = 1.35;
const G = 1.42;
const beams: BeamDef[] = [
  { pos: [0, G, 0], size: [L, T, T], mat: 0 },
  { pos: [0, -G, 0], size: [L, T, T], mat: 1 },
  { pos: [G, 0, 0], size: [T, L, T], mat: 2 },
  { pos: [-G, 0, 0], size: [T, L, T], mat: 3 },
  { pos: [0, 0, G], size: [T, T, L], mat: 1 },
  { pos: [0, 0, -G], size: [T, T, L], mat: 0 },
];

// Shared scroll/pointer signal (avoids per-frame React re-renders).
type ScrollState = { page: number; hero: number; mx: number; my: number };

function Burr({ scroll }: { scroll: React.RefObject<ScrollState> }) {
  const group = useRef<THREE.Group>(null);
  const beamRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tmp = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const s = scroll.current ?? { page: 0, hero: 0, mx: 0, my: 0 };
    const k = Math.min(1, dt * 4);

    const targetY = state.clock.elapsedTime * 0.16 + s.page * Math.PI * 2.4;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (-0.4 + s.my * 0.25 + s.hero * 0.5 - g.rotation.x) * Math.min(1, dt * 3);
    g.rotation.z += (s.mx * 0.12 - g.rotation.z) * Math.min(1, dt * 3);

    // assemble during the first ~1.5 viewports, then stay assembled.
    const assemble = 0.5 + 0.5 * Math.min(1, s.hero * 1.6);
    beams.forEach((b, i) => {
      const m = beamRefs.current[i];
      if (!m) return;
      tmp.current.set(b.pos[0], b.pos[1], b.pos[2]).normalize();
      const explode = Math.pow(1 - assemble, 2) * 13;
      m.position.set(
        b.pos[0] + tmp.current.x * explode,
        b.pos[1] + tmp.current.y * explode,
        b.pos[2] + tmp.current.z * explode
      );
    });
  });

  return (
    <group ref={group} scale={0.92}>
      {beams.map((b, i) => (
        <RoundedBox
          key={i}
          ref={(el) => {
            beamRefs.current[i] = el;
          }}
          args={b.size}
          radius={0.16}
          smoothness={4}
          position={b.pos}
          material={woods[b.mat]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

// Drifting wooden beams that parallax as you scroll — gives 3D presence in
// every section (they're spread in depth around the central burr).
function FloatingWood({ scroll }: { scroll: React.RefObject<ScrollState> }) {
  const group = useRef<THREE.Group>(null);
  const items = useRef(
    [
      { p: [-11, 7, -6], s: [5, 0.9, 0.9], r: 0.5, m: 2, sp: 0.12 },
      { p: [12, 4, -8], s: [6, 1.0, 1.0], r: -0.8, m: 1, sp: -0.1 },
      { p: [-13, -3, -5], s: [4.5, 0.8, 0.8], r: 1.1, m: 3, sp: 0.16 },
      { p: [13, -7, -7], s: [5.5, 0.9, 0.9], r: -0.4, m: 0, sp: -0.13 },
      { p: [-9, -10, -4], s: [4, 0.8, 0.8], r: 0.9, m: 1, sp: 0.1 },
      { p: [10, 11, -9], s: [6.5, 1.0, 1.0], r: 0.2, m: 2, sp: -0.08 },
    ] as { p: [number, number, number]; s: [number, number, number]; r: number; m: number; sp: number }[]
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const s = scroll.current ?? { page: 0, hero: 0, mx: 0, my: 0 };
    if (group.current) {
      // vertical parallax with scroll
      group.current.position.y = s.page * 10;
    }
    items.current.forEach((it, i) => {
      const m = refs.current[i];
      if (!m) return;
      m.rotation.z = it.r + state.clock.elapsedTime * it.sp;
      m.rotation.x = it.r * 0.5 + state.clock.elapsedTime * it.sp * 0.5;
    });
  });

  return (
    <group ref={group}>
      {items.current.map((it, i) => (
        <RoundedBox
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          args={it.s}
          radius={0.14}
          smoothness={3}
          position={it.p}
          material={woods[it.m]}
        />
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useRef<THREE.BufferGeometry | null>(null);
  const tex = useRef<THREE.CanvasTexture | null>(null);

  if (!geo.current) {
    const g = new THREE.BufferGeometry();
    const n = 110;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 30 - 15;
      arr[i * 3 + 1] = ((Math.sin(i * 78.233) * 43758.5453) % 1) * 22 - 11;
      arr[i * 3 + 2] = ((Math.sin(i * 37.719) * 43758.5453) % 1) * 14 - 7;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    geo.current = g;
  }
  // round soft sprite so dust isn't square
  if (!tex.current && typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,230,190,1)");
    grad.addColorStop(1, "rgba(255,230,190,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    tex.current = new THREE.CanvasTexture(c);
  }

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.025;
  });

  return (
    <points ref={ref} geometry={geo.current}>
      <pointsMaterial
        size={0.13}
        map={tex.current ?? undefined}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        color="#e0b483"
      />
    </points>
  );
}

export function HomeBackground() {
  const scroll = useRef<ScrollState>({ page: 0, hero: 0, mx: 0, my: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const cur = scroll.current;
      scroll.current = {
        ...cur,
        page: max > 0 ? Math.min(1, y / max) : 0,
        hero: Math.min(1, y / (window.innerHeight * 1.4)),
      };
    };
    const onMove = (e: PointerEvent) => {
      scroll.current = {
        ...scroll.current,
        mx: (e.clientX / window.innerWidth) * 2 - 1,
        my: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 17], fov: 42 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
      }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[8, 11, 6]}
        intensity={3.4}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
      />
      <directionalLight position={[-9, 2, -6]} intensity={1.5} color="#c8772e" />
      <directionalLight position={[-4, -3, 8]} intensity={0.45} color="#9fb4c9" />
      <pointLight position={[0, 0, 5]} intensity={16} distance={16} color="#ffb866" />

      <Burr scroll={scroll} />
      <FloatingWood scroll={scroll} />
      <Dust />
    </Canvas>
  );
}
