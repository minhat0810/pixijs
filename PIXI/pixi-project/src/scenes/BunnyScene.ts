import { Assets, Sprite
    //, Application
     } from "pixi.js";
import { MainScene } from "./MainScene";

export class BunnyScene extends MainScene {
    private bunny: Sprite;

    constructor(
        //app: Application
        )
        {
        super(
            //app
            );
        this.bunny = new Sprite();
        window.addEventListener("resize", () => this.onResize());
        this.init();
    }

    private async init() {
        // Load texture
        const texture = await Assets.load("/assets/bunny.png");

        // Create a bunny sprite
        this.bunny = new Sprite(texture);
        this.bunny.anchor.set(0.5);
      // this.bunny.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        this.onResize();
        this.addChild(this.bunny);
        
    }

      private onResize() {
        if (this.bunny) {
            this.bunny.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        }
    }

    update(delta: number) {    
       this.bunny.rotation += 0.1 * delta;     
    }
}
