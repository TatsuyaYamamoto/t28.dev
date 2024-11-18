declare module "mind-ar/dist/mindar-image-three.prod.js" {
  import type { WebGLRenderer, Scene, Camera } from "three";

  export class MindARThree {
    constructor(options: {
      container: unknown;
      imageTargetSrc: string;
      uiScanning?: "yes" | "no";
      uiLoading?: "yes" | "no";
    });

    readonly renderer: WebGLRenderer;
    readonly scene: Scene;
    readonly camera: Camera;

    start();
    stop();
    addAnchor(index: number);
  }
}
