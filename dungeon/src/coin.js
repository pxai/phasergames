export default class Coin extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "coin", options = {isStatic: true}) {
		super(scene.matter.world, x, y, texture, 0, options)
        this.scene = scene;
        this.label = "coin"
		scene.add.existing(this)


        this.init();
	}

  /*

  */
    init () {
        this.scene.anims.create({
            key: this.label,
            frames: this.scene.anims.generateFrameNumbers(this.label, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.play(this.label, true)
        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 300,
            y: "-=5",
            repeat: -1,
            yoyo: true,
        })
    }

  /*

  */
    destroy() {
        this.tween.stop();
        super.destroy();
    }
}