import * as THREE from "three";

export const calculateDirection = (
  from: THREE.Vector3,
  to: THREE.Vector3
): THREE.Vector3 => {
  return new THREE.Vector3().subVectors(to, from).normalize();
};

export const getMidpointVector = (
  vector1: THREE.Vector3,
  vector2: THREE.Vector3
): THREE.Vector3 => {
  return new THREE.Vector3().addVectors(vector1, vector2).multiplyScalar(0.5);
};
