import { Container } from "pixi.js";
import { SceneManager } from "./SceneManager";

export class MainScene extends Container{
    protected app;
    constructor(){
        super();
        this.app = SceneManager.getApp();
      //  console.log(this.app.screen.width , this.app.screen.height);
        
        // this.resize();
        
        // window.addEventListener("resize", () => this.resize());
    }


    //  private resize() {
    //      if (!this.app?.screen) return;
    //     this.app.renderer.resize(window.innerWidth, window.innerHeight);
    // //    console.log(`Updated screen size: ${this.width} x ${this.height}`);
    // }

    
    // public destroy(options?: any) {
    //     window.removeEventListener("resize", () => this.resize());
    //     super.destroy(options);
    // }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(delta: number){
        
    }
}






