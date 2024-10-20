import { Debris } from "./particle";

class Spike extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="spike") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0, 1)

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(64, 20)
        this.body.immovable = true;
        this.body.moves = false;
     }
   }


  export default Spike;