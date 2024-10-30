import { AbstractMesh, ActionManager, ArcRotateCamera, ExecuteCodeAction, HemisphericLight, PointerEventTypes, Scene, SceneLoader, Vector3 } from '@babylonjs/core';
import { Engine } from '@babylonjs/core/Engines/engine';


// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Associate a Babylon Engine to it.
const engine = new Engine(canvas, true);

const createScene = (): Scene => {

  const scene = new Scene(engine);
  let skull: AbstractMesh;
  SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "skull.babylon", scene).then((result) => {
    skull = result.meshes[0];
    skull.position.y = 0;
    skull.position.x = 0;
    skull.position.z = 0;
    skull.actionManager = new ActionManager(scene);
    skull.actionManager.registerAction(
      new ExecuteCodeAction(
      {
        trigger: ActionManager.OnLeftPickTrigger,
      },
      function () {
        const pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult?.hit) {
        let isDragging = false;

        scene.onPointerObservable.add((pointerInfo) => {
          switch (pointerInfo.type) {
          case PointerEventTypes.POINTERDOWN:
            isDragging = true;
            break;
          case PointerEventTypes.POINTERUP:
            isDragging = false;
            break;
          case PointerEventTypes.POINTERMOVE:
            if (isDragging) {
            const deltaX = pointerInfo.event.movementX;
            const deltaY = pointerInfo.event.movementY;
            skull.rotate(Vector3.Up(), -deltaX * 0.01);
            skull.rotate(Vector3.Right(), -deltaY * 0.01);
            }
            break;
          }
        });
        }
      }
      )
    );
  });

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(7.6, 40, -124), scene);
  //camera.attachControl(canvas, true);

  camera.onViewMatrixChangedObservable.add(() => {
    console.log(`Camera position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
  });

  new HemisphericLight("light", new Vector3(1, 1, 0), scene);
  // window.addEventListener('keydown', (event) => {
  //   if (!skull) return;

  //   switch (event.key) {
  //     case 'ArrowUp':
  //       skull.rotate(Vector3.Right(), Math.PI / 40);
  //       break;
  //     case 'ArrowDown':
  //       skull.rotate(Vector3.Right(), -Math.PI / 40);
  //       break;
  //     case 'ArrowLeft':
  //       skull.rotate(Vector3.Up(), Math.PI / 40);
  //       break;
  //     case 'ArrowRight':
  //       skull.rotate(Vector3.Up(), -Math.PI / 40);
  //       break;
  //   }
  // });

  return scene;
};

const scene = createScene(); //Call the createScene function
// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});

// Resize the babylon engine when the window is resized
window.addEventListener('resize', () => {
  engine.resize();
});
