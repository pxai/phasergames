export default class Explosion extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, shooter= "", scale = 1, sprite="shield") {
      super(scene, x, y, sprite)
      this.setOrigin(0.5)
      this.setScale(scale)
      this.scale = scale;
      this.scene = scene;
      this.name = sprite;
      this.shooter = shooter;

      this.scene.add.existing(this);
      scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.setCircle(32);
      this.init();
    }

    init() {
       // this.scene.playAudio("explosion", Phaser.Math.Between(10.0, 5.0)/10.0)
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
        this.scene.tweens.add({
            targets: this,
            duration: 3000,
            scale: "*=2",
        })
    }

    animationComplete (animation, frame) {
        if (animation.key === this.name) {
            this.destroy();
        }
    }
}