
export class Trail extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, size = 1, alpha = 1, tint=null, shrinkY = true) {
        super(scene, x, y, "trail");
        this.name = "trail";
        this.scene = scene;
        if (!shrinkY)
            this.setRotation(Math.PI)
        this.alpha = alpha;
        this.setOrigin(0.5)
        if (tint)
            this.setTint(tint)
        this.setScale(size)
        scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "trail",
            frames: this.scene.anims.generateFrameNumbers("trail", { start:0, end: 7 }),
            frameRate: 5,
        });

        this.anims.play("trail", true);
        this.on('animationcomplete', this.animationComplete, this);
    }

    animationComplete () {
        this.destroy()
    }
}