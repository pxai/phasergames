class EndScreen extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y) {
        super(scene, x, y, 600, 20, 0xffffff);
        this.name = "end";
        this.scene = scene;
        this.setOrigin(0.5)
        this.setAlpha(0)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
}

export default EndScreen;
