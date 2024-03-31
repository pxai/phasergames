class Cloud extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        const finalX = x || scene.physics.world.bounds.width;
        const finalY = y - Phaser.Math.Between(50, 400);
        super(scene, finalX, finalY, "cloud" + Phaser.Math.Between(0, 7))
        const alpha = Phaser.Math.Between(1, 3)
        this.setAlpha(alpha)
        this.setScale(alpha)
    }
}

export default Cloud;
