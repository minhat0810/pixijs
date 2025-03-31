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
})();
