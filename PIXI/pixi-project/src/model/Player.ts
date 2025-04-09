import { AnimatedSprite, Application, Assets, Container, Graphics, Sprite, Spritesheet } from "pixi.js";
import RectCollider from "../handle/RectCollider";
import { CollisionManager } from "../handle/CollisionManager";
import { Collider } from "../handle/Collider";

export class Player extends Container {
    public idleSprite!  : Sprite;
    public runSprite!   : AnimatedSprite;
    public jumpSprite!  : AnimatedSprite;
    public punchSprite! : AnimatedSprite;
    public kame1Sprite! : AnimatedSprite;

    public  isAttacking : boolean = false;
    private isMoving    : boolean = false;
    private isJumping   : boolean = false;
//    private isPunch     : boolean = false;
    private attackType  : "none" | "punch" | "kame1" | "slash" = "none";

    private velocityY   : number = 0;
    private gravity     : number = 0.2;
    private jumpForce   : number = -6;
    private groundY!    : number;
    private speed       : number = 2;
    public  direction   : number = 1;
    private border!     : Graphics;
    
    private app         : Application;
    public  collider!    : RectCollider;
    private collisionManager! : CollisionManager;
    private mapWidth    : number;

    constructor(app: Application, collisionManager: CollisionManager,mapWidth: number) {
        super();
        this.app = app;
        this.collisionManager = collisionManager;
        this.mapWidth = mapWidth;
        this.init().then(() => {
            console.log("Player initialized.");
        }).catch((error) => {
            console.error("Error initializing player:", error);
        });
        
      
        
       // this.collisionManager = new CollisionManager();
        // this.collisionManager.addCollider(this.collider);
       // console.log(this.getBounds());
        
    }
    private async init() {
        const spritesheet = await Assets.load("/assets/image/player/player.json");
      //  console.log(spritesheet.textures["move_0"]);
        
        this.idleSprite = new Sprite(spritesheet.textures["move_0"]);
        
        
        this.idleSprite.anchor.set(0.5);
        this.idleSprite.scale.set(3.0 , 1.7) ;
        this.idleSprite.x = 0; 
        // console.log(this.idleSprite.x , this.idleSprite.y);
        
        // this.idleSprite.anchor.set(0, 1);
        // this.idleSprite.x = 0; 
        // this.idleSprite.y = this.app.screen.height; // Đưa xuống sát đáy nếu cần
        
        // this.idleSprite.scale.set(1.7, 1.7);
        // this.idleSprite.x = -this.idleSprite.width * 0.3; // Điều chỉnh lại để bù scale

        
        this.addChild(this.idleSprite);
//        this.app.stage.addChild(this.idleSprite)

        this.spriteRun(spritesheet as Spritesheet);
        this.spriteJump(spritesheet as Spritesheet);
        this.spritePunch(spritesheet as Spritesheet);
        this.spriteKame1(spritesheet as Spritesheet);

        
        // this.border = new Graphics();
        // this.addChild(this.border);
        // this.drawBorder(this.idleSprite);

        this.groundY = 405; 
        this.position.set(20, this.groundY);
       // console.log();
        

        
    }
    private drawBorder(sprite: Sprite | AnimatedSprite) {
        this.border.clear();
        this.border.lineStyle(2, "000", 1); // Độ dày viền, màu đỏ, độ trong suốt 1
        this.border.drawRect(
            sprite.x - sprite.width / 2,
            sprite.y - sprite.height / 2,
            sprite.width,
            sprite.height
        );
    }
    private hideAllSprites() {
        this.idleSprite.visible = false;
        this.runSprite.visible = false;
        this.jumpSprite.visible = false;
        this.punchSprite.visible = false;
        this.kame1Sprite.visible = false;
    }


    private spriteRun(spritesheet : Spritesheet){
         const frames = [];
        for (let i = 1; i < 5; i++) {
            frames.push(spritesheet.textures[`move_${i}`]);
        }
        
        this.runSprite = new AnimatedSprite(frames);
        this.runSprite.anchor.set(0.5);
        this.runSprite.loop = true;
        this.runSprite.animationSpeed = 0.1;
         this.runSprite.scale.set(1.7,1.7)
        this.runSprite.visible = false;
        this.addChild(this.runSprite);
    }

    public spriteJump(spritesheet: Spritesheet){
        const jumpFrames = [];
        for (let i = 1; i < 6; i++) {
            jumpFrames.push(spritesheet.textures[`jump_${i}`]);
        }
        this.jumpSprite = new AnimatedSprite(jumpFrames);
        this.jumpSprite.anchor.set(0.5);
        this.jumpSprite.loop = true;
        this.jumpSprite.animationSpeed = 0.09;
        this.jumpSprite.scale.set(1.7,1.7)
        this.jumpSprite.visible = false;
        this.addChild(this.jumpSprite);
    }
    public spritePunch(spritesheet: Spritesheet){
        const punchFrames = [];
        for (let i = 0; i < 4; i++) {
            punchFrames.push(spritesheet.textures[`punch_${i}`]);
        }
        this.punchSprite = new AnimatedSprite(punchFrames);
        this.punchSprite.anchor.set(0.5);
        //this.punchSprite.loop = true;
        this.punchSprite.animationSpeed = 0.3;
        this.punchSprite.scale.set(1.7,1.7)
        this.punchSprite.visible = false;
        this.addChild(this.punchSprite);
    }
     public spriteKame1(spritesheet: Spritesheet){
        const frames = [];
        for (let i = 0; i < 9; i++) {
            frames.push(spritesheet.textures[`kame1_${i}`]);
        }
        this.kame1Sprite = new AnimatedSprite(frames);
        this.kame1Sprite.anchor.set(0,0.5);
        this.kame1Sprite.loop = true;
        this.kame1Sprite.animationSpeed = 0.2;
        this.kame1Sprite.scale.set(1.7,1.7)
        this.kame1Sprite.visible = false;
        this.addChild(this.kame1Sprite);
        this.kame1Sprite.onFrameChange = (frame) => {
          if(frame == 8){
             console.log(this.idleSprite);
           //  this.kame1Sprite.x = this.idleSprite.x;
          }
        };

    }


