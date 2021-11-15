class Bubble extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, velocity = 1, direction, color = 0x902406) {
        super(scene, x, y, 10, 10, color);
        this.name = "bubble";
        this.scene = scene;
        this.setOrigin(0.5);
        this.setAlpha(0.5);

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
            duration: 900,
        
            alpha: { from: 0.5, to: 0 },
            scale: { from: 1, to: 0},
            onComplete: () => { this.destroy() }
        });
    }
}

export default Bubble;
