import { Particle } from "./particle";
import Ball from "./game";
import {readData, saveData } from "./store";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.registry.set("score", "0");
        this.load.bitmapFont("mario", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("ball", "assets/images/ball.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("basket", "assets/images/basket.png", { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet("clouds", "assets/images/clouds.png", { frameWidth: 64, frameHeight: 32 });
        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("outro", "assets/sounds/outro.mp3");
        this.load.audio("gotcha", "assets/sounds/gotcha.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("break", "assets/sounds/break.mp3");
        this.load.audio("place", "assets/sounds/place.mp3");

        this.load.audio("boing", "assets/sounds/boing.mp3");
        this.load.audio("marble", "assets/sounds/marble.mp3");
        this.load.image('star', 'assets/images/star.png');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('brick', 'assets/maps/brick.png');
        this.load.image('brick0', 'assets/images/brick.png');
        this.load.image('pello', 'assets/images/pello.png');
        this.load.image('background', 'assets/maps/background.png');

        this.load.image('cloud', 'assets/images/cloud.png');

        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        Array(7).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });    
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x006fb1) //0xfef1ca
        this.logo = this.add.sprite(this.center_width, this.center_height - 100, "logo").setOrigin(0.5);

        this.text1 = this.add.bitmapText(this.center_width, this.center_height - 250, "mario", "BRICK", 140, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.text2 = this.add.bitmapText(this.center_width + 32, 450, "mario", "by Pello", 25).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.add.sprite(this.center_width - 118, 450, "pello").setOrigin(0.5).setScale(0.6)
        this.text3 = this.add.bitmapText(this.center_width, 500, "mario", "Click to Start", 15).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.loadScores();
        this.playMusic();
    }

    async loadScores () {
        const scores = await readData();
        if (!scores) return
        const ballBreakerScores = scores.filter(score => score.game === "Bricks")
        
        ballBreakerScores.sort((a, b) => a.score - b.score);
        console.log("Dale: ", scores, ballBreakerScores)
        let amongFirst10 = false;
        this.add.bitmapText(this.center_width, 550, "mario", "SCOREBOARD", 40).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        ballBreakerScores.splice(0, 3).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 620 + (i * 60), "mario", `${i+1}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 620 + (i * 60), "mario", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 620 + (i * 60), "mario", `${String(score.score).padStart(10, '0')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
            if (score.id === this.currentId) {

                amongFirst10 = true;
                this.tweens.add({
                    targets: [text0, text1, text2],
                    duration: 300,
                    alpha: {from: 0, to: 1},
                    repeat: -1,
                    yoyo: true
                })
            }
        })
    }

    update () {
        this.logo.rotation += 0.01;

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
        this.theme.stop();
        this.playMusic("theme") 
        this.registry.set("startTime", Date.now())
        this.registry.set("hits", 0)
        this.scene.start("transition", {number: 0});
    }
}
