import Dust from "./dust";
import Bubble from "./bubble";

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
        this.debugTxt = this.scene.add.bitmapText(this.x, this.y - 10, "wendy", `x: ${this.x} y: ${this.y}`, 20, 0xffffff).setOrigin(0.5);

        this.on('animationcomplete', this.animationComplete, this);
    }

    update () {
        if (this.body.blocked.down) {
            this.anims.play("crabhit", true);
        } else if (this.body.velocity.y < 0) {
            this.anims.play("crabjump", true);
            new Bubble(this.scene, this.x, this.y + Phaser.Math.Between(-10, 10),  50, -1)    
            this.scene.blockCollider.active = false;
        } else {
            new Bubble(this.scene, this.x, this.y - Phaser.Math.Between(-10, 10),  50, -1)    
            this.anims.play("crabfall", true)
            this.scene.blockCollider.active = true;
        }
        this.debugPosition();
    }

    debugPosition () {
        this.debugTxt.setX(this.x + 30);
        this.debugTxt.setY(this.y - 20);
        this.debugTxt.setText(`x: ${Math.round(this.x)} y: ${Math.round(this.y)} speed: ${this.body.gravity.y}`)
    }

    hitShell (shell) {
        console.log(this.body.speed)
        const score = Math.round(Math.abs(this.body.speed));
        this.showPoints(`+${score}`);
        shell.body.enable = false;
        this.scene.updateScore(score);
        this.body.setVelocityY(this.calculateYHitVelocity());
        new Dust(this.scene, this.x, this.y, "0xede46e");
    }

    calculateXHitVelocity (shell) {
        if (this.limited) {
            return this.body.speed > 150 ? 150 : this.body.speed
        } else {
            const direction = (this.x - shell.x) < 8 ? -1 : 1;
            return direction * 150;
        }
    }

    calculateYHitVelocity () {
        return (this.limited)
            ? this.body.speed > 400 ? -400 : -this.body.speed
            : -400;
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "wendy", score, 20, color).setOrigin(0.5);
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
        this.body.setVelocityY(-400);
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

    redirect(shell) {
        this.body.setVelocityX(this.calculateXHitVelocity(shell));
    }

    restart () {
        const {x, y} = this.scene.midPoint;
        this.body.y = y
        this.y = y - 300
        this.body.enable = false;
        this.readyText = this.scene.add.bitmapText(this.x, this.y + 100, "arcade", "READY?", 30)
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
            this.anims.play("crabjump", true)
        }
    }
}

export default Crab;