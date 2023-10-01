export default class Exit extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "exit", options = {isStatic: true}) {
		super(scene.matter.world, x, y, texture, Phaser.Math.RND.pick([0,1]), options)
        this.scene = scene;
        this.label = "exit"
		scene.add.existing(this)

        this.init();
	}

    init () {
        this.scene.anims.create({
            key: this.label,
            frames:  this.scene.anims.generateFrameNumbers(this.label, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.play(this.label, true);
    }

    destroy() {
        // this.tween.stop();
        super.destroy();
    }
}