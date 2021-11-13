class Seagull extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, scale = 0.7) {
        super(scene, x, y, "seagull");
        this.name = "seagull";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        //this.setScale(scale)
        this.body.setAllowGravity(false);
        this.body.setSize(64, 20)
        this.direction = -1;
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
          this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
          this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
    }

    turn () {
        this.flipX = this.direction < 0;
        this.direction = -this.direction;
        this.body.setVelocityX(this.direction * Phaser.Math.Between(150, 200));
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

export default Seagull;
