import Fireball from "./fireball";

export default class Drone extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type="left") {
        super(scene, x, y, "drone");
        this.name = "drone";
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
          this.scene.events.on("update", this.update, this)
    }

    update () {
      super.update();

      if (Phaser.Math.Between(0, 500) > 499) {
          this.directShot()
      }
    }

  directShot() {
      if (!this?.scene?.player) return
      const distance = Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
      const fireball = new Fireball(this.scene, this.x, this.y + 16, 0)
      this.scene.playAudio("foeshot")
      this.scene.fireballs.add(fireball)
      this.scene.physics.moveTo(fireball, this.scene.player.x, this.scene.player.y, 100);
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

