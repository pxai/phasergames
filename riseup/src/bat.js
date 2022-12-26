export default class Bat extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type="right") {
        super(scene, x, y, "bat");
        this.name = "bat";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.add.existing(this);
        this.direction = type === "right" ? 1 : -1;

        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: this.name + "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 2, end: 5 }),
            frameRate: 5,
          });
  
          this.anims.play(this.name, true)
          this.body.setVelocityX(this.direction * 150);
          this.flipX = this.direction > 0;
          this.on('animationcomplete', this.animationComplete, this);
    }


    update () {
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction > 0;
        this.body.setVelocityX(this.direction * 150);
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        this.anims.play(this.name + "death")
      }

      animationComplete(animation, frame) {
        if (animation.key === this.name +"death") {
          this.destroy()
        }
    }
}

