"use client";
import { Landmark } from "@/types/Landmark";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";

export default function ThreeView({
  landmarks,
  modelPath,
  background,
}: {
  landmarks: Landmark[];
  modelPath: string;
  background: { type: string; file: string };
}) {

  return (
    <div className="w-full h-full rounded overflow-hidden">
      <Canvas
        camera={{ position: [0, 1, 3], fov: 75 }}
        style={{ background: "#1e1e1e" }}
      >
        <Environment files={background.file} background />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[0, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Helpers */}
        <OrbitControls target={[0, 1, 0]} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Character */}
        <CharacterModel landmarks={landmarks} modelPath={modelPath} />
      </Canvas>
    </div>
  );
}
