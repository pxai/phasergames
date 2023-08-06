
import { JumpSmoke, RockSmoke, Particle } from "./particle";
import HealthBar from "./health_bar";

class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, side, name, health = 10, tnt = 1, velocity = 200, remote = false) {
        super(scene, x, y);

        this.scene = scene;
        this.side = side;
        this.name = name;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.sprite = this.scene.add.sprite(0, 0, "raistlin");
        this.sprite.setOrigin(0);
        this.add(this.sprite);

        this.nameText = this.scene.add.bitmapText(16, 40, "arcade", this.name, 10).setOrigin(0.5).setTint(0xffffff).setDropShadow(1, 1, 0x75b947, 0.7);
        this.add(this.nameText);

        this.right = true;
        this.sprite.flipX = side === "right";
        this.body.setAllowGravity(true);
        this.body.setSize(20, 30);
        this.body.setDrag(30)
        this.init();
        this.kills = [];

        this.flashing = false;
        this.falling = false;
        this.casting = false;
        this.finished = false;
        this.walkVelocity = velocity;

        this.range = 10;
        this.mana = 10;
        this.level = 1;
        this.health = health;
        this.healthBar = new HealthBar(this, -20, 46, 10);
        this.add(this.healthBar.bar);

        this.dead = false;
        this.jumpSmoke()
        this.scene.events.on("update", this.update, this);
    }

    init () {
        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 1, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 1, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 3, end: 4 }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 5, end: 5 }),
            frameRate: 1
        });

        this.scene.anims.create({
            key: "playerfall",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 6, end: 6 }),
            frameRate: 1
        });

        this.scene.anims.create({
            key: "playerspell",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 7, end: 8 }),
            frameRate: 10,
            repeat: 2
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 9, end: 14 }),
            frameRate: 5
        });

        this.sprite.anims.play("startidle", true);

        this.sprite.on("animationcomplete", this.animationComplete, this);

        this.sprite.on("animationupdate", this.animationUpdate, this);
    }

    update () {
        if (this.scene?.gameOver || !this.active || this.dead || this.finished) return;
        // this.jumpSmoke();
        // this.landSmoke();

        if (!this.casting) this.anims?.play("playeridle", true);
        if (this.y > this.scene.height) {
            this.die()
        }
    }

    landSmoke () {
        this.jumpSmoke(20);
    }

    jumpSmoke (offsetY = 10, varX) {
        Array(Phaser.Math.Between(6, 12)).fill(0).forEach(i => {
            const offset = varX || Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
            varX = varX || Phaser.Math.Between(0, 64);
            new JumpSmoke(this.scene, this.x + (offset * varX), this.y + (offset * varX));
        });
    }

    hitSmoke (offsetY = -32, offsetX) {
        Array(Phaser.Math.Between(8, 14)).fill(0).forEach(i => {
            const varX = Phaser.Math.Between(-10, 10);
            new JumpSmoke(this.scene, this.x + (offsetX + varX), this.y + offsetY);
        });
    }

    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.sprite.anims.play("playeridle", true);
        }

        if (animation.key === "playerspell") {
            this.sprite.anims.play("playeridle", true);
            this.casting = false;
        }
    }

    animationUpdate (animation, frame) {
        if (animation.key === "playerwalk") {
            this.scene.playRandom("step", Phaser.Math.Between(2, 7) / 10);
            new JumpSmoke(this.scene, this.x, this.y + Phaser.Math.Between(10, 15));
        }
    }

    hit (points, shooter) {
        this.health -= points;
        if (this.health <= 0) {
            this.scene.addKill(this.name, shooter)
            this.die();
        }

        this.healthBar.decrease(points)
        this.scene.tweens.add({
          targets: this.healthBar.bar,
          duration: 1000,
          alpha: {
            from: 1,
            to: 0
          },
        });
    }

    die (shake = 100) {
        this.scene.playAudio("death");
        this.scene.cameras.main.shake(shake);
        this.dead = true;
        this.sprite.anims.play("playerdead", true);

        this.body.moves = false;
        this.scene.checkGameOver();
    }

    flashPlayer () {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            alpha: { from: 0.0, to: 1 },
            repeat: 10,
            onComplete: () => {
                this.flashing = false;
            }
        });
    }

    getInfo () {
        return {
            level: this.level,
            health: this.health,
            mana: this.mana,
            range: this.range,
        };
    }
}

export default Player;
