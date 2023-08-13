

class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, side, name) {
        super(scene, x, y);

        this.scene = scene;
        this.side = side;
        this.name = name;
        this.setScale(0.5)
        this.scene.add.existing(this);


        this.sprite = this.scene.add.sprite(0, 0, this.side);
        this.sprite.setOrigin(0);
        this.add(this.sprite);

        this.nameText = this.scene.add.bitmapText(16, 60, "mainFont", this.name, 20).setOrigin(0.5).setTint(0xffffff).setDropShadow(1, 1, 0x75b947, 0.7);
        this.add(this.nameText);

        this.right = true;
        this.sprite.flipX = side === "right";
        this.init();
        this.kills = [];

        this.flashing = false;
        this.marcoUsed = false;
        this.dead = false;
        this.scene.events.on("update", this.update, this);
    }

    init () {
        this.scene.anims.create({
            key: "startidlehuman",
            frames: this.scene.anims.generateFrameNumbers("human", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "startidlezombie",
            frames: this.scene.anims.generateFrameNumbers("zombie", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.sprite.anims.play("startidle" + this.side, true);
    }

    update () {
        if (this.scene?.gameOver || !this.active || this.dead || this.finished) return;
    }

    move (x, y) {
        console.log("Player: from: ", this.x, this.y, " to ", x, y )
        this.scene.tweens.add({
            targets: this,
            x: {from: this.x, to: x * 32},
            duration: 1000
        })
        this.scene.tweens.add({
            targets: this,
            y: {from: this.y, to: y * 32},
            duration: 1000
        })
    }

    die () {
        this.side = "zombie";
        this.sprite.anims.play("startidle" + this.side, true);
        this.scene.checkGameOver();
    }
}

export default Player;
