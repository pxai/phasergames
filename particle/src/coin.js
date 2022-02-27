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

    destroy(picked = false) {
        this.delayBoom.destroy();
        super.destroy();
    }
}