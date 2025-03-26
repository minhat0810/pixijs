import { Application } from "pixi.js";
import { MainScene } from "./MainScene";

export class SceneManager{
    public static currentScene: MainScene;
    private static app: Application;

    static init(appInstance: Application) {
        this.app = appInstance;
      //  console.log(this.app.screen.width);
    }

    static getApp(): Application{
        return this.app;
    }
    static changeScene(newScene: MainScene){
        if(this.currentScene){
            // xóa scene hiện tại
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroy({children: true});
        }
        this.currentScene = newScene;
        this.app.stage.addChild(this.currentScene);
    }
    static update(delta: number){
        if(this.currentScene){
            this.currentScene.update(delta);
        }
    }
}