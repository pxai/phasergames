import { Particle, Wave } from "./particle";

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
        this.body.setVelocityY(velocity);
        this.setWaveSprite();
        this.waveXOffset = 16;
        this.waveYOffset = 0;
        this.waveTime = 0;
        this.finished = false;
        this.init();
    }
    
    setWaveSprite () {
        this.waveSprite = 1;
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

    finish () {
       // this.finished = true;
        this.body.stop();
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            angle: "+=5",
            repeat: -1
        })
    }
  
    update(time, delta) {
        if (this.scene?.gameOver || this.finished) return;
        this.waveTime += delta;
        if (this.waveTime > 200) {
            this.waveTime = 0;
            this.scene && this.scene.trailLayer.add(new Wave(this.scene, this.x + this.waveXOffset, this.y + this.waveYOffset, this.waveSprite));
        }
    }

    directionChanged() {
        if ( this.body.velocity.y > 0) {
            this.waveSprite = 1;
            this.waveXOffset = 16;
            this.waveYOffset = -16;
        } else if ( this.body.velocity.y < 0) {
            this.waveSprite = 0;
            this.waveXOffset = 16;
            this.waveYOffset = 16;
        } 

        if ( this.body.velocity.x > 0) {
            this.waveSprite = 2;
            this.waveYOffset = 16;
        } else if ( this.body.velocity.x < 0) {
            this.waveSprite = 3;
            this.waveYOffset = 16;
        }
    }

    changeDirection(x, y, block) {
        const dirX = this.body.velocity.x > 0 ? 1 : -1;
        const dirY = this.body.velocity.y > 0 ? 1 : -1;
        if (y > 0) {
            this.y += 16;
            this.x = block.x - 16;
            this.waveSprite = 1;
            this.waveXOffset = 16;
            this.waveYOffset = -16;
        } else if (y < 0) {
            this.y -= 16;
            this.x = block.x - 16;
            this.waveSprite = 0;
            this.waveXOffset = 16;
            this.waveYOffset = 16;
        } 

        if (x > 0) {
            this.x += 16;
            this.y = block.y - 16;
            this.waveSprite = 2;
            this.waveYOffset = 16;
        } else if (x < 0) {
            this.x -= 16;
            this.y = block.y -16;
            this.waveSprite = 3;
            this.waveYOffset = 16;
        }
        this.body.setVelocity(x, y)
    }
  }