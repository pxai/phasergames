
import Fireball from "./fireball";
import { RockSmoke } from "./particle";
import Bubble from "./bubble";

export default class Volcano extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "volcano") {
        super(scene, x, y , name);
        this.setOrigin(0.5)
        this.scene = scene;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
        this.body.setImmovable(true)
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            scaleX: {from: this.scaleX - 0.1, to: this.scaleX},
            repeat: -1
        });
        this.scene.events.on("update", this.update, this);
    }

    update () {
        if (Phaser.Math.Between(0, 500) > 499) {
            this.shot()
        }
    }

    shot() {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            scale: {from: this.scale - 0.2, to: this.scale},
            repeat: 10,
            onComplete: () => {
                const fireball = new Fireball(this.scene, this.x, this.y - 32, 0)
                this.shotEffects();
                this.scene.volcanoShots.add(fireball)
                fireball.body.setVelocityY(-100);
                this.setScale(1)

            }
        });
    }

    shotEffects() {
        Array(Phaser.Math.Between(5, 10)).fill().forEach(i =>
            this.scene.trailLayer.add(new RockSmoke(this.scene, this.x, this.y, 0x008722, 4, false))
        )
        Array(Phaser.Math.Between(5, 10)).fill().forEach(i =>
            this.scene.trailLayer.add(new Bubble(this.scene, this.x + (Phaser.Math.Between(-10, 10)) , this.y + (Phaser.Math.Between(-10, 10)),  50, 1))
        )
    }
}
