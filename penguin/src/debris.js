export default class Debris extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, scale = 1) {
        super(scene, x, y , "block0");
        this.scale = scale;
        this.scene = scene;
        this.setScale(scale);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.tweens.add({
            targets: this,
            duration: 2000,
            scale: {from: this.scale, to: 0},
            onComplete: () => { this.destroy() }
        })
    }
}
