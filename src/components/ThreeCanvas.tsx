"use client";
import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Landmark } from "./LandmarkCanvas";
import LandmarkSkeleton from "./LandmarkSkeleton";
import { PoseLandmarks } from "./PoseLandmarks";

function CharacterModel({ landmarks }: { landmarks: Landmark[] }) {
  const gltf = useGLTF("/character.glb");
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!modelRef.current) return;
    console.log(" model for bones and skinned meshes...");
    modelRef.current.traverse((obj) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        console.log(" SkinnedMesh:", obj.name);
      }
      if ((obj as THREE.Bone).isBone) {
        console.log(" Bone:", obj.name);
      }
    });
  }, []);

  useFrame(() => {
    if (!modelRef.current || landmarks.length === 0) return;

    let foundSkeleton: THREE.Skeleton | null = null;
    modelRef.current.traverse((obj) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = obj as THREE.SkinnedMesh;
        if (mesh.skeleton && mesh.skeleton.bones.length > 0) {
          foundSkeleton = mesh.skeleton;
        }
      }
    });

    if (!foundSkeleton) {
      console.warn("XXXXX No skeleton found in the model");
      return;
    }

    const bones = foundSkeleton.bones;

    const applyBoneRotation = (boneName: string, from: Landmark, to: Landmark) => {
      const bone = bones.find(b => b.name === boneName);
      // Debug:
      // console.log("Trying bone:", boneName, "→ Found:", bone?.name);
      if (!bone || !from || !to) return;

      const direction = new THREE.Vector3(to.x - from.x, to.y - from.y, to.z - from.z).normalize();
      const targetQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction);
      bone.quaternion.slerp(targetQuat, 0.3);
    };

    // --- SPINE/HEAD ---
    applyBoneRotation("mixamorigHips",         landmarks[23], landmarks[24]); // for root/hip twist
    applyBoneRotation("mixamorigSpine",        landmarks[23], landmarks[11]);
    applyBoneRotation("mixamorigSpine1",       landmarks[23], landmarks[11]);
    applyBoneRotation("mixamorigSpine2",       landmarks[11], landmarks[0]);
    applyBoneRotation("mixamorigNeck",         landmarks[0],  landmarks[2]);
    applyBoneRotation("mixamorigHead",         landmarks[2],  landmarks[3]);

    // --- LEFT ARM ---
    applyBoneRotation("mixamorigLeftShoulder", landmarks[11], landmarks[13]);
    applyBoneRotation("mixamorigLeftArm",      landmarks[13], landmarks[15]);
    applyBoneRotation("mixamorigLeftForeArm",  landmarks[13], landmarks[15]);
    applyBoneRotation("mixamorigLeftHand",     landmarks[15], landmarks[19]);

    // --- RIGHT ARM ---
    applyBoneRotation("mixamorigRightShoulder", landmarks[12], landmarks[14]);
    applyBoneRotation("mixamorigRightArm",      landmarks[14], landmarks[16]);
    applyBoneRotation("mixamorigRightForeArm",  landmarks[14], landmarks[16]);
    applyBoneRotation("mixamorigRightHand",     landmarks[16], landmarks[20]);

    // --- LEFT LEG ---
    applyBoneRotation("mixamorigLeftUpLeg", landmarks[23], landmarks[25]);
    applyBoneRotation("mixamorigLeftLeg",   landmarks[25], landmarks[27]);

    // --- RIGHT LEG ---
    applyBoneRotation("mixamorigRightUpLeg", landmarks[24], landmarks[26]);
    applyBoneRotation("mixamorigRightLeg",   landmarks[26], landmarks[28]);

    // --- HANDS (index/thumb only for demo) ---
    applyBoneRotation("mixamorigLeftHandThumb1",  landmarks[15], landmarks[21]);
    applyBoneRotation("mixamorigLeftHandIndex1",  landmarks[15], landmarks[19]);
    applyBoneRotation("mixamorigRightHandThumb1", landmarks[16], landmarks[22]);
    applyBoneRotation("mixamorigRightHandIndex1", landmarks[16], landmarks[20]);

  });

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(0, 0, 0);
      //modelRef.current.rotation.set(-Math.PI / 2, 100, 0); 
      modelRef.current.rotation.set(-Math.PI / 2, 100 * Math.PI / 180,0);
      
      modelRef.current.scale.set(0.01, 0.01, 0.01);
      
      modelRef.current.scale.set(0.01, 0.01, 0.01);
    }
  }, []);
  

  return <primitive ref={modelRef} object={gltf.scene} />;
}

export default function ThreeCanvas({ landmarks }: { landmarks: Landmark[] }) {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 75 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls target={[0, 1, 0]} />
      <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} />

      <CharacterModel landmarks={landmarks} />
      <LandmarkSkeleton landmarks={landmarks} />
    </Canvas>
  );
}
