"use client";
import { Landmark } from "@/types/Landmark";
// Importing our custom math utils! :)
import { 
  calculateDirection, 
  getMidpointVector,
  applyQuaternionToVector3,
  quaternionFromUnitVectors,
  invertQuaternion,
  quaternionFromEuler
} from "@/utils/mathUtils";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PoseLandmarks } from "../constants/PoseLandmarks";

export default function CharacterModel({
  landmarks,
}: {
  landmarks: Landmark[];
}) {
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
      }

      if ((obj as THREE.Bone).isBone) {
        console.log(" Bone:", obj.name);
      }
    });
  }, []);

  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.scale.set(0.02, 0.02, 0.02);
  }, []);

  const getLandmarkVector = (landmarkIndex: number): THREE.Vector3 => {
    const landmark = landmarks[landmarkIndex];
    if (!landmark) return new THREE.Vector3();
    return new THREE.Vector3(landmark.x, landmark.y, landmark.z);
  };
  
  /*
  const applyBoneRotation = (
    boneName: string,
    direction: THREE.Vector3, // Direccion global de los landmarks
    rotationOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) => {
    if (!skeletonRef.current) return;

    const bone = skeletonRef.current.bones.find((b) => b.name === boneName);
    if (!bone) return;

    const parentWorldQuat =
      bone.parent?.getWorldQuaternion(new THREE.Quaternion()) ??
      new THREE.Quaternion(); // Obtiene rotacion global del hueso padre (o el mismo hueso)
    const parentWorldQuatInverse = parentWorldQuat.clone().invert(); // Obtiene la rotacion inversa del padre para convertir de global a local mas abajo

    const localDirection = direction
      .clone()
      .applyQuaternion(parentWorldQuatInverse); // Convierte direccion de world space a bone's local space

    const targetQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      localDirection
    );
    bone.quaternion.slerp(targetQuat, 0.3);

    bone.quaternion.multiply(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(rotationOffset.x, rotationOffset.y, rotationOffset.z)
      )
    );
  };
  */

  const applyBoneRotation = (
    boneName: string,
    direction: THREE.Vector3,
    rotationOffset: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) => {
    if (!skeletonRef.current) return;

    const bone = skeletonRef.current.bones.find((b) => b.name === boneName);
    if (!bone) return;

    const parentWorldQuat =
      bone.parent?.getWorldQuaternion(new THREE.Quaternion()) ??
      new THREE.Quaternion();

    const parentWorldQuatInverse = invertQuaternion(parentWorldQuat);

    const localDirection = applyQuaternionToVector3(
      direction.clone(),
      parentWorldQuatInverse
    );

    const targetQuat = quaternionFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      localDirection
    );

    // Slerp manual entre bone.quaternion y targetQuat con factor 0.3
    bone.quaternion.slerp(targetQuat, 0.3);

    const offsetQuat = quaternionFromEuler(
      new THREE.Euler(rotationOffset.x, rotationOffset.y, rotationOffset.z)
    );

    bone.quaternion.multiply(offsetQuat);
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
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.MOUTH_RIGHT),
          getLandmarkVector(PoseLandmarks.MOUTH_LEFT)
        )
      ),
      new THREE.Vector3(-0.2, 0, 0)
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
      new THREE.Vector3(-0.2, 0, 0)
    );

    applyBoneRotation(
      "mixamorigRightArm",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.LEFT_ELBOW),
        getLandmarkVector(PoseLandmarks.LEFT_SHOULDER)
      )
    );

    applyBoneRotation(
      "mixamorigRightForeArm",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.LEFT_WRIST),
        getLandmarkVector(PoseLandmarks.LEFT_ELBOW)
      )
    );

    applyBoneRotation(
      "mixamorigLeftArm",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.RIGHT_ELBOW),
        getLandmarkVector(PoseLandmarks.RIGHT_SHOULDER)
      )
    );

    applyBoneRotation(
      "mixamorigLeftForeArm",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.RIGHT_WRIST),
        getLandmarkVector(PoseLandmarks.RIGHT_ELBOW)
      )
    );

    applyBoneRotation(
      "mixamorigRightUpLeg",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.LEFT_KNEE),
        getLandmarkVector(PoseLandmarks.LEFT_HIP)
      )
    );

    applyBoneRotation(
      "mixamorigRightLeg",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.LEFT_ANKLE),
        getLandmarkVector(PoseLandmarks.LEFT_KNEE)
      )
    );

    applyBoneRotation(
      "mixamorigLeftUpLeg",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.RIGHT_KNEE),
        getLandmarkVector(PoseLandmarks.RIGHT_HIP)
      )
    );

    applyBoneRotation(
      "mixamorigLeftLeg",
      calculateDirection(
        getLandmarkVector(PoseLandmarks.RIGHT_ANKLE),
        getLandmarkVector(PoseLandmarks.RIGHT_KNEE)
      )
    );

    applyBoneRotation(
      "mixamorigHips",
      calculateDirection(
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.LEFT_SHOULDER),
          getLandmarkVector(PoseLandmarks.RIGHT_SHOULDER)
        ),
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.LEFT_HIP),
          getLandmarkVector(PoseLandmarks.RIGHT_HIP)
        )
      )
    );

    applyBoneRotation(
      "mixamorigSpine2",
      calculateDirection(
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.LEFT_SHOULDER),
          getLandmarkVector(PoseLandmarks.RIGHT_SHOULDER)
        ),
        getMidpointVector(
          getLandmarkVector(PoseLandmarks.LEFT_HIP),
          getLandmarkVector(PoseLandmarks.RIGHT_HIP)
        )
      )
    );

    const shoulderDir = calculateDirection(
      getLandmarkVector(PoseLandmarks.RIGHT_SHOULDER),
      getLandmarkVector(PoseLandmarks.LEFT_SHOULDER)
    );
    const forward = new THREE.Vector3().crossVectors(
      shoulderDir,
      new THREE.Vector3(0, 1, 0)
    );
    modelRef.current.lookAt(modelRef.current.position.clone().add(forward));
  });

  return <primitive ref={modelRef} object={gltf.scene} />;
}
