import { type FC, useEffect, useRef } from "react";

import * as THREE from "three";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";

interface Props {
  imageTargetSrc: string;
  anchors: {
    index: number;
    objects: THREE.Object3D[];
  }[];
  onClick?: (names: string[]) => void;
}

const MindArRenderer: FC<Props> = ({ imageTargetSrc, anchors, onClick }) => {
  const wrapperElRef = useRef<HTMLDivElement>(null);
  const mindArThreeRef = useRef<MindARThree | null>(null);

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
    mindArThreeRef.current = mindArThree;

    return () => {
      renderer.setAnimationLoop(null);
      startPromise.then(() => {
        mindArThree.stop();
        container.remove();
      });
      mindArThreeRef.current = null;
    };
  }, [imageTargetSrc, anchors]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();

      if (!mindArThreeRef.current) {
        return;
      }

      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(x, y);

      // レイキャスティングでマウスと重なるオブジェクトを取得
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, mindArThreeRef.current.camera);
      const intersects = raycaster.intersectObjects(
        mindArThreeRef.current.scene.children,
      );

      const names = intersects.flatMap(({ object }) => {
        return object.name ? [object.name] : [];
      });
      if (0 < names.length) {
        onClick?.(names);
      }
    };

    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("click", handler);
    };
  }, [onClick]);

  return <div style={{ display: "contents" }} ref={wrapperElRef} />;
};

export default MindArRenderer;
