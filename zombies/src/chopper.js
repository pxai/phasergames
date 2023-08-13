

class Chopper extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, "chopper");

        this.scene = scene;
        this.name = name;
        this.setScale(0.5)
        this.scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "chopper",
            frames: this.scene.anims.generateFrameNumbers("chopper", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.play("chopper", true);
    }
}

export default Chopper;
