class Thrust extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, side) {
        super(scene, x, y, "thrust");
        this.scene = scene;
        this.setOrigin(0.5)
        if (side === "up") this.angle = 180;
        if (side === "left") this.angle = 90;
        if (side === "right") this.angle = -90;
        
        scene.add.existing(this);
        //this.play("thrust", true)
        this.scene.tweens.add({
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
        });

        setTimeout(() => this.destroy(), 1000);
    }
}

export default Thrust;
