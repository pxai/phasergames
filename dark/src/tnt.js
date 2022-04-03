import { Explosion } from "./steam";

export default class TNT extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, direction = 1) {
      super(scene, x, y, "tnt")
      this.setOrigin(0.5)
      this.setScale(0.5)
      this.scene = scene;

      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.chain = false;
      this.init();
    }

    init() {
        this.scene.anims.create({
            key: "tnt",
            frames: this.scene.anims.generateFrameNumbers("tnt", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.light = this.scene.lights.addLight(this.x - 16, this.y, 50).setColor(0xffffff).setIntensity(3.0);
 
  
        this.scene.time.delayedCall(3000, () => this.kaboom(), null, this);
        this.anims.play("tnt", true);
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            scale: {from: 0.4, to: 0.5},
            repeat: -1,
            yoyo: true
        })
        this.scene.tweens.add({
            targets: this.light,
            duration: 100,
            intensity: {from: 3, to: 0},
            repeat: -1,
            yoyo: true
        })
    }

    kaboom () {
       if (this.scene) {
           this.scene.lights.removeLight(this.light);
            this.scene.explosions.add(new Explosion(this.scene, this.x, this.y, Phaser.Math.Between(60, 95), Phaser.Math.Between(60, 95), this.chain))
       }
        this.destroy();
    }
}