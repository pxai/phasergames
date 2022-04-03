import { Explosion } from "./steam";

export default class Lamp extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, direction = 1) {
      super(scene, x, y, "lamp")
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
            key: "lamp",
            frames: this.scene.anims.generateFrameNumbers("lamp", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.light = this.scene.lights.addLight(this.x - 16, this.y, 50).setColor(0xffffff).setIntensity(3.0);
 
        this.anims.play("lamp", true);
        this.scene.tweens.add({
            targets: [this, this.light],
            duration: 100,
            intensity: {from: 3, to: 0},
            repeat: -1,
            yoyo: true
        })
    }

    destroy () {
        this.scene.lights.removeLight(this.light);
        super.destroy();
    }
}