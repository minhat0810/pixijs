import { Application, Assets, Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { CollisionManager } from "../handle/CollisionManager";
import RectCollider from "../handle/RectCollider";
// import { Collider } from "../handle/Collider";
import { TileSprite } from "../main/TileSprite";
import { Collider } from "../handle/Collider";

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
  col :number;
  row :number;
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
  // private highlightOverlay: Graphics = new Graphics();
  
  public tileSize         : number = 16;
  private tileIndex!      : number;
  private tileSprite!     : TileSprite;

  private cameraX         : number = 0;
  private cameraY         : number = 0;
  private screenWidth     : number;
  private screenHeight    : number;

  //public  mapWidth!       : number;

  private tilesetTextures   : Texture[] = [];
  private mapData!        : MapData;
  private background!     : Sprite;
  public  mapWidth!       :number;
  public  mapHeight!      :number;
    // Cache các sprite của tile và collider theo vị trí [y][x]
  private tileSprites     : Sprite[][] = [];
  private tileColliders   : RectCollider;
  private tilePool        : Sprite[] = [];
  private tileCount     = 0;

  constructor(app: Application, collisionManager: CollisionManager) {
    super();
    this.app = app;
    //this.addChild(this.highlightOverlay);
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
       this.mapWidth  = this.mapData.width * this.mapData.tilewidth;
       this.mapHeight = this.mapData.height * this.mapData.tileheight;
       this.width = this.mapWidth;
 //     console.log(mapFile);
      
      
      await this.loadTileset();
      await this.loadBackground();
     
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
    for (let i = this.tileCount; i < this.tilePool.length; i++) {
      this.tilePool[i].visible = false;
    }
    this.tileCount = 0;
    if (!this.mapData) return;

    const tileWidth = this.mapData.tilewidth;
    const tileHeight = this.mapData.tileheight;
  

  this.mapData.layers.forEach(layer => {
    const startX = Math.max(0, Math.floor(this.cameraX / tileWidth));
    const startY = Math.max(0, Math.floor(this.cameraY / tileHeight));
    
    //số cột hàng tối đa có thể vẽ trên màn hìnhz
    const visibleCols = Math.ceil(this.screenWidth / tileWidth);
    const visibleRows = Math.ceil(this.screenHeight / tileHeight);

    if(layer.width && layer.height){
      const endX = Math.min(layer.width, startX + visibleCols + 1);
      const endY = Math.min(layer.height, startY + visibleRows + 1);
      console.log();
      
      for (let y = 0; y < layer.height; y++) {
        for (let x = 0; x < layer.width; x++) {
          //Đảm bảo chương trình không crash khi tileSprites[y] chưa được khởi tạo
          const sprite = this.tileSprites[y]?.[x];
          if (sprite) sprite.visible = false;
        }
      }
  
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
         this.tileIndex = layer.data[y * layer.width + x];
          if (this.tileIndex < 1 || this.tileIndex == 86) continue;
          const tileTexture = this.tilesetTextures[this.tileIndex];
          //let isReused = false;
          
          // nếu tilePool chưa có thì khởi tạo - tạo xong thì tái sử dụng
          if (this.tilePool[this.tileCount]) {
            this.tileSprite = this.tilePool[this.tileCount] as TileSprite;
            this.tileSprite.texture = tileTexture;
           //  isReused = true; // Tái sử dụng
          } else {
            this.tileSprite = new TileSprite(tileTexture);
            this.tilePool.push(this.tileSprite);
            this.addChild(this.tileSprite);
          }
  
          if (!this.tileSprites[y]) {
            this.tileSprites[y] = [];
          }
          this.tileSprites[y][x] = this.tileSprite;
  
          this.tileSprite.visible = true;
          this.tileSprite.row = y;
          this.tileSprite.col = x;
          this.tileSprite.x = this.tileSprite.col * tileWidth - this.cameraX;
          this.tileSprite.y = this.tileSprite.row * tileHeight - this.cameraY;
          this.tileCount++;
        }
      }
    }
  });
}

  updateCamera(playerX: number, playerY: number){
      // if (!this.mapData || this.tilesetTextures.length === 0) return;
    // console.log(this.mapData);
    
      const centerX = this.screenWidth/2;
      const centerY = this.screenHeight/2;
      

      this.cameraX = Math.min(Math.max(playerX-centerX,0), this.mapWidth - this.screenWidth);
      this.cameraY = Math.min(Math.max(playerY-centerY,0), this.mapHeight-this.screenHeight);
      
      
      

      this.renderMap();
  }

  public checkCollision(playerX: number, playerY: number, range: number = 2): TileSprite[] {
    const tileSize = this.tileSize;
  
    // Tính vị trí gốc của player theo tọa độ bản đồ
    const globalPlayerX = playerX + this.cameraX;
    const globalPlayerY = playerY + this.cameraY;
  
    // Nếu player đang ở nửa trái màn hình, không dùng camera
    const useGlobal = playerX >= this.screenWidth / 2;
  
    const centerTileX = Math.floor((useGlobal ? globalPlayerX : playerX) / tileSize);
    const centerTileY = Math.floor((useGlobal ? globalPlayerY : playerY) / tileSize);
  
    const tiles: TileSprite[] = [];
  
    for (let dy = -range; dy <= range; dy++) {
      for (let dx = -range; dx <= range; dx++) {
        const tileX = centerTileX + dx;
        const tileY = centerTileY + dy;
  
        if (
          tileX >= 0 && tileX < this.mapData.width &&
          tileY >= 0 && tileY < this.mapData.height
        ) {
          const tile = this.tileSprites[tileY]?.[tileX] as TileSprite;
          if (tile) {
            tiles.push(tile);
  
            const debugRect = new Graphics();
            debugRect.rect(
              tileX * tileSize - this.cameraX,
              tileY * tileSize - this.cameraY,
              tileSize,
              tileSize
            );
            debugRect.fill({ color: 0xff0000, alpha: 0.3 });
            this.addChild(debugRect);
          }
        }
      }
    }
  
    return tiles;
  }
}  

