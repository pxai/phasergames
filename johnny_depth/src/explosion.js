export default class Explosion extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, scale = 1) {
      super(scene, x, y, "explosion")
      this.setOrigin(0.5)
      this.setScale(scale)
      this.scene = scene;

      this.scene.add.existing(this);
      this.init();
    }

    init() {
        this.light = this.scene.lights.addLight(this.x - 16, this.y, 50).setColor(0xffffff).setIntensity(3.0);
 
        this.explosionAnimation = this.scene.anims.create({
            key: "explosion",
            frames: this.scene.anims.generateFrameNumbers("explosion", { start: 0, end: 8 }),
            frameRate: 20,
        });

        this.anims.play("explosion", true);


        this.kaboom();
        this.on('animationcomplete', this.animationComplete, this);
    }

    kaboom () {
       if (this.scene) {
           this.anims.play("explosion", true);
           this.scene.tweens.add({
            targets: this.light,
            duration: 300,
            intensity: {from: 3, to: 0},
            repeat: -1,
            yoyo: true
        })
           this.scene.tweens.add({
            targets: this,
            duration: 300,
            scale: {from: 1, to: 4},
             })
           this.scene.lights.removeLight(this.light);
       }
        
    }

    animationComplete (animation, frame) {
        if (animation.key === "explosion") {
            this.destroy();
        }
    }
}