
import Blow from "./blow";
import Brick from "./brick";
import { JumpSmoke, RockSmoke } from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10) {
      super(scene, x, y, "walt")
      this.setOrigin(0.5)
      this.setScale(0.5)
      this.scene = scene;

      this.scene.add.existing(this);

      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.right = true;
      if (health > 0) {
        this.scene.physics.add.existing(this);
        this.body.setGravityY(100)
        this.body.setSize(48, 60)
      }
      this.init();
      this.jumping = false;
      this.building = false;
      this.falling = false;
      this.mjolnir = false;
      this.walkVelocity = 200;
      this.jumpVelocity = -400;
      this.invincible = false;

      this.health = health;

      this.dead = false;

      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.R = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    init () {

        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 4, end: 4 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 11, end: 16 }),
            frameRate: 5,
        });

        this.anims.play("startidle", true);

        this.on('animationcomplete', this.animationComplete, this);
    }    
  

    update () {
        if (this.dead) return;
        if (this.jumping ) {
           // if (Phaser.Math.Between(1,101) > 100) new Star(this.scene, this.x, this.y + 5)
            if (this.body.velocity.y >= 0) {
                this.body.setGravityY(700)
                this.falling = true;
            }
        }
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if ((Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) && this.body.blocked.down) {
            // new Dust(this.scene, this.x, this.y)
            this.building = false;
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setGravityY(400)
            this.anims.play("playerjump", true);
            this.scene.playAudio("jump")
            this.jumping = true;
            this.jumpSmoke();

        } else if (this.cursor.right.isDown || this.D.isDown) {
            this.building = false;
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(this.walkVelocity);

        } else if (this.cursor.left.isDown || this.A.isDown) {
            this.building = false;
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = false;
            this.flipX = true;
            this.body.setVelocityX(-this.walkVelocity);  

        } else {
            if (this.body.blocked.down) { 
                if (this.jumping) {this.scene.playAudio("land");this.landSmoke();}
                this.jumping = false;
                this.falling = false;

                if (!this.building)
                    this.anims.play("playeridle", true); 
            }

            this.body.setVelocityX(0)
        }

        if (this.R.isDown) {
            this.scene.rebuildScene();
        }
    }

    landSmoke () {
        this.jumpSmoke(20);
    }

    jumpSmoke (offsetY = 10, varX) {
        Array(Phaser.Math.Between(3, 6)).fill(0).forEach(i => {
            const offset = varX || Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
            varX = varX || Phaser.Math.Between(0, 20);
            new JumpSmoke(this.scene, this.x + (offset * varX), this.y + offsetY)
        })
    }

    buildSmoke (offsetY = 10, offsetX) {
        Array(Phaser.Math.Between(8, 14)).fill(0).forEach(i => {
            const varX = Phaser.Math.Between(-20, 20);
            new JumpSmoke(this.scene, this.x + (offsetX + varX), this.y + offsetY)
        })
    }
    

    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.anims.play("playeridle", true)
        }

        if (animation.key === "playerwalk") {
            this.scene.playAudioRandomly("step", Phaser.Math.Between(2, 7) / 10);
            new JumpSmoke(this.scene, this.x, this.y + 10)
        }
    }

    hitFloor() {
        if (this.jumping) {
            ////this.scene.playAudio("ground")

            this.jumping = false;
        }
    }

    hit () {
        this.health--;
        this.anims.play("playerdead", true);
        this.body.enable = false;
        if (this.health === 0) {
            this.die();
        }

    }

    die () {
        this.dead = true;
        this.scene.cameras.main.shake(100);
        this.anims.play("playerdead", true);
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.restartScene();
    }


    applyPrize (prize) {
        switch (prize) {
            case "speed":
                    this.walkVelocity = 330;
                    this.flashPlayer();
                    break;
            case "hammer":
                    this.mjolnir = true;
                    this.flashPlayer();
                    break;
            case "boots":
                    this.jumpVelocity = -600;
                    this.flashPlayer();
                    break;
            case "coin":
                    this.scene.updateCoins();
                    break;
            case "star":
                    this.invincible = true;
                    this.scene.tweens.add({
                        targets: this,
                        duration: 300,
                        alpha: {from: 0.7, to: 1},
                        repeat: -1
                    });
                    break;
            default: break;
        }
    }

    flashPlayer () {
        this.scene.tweens.add({
            targets: this,
            duration: 50,
            scale: { from: 1.2, to: 1},
            repeat: 10
        });
    }

}

export default Player;
  