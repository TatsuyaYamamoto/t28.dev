import { type FC, useMemo, useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import MindArRenderer from "../../helpers/mindAr/MindArRenderer.tsx";
import { createMesh } from "../../helpers/mindAr/utils.ts";

import sWorksPortfolioNijiyonAr from "../../../docs/s-works-achievement/_assets/nijigasaki-gamers-nijiyon-ar/hero.jpg";
import sWorksPortfolioMachigaiSagashi from "../../../docs/s-works-achievement/_assets/lovelive-machigai-sagashi/hero.jpg";
import sWorksPortfolioFlowerStand from "../../../docs/s-works-achievement/_assets/nijigasaki_flower_stand/hero.jpg";
import sWorksPortfolioMemoryGame from "../../../docs/s-works-achievement/_assets/it_team_memory_game/hero.jpg";

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
    sWorksPortfolioNijiyonArTexture,
    sWorksPortfolioMachigaiSagashiTexture,
    sWorksPortfolioFlowerStandTexture,
    sWorksPortfolioMemoryGameTexture,
  ] = useLoader(THREE.TextureLoader, [
    dairiPng.src,
    leftPng.src,
    rightPng.src,
    sWorksPortfolioNijiyonAr.src,
    sWorksPortfolioMachigaiSagashi.src,
    sWorksPortfolioFlowerStand.src,
    sWorksPortfolioMemoryGame.src,
  ]);
  const sWorksGltf = useLoader(GLTFLoader, sWorksGltfUrl);
  const portfolioIndex = useRef(0);

  const [sWorksPortfolioNijiyonArMesh] = useState(() => {
    // @ts-expect-error
    const mesh = createMesh(sWorksPortfolioNijiyonArTexture);
    mesh.scale.setScalar(0.7);
    mesh.position.y = 0.7;
    mesh.visible = true;
    return mesh;
  });
  const [sWorksPortfolioMachigaiSagashiMesh] = useState(() => {
    // @ts-expect-error
    const mesh = createMesh(sWorksPortfolioMachigaiSagashiTexture);
    mesh.scale.setScalar(0.7);
    mesh.position.y = 0.7;
    mesh.visible = false;
    return mesh;
  });
  const [sWorksPortfolioFlowerStandMesh] = useState(() => {
    // @ts-expect-error
    const mesh = createMesh(sWorksPortfolioFlowerStandTexture);
    mesh.scale.setScalar(0.7);
    mesh.position.y = 0.7;
    mesh.visible = false;
    return mesh;
  });
  const [sWorksPortfolioMemoryGameMesh] = useState(() => {
    // @ts-expect-error
    const mesh = createMesh(sWorksPortfolioMemoryGameTexture);
    mesh.scale.setScalar(0.7);
    mesh.position.y = 0.7;
    mesh.visible = false;
    return mesh;
  });

  const [leftButtonMesh] = useState(() => {
    // @ts-expect-error
    const mesh = createMesh(leftTexture);
    mesh.name = "left-button";
    mesh.scale.setScalar(0.2);
    mesh.position.x = -0.6;
    mesh.position.y = 0.7;
    console.log(mesh.id);
    return mesh;
  });
  const [rightButtonMesh] = useState(() => {
    // @ts-expect-error
    const mesh = createMesh(rightTexture);
    mesh.name = "right-button";
    mesh.scale.setScalar(0.2);
    mesh.position.x = 0.6;
    mesh.position.y = 0.7;
    return mesh;
  });

  const anchors = useMemo(
    () => [
      {
        index: 1,
        objects: [
          sWorksPortfolioNijiyonArMesh,
          sWorksPortfolioMachigaiSagashiMesh,
          sWorksPortfolioFlowerStandMesh,
          sWorksPortfolioMemoryGameMesh,
          rightButtonMesh,
          leftButtonMesh,
          (() => {
            sWorksGltf.scene.scale.setScalar(0.01);
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
    const portfolioItems = [
      sWorksPortfolioNijiyonArMesh,
      sWorksPortfolioMachigaiSagashiMesh,
      sWorksPortfolioFlowerStandMesh,
      sWorksPortfolioMemoryGameMesh,
    ];

    names.forEach((name) => {
      if (name === "right-button") {
        portfolioIndex.current =
          (portfolioIndex.current + 1) % portfolioItems.length;
      }
      if (name === "left-button") {
        portfolioIndex.current =
          (portfolioIndex.current - 1 + portfolioItems.length) %
          portfolioItems.length;
      }
    });

    portfolioItems.forEach((mesh, index) => {
      mesh.visible = index === portfolioIndex.current;
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