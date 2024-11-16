import * as THREE from "three";

export const createMesh = (texture: THREE.Texture) => {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial({
      transparent: true,
      map: texture,
    }),
  );
};
