class Star extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, color = 0xffffff) {
        const finalX = x || scene.physics.world.bounds.width;
        const y = Phaser.Math.Between(0, 2000);
        const scale = Phaser.Math.Between(0, 5);
        const alpha = Phaser.Math.Between(0.4, 1)
        const rotation = Phaser.Math.Between(0, 1) >= 0.5 ? 0 : 45;
        super(scene, finalX, y, 2, 2, color, alpha).setScale(scale);
    }
}

export default Star;
