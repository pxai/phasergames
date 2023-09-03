import { Particle } from "./particle";

export default class Fireball extends Phaser.Physics.Matter.Sprite  {
    constructor (scene, x, y, direction) {
        super(scene.matter.world, x, y, "fireball", 0)
        this.label = "fireball";
        this.scene = scene;
        this.direction = direction
        scene.add.existing(this)
        //scene.physics.add.existing(this);
      
        this.setIgnoreGravity(true)
        this.setVelocityX(5 * this.direction);
        this.setVelocityY(Phaser.Math.Between(0, -8));
        this.setBounce(1)
        this.init();
    }
    
    init () {
        this.scene.events.on("update", this.update, this);
        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 200,
            scale: {from: 0.9, to: 1},
            repeat: -1
        });
        this.scene.time.delayedCall(5000, () => {this.destroy()}, null, this)
    }
  
    update() {
        if (this.scene?.gameOver) return;
        //if (Phaser.Math.Between(0,5)> 4)
           // this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0xffffff, 4, false));
    }

    death () {
        this.destroy();
    } 

    destroy () {
        this.tween.destroy();
        super.destroy();
    }
  }