export default class Water extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = 0) {
        super(scene, x, y , "water");
        this.scene = scene;
        this.name = "water";
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        // #2f4f59
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "water",
            frames: this.scene.anims.generateFrameNumbers("water", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.play("water", true)
    }
}
