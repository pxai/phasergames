
import HealthBar from "./health_bar";

class Castle extends Phaser.GameObjects.Container {
    constructor (scene, x, y, side, name, health = 100, tnt = 1, velocity = 200, remote = false) {
        super(scene, x, y);

        this.scene = scene;
        this.side = side;
        this.name = name;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.sprite = this.scene.add.sprite(0, 0, "foe");
        this.sprite.setOrigin(0);
        this.sprite.setTint(Math.random() * 0xffffff);
        this.add(this.sprite);

        this.nameText = this.scene.add.bitmapText(16, 40, "mainFont", this.name, 10).setOrigin(0.5).setTint(0xffffff).setDropShadow(1, 1, 0x75b947, 0.7);
        this.add(this.nameText);

        this.right = true;
        this.sprite.flipX = side === "right";
        this.body.setAllowGravity(false);
       // this.init();


        this.health = health;
        this.healthBar = new HealthBar(this, 32, -32, 10);
        this.add(this.healthBar.bar);

        this.dead = false;

        this.scene.events.on("update", this.update, this);
    }

    init () {
        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("foe", { start: 1, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        this.sprite.anims.play("startidle", true);
    }

    update () {
        if (this.scene?.gameOver || !this.active || this.dead || this.finished) return;
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


    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.sprite.anims.play("playeridle", true);
        }

        if (animation.key === "playerspell") {
            this.sprite.anims.play("playeridle", true);
            this.casting = false;
        }
    }

    hit (points, shooter) {

        this.health -= points;
        if (this.health <= 0) {
            // this.scene.addKill(this.name, shooter)
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
}

export default Castle;