    public startMoving(direction: number) {
        this.direction = direction;
        // Lật sprite theo hướng chạy
        this.runSprite.scale.set(Math.abs(this.runSprite.scale.x) * direction, this.runSprite.scale.y); 
        this.hideAllSprites();
        this.runSprite.visible = true;
        // this.idleSprite.visible = false;
        // this.jumpSprite.visible = false;
        // this.punchSprite.visible = false;
        this.runSprite.play();
        this.isMoving = true;

    }

    public stopMoving() {
        this.isMoving = false;
         this.isMoving = false;
        if (this.runSprite) {
            this.runSprite.stop();
            this.runSprite.visible = false;
        }
        this.jumpSprite.stop()
        this.jumpSprite.visible = false;
        // this.punchSprite.visible = false;
        this.idleSprite.scale.set(1.7,1.7) 
        this.idleSprite.scale.x = this.direction; 
        this.idleSprite.visible = true;
    }

    public jump(direction: number) {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = this.jumpForce;

            //  this.idleSprite.visible = false;
            //  this.runSprite.visible = false;
            //  this.punchSprite.visible = false;
            this.hideAllSprites();

             this.jumpSprite.play();
             this.jumpSprite.visible = true;
             this.jumpSprite.gotoAndPlay(0);

             this.jumpSprite.scale.set(Math.abs(this.jumpSprite.scale.x) * direction, this.jumpSprite.scale.y);
        }
    }
    public attack(type: "punch" | "kame1" | "slash",direction: number){
        if(this.attackType != "none" || this.isJumping) return;
        
        this.isAttacking = true;
        this.attackType = type;

        // this.idleSprite.visible = false;
        // this.runSprite.visible  = false;
        // this.jumpSprite.visible = false;
        this.hideAllSprites();
       // console.log(this.idleSprite);
        

        let attackSprite: AnimatedSprite | null = null;
        //console.log(attackSprite);
        if (type == "punch") {
            attackSprite = this.punchSprite;
            //
        }  else
        if(type == "kame1"){
            attackSprite = this.kame1Sprite;
        }

        if(attackSprite){
            attackSprite.visible = true;
            attackSprite.gotoAndPlay(0);
            attackSprite.loop = false;
           // attackSprite.currentFrame = 0;
            attackSprite.play();
            attackSprite.scale.set(Math.abs(attackSprite.scale.x) * direction, attackSprite.scale.y);

            let time: number = 300; // Mặc định là 500ms
            if (type == "kame1") time = 1000;
            setTimeout(()=>{
                attackSprite.stop();
                attackSprite.visible = false;
                this.isAttacking = false;
                this.attackType = "none";
                this.idleSprite.visible = true;
                // let time: number =;
                // if(type=="kame1") time = 1000;
            },time);
        }
    }

    onCollision(){
        console.log("hi");
        
    }

    public update(delta: number) {
      //  console.log(this.mapWidth);
        
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.collider = new RectCollider(this.x,this.y,32,32, (other: Collider) => {} );
        this.collisionManager.addCollider(this.collider);
      //  console.log(this.collider);
        if(this.x<=0){
            //console.log();
            this.speed = 0;
            this.x += 1;
        } else {
            // Xử lý trọng lực
            this.speed = 2;
        if (this.isMoving) {
        const screenMid = this.direction === 1? this.app.screen.width / 2 - 150 : this.app.screen.width / 2 + 150 ;

        const mapEndOffset = 80;

        const globalPlayerX = this.x - this.parent.x;

        // Giới hạn cuộn map
        const minParentX = -(this.mapWidth - this.app.screen.width - mapEndOffset); // Cuộn hết về phải
        const maxParentX = 0; // Gốc bên trái

        // Di chuyển sang phải
            const moveAmount = this.direction * this.speed * delta;

            if (this.direction > 0) {
        //        console.log(globalPlayerX);
                
               if(globalPlayerX >= this.mapWidth-110){
                    this.speed = 0;
               } else {
                 if (globalPlayerX < screenMid) {
                    this.x += moveAmount;
                } else if (this.parent.x > minParentX) {
                    this.parent.x -= moveAmount;
                    this.x += moveAmount;
                    if (this.parent.x < minParentX) this.parent.x = minParentX;
                } else {
                    this.x += moveAmount;
                }
               }
            }

            if (this.direction < 0) {
                if (globalPlayerX > screenMid  + 300) {
                    this.x += moveAmount;
                } else if (this.parent.x < maxParentX) {
                    this.parent.x -= moveAmount;
                    this.x += moveAmount;
                    if (this.parent.x > maxParentX) this.parent.x = maxParentX;
                } else {
                    this.x += moveAmount;
                }
            }
        }


        if (this.isJumping) {
            this.y += this.velocityY * delta;
            this.velocityY += this.gravity * delta;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.isJumping = false;
                this.velocityY = 0;
            }
        }
        }      
    }
    
}
