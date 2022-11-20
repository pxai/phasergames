import { Bubble } from "./bubble";
export default class Fish extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, type="right") {
        super(scene, x, y, "fish");
        this.name = "fish";
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
            frameRate: 3,
            repeat: -1
          });
  
          this.anims.play(this.name, true)
          this.body.setVelocityX(this.direction * 150);
          this.flipX = this.direction > 0;
          this.scene.events.on("update", this.update, this);
    }


    update () {
      if (!this.scene) return;
      if (Phaser.Math.Between(0, 5) > 4)
        this.scene.trailLayer.add(new Bubble(this.scene, this.x + (Phaser.Math.Between(-4, 4)) , this.y + (Phaser.Math.Between(-4, 4)),  50, 1, 600, 0x0099dc))
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction > 0;
        this.body.setVelocityX(this.direction * 150);
    }

    death () {
        this.destroy();
    }
}

