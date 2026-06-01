"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

// Carved-wood materials. No envMap (PMREM on software-GL can crash the context),
// so we light it like a real workshop with directional + rim + fill.
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

function Burr({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const beamRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { pointer } = useThree();
  const tmp = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const p = progress.get();
    const g = group.current;
    if (!g) return;
    const k = Math.min(1, dt * 4);

    const targetY = state.clock.elapsedTime * 0.2 + p * Math.PI * 1.8;
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (-0.45 + pointer.y * 0.3 + p * 0.6 - g.rotation.x) * Math.min(1, dt * 3);
    g.rotation.z += (pointer.x * 0.14 - g.rotation.z) * Math.min(1, dt * 3);

    // Start ~half-formed and visible at rest; finish assembling on scroll.
    const assemble = 0.5 + 0.5 * Math.min(1, p * 1.6);
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

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 120;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.sin(i * 12.9898) * 43758.5453) % 1 * 28 - 14;
      arr[i * 3 + 1] = (Math.sin(i * 78.233) * 43758.5453) % 1 * 18 - 9;
      arr[i * 3 + 2] = (Math.sin(i * 37.719) * 43758.5453) % 1 * 16 - 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.07} color="#e0b483" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function Hero3D({ progress }: { progress: MotionValue<number> }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.5, 17], fov: 40 }}
      onCreated={({ gl }) => {
        // Allow the browser to restore a lost context instead of dying.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => e.preventDefault(),
          false
        );
      }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.28} />
      {/* warm key light from upper right with crisp shadow */}
      <directionalLight
        position={[8, 11, 6]}
        intensity={3.4}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      {/* amber rim from behind-left */}
      <directionalLight position={[-9, 2, -6]} intensity={1.6} color="#c8772e" />
      {/* soft cool fill */}
      <directionalLight position={[-4, -3, 8]} intensity={0.5} color="#9fb4c9" />
      {/* glow near the object */}
      <pointLight position={[0, 0, 4]} intensity={18} distance={16} color="#ffb866" />

      <Burr progress={progress} />
      <Dust />

      {/* shadow-catcher floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7.5, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.4} color="#000000" />
      </mesh>
    </Canvas>
  );
}
