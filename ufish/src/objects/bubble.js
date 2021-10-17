class Bubble extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 1, direction) {
        super(scene, x, y, "bubble");
        this.name = "bubble";
        this.scene = scene;
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.direction = direction || Phaser.Math.Between(0, 1) ? -1 : 1;
        this.body.setVelocityY(this.direction * velocity);
        this.flipX = this.direction < 0;
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(600, 1000),
            y: {from: this.y, to: this.y + (this.direction * Phaser.Math.Between(20, 40))},
            scale: {from: Phaser.Math.Between(0.5, 1), to: 0.1},
            alpha: { from: 1, to: 0 },
            onComplete: () => { this.destroy() }
        });
    }
}

export default Bubble;
