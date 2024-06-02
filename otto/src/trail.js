
export class Trail extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, tint=null, name="trail2") {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.setOrigin(0.5)
        if (tint)
            this.setTint(tint)
        scene.add.existing(this);
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start:0, end: 7 }),
            frameRate: 5,
        });

        this.anims.play(this.name, true);
        this.on('animationcomplete', this.animationComplete, this);
    }

    animationComplete () {
        this.destroy()
    }
}