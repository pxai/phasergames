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
      this.wick = this.scene.sound.add("wick");
      this.wick.play();
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
 
        this.explosionAnimation = this.scene.anims.create({
            key: "explosion",
            frames: this.scene.anims.generateFrameNumbers("explosion", { start: 0, end: 8 }),
            frameRate: 20,
        });

        this.scene.time.delayedCall(2000, () => this.kaboom(), null, this);
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

        this.on('animationcomplete', this.animationComplete, this);
    }

    kaboom () {
       if (this.scene) {
           this.wick.stop();
           this.anims.play("explosion", true);
           this.scene.tweens.add({
            targets: this,
            duration: 300,
            scale: {from: 1, to: 4},
             })
           this.scene.lights.removeLight(this.light);
           this.scene.explosions.add(new Explosion(this.scene, this.x, this.y, Phaser.Math.Between(60, 95), Phaser.Math.Between(60, 95), this.chain))
       }
        
    }

    animationComplete (animation, frame) {
        if (animation.key === "explosion") {
            this.destroy();
        }
    }
}