import { type FC, useEffect, useRef } from "react";

import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

interface Props {
  imageTargetSrc: string;
  anchors: {
    index: number;
    objects: THREE.Object3D[];
  }[];
}

const MindArRenderer: FC<Props> = ({ imageTargetSrc, anchors }) => {
  const wrapperElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";

    const mindArThree = new MindARThree({
      container,
      imageTargetSrc,
      uiScanning: "no",
      uiLoading: "no",
    });

    anchors.map((anchor) => {
      mindArThree.addAnchor(anchor.index).group.add(...anchor.objects);
    });

    const { renderer, scene, camera } = mindArThree;
    const startPromise = mindArThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    wrapperElRef.current?.append(container);

    return () => {
      renderer.setAnimationLoop(null);
      startPromise.then(() => {
        mindArThree.stop();
        container.remove();
      });
    };
  }, [imageTargetSrc, anchors]);

  return <div style={{ display: "contents" }} ref={wrapperElRef} />;
};

export default MindArRenderer;
