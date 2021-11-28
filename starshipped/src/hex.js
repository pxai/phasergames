class Hex extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, tween = true, colors = {from: 0x494d7e, to: 0x494d9f}) {
        super(scene, x, y, "hex");
        this.scene = scene;
        this.scene.add.existing(this)
        this.tint = Phaser.Math.Between(0x494d7e, 0x494d9f);
        this.colors = colors;
        this.setOrigin(0.5)
        this.init(tween);
    }

    init (tween) {
        if (!tween) return;

        this.scene.tweens.timeline({
            tweens: [{
                targets: this,
                duration: Phaser.Math.Between(1000, 5000),
                tint: {from: 0x494d7e, to: 0x494d9f},
                repeat: 3,
                ease: 'Linear',
            },{
                targets: this,
                duration: Phaser.Math.Between(10000, 20000),
                tint: {from: 0x494d7e, to: 0x494d9f},
                repeat: -1,
                ease: 'Linear',
            }]
        })

    }
}

export default Hex;