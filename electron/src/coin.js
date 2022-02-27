import { Explosion } from "./trail";

export default class Coin extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, "coin");
        this.scene = scene;
        this.setScale(0.8);

        scene.add.existing(this);
        scene.physics.add.existing(this);
  
        this.body.immovable = true;
        this.body.moves = false;
    
        const coinAnimation = this.scene.anims.create({
            key: "coin",
            frames: this.scene.anims.generateFrameNumbers("coin", { start: 0, end: 13 }, ),
            frameRate: 8,
        });
        this.play({ key: "coin", repeat: -1 });
        this.delayBoom = this.scene.time.delayedCall(3000, () => {
            this.scene.playAudio("coinboom")
            new Explosion(this.scene, this.x, this.y, "coin");
            this.destroy();
        }, null, this)
    }

    showPoints () {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "visitor", "+1", 30).setDropShadow(0, 3, 0x222222, 0.9).setTint(0xffffff).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 800,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 20, to: this.y - 80},
            onComplete: () => {
                text.destroy()
            }
        });
    }


    destroy(picked = false) {
        this.delayBoom.destroy();
        super.destroy();
    }
}