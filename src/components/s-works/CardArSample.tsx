import { type FC, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import MindArRenderer from "../../helpers/mindAr/MindArRenderer.tsx";
import { createMesh } from "../../helpers/mindAr/utils.ts";

import dairiPng from "../../assets/images/profile-pic.jpg";
import imageTarget from "../../assets/mindAr/s-works-logo.mind?url";

const CardArSample: FC = () => {
  const dairiTexture = useLoader(THREE.TextureLoader, dairiPng.src);
  const anchors = useMemo(
    () => [
      {
        index: 0,
        meshes: [createMesh(dairiTexture)],
      },
      {
        index: 1,
        meshes: [createMesh(dairiTexture)],
      },
    ],
    [dairiTexture],
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
