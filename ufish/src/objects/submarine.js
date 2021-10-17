import Torpedo from "./torpedo";

class Submarine extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name = "submarine", scale = 0.7) {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale)
        this.body.setAllowGravity(false);

        this.scene.add.existing(this);

        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play(this.name, true)
          this.body.setVelocityX(-Phaser.Math.Between(150, 200));
    }


    update () {
        if (Phaser.Math.Between(1, 101) > 100) {
            this.scene.torpedoesGroup.add(new Torpedo(this.scene, this.x, this.y))
        }
    }

    turn (direction) {
        this.flipX = direction > 0;
        this.body.setVelocityX(direction * Phaser.Math.Between(150, 200));
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        this.anims.play("death")
      }
}

export default Submarine;
