"use client";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Landmark } from "./LandmarkCanvas";
import { PoseLandmarks } from "./PoseLandmarks";

function CharacterModel({ landmarks }: { landmarks: Landmark[] }) {
  const gltf = useGLTF("/character.glb");
  const modelRef = useRef<THREE.Group>(null);
  const skeletonRef = useRef<THREE.Skeleton | null>(null);

  useEffect(() => {
    if (!modelRef.current) return;

    modelRef.current.traverse((obj) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = obj as THREE.SkinnedMesh;

        if (mesh.skeleton && mesh.skeleton.bones.length > 0) {
          skeletonRef.current = mesh.skeleton;
        }

        if ((obj as THREE.Bone).isBone) {
          console.log(" Bone:", obj.name);
        }
      }
    });
  }, []);

  const getLandmarkVector = (landmarkIndex: number): THREE.Vector3 => {
    const landmark = landmarks[landmarkIndex];
    if (!landmark) return new THREE.Vector3();
    return new THREE.Vector3(landmark.x, landmark.y, landmark.z);
  };

  const calculateDirection = (
    from: THREE.Vector3,
    to: THREE.Vector3
  ): THREE.Vector3 => {
    return new THREE.Vector3().subVectors(to, from).normalize();
  };

  const getPerpendicularVector = (
    vector1: THREE.Vector3,
    vector2: THREE.Vector3
  ): THREE.Vector3 => {
    return new THREE.Vector3().crossVectors(vector1, vector2).normalize();
  };

  const getMidpointVector = (
    vector1: THREE.Vector3,
    vector2: THREE.Vector3
  ): THREE.Vector3 => {
    return new THREE.Vector3().addVectors(vector1, vector2).multiplyScalar(0.5);
  };

  const applyBoneRotation = (
    boneName: string,
    direction: THREE.Vector3, // Direccion global de los landmarks
    localForward: THREE.Vector3 // Direccion local del hueso (ej. Z positivo hacia adelante en el modelo)
  ) => {
    if (!skeletonRef.current) return;

    const bone = skeletonRef.current.bones.find((b) => b.name === boneName);
    if (!bone) return;

    const parentWorldQuat = bone.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion(); // Obtiene rotacion global del hueso padre (o el mismo hueso)
    const parentWorldQuatInverse = parentWorldQuat.clone().invert(); // Se obtiene la rotacion inversa del padre para convertir de global a local mas abajo

    const localDirection = direction.clone().applyQuaternion(parentWorldQuatInverse); // Convierte direccion de world space a bone's local space

    const targetQuat = new THREE.Quaternion().setFromUnitVectors(
      localForward,
      localDirection
    );
    bone.quaternion.slerp(targetQuat, 0.3);
  };

  useFrame(() => {
    if (
      !modelRef.current ||
      !landmarks ||
      landmarks.length === 0 ||
      !skeletonRef.current
    )
      return;

    applyBoneRotation(
      "mixamorigHead",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.NOSE),
        getPerpendicularVector(
          getLandmarkVector(PoseLandmarks.MOUTH_RIGHT),
          getLandmarkVector(PoseLandmarks.MOUTH_LEFT),
        )
      ),
      new THREE.Vector3(0, 0, 1)
    );

    applyBoneRotation(
      "mixamorigNeck",
      calculateDirection(
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.MOUTH_RIGHT),
          getLandmarkVector(PoseLandmarks.MOUTH_LEFT)
        ),
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.RIGHT_SHOULDER),
          getLandmarkVector(PoseLandmarks.LEFT_SHOULDER)
        )
      ),
      new THREE.Vector3(0, 1, 0)
    );

    applyBoneRotation(
      "mixamorigRightArm", // Por algun motivo los PoseLandmarks de LEFT controlan el brazo derecho (POR REVISAR)
      calculateDirection(
        getLandmarkVector(PoseLandmarks.LEFT_SHOULDER),
        getLandmarkVector(PoseLandmarks.LEFT_ELBOW)
      ),
      new THREE.Vector3(0, -1, 0)
    );

    applyBoneRotation(
      "mixamorigRightForeArm",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.LEFT_ELBOW),
        getLandmarkVector(PoseLandmarks.LEFT_WRIST)
      ),
      new THREE.Vector3(0, -1, 0)
    );

    applyBoneRotation(
      "mixamorigLeftArm", // Por algun motivo los PoseLandmarks de RIGHT controlan el brazo izquierdo (POR REVISAR)
      calculateDirection(
        getLandmarkVector(PoseLandmarks.RIGHT_SHOULDER),
        getLandmarkVector(PoseLandmarks.RIGHT_ELBOW)
      ),
      new THREE.Vector3(0, -1, 0)
    );

    applyBoneRotation(
      "mixamorigLeftForeArm",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.RIGHT_ELBOW),
        getLandmarkVector(PoseLandmarks.RIGHT_WRIST)
      ),
      new THREE.Vector3(0, -1, 0)
    );
  });

  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.scale.set(0.01, 0.01, 0.01);
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
      {/* <LandmarkSkeleton landmarks={landmarks} /> */}
    </Canvas>
  );
}
