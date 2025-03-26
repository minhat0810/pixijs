    import { Text, Sprite, Assets, Container, Graphics } from "pixi.js";
    import { MainScene } from "./MainScene";
    import { SceneManager } from "./SceneManager";
    import { GameScene } from "./GameScene";

    export class MenuScene extends MainScene {
        constructor() {
            super();
            this.init();
        }

        private async init() {

            const bgTexture = await Assets.load("/assets/bgr.webp");
            const background = new Sprite(bgTexture);

            // Căn chỉnh kích thước background khớp với màn hình
            background.width = this.app.screen.width;
            background.height = this.app.screen.height;

            this.addChild(background);

            // Tạo Container để bọc text
            const buttonContainer = new Container();

            const text = new Text("Start Game", {
                fill: "black",
                fontSize: 40,
                fontFamily: "Robo" 
            });

            text.anchor.set(0.5);
            text.position.set(0, 0); 

            // Thêm text vào container
            const buttonBg = new Graphics();
            buttonBg.beginFill("#B0C4DE"); 
            buttonBg.drawRoundedRect(-text.width / 2 - 10, -text.height / 2 - 10, text.width + 20, text.height + 20, 10);
            buttonBg.lineStyle(3, "000"); 
            buttonBg.endFill();
        
            buttonContainer.addChild(buttonBg, text);


            buttonContainer.position.set(this.app.screen.width / 2, this.app.screen.height / 2);


            buttonContainer.interactive = true;
            buttonContainer.cursor = "pointer";


            buttonContainer.on("pointerover", () => {
                buttonContainer.scale.set(1.2); 
            });

            buttonContainer.on("pointerout", () => {
                buttonContainer.scale.set(1);
            });


            buttonContainer.on("pointerdown", () => {
                SceneManager.changeScene(new GameScene());
            });

            this.addChild(buttonContainer);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        update(delta: number) {}
    }
