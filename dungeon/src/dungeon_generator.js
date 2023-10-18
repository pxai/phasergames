import Dungeon from "@mikewesthad/dungeon";
import Coin from "./coin";
import Key from "./key";
import Bat from "./bat";
import Wizard from "./wizard";
import SeeSaw from "./seesaw";
export default class DungeonGenerator {
    constructor(scene) {
        this.scene = scene;
        this.generate();
    }

  /*

  */
    generate () {
        this.dungeon = new Dungeon({
            width: 50,
            height: 50,
            doorPadding: 2,
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
          const tileset = this.map.addTilesetImage("tiles", null, 48, 48, 0, 0); // 1px margin, 2px spacing
          this.groundLayer = this.map.createBlankLayer("Layer 1", tileset);
          this.stuffLayer = this.map.createBlankLayer("Stuff", tileset);

          // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
          // blank layer
          const mappedTiles = this.dungeon.getMappedTiles({
            empty: -1,
            floor: -1,
            door: 3,
            wall: 0
          });
          this.groundLayer.putTilesAt(mappedTiles, 0, 0);
          this.groundLayer.setCollision(0);
          this.groundLayer.setCollisionByProperty({ collides: true });
          this.scene.matter.world.convertTilemapLayer(this.groundLayer);
          //this.groundLayer.fill(7);
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

          this.dungeon.rooms.forEach(room => {
            // These room properties are all in grid units (not pixels units)
            const { x, y, width, height, left, right, top, bottom } = room;
            // console.log("Generating room: ", room)
            // Fill the room (minus the walls) with mostly clean floor tiles (90% of the time), but
            // occasionally place a dirty tile (10% of the time).
            this.groundLayer.weightedRandomize([
               { index: 17, weight: 9 },              // 9/10 times, use index 6
               { index: [7, 8, 9, 17, 18, 19], weight: 1 }      // 1/10 times, randomly pick 7, 8 or 26
            ], x + 1, y + 1, width - 2, height - 2);

            // Place the room corners tiles
            this.groundLayer.putTileAt(0, left, top);
            this.groundLayer.putTileAt(5, right, top);
            this.groundLayer.putTileAt(45, right, bottom);
            this.groundLayer.putTileAt(40, left, bottom);

            // Place the non-corner wall tiles using fill with x, y, width, height parameters

            this.groundLayer.weightedRandomize(
              [{ index: 2, weight: 4 }, {index: [1, 2, 3, 4], weight: 1}],
              left + 1,
              top,
              width - 2,
              1
            );
            this.groundLayer.weightedRandomize(
              [{ index: 42, weight: 4 }, {index: [41, 42, 43, 44], weight: 1}],
              left + 1,
              bottom,
              width - 2,
              1
            );
            this.groundLayer.weightedRandomize(
              [{ index: 10, weight: 4 }, {index: [10, 20, 30], weight: 1}],
              left,
              top + 1,
              1,
              height - 2
            );
            this.groundLayer.weightedRandomize(
              [{ index: 15, weight: 4 }, {index: [15, 25, 35], weight: 1}],
              right,
              top + 1,
              1,
              height - 2
            );

            const doors = room.getDoorLocations(); // → Returns an array of {x, y} objects
            this.addKey(room)
            this.addFoes(room)
            this.addCoins(room)
            this.addSeeSaw(room);
      for (let i = 0; i < doors.length; i++) {
        const worldPosition = this.groundLayer.tileToWorldXY(x + doors[i].x, y + doors[i].y);
        // console.log("Adding coin: ",x, y,  doors[i].x, doors[i].y,worldPosition.x, worldPosition.y)
        new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20)
        if (doors[i].y === 0) {
          this.groundLayer.putTilesAt(
            [[7],[7]],
            x + doors[i].x,
            y + doors[i].y
          );
        } else if (doors[i].y === room.height - 1) {
          this.groundLayer.putTilesAt(
            [[7],[7]],
            x + doors[i].x,
            y + doors[i].y
          );
        } else if (doors[i].x === 0) {
          this.groundLayer.putTilesAt(
            [[7]],
            x + doors[i].x,
            y + doors[i].y
          );
        } else if (doors[i].x === room.width - 1) {
          this.groundLayer.putTilesAt(
            [[7]],
            x + doors[i].x,
            y + doors[i].y
          );
        }
      }
            //this.addTopTraps(room)

      });
    }

  /*

  */
    addKey(room) {
      const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
      const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);

      const worldPosition= this.groundLayer.tileToWorldXY(keyX, keyY);

      new Key(this.scene, worldPosition.x + 22, worldPosition.y + 22)
    }

