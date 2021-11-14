import Dust from "./dust";

class Crab extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "crab", limited = true) {
        super(scene, x, y, name);
        this.scene = scene;
        this.setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(32, 20)
        this.jumping = false;
        this.right = true;
        this.limited = limited;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "crabjump",
            frames: this.scene.anims.generateFrameNumbers("crab", { start: 0, end: 0 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "crabfall",
            frames: this.scene.anims.generateFrameNumbers("crab", { start: 1, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "crabhit",
            frames: this.scene.anims.generateFrameNumbers("crab", { start: 2, end: 2 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.play("crabfall", true);
        this.on('animationcomplete', this.animationComplete, this);
    }

    update () {
        if (this.body.blocked.down) {
            this.anims.play("crabhit", true);
        } else if (this.body.velocity.y < 0) {
            this.anims.play("crabjump", true);
        } else {
            this.anims.play("crabfall", true)
        }
    }

    hitShell (shell) {
        console.log(this.body.speed)
        const score = Math.round(Math.abs(this.body.speed));
        this.showPoints(`+${score}`);
        this.scene.updateScore(score);
        const velocity = this.limited ? (this.body.speed > 330 ? -330 : -this.body.speed) : -330;
        this.body.setVelocityY(velocity);
        new Dust(this.scene, this.x, this.y, "0xede46e");
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x, this.y - 10, "wendy", score, 20, color).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 1000,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 10, to: this.y - 60},
            onComplete: () => {
                text.destroy()
            }
        });
    }

    hitGround () {
        this.body.setVelocityX(0);
        this.body.setVelocityY(-330);
        new Dust(this.scene, this.x, this.y, "0x902406")
    }

    hit (score = 0) {
        this.body.enable = false;
        this.body.stop();
        if (score !== 0) {
            this.showPoints(`${score}`);
            this.scene.updateScore(-1000);
        }

        new Dust(this.scene, this.x, this.y, "0x902406")
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            alpha: {from: 1, to: 0},
            onComplete: () => {
                this.restart();
            }
        });
    }

    redirect(velocityX) {
        this.body.setVelocityX(velocityX);
    }

    restart () {
        this.y = 200;
        this.body.enable = false;
        this.readyText = this.scene.add.bitmapText(this.x, this.y + 300, "arcade", "READY?", 30)
        this.scene.tweens.add({
            targets: [this, this.readyText],
            duration: 200,
            alpha: {from: 1, to: 0},
            repeat: 3,
            yoyo: true,
            onComplete: () => {
                this.body.enable = true;
                this.readyText.setText("");
            }
        });
    }

    animationComplete(animation, frame) {
        if (animation.key === "crabhit") {
            console.log("Change:");
            this.anims.play("crabjump", true)
        }
    }
}

export default Crab;