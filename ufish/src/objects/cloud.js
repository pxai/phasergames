class Cloud extends Phaser.GameObjects.Sprite {
    constructor (scene, x) {
        const finalX = x || scene.physics.world.bounds.width;
        const y = Phaser.Math.Between(0, 400);
        const scale = Phaser.Math.Between(0, 1.2);
        const alpha = Phaser.Math.Between(0.8, 1)
        // const rotation = Phaser.Math.Between(0, 1) >= 0.5 ? 0 : 45;
        super(scene, finalX, y, "cloud").setAlpha(alpha).setScale(scale);
    }
}

export default Cloud;
