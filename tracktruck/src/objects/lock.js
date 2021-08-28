class Lock extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, side) {
        super(scene, x, y, "lock");
        this.scene = scene;
        this.setOrigin(0.5)
        if (side === "up") this.angle = 180;
        
        scene.add.existing(this);

        /*this.scene.tweens.add({
            targets: this,
            duration: 800,
            scale: {
              from: 1,
              to: 0
            },
            alpha: {
              from: 1,
              to: 0
            }
        });*/

        setTimeout(() => this.destroy(), 1000);
    }
}

export default Lock;
