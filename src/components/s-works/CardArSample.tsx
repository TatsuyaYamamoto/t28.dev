import { type FC, useMemo, useState } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import MindArRenderer from "../../helpers/mindAr/MindArRenderer.tsx";
import { createMesh } from "../../helpers/mindAr/utils.ts";

import sWorksPortfolioMemoryGame from "../../../docs/s-works-achievement/_assets/it_team_memory_game/hero.jpg";
import sWorksPortfolioNijiyonAr from "../../../docs/s-works-achievement/_assets/nijigasaki-gamers-nijiyon-ar/hero.jpg";

import dairiPng from "../../assets/images/profile-pic.jpg";
import leftPng from "../../assets/images/left.png";
import rightPng from "../../assets/images/right.png";
import sWorksGltfUrl from "../../assets/mindAr/s-works-logo-alpha.gltf?url";
import imageTarget from "../../assets/mindAr/s-works-logo.mind?url";

const CardArSample: FC = () => {
  const [hasCardQuery] = useState(() =>
    new URLSearchParams(location.search).get("card"),
  );
  if (!hasCardQuery) {
    return null;
  }

  const [
    dairiTexture,
    leftTexture,
    rightTexture,
    sWorksPortfolioMemoryGameTexture,
    sWorksPortfolioNijiyonArTexture,
  ] = useLoader(THREE.TextureLoader, [
    dairiPng.src,
    leftPng.src,
    rightPng.src,
    sWorksPortfolioMemoryGame.src,
    sWorksPortfolioNijiyonAr.src,
  ]);
  const sWorksGltf = useLoader(GLTFLoader, sWorksGltfUrl);
  const [portfolioIndex, setPortfolioIndex] = useState(0);

  const anchors = useMemo(
    () => [
      {
        index: 1,
        objects: [
          (() => {
            const mesh =
              portfolioIndex === 0
                ? // @ts-expect-error
                  createMesh(sWorksPortfolioMemoryGameTexture)
                : // @ts-expect-error
                  createMesh(sWorksPortfolioNijiyonArTexture);
            mesh.scale.setScalar(0.7);
            mesh.position.y = 0.7;
            return mesh;
          })(),
          (() => {
            // @ts-expect-error
            const mesh = createMesh(rightTexture);
            mesh.name = "right-button";
            mesh.scale.setScalar(0.2);
            mesh.position.x = 0.6;
            mesh.position.y = 0.7;
            return mesh;
          })(),
          (() => {
            // @ts-expect-error
            const mesh = createMesh(leftTexture);
            mesh.name = "left-button";
            mesh.scale.setScalar(0.2);
            mesh.position.x = -0.6;
            mesh.position.y = 0.7;
            console.log(mesh.id);
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
    [dairiTexture, sWorksGltf, portfolioIndex],
  );

  const onClick = (names: string[]) => {
    names.forEach((name) => {
      if (name === "right-button" || name === "left-button") {
        setPortfolioIndex((prev) => (prev + 1) % 2);
      }
    });
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <MindArRenderer
        imageTargetSrc={imageTarget}
        anchors={anchors}
        onClick={onClick}
      />
    </div>
  );
};

export default CardArSample;
