import { Burst } from "./particle";

class Bubble extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 1, direction) {
        super(scene, x, y, "bubble");
        this.name = "bubble";
        this.scene = scene;
        this.setOrigin(0.5)
       // this.setScale(1.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true)
        this.body.setVelocityY(-50);
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 1.5, to: 1.6},
            yoyo: true,
            repeat: -1
        });
        this.scene.time.delayedCall(Phaser.Math.Between(3000, 10000), () => this.removeIt(), null, this)
        this.scene.events.on("update", this.update, this);
        this.scene.playRandom("bubble")
    }

    update () {
        if (this.scene && Phaser.Math.Between(0, 100) > 99) {
            this.scene.playRandom("bubble")
            new LittleBubble(this.scene, this.x, this.y + 32)
        }
    }

    removeIt () {
        new Burst(this.scene, this.x, this.y).setScale(this.scale)
        this.destroy();
    }
}

class LittleBubble extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 1, direction) {
        super(scene, x, y, "bubble");
        this.name = "bubble";
        this.scene = scene;
        this.setOrigin(0.5)
        this.setScale()
       // this.setScale(1.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setVelocityY(-5);
        this.scene.time.delayedCall(Phaser.Math.Between(300, 1000), () => this.removeIt(), null, this)
    }

    removeIt () {
        new Burst(this.scene, this.x, this.y).setScale(this.scale)
        this.destroy();
    }
}
export default Bubble;