import Dungeon from "@mikewesthad/dungeon";
import Bat from "./bat";
import { TntActivator } from "./tnt";

export default class DungeonGenerator {
  constructor(scene) {
    this.scene = scene;
    this.generate();
  }

  /*
    This is the method that generates the whole dungeon. It's divided into different methods to make it more readable but basically, it generates the dungeon, and the map and then it places the different elements on the map.
  */
  generate() {
    this.generateDungeon();
    this.generateMap();


    this.dungeon.rooms.forEach((room) => {
      // These room properties are all in grid units (not pixels units)
      const { x, y, width, height } = room;
      // Fill the room (minus the walls) with mostly clean floor tiles (90% of the time), but
      // occasionally place a dirty tile (10% of the time).
      this.groundLayer.weightedRandomize(
        [
          { index: 10, weight: 9 }, // 9/10 times, use index 6
          { index: [7, 8, 9], weight: 1 }, // 1/10 times, randomly pick 7, 8 or 26
        ],
        x + 1,
        y + 1,
        width - 2,
        height - 2
      );

      this.placeCorners(room);
      this.placeWalls(room);

      const doors = room.getDoorLocations(); // Returns an array of {x, y} objects
      this.addDoors(room, doors, x, y);
      this.addTntActivators(room)
      const foes = Phaser.Math.Between(1, 3)
      for (let i = 0;i<foes;i++)
        this.addFoes(room)
    });

    this.placePlayer(this.dungeon.rooms[0])
  }

  /*
    This method generates the dungeon using the dungeon generator library. We just need to pass the width and height of the dungeon and some options. You can check the documentation of the library to see all the options available.
  */
  generateDungeon() {
    this.dungeon = new Dungeon({
      width: 50,
      height: 50,
      doorPadding: 2,
      rooms: {
        width: { min: 7, max: 15 },
        height: { min: 7, max: 15 },
        maxRooms: 12,
      },
    });
  }

  /*
    This method adds a specific tilemap to our dungeon, with its layers and collisions.
  */
  generateMap() {
    this.map = this.scene.make.tilemap({
      tileWidth: 64,
      tileHeight: 64,
      width: this.dungeon.width,
      height: this.dungeon.height,
    });
    const tileset = this.map.addTilesetImage("brick", null, 64, 64, 0, 0); // 1px margin, 2px spacing
    this.groundLayer = this.map.createBlankLayer("Layer 1", tileset);
    this.stuffLayer = this.map.createBlankLayer("Stuff", tileset);
    this.groundLayer.setCollisionByExclusion([-1]);

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    const mappedTiles = this.dungeon.getMappedTiles({
      empty: -1,
      floor: -1,
      door: 3,
      wall: 0,
    });
    this.groundLayer.putTilesAt(mappedTiles, 0, 0);
    this.groundLayer.setCollision(0);
    this.groundLayer.setCollisionByProperty({ collides: true });
   // this.scene.physics.world.convertTilemapLayer(this.groundLayer);
  }

  placePlayer(room) {
    const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
    const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);
    const worldPosition = this.groundLayer.tileToWorldXY(keyX, keyY);
    this.playerPosition = new Phaser.Geom.Point(worldPosition.x + 32, worldPosition.y + 32);
  }

  placeCorners(room) {
    const { left, right, top, bottom } = room;
    this.groundLayer.putTileAt(4, left, top);
    this.groundLayer.putTileAt(4, right, top);
    this.groundLayer.putTileAt(4, right, bottom);
    this.groundLayer.putTileAt(4, left, bottom);
  }


  placeWalls(room) {
    const { width, height, left, right, top, bottom } = room;
    this.stuffLayer.weightedRandomize(
      [
        { index: [0], weight: 4 },
        { index: [1], weight: 3 },
        { index: [2], weight: 2 },
        { index: [3], weight: 1 },
      ],
      left + 1,
      top + 1,
      width - 2,
      height - 2
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 4, weight: 4 },
        { index: [4], weight: 1 },
      ],
      left + 1,
      top,
      width - 2,
      1
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 4, weight: 4 },
        { index: [4], weight: 1 },
      ],
      left + 1,
      bottom,
      width - 2,
      1
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 4, weight: 4 },
        { index: [4], weight: 1 },
      ],
      left,
      top + 1,
      1,
      height - 2
    );
    this.groundLayer.weightedRandomize(
      [
        { index: 4, weight: 4 },
        { index: [4], weight: 1 },
      ],
      right,
      top + 1,
      1,
      height - 2
    );
  }

  addDoors(room, doors, x, y) {
    for (let i = 0; i < doors.length; i++) {
      const worldPosition = this.groundLayer.tileToWorldXY(
        x + doors[i].x,
        y + doors[i].y
      );

      if (doors[i].y === 0) {
        this.groundLayer.putTilesAt([[7], [7]], x + doors[i].x, y + doors[i].y);
      } else if (doors[i].y === room.height - 1) {
        this.groundLayer.putTilesAt([[7], [7]], x + doors[i].x, y + doors[i].y);
      } else if (doors[i].x === 0) {
        this.groundLayer.putTilesAt([[7]], x + doors[i].x, y + doors[i].y);
      } else if (doors[i].x === room.width - 1) {
        this.groundLayer.putTilesAt([[7]], x + doors[i].x, y + doors[i].y);
      }
    }
  }

  addTntActivators(room) {
    const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
    const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);

    const worldPosition = this.groundLayer.tileToWorldXY(keyX, keyY);
    this.scene.tntActivators.add(new TntActivator(
      this.scene,
      worldPosition.x + 22,
      worldPosition.y + 22
    ));
  }

  addFoes(room) {
    const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
    const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);

    const worldPosition = this.groundLayer.tileToWorldXY(keyX, keyY);
    this.scene.foes.add(new Bat(
      this.scene,
      worldPosition.x + 22,
      worldPosition.y + 22,
      this.groundLayer
    ));
  }
}
