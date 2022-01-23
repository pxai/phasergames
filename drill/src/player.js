import { Smoke } from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
      super(scene, x, y, "player")
      this.setOrigin(0.5)
      this.setScale(0.7)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.setAllowGravity(false);
      this.body.collideWorldBounds = true;
      this.body.setSize(60, 60)
      this.cursor = this.scene.input.keyboard.createCursorKeys();

      this.init();
      this.drilling = false;
      this.drillTime = 0;
      this.health = 10;
      this.attack = 1;
      this.velocity = 100;
      this.body.setGravity(100);
    }

    init () {
        this.scene.anims.create({
            key: "idledown",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end:1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drilldown",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "idleup",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drillup",
            frames: this.scene.anims.generateFrameNumbers("player", { start:4, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "idleleft",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 8, end: 9 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drillleft",
            frames: this.scene.anims.generateFrameNumbers("player", { start:8, end: 11 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "idleright",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 12, end: 13 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "drillright",
            frames: this.scene.anims.generateFrameNumbers("player", { start:12, end: 15 }),
            frameRate: 5,
            repeat: -1
        });

        this.last = "down";
        this.anims.play("idledown", true);

        this.on('animationcomplete', this.animationComplete, this);

    }    
  
    update (time, delta) {
        if (this.cursor.down.isDown) {
            this.body.setVelocityY(this.velocity);
            this.anims.play("drilldown", true);
            this.last = "down";
            this.drillTime += delta; 
            this.drilling = this.drillTime > 100;
            if (Phaser.Math.Between(0, 3) > 2) new Smoke(this.scene, this.x, this.y - 32)
        } else if (this.cursor.up.isDown) {
            this.body.setVelocityY(-this.velocity);
            //this.anims.play("playerjump", true);
            //this.scene.playAudio("jump")
            this.anims.play("drillup", true);
            this.last = "up";
            this.drillTime += delta; 
            this.drilling = this.drillTime > 100;
            if (Phaser.Math.Between(0, 3) > 2)new Smoke(this.scene, this.x, this.y + 32)
        } else if (this.cursor.right.isDown) {
            this.body.setVelocityX(this.velocity);
            this.anims.play("drillright", true);
            this.last = "right";
            this.drillTime += delta; 
            this.drilling = this.drillTime > 100;
            if (Phaser.Math.Between(0, 3) > 2)new Smoke(this.scene, this.x - 32, this.y + Phaser.Math.Between(10, 16))
        } else if (this.cursor.left.isDown) {
            this.body.setVelocityX(-this.velocity);
            this.anims.play("drillleft", true);
            this.last = "left";
            this.drillTime += delta; 
            this.drilling = this.drillTime > 100;
            if (Phaser.Math.Between(0, 3) > 2)new Smoke(this.scene, this.x + 32, this.y + Phaser.Math.Between(10, 16))
        } else {
            this.body.setVelocity(0);
            this.anims.play("idle" + this.last, true);
            this.drillTime = 0; 
            this.drilling = false;
        }

     }


    animationComplete (animation, frame) {
        if (animation.key === "playercast" + this.number) {
            this.casting = false;
            this.anims.play("playeridle" + this.number, true);
            this.scene.playAudio("cast2")
        }

        if (animation.key === "playerdead" + this.number) {
            this.scene.scene.start('game_over')
        }
    }

  }

export default Player;
  