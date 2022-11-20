export default class Explosion extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, scale = 1, sprite="explosion") {
      super(scene, x, y, sprite)
      this.setOrigin(0.5)
      this.setScale(scale)
      this.scene = scene;
      this.name = sprite;

      this.scene.add.existing(this);
      this.init();
    }

    init() {
        this.light = this.scene.lights.addLight(this.x, this.y, 50 * this.scale).setColor(0xffffff).setIntensity(3.0);
        this.scene.playAudio("explosion", Phaser.Math.Between(10.0, 5.0)/10.0)
        this.explosionAnimation = this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 8 }),
            frameRate: 20,
        });

        this.anims.play(this.name, true);


        this.kaboom();
        this.on('animationcomplete', this.animationComplete, this);
    }

    kaboom () {
       if (this.scene) {
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
        if (animation.key === this.name) {
            this.destroy();
        }
    }
}