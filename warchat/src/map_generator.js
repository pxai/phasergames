import Brick from './brick.js';

export default class MapGenerator {
  constructor (scene) {
    this.scene = scene;
    this.tileSize = 32;
    this.totalColumns = this.scene.width / this.tileSize;
    this.columnCount = 0;
    this.maxHeight =  Phaser.Math.Between(this.scene.height/4, this.scene.height/3);
    this.heightCount = this.maxHeight;
    //this.generate();

    this.generateFalling();
  }

  generate () {
    const landscape = this.generateRandomLandscape(this.scene.height/2, this.totalColumns)

    for(let i = 0; i < landscape.length; i++) {
      for(let j = 0; j < landscape[i].length; j++) {
        if (landscape[i][j] === 1) {
          const brick = new Brick(this.scene, j * this.tileSize, i * this.tileSize, "bricks");
          this.scene.bricks.add(brick);
        }
      }
    }

    // for(let i = 0; i < this.scene.width; i += 32) {
    //   for(let j = this.scene.height; j > this.scene.height/2; j -= 32) {
    //     console.log("Generated: ", i , j)
    //     const brick = new Brick(this.scene, i , j , "bricks");
    //     this.scene.bricks.add(brick);
    //   }
    // }
  }

  generateRandomLandscape(numRows, numCols) {
    const landscape = [];
    for (let y = 0; y < numRows; y++) {
      const row = [];
      for (let x = 0; x < numCols; x++) {
        row.push(Math.random() < 1 - (x*0.1) ? 1 : 0); // Adjust the threshold to control mountain density
      }
      landscape.push(row);
    }
    return landscape;
  }

  generateFalling () {
    this.scene.time.delayedCall(10, () => {
      console.log("Generated: ", this.columnCount, this.columnCount * this.tileSize)
      if (Phaser.Math.Between(0, this.heightCount) >= this.heightCount/2) {
        const brick = new Brick(this.scene, this.columnCount * this.tileSize, 0 + Phaser.Math.Between(-50, 50), "bricks");
        this.scene.bricks.add(brick);
      }
      this.columnCount++;
      if (this.heightCount === 0) {
        return;
      } else if (this.columnCount * this.tileSize < this.scene.width) {
        this.generate();
      } else {
        this.columnCount = 0;
        this.heightCount--;
        this.generate();
      }
    });
}
}