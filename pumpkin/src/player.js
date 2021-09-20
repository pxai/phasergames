export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, name);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        this.body.setSize(32,64);
        this.hasKey = false;
        this.init();
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: "left",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 2, end: 4 }),
            frameRate: 2
        });

        this.scene.anims.create({
            key: "right",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 5, end: 7 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: "down",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 8, end: 9 }),
            frameRate: 2,
            repeat: -1
        });

        this.scene.anims.create({
            key: "up",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 10, end: 11 }),
            frameRate: 2,
            repeat: -1
        });

        this.on("animationupdate" , this.stepSound, this);

        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update () {
        if (this.cursors.left.isDown) {
            this.anims.play("left", true);
            this.setVelocityX(-20);
        } else if (this.cursors.right.isDown) {
            this.anims.play("right", true);
            this.setVelocityX(20);
        } else if (this.cursors.down.isDown) {
            this.anims.play("down", true);
           this.setVelocityY(20);
        } else if (this.cursors.up.isDown) {
            this.anims.play("up", true);
            this.setVelocityY(-20);
            //this.body.y--;
        } else {
            this.anims.play("idle", true);
            this.setVelocity(0,0)
        }
    }

    getKey() {
        this.hasKey = true;
        this.scene.getKey();
    }

    stepSound(animation, frame, player) {
        if(animation.key !== "idle") {
            player.scene.playRandom("step" + Phaser.Math.Between(0, 3));
        }
    }
}
