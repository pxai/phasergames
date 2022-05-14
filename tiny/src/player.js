import { Particle } from "./particle";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 100) {
        super(scene, x, y, "spider")
        this.name = "spider";
        this.setOrigin(0)
        this.setScale(0.8)
        scene.add.existing(this)
        scene.physics.add.existing(this);
      
        this.body.setBounce(1)
        this.body.setAllowGravity(false);
        this.body.setVelocityY(velocity)
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
    }
  
    update() {
        if (this.scene?.gameOver) return;
        if (Phaser.Math.Between(0,5)> 4)
            this.scene && this.scene.trailLayer.add(new Particle(this.scene, this.x, this.y, 0xffffff, 4, false));
    }

    changeDirection(x, y, block) {
        const dirX = this.body.velocity.x > 0 ? 1 : -1;
        const dirY = this.body.velocity.y > 0 ? 1 : -1;
        if (y > 0) {
            this.y += 16;
            this.x = block.x - 16;
        } else if (y < 0) {
            this.y -= 16;
            this.x = block.x - 16;
        } 

        if (x > 0) {
            this.x += 16;
            this.y = block.y - 16;
        } else if (x < 0) {
            this.x -= 16;
            this.y = block.y -16;
        }
        this.body.setVelocity(x, y)
    }
  }