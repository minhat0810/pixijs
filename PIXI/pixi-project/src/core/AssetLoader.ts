import { Assets } from "pixi.js";

export class AssetLoader {
    public static async loadAllAssets() {
        await Promise.all([
            this.loadPlayerAssets(),
            this.loadMapAssets(),
        ]);
        // thêm các nhóm khác nếu có
    }

    private static async loadPlayerAssets() {
        Assets.add({
            alias: 'player',
            src: '/assets/image/player/player.json'
        });
        // Assets.add({
        //     alias: 'spritesheet',
        //     src: 
        // })
        // const spritesheet = await Assets.load("/assets/image/player/player.json");
        await Assets.load('player');
    }
    private static async loadMapAssets(){
        Assets.add(
           {
            alias: 'map_level_1',
            src: '/assets/maps/map_level_1.json'
           } );
        await Assets.load('map_level_1');
    }
}