import { RockSmoke } from "./particle";
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
        this.falling = false;
    }

    fall () {
        this.scene.tweens.add({
            targets: this,
            x: "+=1",
            yoyo: true,
            duration: 500,
            onComplete: () => {
                this.falling = true;
                this.body.setImmovable(false)
                this.body.setAllowGravity(true)
            }
        })
        this.scene.events.on("update", this.update, this);
    }

    update () {
        if (this.falling && Phaser.Math.Between(0, 10) > 9) {
            new RockSmoke(this.scene, this.x + 16, this.y)
        }
    }
}
