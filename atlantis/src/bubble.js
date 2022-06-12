class Bubble extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 1, direction) {
        super(scene, x, y, "bubble");
        this.name = "bubble";
        this.scene = scene;
        this.setOrigin(0.5)
       // this.setScale(1.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true)
        this.body.setVelocityY(-50);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 1.5, to: 1.6},
            yoyo: true,
            repeat: -1
        });
        this.scene.time.delayedCall(Phaser.Math.Between(3000, 10000), () => this.destroy(), null, this)
    }
}

export default Bubble;