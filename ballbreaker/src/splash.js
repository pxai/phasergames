import { Particle } from "./particle";
import Ball from "./game";
import Sky from "./sky";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.registry.set("score", "0");
        this.load.bitmapFont("daydream", "assets/fonts/daydream.png", "assets/fonts/daydream.xml");
        this.load.spritesheet("ball", "assets/images/ball.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("basket", "assets/images/basket.png", { frameWidth: 32, frameHeight: 64 });
        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("gotcha", "assets/sounds/gotcha.mp3");

        this.load.audio("boing", "assets/sounds/boing.mp3");
        this.load.audio("marble", "assets/sounds/marble.mp3");

        this.load.image('brick', 'assets/maps/brick.png');
        this.load.image('brick0', 'assets/images/brick.png');
        this.load.image('background', 'assets/maps/background.png');

        this.load.image('cloud', 'assets/images/cloud.png');

        Array(2).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });    
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x006fb1) //0xfef1ca

        this.text1 = this.add.bitmapText(this.center_width, this.center_height, "daydream", "BALL\nBREAKER", 100, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.text2 = this.add.bitmapText(this.center_width, 650, "daydream", "by Pello", 25).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.text3 = this.add.bitmapText(this.center_width, 700, "daydream", "Click to Start", 15).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.playMusic();

        this.tweens.add({
            targets: this.text1,
            x: {from: this.text1.x, to: this.text1.x + Phaser.Math.Between(-10, 10) },
            y: {from: 0, to: Phaser.Math.Between(400, 500) },
            duration: 2000,
            repeat: -1,
            yoyo: true,
        })
        this.addSky();
    }

    addSky() {
        this.sky = new Sky(this);
    }

    update () {
        new Ball(this, 200, 128, Phaser.Math.Between(10, 1)/10)
        //new Ball(this, Phaser.Math.Between(0, this.width), 128, Phaser.Math.Between(10, 1)/10);
    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }


    startGame () {
        this.tweens.add({
            targets: this.text1,
            y: {from: this.text1, to: -200},
            duration: 1000
        })

        this.tweens.add({
            targets: this.text2,
            y: {from: this.text2, to: -200},
            duration: 1200
        })

        this.tweens.add({
            targets: this.text3,
            y: {from: this.text3, to: -200},
            duration: 1300,
            onComplete: () => {
                this.theme.stop();
                this.playMusic("theme")
                this.registry.set("startTime", Date.now())
                this.registry.set("blocks", 0)
                this.scene.start("outro", {number: 0});
            }
        })
    }
}
