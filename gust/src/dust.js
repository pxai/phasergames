export class Dust extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, size = 1, tint) {
        super(scene, x, y, "dust");
        this.name = "dust";
        this.scene = scene;
        this.setOrigin(0.5)
        this.setScale(size)
        if (tint) this.setTint(tint)
        scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "dust",
            frames: this.scene.anims.generateFrameNumbers("dust", { start:0, end: 9 }),
            frameRate: 10,
        });

        this.anims.play("dust", true);

        this.scene.tweens.add({
            targets: this,
            duration: Phaser.Math.Between(600, 1000),
            y: { from: this.y, to: this.y - 32 },
            onComplete: () => { this.destroy() }
        });
    }
}

export class Explosion {
    constructor(scene, x, y, max = 10, tint) {

        Array(Phaser.Math.Between(3, max)).fill(0).forEach(i => {
            const offset = Phaser.Math.Between(-128, 128);
            const offsetY = Phaser.Math.Between(-64, 64);
            const size = Phaser.Math.Between(0.5, 1.5);
            new Dust(scene, x + offset, y + offsetY, size, tint)
        })
    }
}