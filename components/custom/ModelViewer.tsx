"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Environment,
  Html,
} from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Loader() {
  return (
    <Html center>
      <div className="font-mono text-xs text-bone/70">loading model…</div>
    </Html>
  );
}

export function ModelViewer({ url }: { url: string }) {
  return (
    <Canvas
      key={url}
      dpr={[1, 1.8]}
      shadows
      camera={{ position: [0, 0.5, 4], fov: 40 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#2a1c10"]} />
      <Suspense fallback={<Loader />}>
        <Stage
          intensity={0.6}
          environment="warehouse"
          adjustCamera={0.8}
          shadows={{ type: "contact", opacity: 0.4, blur: 2 }}
        >
          <Model url={url} />
        </Stage>
        <Environment preset="warehouse" />
      </Suspense>
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.1}
        enablePan={false}
        minDistance={1.5}
        maxDistance={9}
        makeDefault
      />
    </Canvas>
  );
}
