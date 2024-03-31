import { Particle } from "./particle2";
import Ball from "./game";
import Sky from "./sky";
import {readData, saveData } from "./store";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {

    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x4eadf5) //0xfef1ca
        this.cloudLayer = this.add.layer();
        this.text1 = this.add.bitmapText(this.center_width, this.center_height -200, "demon", "GUST", 200, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.add.sprite(this.center_width - 118, 450, "pello").setOrigin(0.5).setScale(0.8)
        this.add.bitmapText(this.center_width + 32, 340, "demon", "ARROWS", 25).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 2, 0x222222, 0.9);
        this.add.bitmapText(this.center_width + 32, 380, "demon", "WASD", 25).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 2, 0x222222, 0.9);

        this.text2 = this.add.bitmapText(this.center_width + 32, 450, "demon", "by Pello", 25).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 2, 0x222222, 0.9);
        this.text3 = this.add.bitmapText(this.center_width, 500, "demon", "Click to Start", 15).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 2, 0x222222, 0.9);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.loadScores();
        this.playMusic();

        this.moveLetters();
        this.addSky();
    }

    moveLetters () {
        this.tweens.add({
            targets: this.text1,
            x: {from: this.text1.x, to: this.text1.x + Phaser.Math.Between(-200, 200) },
            y: {from: 150, to: Phaser.Math.Between(150, 220) },
            duration: 1000,
            yoyo: true,
            onComplete: () => this.moveLetters()
        })
    }

    async loadScores () {
        const scores = await readData();
        if (!scores) return
        const ballBreakerScores = scores.filter(score => score.game === "Gust")

        ballBreakerScores.sort((a, b) => b.score - a.score);

        let amongFirst10 = false;
        this.scoreboard = this.add.bitmapText(this.center_width, 550, "demon", "SCOREBOARD", 40).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        ballBreakerScores.splice(0, 10).forEach( (score, i) => {
            this.time.delayedCall(1000 + (1000 * i), () => {
                this.scoreboard.setText(`${i+1} ${score.player.substring(0, 10).padEnd(11, ' ')} ${String(score.score).padStart(10, '0')}`)
            })
        })
    }

    addSky() {
        this.sky = new Sky(this);
    }

    update () {

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
