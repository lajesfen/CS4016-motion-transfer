"use client";
import { Landmark } from "@/types/Landmark";
import { OrbitControls, Environment } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";
import { TextureLoader } from "three";

export default function ThreeView({
  landmarks,
  modelPath,
  background,
}: {
  landmarks: Landmark[];
  modelPath: string;
  background: { type: string; file: string };
}) {
  //  Load image texture only if background type is image
  const imageTexture =
    background.type === "image"
      ? useLoader(TextureLoader, background.file)
      : null;

  return (
    <div className="w-full h-full rounded overflow-hidden">
      <Canvas
        camera={{ position: [0, 1, 3], fov: 75 }}
        style={{ background: "#1e1e1e" }}
      >
        {/* Dynamic background  HDR */}
        {background.type === "hdr" && (
          <Environment files={background.file} background />
        )}
        {background.type === "image" && imageTexture && (
          <mesh position={[0, 2, -5]}>
            <planeGeometry args={[16, 9]} />
            <meshBasicMaterial map={imageTexture} />
          </mesh>
        )}

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
