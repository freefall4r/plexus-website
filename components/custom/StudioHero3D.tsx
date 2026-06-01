"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type ScrollState = { p: number; mx: number; my: number };

// A faceted "wood gem" wrapped in a glowing amber wireframe — blueprint meeting
// material. Scroll drives the reveal: the wireframe shell expands & dissolves
// while the solid gem tilts, spins and recedes.
function Gem({ scroll }: { scroll: React.RefObject<ScrollState> }) {
  const grp = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b08a5b",
        roughness: 0.4,
        metalness: 0.05,
        flatShading: true,
        emissive: new THREE.Color("#5a4126"),
        emissiveIntensity: 0.4,
      }),
    []
  );
  const shellMat = useMemo(
    () => new THREE.MeshBasicMaterial({ wireframe: true, color: "#b87a52", transparent: true, opacity: 0.12 }),
    []
  );

  useFrame((state, dt) => {
    const g = grp.current;
    if (!g) return;
    const s = scroll.current ?? { p: 0, mx: 0, my: 0 };
    const p = s.p;

    g.rotation.y += dt * 0.25 + dt * p * 1.8;
    g.rotation.x += ((pointer.y || s.my) * 0.3 + p * 0.7 - g.rotation.x) * Math.min(1, dt * 2);
    g.rotation.z += (-(pointer.x || s.mx) * 0.2 - g.rotation.z) * Math.min(1, dt * 2);

    // drift up + recede slightly as you scroll
    g.position.y += (p * 2.2 - g.position.y) * Math.min(1, dt * 3);
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    const target = (1 - p * 0.18) * breathe;
    const cur = g.scale.x + (target - g.scale.x) * Math.min(1, dt * 3);
    g.scale.setScalar(cur);

    // blueprint shell expands outward and fades as the model "renders"
    if (shell.current) {
      const sc = 1.28 + p * 0.9;
      shell.current.scale.setScalar(sc);
      (shell.current.material as THREE.MeshBasicMaterial).opacity =
        0.14 * (1 - Math.min(1, p * 1.1));
      shell.current.rotation.y -= dt * 0.15;
    }
  });

  return (
    <group ref={grp}>
      <mesh material={mat} castShadow>
        <icosahedronGeometry args={[3.1, 0]} />
        <Edges threshold={1} color="#d2966b" />
      </mesh>
      <mesh ref={shell} material={shellMat} scale={1.28}>
        <icosahedronGeometry args={[3.1, 0]} />
      </mesh>
    </group>
  );
}

function Chips({ scroll }: { scroll: React.RefObject<ScrollState> }) {
  const chips = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        r: 4.6 + (i % 3) * 0.9,
        a: (i / 7) * Math.PI * 2,
        y: ((i * 37) % 60) / 10 - 3,
        sp: 0.15 + (i % 4) * 0.05,
        size: [0.5 + (i % 3) * 0.25, 0.18, 0.18] as [number, number, number],
        tilt: i,
      })),
    []
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c8a576", roughness: 0.5 }), []);

  useFrame((state) => {
    const s = scroll.current ?? { p: 0, mx: 0, my: 0 };
    const t = state.clock.elapsedTime;
    const scatter = 1 + s.p * 0.7; // chips fly outward with scroll
    chips.forEach((c, i) => {
      const m = refs.current[i];
      if (!m) return;
      const ang = c.a + t * c.sp + s.p * 1.5;
      const r = c.r * scatter;
      m.position.set(Math.cos(ang) * r, c.y + s.p * 3 + Math.sin(t * 0.4 + i) * 0.3, Math.sin(ang) * r);
      m.rotation.set(c.tilt + t * 0.3, ang, c.tilt * 0.5);
    });
  });

  return (
    <group>
      {chips.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          material={mat}
        >
          <boxGeometry args={c.size} />
        </mesh>
      ))}
    </group>
  );
}

export function StudioHero3D() {
  const scroll = useRef<ScrollState>({ p: 0, mx: 0, my: 0 });

  useEffect(() => {
    const onScroll = () => {
      scroll.current = {
        ...scroll.current,
        p: Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.8))),
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
      camera={{ position: [0, 0, 11], fov: 42 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={3}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
      />
      <directionalLight position={[-7, 1, -5]} intensity={1.6} color="#b87a52" />
      <pointLight position={[0, 0, 6]} intensity={14} distance={16} color="#ffc98c" />

      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <Gem scroll={scroll} />
      </Float>
      <Chips scroll={scroll} />
    </Canvas>
  );
}
