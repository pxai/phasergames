import Dungeon from "@mikewesthad/dungeon";

export default class DungeonGenerator {
    constructor(scene) {
        this.scene = scene;
        this.generate();
    }

    generate () {
        this.dungeon = new Dungeon({
            width: 50,
            height: 50,
            rooms: {
              width: { min: 7, max: 15 },
              height: { min: 7, max: 15 },
              maxRooms: 12
            }
          });

          this.map = this.scene.make.tilemap({
            tileWidth: 48,
            tileHeight: 48,
            width: this.dungeon.width,
            height: this.dungeon.height
          });
          const tileset = this.map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
          const layer = this.map.createBlankLayer("Layer 1", tileset);
          
      
          // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
          // blank layer
          const mappedTiles = this.dungeon.getMappedTiles({
            empty: -1,
            floor: 6,
            door: 6,
            wall: 20
          });
          layer.putTilesAt(mappedTiles, 0, 0);
          layer.setCollision(20); 
          layer.setCollisionByProperty({ collides: true });
          this.scene.matter.world.convertTilemapLayer(layer);
          // We only need one tile index (the walls) to be colliding for now
      
          // Place the player in the center of the map. This works because the Dungeon generator places
          // the first room in the center of the map.
        //   this.player = new Player(
        //     this,
        //     this.map.widthInPixels / 2,
        //     this.map.heightInPixels / 2
        //   );
      
          // Watch the player and layer for collisions, for the duration of the scene:
          //this.physics.add.collider(this.player.sprite, layer);
    
      
    }
}