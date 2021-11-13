class Sand extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, move, color = 0xede46e) {
        super(scene, x + move, y, 4, 4, color);
        this.name = "sand";
        this.scene = scene;
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.direction = move > 0 ? 1 : -1;
        this.body.setVelocityX(this.direction * Phaser.Math.Between(15, 25))

        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(300, 400),
            alpha: { from: 1, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export default Sand;
