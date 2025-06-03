
import { AnimatedSprite, Assets, Sprite } from "pixi.js";
import { MainScene } from "./MainScene";
import { Player } from "../model/Player";
import { InputController } from "../handle/InputController";
import { MapRenderer } from "../model/Map";
import { CollisionManager } from "../handle/CollisionManager";

export class GameScene extends MainScene {
    private idleSprite! : Sprite;
    private runSprite!  : AnimatedSprite;
    private isMoving    : boolean = false;
    private speed       : number = 5;
    private direction   : number = 1;
    private player!     : Player;
    private input       : InputController;

    private mapRenderer : MapRenderer;
    private collisionManager: CollisionManager;

    constructor() {
        super();
        //console.log(this.app.screen.width);
        this.collisionManager = new CollisionManager();
        
        this.input            = new InputController();
        this.mapRenderer      = new MapRenderer(this.app , this.collisionManager);

         this.init();
    }

   private async init() {
             
            this.width    = this.app.screen.width;
            this.height   = this.app.screen.height    
            const mapData = Assets.get('map_level_1');
            await this.mapRenderer.loadMap(mapData);
            
            this.player   = new Player(this.app ,this.collisionManager,mapData);
            
            //this.player = new Player(this.app ,this.collisionManager,data.width * data.tilewidth);
            this.addChild(this.mapRenderer);
            this.addChild(this.player);
            // this.collisionManager.addCollider(this.player.collider);
            // this.app.ticker.add((ticker)=>this.update(ticker.deltaTime));

  }


    update(delta: number) {

        if(!this.player) return;
        if (document.hidden) return;
        this.mapRenderer.updateCamera(this.player.x,this.player.y);
        this.mapRenderer.checkCollision(this.player.x,this.player.y);
        this.player.update(delta);
        this.collisionManager.checkCollisions();
        if (!this.player.runSprite) return;
        if(this.player.isAttacking) return;
                
                if(this.input.isKeyPressed("ArrowUp") && this.input.isKeyPressed("ArrowRight")){
                        this.player.jump(1);
                } else 
                if(this.input.isKeyPressed("ArrowUp") && this.input.isKeyPressed("ArrowLeft")){
                        this.player.jump(-1);
                } else
                if(this.input.isKeyPressed("ArrowUp")){
                        this.player.jump(this.player.direction);
                } else  
                if(this.input.isKeyPressed("ArrowLeft")){
                        this.player.startMoving(-1);
                } else 
                if(this.input.isKeyPressed("ArrowRight")){
                         this.player.startMoving(1);
                } else
                if(this.input.isKeyPressed("Enter") || this.input.isKeyPressed("1")){            
                        this.player.attack("punch",this.player.direction);
                }
                else
                if(this.input.isKeyPressed("2")){
                        this.player.attack("kame1",this.player.direction);
                }
                else
                 {
                        this.player.stopMoving();
                }
                
          // console.log(this.player.x , this.player.y);
           //this.mapRenderer.checkCollision(this.player)
        //      this.mapRenderer.setCameraPosition(this.player.x, this.player.y);
   //       console.log(this.player.x, this.player.y);
                const nearbyTiles = this.mapRenderer.checkCollision(this.player.x, this.player.y,2);

                // ví dụ: kiểm tra có tile nào không trong suốt
                nearbyTiles.forEach(tile => {
                if (tile.visible) {
                // xử lý va chạm hoặc debug highlight tile
                console.log(`Tile tại (${tile.col}, ${tile.row}) va chạm.`);
                }
                });
                        } 
    
}





























        // this.addChild(player);
        // Load Spritesheet từ JSON
        // const spritesheet =  await Assets.load("/assets/image/moves/move.json");

        // //đứng yên
        //     this.idleSprite = new Sprite(spritesheet.textures["move_0"]);
        //     this.idleSprite.x = this.app.screen.width/2;
        //     this.idleSprite.y = this.app.screen.height/2;
        //     this.addChild(this.idleSprite);

        //     const frames = [];
        //      for (let i = 1; i < 6; i++) { console.log(spritesheet.textures);
        //         frames.push(spritesheet.textures[`move_${i}`]);
        //      }
          
        //     this.runSprite = new AnimatedSprite(frames);
        //     this.runSprite.x = this.app.screen.width/2;
        //     this.runSprite.y = this.app.screen.height/2;
        //     this.runSprite.loop = true;
        //     this.runSprite.visible = false;
        //     this.runSprite.animationSpeed = 0.1;
        //     this.addChild(this.runSprite);
             
            // const anim = new AnimatedSprite(frames);
            // console.log();
            // anim.x = this.app.screen.width/2;
            // anim.y = this.app.screen.height/2;
            // anim.animationSpeed = 0.1;
            // anim.loop = true;
            // anim.play();
            // this.addChild(anim);

        // window.addEventListener("keydown", this.startMoving.bind(this));
        // window.addEventListener("keyup", this.stopMoving.bind(this));
       
        //this.app.ticker.add(() => this.update());


            // private startMoving(event: KeyboardEvent){
    //      if (event.key === "ArrowLeft") {
    //         this.direction = -1;
    //         this.runSprite.scale.x = -1;
    //          this.runSprite.x -= 5;
    //          this.idleSprite.x = this.runSprite.x;
    //         this.runSprite.anchor.set(1, 0); 
    //     } else if (event.key === "ArrowRight") {
    //         this.direction = 1;
    //         this.runSprite.scale.x = 1;
    //         this.runSprite.x += 5;
    //         this.idleSprite.x = this.runSprite.x;
    //         this.runSprite.anchor.set(0, 0);
    //     } else {
    //         return;
    //     }

    //     if (!this.isMoving) {
    //         this.isMoving = true;
    //         this.idleSprite.visible = false;
    //         this.runSprite.visible = true;
    //         this.runSprite.play();
    //     }
    // }
    
    // private stopMoving(event: KeyboardEvent) {
    //     if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    //         this.isMoving = false;
    //         this.runSprite.stop();
    //         this.runSprite.visible = false;
    //         this.idleSprite.visible = true;
    //     }
    // }