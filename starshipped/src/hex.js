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
        /*this.scene.tweens.addCounter({
            from: 255,
            to: 0,
            duration: 5000,
            repeat: -1
            onUpdate: function (tween)
            {
                this.tint = Phaser.Math.Between(0xaede01, 0x01aede)
            }
        });*/
       this.tween = this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(10000, 30000),
            tint: {from: 0x494d7e, to: 0x494d9f},
            repeat: -1,
            ease: 'Linear',
        })
    }
}

export default Hex;