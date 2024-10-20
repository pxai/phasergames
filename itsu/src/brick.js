import { Debris } from "./particle";

class Brick extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="brick", type="", steps=0) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0, 0)
        this.type = type;
        this.steps = steps;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        if (!this.type)
         this.body.moves = false;
         if (this.type && this.steps) {
            this.body.setAllowGravity(false);
            this.setMove()
         }
     }

     setMove () {
      this.activated = true;
      this.direction = 1;
      if (this.type === "ver") {
         this.scene.time.addEvent({ delay: Phaser.Math.Between(200, 500) * this.steps, callback: () => {
            this.body.velocity.y = 100 * this.direction;
            this.direction *= -1;
         }, callbackScope: this, loop: true });
      } else if (this.type === "hor") {
         this.scene.time.addEvent({ delay: Phaser.Math.Between(300, 500) * this.steps, callback: () => {
            this.body.velocity.x = 100 * this.direction;
            this.direction *= -1;
         }, callbackScope: this, loop: true });
      }
    }
  }

  export default Brick;