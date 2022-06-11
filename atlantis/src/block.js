export default class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = 0) {
        super(scene, x, y , name);
        this.setOrigin(0)
        this.scene = scene;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.fall()
    }

    fall () {
        this.scene.tweens.add({
            targets: this,
            x: "+=1",
            yoyo: true,
            duration: 500,
            onComplete: () => {
                this.body.setImmovable(false)
                this.body.setAllowGravity(true)
            }
        })
    }
}
