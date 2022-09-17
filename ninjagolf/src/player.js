
import { JumpSmoke, RockSmoke, Particle } from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10, tnt = 1, velocity = 200, remote = false) {
        super(scene, x, y, "player")
        this.setOrigin(0.5)
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.right = true;
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
        this.body.setSize(20, 30)
        this.init();
        this.jumping = false;
        this.flashing = false;
        this.falling = false;
        this.casting = false;
        this.finished = false;
        this.walkVelocity = velocity;
        this.jumpVelocity = -400;
        this.hasKey = false;

        this.health = health;

        this.dead = false;

        this.R = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.scene.events.on("update", this.update, this);
    }

    init () {

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.play("playeridle", true);

        this.on('animationcomplete', this.animationComplete, this);

        this.on('animationupdate', this.animationUpdate, this);
    }    

    update () {
        if (this.scene?.gameOver || this.dead || this.finished) return;
        if (Phaser.Input.Keyboard.JustDown(this.R)) {
            this.scene.restartScene();
        }
    }
    

    hitSmoke (offsetY = -32, offsetX) {
        Array(Phaser.Math.Between(8, 14)).fill(0).forEach(i => {
            const varX = Phaser.Math.Between(-10, 10);
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

        if (animation.key === "playerspell") {
            this.anims.play("playeridle", true)
            this.casting = false;
        }
    }

    animationUpdate (animation, frame) {
        if(animation.key === "playerwalk") {
            this.scene.playRandom("step", Phaser.Math.Between(2, 7) / 10);
            new JumpSmoke(this.scene, this.x, this.y + Phaser.Math.Between(10, 15))
        }
    }

    hitFloor() {
        if (this.jumping) {
            ////this.scene.playAudio("ground")

            this.jumping = false;
        }
    }

    die (shake=100) {
        this.scene.playAudio("death");
        this.scene.cameras.main.shake(shake)
        this.dead = true;
        this.anims.play("playerdead", true);

        this.body.moves = false;
        this.scene.time.delayedCall(2000, () => this.scene.restartScene(), null, this);
    }


    flashPlayer () {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            alpha: { from: 0.0, to: 1},
            repeat: 10,
            onComplete: () => {
                this.flashing = false;
            }
        });
    }

}

export default Player;
  