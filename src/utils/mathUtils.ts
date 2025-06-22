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

/*
  Rota un Vector3 por un Quaternion (v' = q * v * q^-1)
*/
export function applyQuaternionToVector3(
  v: THREE.Vector3,
  q: THREE.Quaternion
): THREE.Vector3 {
  const x = v.x, y = v.y, z = v.z;
  const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

  // q * v
  const ix = qw * x + qy * z - qz * y;
  const iy = qw * y + qz * x - qx * z;
  const iz = qw * z + qx * y - qy * x;
  const iw = -qx * x - qy * y - qz * z;

  // (q * v) * q^-1
  const resX = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  const resY = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  const resZ = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  return new THREE.Vector3(resX, resY, resZ);
}


/*
  Genera un Quaternion que rota el vector a hacia el vector b
*/
export function quaternionFromUnitVectors(
  a: THREE.Vector3,
  b: THREE.Vector3
): THREE.Quaternion {
  const v1 = a.clone().normalize();
  const v2 = b.clone().normalize();
  const dot = v1.dot(v2);

  if (dot < -0.999999) {
    const orthogonal = new THREE.Vector3(1, 0, 0).cross(v1);
    if (orthogonal.lengthSq() < 0.000001) {
      orthogonal.set(0, 1, 0).cross(v1);
    }
    orthogonal.normalize();
    return new THREE.Quaternion().setFromAxisAngle(orthogonal, Math.PI);
  }

  const cross = new THREE.Vector3().crossVectors(v1, v2);
  const q = new THREE.Quaternion(cross.x, cross.y, cross.z, 1 + dot);
  q.normalize();
  return q;
}

/*
  Invierte un Quaternion (q^-1)
*/
export function invertQuaternion(q: THREE.Quaternion): THREE.Quaternion {
  const normSq = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
  return new THREE.Quaternion(
    -q.x / normSq,
    -q.y / normSq,
    -q.z / normSq,
     q.w / normSq
  );
}

/*
  Genera un Quaternion desde ángulos de Euler (XYZ por defecto)
*/
export function quaternionFromEuler(euler: THREE.Euler): THREE.Quaternion {
  const { x, y, z, order = 'XYZ' } = euler;
  const c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2);

  const q = new THREE.Quaternion();

  switch (order) {
    case 'XYZ':
      q.set(
        s1 * c2 * c3 + c1 * s2 * s3,
        c1 * s2 * c3 - s1 * c2 * s3,
        c1 * c2 * s3 + s1 * s2 * c3,
        c1 * c2 * c3 - s1 * s2 * s3
      );
      break;

    default:
      throw new Error(`Orden de Euler '${order}' no soportado`);
  }
  return q;
}
