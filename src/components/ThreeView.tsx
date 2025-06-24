"use client";
import { Landmark } from "@/types/Landmark";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";
import { Environment } from "@react-three/drei";


export default function ThreeView({
  landmarks,
  modelPath,
}: {
  landmarks: Landmark[];
  modelPath: string;
}) {
  return (
    <div className="w-full h-full rounded overflow-hidden">
      <Canvas camera={{ position: [0, 1, 3], fov: 75 }} 
       style={{ background: "#1e1e1e" }} //back
      >
        
        <Environment files="arena-gym.hdr" background />
        <ambientLight intensity={0.6} /> 
        <directionalLight
          position={[0, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <OrbitControls target={[0, 1, 0]} />
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        <CharacterModel landmarks={landmarks} modelPath={modelPath} />
      </Canvas>
    </div>
  );
}
