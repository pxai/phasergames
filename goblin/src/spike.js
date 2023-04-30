import { Debris } from "./particle";

class Spike extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="spike", rotation = 55, still = true) {
        super(scene, x, y - 32, name);
        this.scene = scene;
        this.name = name;

        this.setOrigin(0, 0)
        this.rotation = +rotation;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        if (still) {
          this.body.immovable = true;
          this.body.moves = false;
        } else {
          this.setScale(0.8)
          this.body.setSize(16, 64)
        }
     }
   }
  
  
  export default Spike;