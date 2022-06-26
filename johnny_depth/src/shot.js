import { Particle } from "./particle";
import Bubble from "./bubble";

export default class Shot extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, scale = 0.7) {
        super(scene, x, y, "shot")
        this.name = "shot";
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.setScale(scale)
        this.body.setBounce(1)
        this.body.setAllowGravity(false);
        this.init();
    }
    
    init () {
        this.scene.events.on("update", this.update, this);
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: this.scale - 1, to: this.scale},
            repeat: -1
        });
        this.scene.time.delayedCall(5000, () => {this.destroy()}, null, this)
    }
  
    update() {
        if (this.scene?.gameOver) return;
        if (Phaser.Math.Between(0,5)> 4) {
            this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0x008722, 4, false));
            this.scene && this.scene.trailLayer.add(new Bubble(this.scene, this.x + (Phaser.Math.Between(-10, 10)) , this.y + (Phaser.Math.Between(-10, 10)),  50, 1))
        }

    }
  }