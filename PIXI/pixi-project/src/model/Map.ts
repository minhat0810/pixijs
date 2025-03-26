import {  Application, Assets, Container, Rectangle, Sprite, Texture } from "pixi.js";


interface LayerData {
  data: number[];
  width: number;
  height: number;
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
//   layers: number[];
//   tilesets: number[];
  layers: LayerData[];
  tilesets: TilesetData[];
}

export class MapRenderer extends Container{
    private app : Application;
    // private container: Container;
    private tileSize: number = 16;
    private  sprite! : Sprite;
    private  tilesMap! : Sprite;
    constructor(app: Application){
      super();
         this.app = app;
         console.log(app.screen.width , app.screen.height);
         
        // this.container = new Container();
        // this.app.stage.addChild(this.container);'
    }

    async loadMap(mapFile: string){
       // console.log(mapFile);
        
        try{
          
            const reponse = await fetch(mapFile);
            const mapData = await reponse.json();

            // const imgMap = mapData.tilesets[0].source;
            // const reponseMap = await fetch(`/assets/maps/${imgMap}`);
            // const mapImg    = await reponseMap.json();
            // console.log(mapImg.name);
            
            this.renderMap(mapData);
        } catch (error){
            console.log(error);
            
        }
    }

   async renderMap(mapData : MapData){
        
        const imgFile = mapData.tilesets[0].source;
        const reponse = await fetch(`/assets/maps/${imgFile}`);
        const imgJson = await reponse.json();

        const tileset = mapData.tilesets[0]; 
        const texture = await Assets.load(`/assets/maps/${imgJson.image}`);
        // console.log(texture);
        this.tilesMap = new Sprite(texture);
        // this.tilesMap.x = 400;
        // this.tilesMap.y = 400;
        // // this.tilesMap.anchor.set(1)
        // this.addChild(this.tilesMap);

        const tileWidth = mapData.tilewidth;
        const tilesetTextures: Texture[] = [];
        const tileHeight = mapData.tileheight;
        const tilesetColumns = imgJson.imagewidth / tileWidth;
        const tilesetRows = imgJson.imageheight / tileHeight;
       // console.log(mapData);
        for (let x = 0; x < tilesetColumns ; x++){        
          for(let y = 0; y < tilesetRows ; y++){
              const frame = new Rectangle(x*tileWidth, y* tileHeight, tileWidth, tileHeight);
              texture.frame = frame;
              // console.log(texture.orig.width);
              texture.orig.width = 16;
              texture.orig.height = 16;
              const tileTexture = new Texture(texture);
              tilesetTextures.push(tileTexture);
          }
        }
      //  console.log(tilesetTextures[0]);
        const tile = new Sprite(tilesetTextures[0]);
        
        tile.x = 0;
        console.log(this.app.screen.height);
        
       // tile.y = this.app.screen.height-150;
        
        
        this.addChild(tile)
        
        //console.log(mapData);
      
        //   mapData.layers.forEach((layer) => {
        //   for (let y = 0; y < layer.height; y++) {
        //     for (let x = 0; x < layer.width; x++) {
        //         const tileIndex = layer.data[y*layer.width+x] - tileset.firstgid;
                
        //         if(tileIndex < 0 ) continue;

        //         const tileSprite = new Sprite(tilesetTextures[tileIndex])
        //        // 
        //         tileSprite.x = 400;
        //         tileSprite.y = 400;
        //         console.log(tileSprite);
        //         this.addChild(tileSprite)
        //         this.addChild(this.tilesMap);
                
        //     }
        //   }
        //  });
      //    console.log(this.tilesMap);
        
        
        
      //  this.container.removeChildren();
        //  console.log(mapData);
        //  const {width,height,tilewidth,tileheight,layers,tilesets} = mapData;
        //  console.log(width,height,tilewidth,tileheight,layers,tilesets);
        // console.log(tilesets[0]);
        // const source  = tilesets[0].source;
        // console.log(source);
        // const tileTexture = Texture.from(`assets/maps/Multi_Platformer_Tileset_Free/GrassLand/Terrain/${[source]}`);
        //  const tileTexture = Texture.from(`tilesets${`[0]`}.source`);
       // console.log(tileTexture);
        
       // console.log(mapData.tilesets[1]);
       
        //  for (let x = 0; x < width; x++) {
        //     for (let y = 0; y < height; y++) {
        //         const tileIndex = y * width + x;'
        //       // console.log(layers[2]);
               
                 
                
        //         //  const tileId = tilesets[tileIndex];
                
        //         //   console.log(tileId);
        //         // if(tileId != 0){
        //         //     const tile = Sprite.from(`/assets/tiles/tile_${tileId}.png`);
        //         //     tile.x = x*this.tileSize;
        //         //     tile.y = y*this.tileSize;
        //         //     this.container.addChild(tile);
        //         // }
        //     }   
        //  }
    }     
} 


