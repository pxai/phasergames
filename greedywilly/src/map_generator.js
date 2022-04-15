import Chest from "./chest";
import Exit from "./exit";


export default class MapGenerator {
    constructor (scene) {
        this.scene = scene;
    }

    createMap() {
        this.scene.chests = this.scene.add.group();
        this.scene.golds = this.scene.add.group();
        this.scene.exits = this.scene.add.group();
        this.scene.totalRooms = Phaser.Math.Between(4, 10);
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tilemap/#map
        this.scene.map = this.scene.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 300, height: 300});
        this.scene.brickTiles = this.scene.map.addTilesetImage('cave');
  
        this.scene.background = this.scene.map.createBlankLayer('background', this.scene.brickTiles).setPipeline('Light2D');
        this.scene.layer0 = this.scene.map.createBlankLayer('layer0', this.scene.brickTiles).setPipeline('Light2D');
        // this.scene.layer1.randomize(0, 0, this.scene.map.width, this.scene.map.height, [ -1, 0, 12 ]);
        this.scene.finished = false;
        this.scene.rooms = 0;
        const positions = [{x: 10, y: 10}];
        let width, height;
        do {
          let {x, y} = positions[positions.length - 1];
          width = Phaser.Math.Between(10, 20)
          height = Phaser.Math.Between(8, 10);
          positions[positions.length - 1] = {...positions[positions.length - 1], width, height}
          let position = this.createSquare(0, x, y, width , height, 1, (this.scene.rooms === 0));
          this.createBackground(x, y, width , height)
          positions.push(position);
          this.scene.rooms++;
        } while(this.scene.rooms < this.scene.totalRooms)
        positions.pop();
        console.log(positions)
        this.scene.layer1 = this.scene.map.createBlankLayer('layer1', this.scene.brickTiles).setPipeline('Light2D');
        positions.forEach(position => {
          let {x, y, width, height} = position;
          this.createSquare(1, x + 1, y + 1, width - 2, height -2, 2)
          if (Phaser.Math.Between(1, 10)> 7) {
            this.scene.chests.add(new Chest(this.scene, (x * 32) + Phaser.Math.Between(160, 224), (y * 32) +  128))
          }
        });
        const {x, y} = positions.pop();
   
        this.scene.exits.add(new Exit(this.scene, (x * 32) + 128, (y * 32) + 128))
  
        
        this.scene.layer0.setCollisionByExclusion([-1]);
        this.scene.layer1.setCollisionByExclusion([-1]);
      }
  
      createBackground(x, y, width, height) {
        this.scene.map.setLayer(0)
        Array(height).fill(0).forEach((_,i) => {
          Array(width).fill(0).forEach((_,j) => {
            const tile = Phaser.Math.RND.pick([4, 5, 6, 7])
            this.scene.map.putTileAt(tile, x + j, y + i )
          })
        });
      }
  
      createSquare (tile, x, y, width, height, layer, first = false) {
        
        this.scene.map.setLayer(layer)
        const setTile = (tile, x, y, skip=false) => {
          if (skip && Phaser.Math.Between(0,5)>4) return;
          tile = Phaser.Math.RND.pick([0, 1, 2, 3])
          const t = this.scene.map.putTileAt(tile, x, y);
        }
        
        Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y));
        Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y + height - 1));
  
        if (layer === 1) {
          Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y - 2));
          Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y - 1));
          Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y));
          Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y + height - 1));

          Array(5).fill(0).forEach((_, j) => Array(width).fill(0).forEach((_,i) => setTile(tile, x + i, y + height + j)))
        }
  
        if (!layer === 1 && first) {
          Array(height).fill(0).forEach((_,i) => setTile(tile, x, y + i));
        } else if (layer === 2) {
          Array(height).fill(0).forEach((_,i) => setTile(tile, x - 1, y + i, true));
          Array(height).fill(0).forEach((_,i) => setTile(tile, x, y + i, true));
          Array(height).fill(0).forEach((_,i) => setTile(tile, x + width - 1, y + i, true));
          Array(height).fill(0).forEach((_,i) => setTile(tile, x + width, y + i, true));
        }
  
  
        const growingDirections = this.calculateGrowinOptions(x, y, width, height);
        const grow = Phaser.Math.RND.pick(growingDirections);
        return {
          "right": {x: x + width, y: y + Phaser.Math.Between(0, 5)},
          "left": {x: x - width, y},
          "up": {x, y},
          "down": {x: x, y: y + height },
        }[grow.orientation];
      }
  
      calculateGrowinOptions(x, y, width, height) {
        const result = [];
        result.push({ orientation: "right", width: 7, height: 7 } );
        return result;
      }
}