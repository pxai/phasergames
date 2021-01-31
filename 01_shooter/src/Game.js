import Explosion from "./Explosion.js";
import Laser from "./Laser.js";
import Foe from "./Foe.js";
import Player from "./Player.js";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "gameScene" });
    }

    preload () {
        this.load.image("starfield", "assets/images/starfield.png");
        this.load.image("player", "assets/images/galaga.png");
        this.load.image("foe", "assets/images/foe.png");

        this.load.spritesheet("laser", "assets/images/laser.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("explosion", "assets/images/explosion.png", {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");
        this.load.audio("boom", "assets/sounds/boom.mp3");
        this.load.audio("shot", "assets/sounds/shot.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");
    }

    create () {
        console.log("Yea");
        this.background = this.add.tileSprite(0, 0, Phaser.sys.game.canvas.width, Phaser.sys.game.canvas.height, "starfield");
        this.background.setOrigin(0, 0);
        this.anims.create({ key: "laser_anim", frames: this.anims.generateFrameNumbers("laser"), frameRate: 20, repeat: -1 });
        this.player = new Player(this);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.bullets = this.add.group();
        this.foes = this.add.group();
        this.physics.add.collider(this.bullets, this.foes, this.hitFoe.bind(this));
        this.physics.add.collider(this.player, this.foes, this.hitPlayer.bind(this));
        this.player.body.collideWorldBounds = true;
        this.addScore();
        this.sound.play("music");
    }

    addScore () {
        this.score = 0;
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + this.score, 16);
    }

    update () {
        this.background.tilePositionX += 1;
        this.updateShip();

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.shoot();
        }
        const chances = Phaser.Math.Between(0, 100);
        if (chances === 1) {
            this.addFoe();
        }
    }

    updateBullets () {
        this.projectiles.getChildren().forEach(laser => laser.update());
    }

    shoot () {
        new Laser(this, this.sys.game.canvas.width);
        this.sound.play("shot");
    }

    addFoe () {
        new Foe(this, this.sys.game.canvas.width, this.sys.game.canvas.height);
    }

    hitFoe (bullet, foe) {
        new Explosion(this, foe.x, foe.y);
        foe.destroy();
        bullet.destroy();
        this.sound.play("boom");
        this.score++;
        this.scoreLabel.text = "SCORE " + this.score;
    }

    hitPlayer (ship, foe) {
        console.log(ship);
        new Explosion(this, foe.x, foe.y);
        this.sound.play("boom");
        foe.destroy();
        new Explosion(this, ship.x, ship.y);
        this.sound.play("boom");
        ship.destroy();
    }

    updateShip () {
        if (!this.player.active) return;

        this.player.body.setVelocityX(0);
        this.player.body.setVelocityY(0);

        if (this.cursor.left.isDown) {
            this.player.body.setVelocityX(-200);
        } else if (this.cursor.right.isDown) {
            this.player.body.setVelocityX(200);
        }

        if (this.cursor.up.isDown) {
            this.player.body.setVelocityY(-200);
        } else if (this.cursor.down.isDown) {
            this.player.body.setVelocityY(200);
        }
    }
}
