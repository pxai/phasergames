import Bean from "./objects/bean";
import BeanGenerator from "./objects/bean _generator";

export default class Game extends Phaser.Scene {
    constructor ({ key }) {
        super({ key });
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    }

    preload () {
        console.log("preload");
    }

    create () {
        // this.add.image(400, 300, 'sky');
        this.beanGenerator = new BeanGenerator(this);
        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, "ground").setScale(2).refreshBody();

        this.platforms.create(600, 400, "ground");
        this.platforms.create(50, 250, "ground");
        this.platforms.create(750, 220, "ground");

        const player = this.physics.add.sprite(100, 450, "dude");

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("grogu", { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "grogu", frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
            key: "crouch",
            frames: [{ key: "grogu", frame: 7 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("grogu", { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("grogu", { start: 7, end: 0 }),
            frameRate: 5
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        /* var stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        }); */

        /* stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        }); */

        this.scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" });

        this.physics.add.collider(player, this.platforms);
        /* this.physics.add.collider(stars, platforms); */

        /* this.physics.add.overlap(player, stars, this.collectStar, null, this); */

        this.player = player;

        const button = this.add.image(800 - 16, 16, "fullscreen", 0).setOrigin(1, 0).setInteractive();

        button.on("pointerup", function () {
            if (this.scale.isFullscreen) {
                button.setFrame(0);

                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);

                this.scale.startFullscreen();
            }
        }, this);

        this.scoreText.setText("v15");

        const FKey = this.input.keyboard.addKey("F");

        FKey.on("down", function () {
            if (this.scale.isFullscreen) {
                button.setFrame(0);
                this.scale.stopFullscreen();
            } else {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
        }, this);
        this.sound.add("music", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.sound.play("music");
    }

    update () {
        const cursors = this.cursors;
        const player = this.player;

        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play("right", true);
        } else if (cursors.down.isDown) {
            player.anims.play("crouch", true);
        } else {
            player.setVelocityX(0);

            player.anims.play("turn");
        }

        if (cursors.up.isDown && player.body.touching.down) {
            console.log("Jump!!");
            player.anims.play("jump", true);
            player.setVelocityY(-400);
        }
    }

    collectStar (player, star) {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText("Score: " + this.score);
    }
}
