class Cloud extends Phaser.GameObjects.Sprite {
    constructor (scene, x) {
        const finalX = x || scene.physics.world.bounds.width;
        const y = Phaser.Math.Between(0, 400);
        super(scene, finalX, y, "cloud")
        const alpha = 1/Phaser.Math.Between(1, 3)
        this.setAlpha(alpha)
        this.setScale(alpha)
    }
}

export default Cloud;
