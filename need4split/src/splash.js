import { Particle } from "./particle";
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
        this.cameras.main.setBackgroundColor(0x006fb1) //0xfef1ca
        this.cloudLayer = this.add.layer();
        this.text1 = this.add.bitmapText(this.center_width, this.center_height, "demon", "NEED\n4\nSPLIT", 100, Phaser.GameObjects.BitmapText.ALIGN_CENTER).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.add.sprite(this.center_width - 118, 450, "pello").setOrigin(0.5).setScale(0.8)
        this.text2 = this.add.bitmapText(this.center_width + 32, 450, "demon", "by Pello", 25).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.text3 = this.add.bitmapText(this.center_width, 500, "demon", "Click to Start", 15).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.loadScores();
        this.playMusic();

        this.tweens.add({
            targets: this.text1,
            x: {from: this.text1.x, to: this.text1.x + Phaser.Math.Between(-10, 10) },
            y: {from: 200, to: Phaser.Math.Between(200, 300) },
            duration: 1000,
            repeat: -1,
            yoyo: true,
        })
        this.addSky();
    }

    async loadScores () {
        const scores = await readData();
        if (!scores) return
        const ballBreakerScores = scores.filter(score => score.game === "Need4Split")
        
        ballBreakerScores.sort((a, b) => a.score - b.score);

        let amongFirst10 = false;
        this.add.bitmapText(this.center_width, 550, "demon", "SCOREBOARD", 40).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        ballBreakerScores.splice(0, 3).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 620 + (i * 60), "demon", `${i+1}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 620 + (i * 60), "demon", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 620 + (i * 60), "demon", `${String(score.score).padStart(10, '0')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
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
        this.theme.stop();
        this.playMusic("theme")
        this.registry.set("startTime", Date.now())
        this.registry.set("hits", 0)
        this.scene.start("transition", {number: 0});
    }
}
