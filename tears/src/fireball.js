import { Particle } from "./particle";

export default class Fireball extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, color = 0xffffff, size = 15) {
        super(scene, x, y, "fireball")
        this.name = "fireball";
        scene.add.existing(this)
        scene.physics.add.existing(this);
      
        this.body.setBounce(1)
        this.body.setAllowGravity(false);
        this.init();
    }
    
    init () {
        this.scene.events.on("update", this.update, this);
        this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 0.9, to: 1},
            repeat: -1
        });
        this.scene.time.delayedCall(5000, () => {this.destroy()}, null, this)
    }
  
    update() {
        if (this.scene?.gameOver) return;
        if (Phaser.Math.Between(0,5)> 4)
            this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0xffffff, 4, false));
    }
  }