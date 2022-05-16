import { Particle, Wave } from "./particle";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, velocity = 100) {
        super(scene, x, y, "frog")
        this.name = "frog";
        this.setOrigin(0)
        this.setScale(0.8)

        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setSize(32, 32)
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
        this.scene.anims.create({
            key: "frog",
            frames: this.scene.anims.generateFrameNumbers("frog", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "frog2",
            frames: this.scene.anims.generateFrameNumbers("frog2", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
    
        this.anims.play("frog", true)
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
            this.anims.play("frog", true)
            this.flipY = false;
            this.waveSprite = 1;
            this.waveXOffset = 16;
            this.waveYOffset = -16;
        } else if ( this.body.velocity.y < 0) {
            this.anims.play("frog", true)
            this.flipY = true;
            this.waveSprite = 0;
            this.waveXOffset = 16;
            this.waveYOffset = 16;
        } 

        if ( this.body.velocity.x > 0) {
            this.anims.play("frog2", true)
            this.flipX = false;
            this.waveSprite = 2;
            this.waveYOffset = 16;
        } else if ( this.body.velocity.x < 0) {
            this.anims.play("frog2", true)
            this.flipX = true;
            this.waveSprite = 3;
            this.waveYOffset = 16;
        }
    }

    reverseDirection() {
        this.body.setVelocity(-this.body.velocity.x, -this.body.velocity.y)
    }

    changeDirection(x, y, block) {
        const dirX = this.body.velocity.x > 0 ? 1 : -1;
        const dirY = this.body.velocity.y > 0 ? 1 : -1;
        if (y > 0 && this.canMoveDown()) {
            this.anims.play("frog", true)
            this.flipY = false;
            this.y += 16;
            this.x = block.x - 16;
            this.waveSprite = 1;
            this.waveXOffset = 16;
            this.waveYOffset = -16;
        } else if (y < 0  && this.canMoveUp()) {
            this.anims.play("frog", true)
            this.flipY = true;
            this.y -= 16;
            this.x = block.x - 16;
            this.waveSprite = 0;
            this.waveXOffset = 16;
            this.waveYOffset = 16;
        } 

        if (x > 0 && this.canMoveRight()) {
            this.anims.play("frog2", true)
            this.flipX = false;
            this.x += 16;
            this.y = block.y - 22;
            this.waveSprite = 2;
            this.waveYOffset = 16;
        } else if (x < 0 && this.canMoveLeft()) {
            this.anims.play("frog2", true)
            this.flipX = true;
            this.x -= 16;
            this.y = block.y - 22;
            this.waveSprite = 3;
            this.waveYOffset = 16;
        }
        this.body.setVelocity(x, y)
    }

    canMoveDown(distance = 32) {
        const tile = this.scene.platform.getTileAtWorldXY(this.x, this.y + distance);

        return !tile;
      }
  
      canMoveUp(distance = 32) {
        const tile = this.scene.platform.getTileAtWorldXY(this.x, this.y - distance);

  
        return !tile;
      }
  
      canMoveLeft(distance = 32) {      
        const tile = this.scene.platform.getTileAtWorldXY(this.x - distance, this.y );

        return !tile;
      }
  
      canMoveRight(distance = 32) {
        const tile = this.scene.platform.getTileAtWorldXY(this.x + distance, this.y );

        return !tile;
      }
  }