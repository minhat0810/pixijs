import { Application, Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";
import { CollisionManager } from "../handle/CollisionManager";
import RectCollider from "../handle/RectCollider";

interface LayerData {
  data: number[];
  width: number;
  height: number;
  image: string;
  offsety: number;
}

interface TilesetData {
  source: string;
  firstgid: number;
  tilewidth: number;
  tileheight: number;
  imagewidth: number;
  imageheight: number;
}

interface MapData {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: LayerData[];
  tilesets: TilesetData[];
}

export class MapRenderer extends Container {
  private app: Application;
  private collisionManager: CollisionManager;
  
  private tileSize: number = 16;
  private cameraX: number = 0;
  private cameraY: number = 0;
  private screenWidth: number;
  private screenHeight: number;
  //public  mapWidth!    : number;

  private tilesetTextures: Texture[] = [];
  private mapData!: MapData;
  private background!: Sprite;
  public  mapWidth!  :number;

  constructor(app: Application, collisionManager: CollisionManager) {
    super();
    this.app = app;
    this.collisionManager = collisionManager;
    this.screenWidth = app.screen.width;
    this.screenHeight = app.screen.height;
  }

  async loadMap(mapFile: MapData) {   
    try {
    //   const response = await fetch(mapFile);
    //   this.mapData = await response.json();
    // //  console.log(this.mapData);
      this.mapData = mapFile;
      
       this.mapWidth = this.mapData.width * this.mapData.tilewidth;
       this.width = this.mapWidth;
 //     console.log(mapFile);
      
      
      await this.loadTileset();
      await this.loadBackground();
      this.renderMap();
    } catch (error) {
      console.error("Lỗi tải bản đồ:", error);
    }
  }

  async loadBackground() {
    const textureBgr = await Assets.load(`/assets/image/${this.mapData.layers[0].image}`);
    this.background = new Sprite(textureBgr);
    this.background.y = this.mapData.layers[0].offsety;
    this.addChild(this.background); 
  }


  async loadTileset() {
    const imgFile = this.mapData.tilesets[0].source;
    const response = await fetch(`/assets/maps/${imgFile}`);
    const imgJson = await response.json();
    const texture = await Assets.load(`/assets/maps/${imgJson.image}`);
  

    const tileWidth = this.mapData.tilewidth;
    const tileHeight = this.mapData.tileheight;
    const tilesetColumns = imgJson.imagewidth / tileWidth;
    const tilesetRows = imgJson.imageheight / tileHeight;
    this.tilesetTextures = [];

    for (let y = 0; y < tilesetRows; y++) {        
      for (let x = 0; x < tilesetColumns; x++) {
        const frame = new Rectangle(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
        texture.frame = frame;
        texture.orig.width = tileWidth;
        texture.orig.height = tileHeight;
        const tileTexture = new Texture(texture);
        this.tilesetTextures.push(tileTexture);
      }
    }
  }

  renderMap() {
    this.removeChildren();
    //console.log(this.app.screen.width);
    
    //this.addChild(this.background);
    if (this.background) {
     this.addChild(this.background);
    }

    if (!this.mapData) return;

    this.mapData.layers.forEach(layer => {
      const tileWidth = this.mapData.tilewidth;
      const tileHeight = this.mapData.tileheight;

      // Xác định vùng cần vẽ theo camera
      const startX = Math.max(0, Math.floor(this.cameraX / tileWidth));
      const startY = Math.max(0, Math.floor(this.cameraY / tileHeight));
  
      
      const endX = Math.min(layer.width, startX + Math.ceil(this.screenWidth / tileWidth) + 7);
      const endY = Math.min(layer.height, startY + Math.ceil(this.screenHeight / tileHeight) + 1);
     //     console.log(endX);
     // console.log(endX);
      
    if(endX != 0 && endY != 0){
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tileIndex = layer.data[y * layer.width + x];
          if (tileIndex < 1 || tileIndex == 86) continue;

          const tileSprite = new Sprite(this.tilesetTextures[tileIndex]);
          tileSprite.x = x * tileWidth - this.cameraX;
          tileSprite.y = y * tileHeight - this.cameraY;
          
          this.addChild(tileSprite);

          const collider = new RectCollider(tileSprite.x, tileSprite.y, tileWidth, tileHeight, () => {
           // console.log("Player va chạm với tile!");
          });
          //console.log(collider);
          
          this.collisionManager.addCollider(collider);
        }
      }
    }
    });
    
  }

  setCameraPosition(playerX: number, playerY: number) {
    if (!this.background || !this.mapData) return;

   // const mapWidth = this.mapData.width * this.mapData.tilewidth;
   // const mapHeight = this.mapData.height * this.mapData.tileheight;
// console.log(this.mapData.width );
  //console.log(this.mapWidth);
    
    this.cameraX = Math.min(
        Math.max(playerX - this.screenWidth / 2, 0),
        this.mapWidth - this.screenWidth
    );

    // this.cameraY = Math.min(
    //     Math.max(playerY - this.screenHeight / 2, 0),
    //     mapHeight - this.screenHeight
    // );
    this.cameraY = playerY-this.screenHeight/2;
    this.renderMap();
}
  getXmap(){
    //  if (!this.background || !this.mapData) return;
    // console.log(this.mapData);
    
    return this.mapWidth;
  }
}
