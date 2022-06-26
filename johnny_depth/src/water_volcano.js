
import Fireball from "./fireball";
import { RockSmoke } from "./particle";
import Bubble from "./bubble";

export default class WaterVolcano extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "water_volcano") {
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
                this.shotBubbles();
                this.setScale(1)

            }
        });
    }

    shotBubbles() {
        Array(Phaser.Math.Between(5, 10)).fill().forEach(i => {
            const bubble = new Bubble(this.scene, this.x + (Phaser.Math.Between(-10, 10)) , this.y - 16,  150, -1)
            bubble.body.setVelocityY(-150)
            this.scene.bubbles.add(bubble);
            this.scene.trailLayer.add(bubble);
        })
    }
}
