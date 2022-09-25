class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "flag") {
        super(scene, x + 16, y + 16, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
        this.body.moves = false;
        this.disabled = false;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames:  this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.play(this.name, true);
    }
}

export default Exit;
