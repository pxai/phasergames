class Star extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, color, velocityX = 0, velocityY = 0) {
        super(scene, x, y, "star");
        this.scene = scene;
        this.x = x;
        this.y = y;

        const colors = [ 0xffffff, 0x64a7bd, 0x3e6875];
        this.color = color || colors[Phaser.Math.Between(0, 2)];
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setVelocityX(velocityX)
        this.body.setVelocityY(velocityY)
        this.setTint(this.color);
        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(500, 800),
            scale: { from: 1.5, to: 0 },
            onComplete: () => { this.destroy();}
        });
    }
}

export default Star;