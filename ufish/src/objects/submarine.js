import Torpedo from "./torpedo";

class Submarine extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, scale = 0.7, shoot = true) {
        super(scene, x, y, "submarine");
        this.name = "submarine";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.setScale(scale)
        this.body.setAllowGravity(false);
        this.shoot = shoot;
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
          this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
        if (this.shoot && Phaser.Math.Between(1, 501) > 500) {
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

      animationComplete(animation, frame) {
        if (animation.key === "death") {
          this.destroy()
        }
    }
}

export default Submarine;
