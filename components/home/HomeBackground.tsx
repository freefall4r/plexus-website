"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Shared pointer signal (avoids per-frame React re-renders).
type Pointer = { mx: number; my: number };

// A single quiet, hand-faceted monolith — reads as carved stone / wood.
// It turns slowly and tilts a touch toward the cursor. No scroll drama.
function Monolith({ pointer }: { pointer: React.RefObject<Pointer> }) {
  const grp = useRef<THREE.Group>(null);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9a7d58", // oak / sandstone
        roughness: 0.82,
        metalness: 0.0,
        flatShading: true, // faceted, chiselled feel
        emissive: new THREE.Color("#3a2c1e"),
        emissiveIntensity: 0.12,
      }),
    []
  );

  // A slightly irregular icosahedron geometry — carved, not perfect.
  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(3.05, 1);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(v.x * 1.7) * Math.cos(v.y * 1.5) * 0.18;
      v.addScaledVector(v.clone().normalize(), n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state, dt) => {
    const g = grp.current;
    if (!g) return;
    const p = pointer.current ?? { mx: 0, my: 0 };
    g.rotation.y += dt * 0.08; // slow, calm turn
    const k = Math.min(1, dt * 1.6);
    g.rotation.x += (-0.12 + p.my * 0.12 - g.rotation.x) * k;
    g.rotation.z += (p.mx * 0.06 - g.rotation.z) * k;
    // gentle breathing
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.012;
    g.scale.setScalar(s);
  });

  return (
    <group ref={grp} position={[1.6, 0.4, 0]}>
      <mesh geometry={geo} material={mat} />
    </group>
  );
}

export function HomeBackground() {
  const pointer = useRef<Pointer>({ mx: 0, my: 0 });

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.3, 12], fov: 42 }}
      onPointerMove={(e) => {
        pointer.current = {
          mx: (e.clientX / window.innerWidth) * 2 - 1,
          my: -((e.clientY / window.innerHeight) * 2 - 1),
        };
      }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
      }}
    >
      {/* soft, warm daylight — like sun through a workshop window */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 9, 6]} intensity={2.2} color="#fff1da" />
      <directionalLight position={[-7, 1, -4]} intensity={0.8} color="#b07d5a" />
      <directionalLight position={[-3, -4, 6]} intensity={0.35} color="#cdbfa6" />

      <Monolith pointer={pointer} />
    </Canvas>
  );
}
