import { type FC, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import MindArRenderer from "../../helpers/mindAr/MindArRenderer.tsx";
import { createMesh } from "../../helpers/mindAr/utils.ts";

import dairiPng from "../../assets/images/profile-pic.jpg";
import imageTarget from "../../assets/mindAr/s-works-logo.mind?url";
import sWorksGltfUrl from "../../assets/mindAr/s-works-logo-alpha.gltf?url";

const CardArSample: FC = () => {
  const dairiTexture = useLoader(THREE.TextureLoader, dairiPng.src);
  const sWorksGltf = useLoader(GLTFLoader, sWorksGltfUrl);

  const anchors = useMemo(
    () => [
      {
        index: 0,
        objects: [createMesh(dairiTexture)],
      },
      {
        index: 1,
        objects: [
          (() => {
            const mesh = createMesh(dairiTexture);
            return mesh;
          })(),
          (() => {
            sWorksGltf.scene.scale.set(0.01, 0.01, 0.01);
            sWorksGltf.scene.position.set(0, 0, 0.1);
            sWorksGltf.scene.rotation.set(
              THREE.MathUtils.degToRad(90),
              THREE.MathUtils.degToRad(90),
              0,
            );
            return sWorksGltf.scene;
          })(),
        ],
      },
    ],
    [dairiTexture, sWorksGltf],
  );

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <MindArRenderer imageTargetSrc={imageTarget} anchors={anchors} />
    </div>
  );
};

export default CardArSample;
