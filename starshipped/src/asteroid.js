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
    }
}

export default Asteroid;