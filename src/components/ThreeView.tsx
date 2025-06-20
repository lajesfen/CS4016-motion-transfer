"use client";
import { Landmark } from "@/types/Landmark";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";

export default function ThreeView({ landmarks }: { landmarks: Landmark[] }) {
  return (
    <div className="w-full h-full border border-white rounded overflow-hidden">
      <Canvas camera={{ position: [0, 1, 3], fov: 75 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls target={[0, 1, 0]} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />

        <CharacterModel landmarks={landmarks} />
      </Canvas>
    </div>
  );
}