  /*

  */
    addSeeSaw(room) {
      if (Phaser.Math.Between(0, 10) < 7) return;

      console.log("Adding see saw: ", room);

      const worldPosition= this.groundLayer.tileToWorldXY(room.centerX, room.centerY);

      new SeeSaw(this.scene, worldPosition.x + 22, worldPosition.y + 22, room.width)
    }

  /*

  */
    addCoins(room) {
      const where = Phaser.Math.RND.pick(["top", "bottom", "left", "right", "none"]);
      const width = parseInt(room.width/3) - Phaser.Math.Between(1, 2);
      const height = parseInt(room.height/3) - Phaser.Math.Between(1, 2);

      if (where === "top") {
        const keyY = room.top + Phaser.Math.Between(1 , 2);
        const keyX = room.left + Phaser.Math.Between(1, 2);

        Array(width).fill().forEach((x, i) => {
          Array(height).fill().forEach((y, j) => {
            const worldPosition= this.groundLayer.tileToWorldXY(keyX + i, keyY + j);
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20)
          })
        })
        //const worldPosition= this.groundLayer.tileToWorldXY(keyX, keyY);
      } else if (where === "bottom") {
        const keyY = room.bottom - Phaser.Math.Between(1 , 2);
        const keyX = room.left + Phaser.Math.Between(1, 2);

        Array(width).fill().forEach((x, i) => {
          Array(height).fill().forEach((y, j) => {
            const worldPosition= this.groundLayer.tileToWorldXY(keyX + i, keyY - j);
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20)
          })
        })
      } else if (where === "left") {
        const keyY = room.top + Phaser.Math.Between(3 , 4);
        const keyX = room.left + Phaser.Math.Between(1, 2);

        Array(width).fill().forEach((x, i) => {
          Array(height).fill().forEach((y, j) => {
            const worldPosition= this.groundLayer.tileToWorldXY(keyX + i, keyY - j);
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20)
          })
        })
      } else if (where === "right") {
        const keyY = room.top + Phaser.Math.Between(1 , 2);
        const keyX = room.right - Phaser.Math.Between(3, 4);

        Array(width).fill().forEach((x, i) => {
          Array(height).fill().forEach((y, j) => {
            const worldPosition= this.groundLayer.tileToWorldXY(keyX - i, keyY + j);
            new Coin(this.scene, worldPosition.x + 20, worldPosition.y + 20)
          })
        })
      }

    }

  /*

  */
    addFoes(room) {
      const keyX = Phaser.Math.Between(room.left + 2, room.right - 2);
      const keyY = Phaser.Math.Between(room.top + 2, room.bottom - 2);

      const worldPosition= this.groundLayer.tileToWorldXY(keyX, keyY);

      if (Phaser.Math.Between(0, 5 ) > 4) {
        new Wizard(this.scene, worldPosition.x + 22, worldPosition.y + 22, this.groundLayer)
      } else {
        new Bat(this.scene, worldPosition.x + 22, worldPosition.y + 22, this.groundLayer)
      }

    }

  /*

  */
    addTopTraps (room) {
      const { x, y, width, height, left, right, top, bottom, tiles } = room;

      const topTiles = tiles[0];
      topTiles.forEach((tile, i) => {
        if (tile === 1 && i> 0 && i < right)
          this.groundLayer.putTileAt(5, i + left, top + 1);
      })

    }
}