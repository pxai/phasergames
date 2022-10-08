
import { JumpSmoke, RockSmoke } from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10) {
      super(scene, x, y, "warrior")
      this.setOrigin(0.5)
      this.scene = scene;

      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.right = true;
      this.body.setAllowGravity(false);
      this.walkVelocity = 200;

      this.invincible = false;

      this.health = health;

      this.dead = false;

      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }  
  
    update () {
        if (this.dead) return;

        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if (this.cursor.up.isDown || this.W.isDown) {
            this.y -= 32;
        } else if (this.cursor.right.isDown || this.D.isDown) {
            this.x += 32;
        } else if (this.cursor.left.isDown || this.A.isDown) {
            this.x -= 32;
        } else if (this.cursor.down.isDown || this.S.isDown) {
            this.y += 32;
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
  