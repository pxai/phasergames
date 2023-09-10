export default class key extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "keys", options = {isStatic: true}) {
		super(scene.matter.world, x, y, texture, Phaser.Math.RND.pick([0,1]), options)
        this.scene = scene;
        this.label = "keys"
		scene.add.existing(this)

        this.init();
	}

    init () {
        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 300,
            y: "-=5",
            repeat: -1,
            yoyo: true,
        })
    }

    destroy() {
        this.tween.stop();
        super.destroy();
    }
}