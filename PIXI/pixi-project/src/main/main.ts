import { Application } from "pixi.js";
import { SceneManager } from "../scenes/SceneManager";
//import { BunnyScene } from "../scenes/BunnyScene";
//import { MenuScene } from "../scenes/MenuScene";
import { GameScene } from "../scenes/GameScene";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window, resolution: window.devicePixelRatio || 1 });
 // console.log(app.screen.width,app.screen.height);
  

  //document.getElementById("pixi-container")!.appendChild(app.canvas);

  const pixiContainer = document.getElementById("pixi-container");
  if (pixiContainer) {
    pixiContainer.appendChild(app.canvas);
    app.canvas.style.position = "absolute";
    app.canvas.style.left = "0";
    app.canvas.style.top = "0";
  }
  SceneManager.init(app);
 
  
  SceneManager.changeScene(new GameScene());
  app.ticker.add((time) => {
    SceneManager.update(time.deltaTime)
  })


//   // Xử lý khi mất WebGL context
//   app.renderer.on("contextLost", () => {
//     console.warn("WebGL context lost. Attempting to restore...");
//   });

//   app.renderer.on("contextRestored", () => {
//     console.log("WebGL context restored. Reloading sprites...");
//     reloadSprites();
//   });

//   // Xử lý khi thay đổi kích thước màn hình
//   window.addEventListener("resize", () => {
//     console.log("Resizing game...");
//     app.renderer.resize(window.innerWidth, window.innerHeight);
//   });

// })();

// // Hàm reload lại các sprite khi WebGL context bị mất
//   async function reloadSprites() {
//     console.log("Reloading sprites...");

//     // Nếu SceneManager đang chứa GameScene thì gọi hàm reload
//     const currentScene = SceneManager.currentScene;
//     if (currentScene instanceof GameScene) {
//       await currentScene.reloadTextures();
//     }

//   console.log("Sprites reloaded successfully!");

  
  // // Load the bunny texture
  // const texture = await Assets.load("/assets/bunny.png");

  // // Create a bunny Sprite
  // const bunny = new Sprite(texture);

  // // Center the sprite's anchor point
  // bunny.anchor.set(0.5);

  // // Move the sprite to the center of the screen
  // bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // // Add the bunny to the stage
  // app.stage.addChild(bunny);

  // // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   bunny.rotation += 0.1 * time.deltaTime;
  // });
})();
