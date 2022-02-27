import { Trail } from "./trail";

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "electron", limited = true) {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setCircle(16);

        this.body.setDrag(0.7)
        this.body.setBounce(1);
        this.jumping = false;
        this.right = true;
        this.limited = limited;
        this.life = 100;
        
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + "left",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 2, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + "right",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 4, end: 5 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.play(this.name, true);
        this.up();
        this.on('animationcomplete', this.animationComplete, this);
    }

    up () {
        if (this.upTween) return;
        this.upTween = this.scene.tweens.add({
            targets: this,
            duration: 200,
            yoyo: true,
            scaleY: {from: 1, to: 0.8},
            repeat: -1
        })
    }

    sides () {
        if (this.upTween) { this.upTween.stop(); this.upTween = null };
        if (this.sideTween) return;
        this.sideTween = this.scene.tweens.add({
            targets: this,
            duration: 200,
            yoyo: true,
            scaleX: {from: 1, to: 0.8},
            repeat: -1
        })
    }

    attract(atractor) {
        const distance = Phaser.Math.Distance.BetweenPoints(this, atractor) / 100;
        atractor.showPoints("+" + Math.abs(Math.round(1/distance * 100)), 0xd5896f)
        this.scene.physics.moveTo(this, atractor.x, atractor.y, 300 / distance);
        this.addFancyLine(this.x, this.y, atractor.x, atractor.y, 0xd5896f, distance * 100, "particle4");
    }   

    repel(atractor) {
        const distance = Phaser.Math.Distance.BetweenPoints(this, atractor) / 100;
        atractor.showPoints("-" + Math.abs(Math.round(1/distance * 100)), 0x04395e)
        this.scene.physics.moveTo(this, atractor.x, atractor.y, -300 / distance);
        this.addFancyLine(this.x, this.y, atractor.x, atractor.y, 0x04395e, distance * 100);
    }

    addFancyLine (x1, y1, x2, y2, color, distance, particle = "particle3") {
        const graphics = this.scene.add.graphics({ fillStyle: { color }});
        const line = new Phaser.Geom.Line(x1, y1, x2, y2);
        const points = line.getPoints(distance);

        for (let i = 0; i < points.length; i++) {
            let p = points[i];
            if (Phaser.Math.Between(0, 11) > 10)
                this.scene.trailLayer.add(new Trail(this.scene, p.x, p.y, particle))
        }
    }
    addLine (x1, y1, x2, y2, color) {
        const graphics = this.scene.add.graphics();
        this.scene.trailLayer.add(graphics)
        graphics.lineStyle(8, color);
        const line = graphics.lineBetween(x1, y1, x2, y2);
        console.log(line, graphics.stroke())
        this.scene.tweens.add({
            targets: line,
            alpha: {from: 1, to: 0},
            duration: 500,
            onComplete: () => { line.destroy() }
        })
    }

    update () {
        if (Phaser.Math.Between(0, 6) > 5)
            this.scene.trailLayer.add(new Trail(this.scene, this.x, this.y + 8, "particle3", -this.body.velocity.x, this.body.velocity.y === 0 ? 300 : -this.body.velocity.y))
        
        if (this.body.velocity.x < 0) {
            this.anims.play(this.name + "left", true);
            this.sides();
        } else if (this.body.velocity.x > 0) {
            this.anims.play(this.name + "right", true);
            this.sides();
        } else {
            this.anims.play(this.name, true);
            this.up();
        }
    }

    hitShell (shell) {
        let score = Math.round(Math.abs(this.body.speed));
        this.showPoints(`+${score}`);

        shell.body.enable = false;
        if (this.scene.streak % 5 === 0) { 
            this.showStreakPoints(this.scene.streak);
            score = score * this.scene.streak;
        } 
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

    showStreakPoints (streak, color = 0x00ff00) {
        this.scene.playAudio("streak")
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "wendy", "BONUS x" + streak, 40, color).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 2000,
            alpha: {from: 1, to: 0},
            y: {from: this.y - 10, to: this.y - 100},
            onComplete: () => {
                text.destroy()
            }
        });
    }

    hitGround () {
        this.body.setVelocityX(0);
        this.body.setVelocityY(-400);
        new Dust(this.scene, this.x, this.y - 4, "0x902406")
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


    animationComplete(animation, frame) {
        if (animation.key === this.name + "hit") {
            this.anims.play(this.name + "jump", true)
        }
    }
}

export default Player;