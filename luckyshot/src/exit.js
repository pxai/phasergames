export default class Exit extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, texture = "bell", options = {isStatic: true}) {
		super(scene.matter.world, x, y, texture, Phaser.Math.RND.pick([0,1]), options)
        this.scene = scene;
        this.label = "bell"
		scene.add.existing(this)

        this.init();
	}

    init () {
        this.scene.anims.create({
            key: this.label,
            frames:  this.scene.anims.generateFrameNumbers(this.label, { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    hit () {
        this.anims.play(this.label, true);
    }
}