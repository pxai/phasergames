export default class Skeleton extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type="0") {
        super(scene, x, y, "skeleton");
        this.name = "skeleton";
        this.scene = scene;
        this.type = type;
        this.setOrigin(0);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.scene.add.existing(this);
        this.body.setImmovable(true)
        this.direction = 1;
        this.flipX = this.direction > 0;
        this.moveIt();
        this.setListeners();
        this.init();
        this.stopped = false;
    }

    setListeners () {
      this.setInteractive();
      this.on("pointerdown", (pointer) => {
        this.setTint(0x00ff00)
        this.stopIt();
      });
  
      this.on("pointerover", () => {
        this.setTint(0x3E6875);
        //this.setScale(1.1)
      });
  
      this.on("pointerout", () => {
        this.clearTint();
          //this.setScale(1)
          //if (!this.active) this.sprite.
      });
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: "ice",
            frames: this.scene.anims.generateFrameNumbers("ice", { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: this.name + "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 3, end: 5 }),
            frameRate: 5,
            repeat: -1
          });
  
          this.anims.play(this.name, true)

          this.flipX = this.direction > 0;
          this.on('animationcomplete', this.animationComplete, this);
    }

    stopIt() {
      if (this.stopped) {
        this.stopped = false;
        this.scene.playAudio("stone");
        this.moveIt();
        this.body.setImmovable(this.stopped)
        this.anims.play(this.name, true)
      } else {
        this.scene.playAudio("ice");
        this.stopped = true;
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
        this.body.setImmovable(this.stopped)
        this.anims.play("ice", true)
      }

    }

    moveIt() {
      if (this.type === "0") {
        this.body.setVelocityX(this.direction * 100);
      } else {
        this.body.setVelocityY(this.direction * 100);
      }
      
    }

    update () {
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction > 0;

        this.moveIt();
    }

    death () {
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        this.anims.play(this.name + "death")
      }

      animationComplete(animation, frame) {
        if (animation.key === "death") {
          this.destroy()
        }
    }
}

