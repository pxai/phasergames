
export class Dust extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, size = 1, alpha = 1, tint=null) {
        super(scene, x, y, "dust");
        this.name = "dust";
        this.scene = scene;
        this.alpha = alpha;
        this.setOrigin(0)
        if (tint)
            this.setTint(tint)
        this.setScale(size)
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