class Little extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "little");
        this.setScale(0.7);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "little",
            frames: this.scene.anims.generateFrameNumbers("little", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.play("little", true)
    }
}

export default Little;