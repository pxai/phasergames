class Asteroid extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, tween = true) {
        super(scene, x, y, "asteroid");
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this)
        this.setOrigin(0.5)
        this.body.rotate = 14;
        this.body.setCircle(26);
        this.body.setOffset(6, 11)

        this.body.setVelocityX(Phaser.Math.Between(10, 100))
        this.body.setVelocityY(Phaser.Math.Between(10, 100))
    }
}

export default Asteroid;