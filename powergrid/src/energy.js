import EasyStar from "easystarjs";

class Energy extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, grid, name = "heart", color = "0xffffff") {
      super(scene, x, y, name);
      this.scene = scene;
      this.color = color;
      this.grid = grid;
      this.setOrigin(0)
      this.x = x;
      this.y = y;
      this.name = name;
      this.setTween();
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.immovable = true;
      this.body.moves = false;
      const potAnimation = this.scene.anims.create({
        key: this.name,
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }, ),
        frameRate: 5
      });
    this.play({ key: this.name, repeat: -1 });
    this.init();
   }

   init () {
    this.easystar = new EasyStar.js();
    this.easystar.setGrid(this.grid);
    this.easystar.setAcceptableTiles([0]);
   }

  updateGrid(grid) {
    this.grid = grid;
    this.easystar.setGrid(this.grid);
    this.easystar.setAcceptableTiles([0]);
  }

  setTween () {
    this.scene.tweens.add({
      targets: this,
      duration: 500,
      y: this.y - 20,
      repeat: -1,
      yoyo: true
    })  
  }

    searchPath (bulb) {
      try {
          if (this.moveTimeline) this.moveTimeline.destroy();

          this.easystar.findPath(Math.floor(this.x/32), Math.floor(this.y/32), Math.floor(bulb.x/32), Math.floor(bulb.y/32), (path) => this.checkPath(path, bulb));
          this.easystar.setIterationsPerCalculation(10000);
          this.easystar.enableSync();
          this.easystar.calculate();
      } catch (err) {
          console.log("Cant move yet: ", err)
      }
    }

    checkPath (path, bulb) {
      if (!path) {
        console.log("There is NO path for ", bulb)
        bulb.deactivate();
      } else {
        console.log("There is a PATH for ", bulb)
        bulb.activate();
      }
    }
}

export default Energy;
