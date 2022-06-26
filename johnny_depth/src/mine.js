
import { RockSmoke } from "./particle";
import Bubble from "./bubble";

export default class Mine extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "mine") {
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
