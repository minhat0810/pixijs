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

    // Cache các sprite của tile và collider theo vị trí [y][x]
  private tileSprites: Sprite[][] = [];
  private tileColliders: RectCollider[][] = [];

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
  //      console.log(tileTexture);
        
      }
    }
  }

renderMap() {
  this.removeChildren();
  if (this.background) this.addChild(this.background);
  if (!this.mapData) return;

  const tileWidth = this.mapData.tilewidth;
  const tileHeight = this.mapData.tileheight;

  this.mapData.layers.forEach(layer => {
    const startX = Math.max(0, Math.floor(this.cameraX / tileWidth));
    const startY = Math.max(0, Math.floor(this.cameraY / tileHeight));
    const endX = Math.min(layer.width, startX + Math.ceil(this.screenWidth / tileWidth) + 1);
    const endY = Math.min(layer.height, startY + Math.ceil(this.screenHeight / tileHeight) + 1);

    for (let y = 0; y < layer.height; y++) {
      for (let x = 0; x < layer.width; x++) {
        const sprite = this.tileSprites[y]?.[x];
        if (sprite) sprite.visible = false;
      }
    }

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const tileIndex = layer.data[y * layer.width + x];
        if (tileIndex < 1 || tileIndex == 86) continue;

        if (!this.tileSprites[y]) this.tileSprites[y] = [];
        let tileSprite: Sprite;
      //  const newTexture = this.tilesetTextures[tileIndex];


        if (!this.tileSprites[y][x]) {
          tileSprite = new Sprite(this.tilesetTextures[tileIndex]);
          tileSprite.anchor.set(0);
          tileSprite.x = x * tileWidth - this.cameraX;
          tileSprite.y = y * tileHeight - this.cameraY;
          this.tileSprites[y][x] = tileSprite;
          this.addChild(tileSprite);
         // this.tileSprites[y][x] = tileSprite;
          console.log(tileSprite);
          
        } else {
             tileSprite = this.tileSprites[y][x];
             console.log(tileSprite);
             

        // // Nếu texture giống nhau thì không cần set lại
        //     if (tileSprite.texture.baseTexture.uid === newTexture.baseTexture.uid) {
        //       tileSprite.x = x * tileWidth - this.cameraX;
        //       tileSprite.y = y * tileHeight - this.cameraY;
        //       tileSprite.visible = true;
        //       continue;
        //     }


        //     // Cập nhật lại nếu khác texture
        //     tileSprite.texture = newTexture;
        //     tileSprite.x = x * tileWidth - this.cameraX;
        //     tileSprite.y = y * tileHeight - this.cameraY;
        //     tileSprite.visible = true;
        //     console.log(tileSprite);
      //  console.log("hi");
         tileSprite = new Sprite(this.tilesetTextures[tileIndex]);
          tileSprite.anchor.set(0);
          tileSprite.x = x * tileWidth - this.cameraX;
          tileSprite.y = y * tileHeight - this.cameraY;
          this.tileSprites[y][x] = tileSprite;
          this.addChild(tileSprite);
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
