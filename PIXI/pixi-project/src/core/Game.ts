import { Application } from "pixi.js";

export class Game{
    public app: Application;
    
    constructor() {
        // const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
        this.app = new Application({
            // view: canvas,
            width: 800,
            height: 600,
            // backgroundColor: 0x1099bb
        })
    }
}