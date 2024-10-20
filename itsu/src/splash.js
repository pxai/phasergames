import {readData } from "./store";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    async create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;


        this.cameras.main.setBackgroundColor(0x000000);
        this.showLogo();
        this.showInstructions()

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        this.showPlayer();
        await this.loadScores()
    }

    startGame () {
        //if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0, time: 30})
    }

    showLogo() {
        this.letters = []
        const positions = [-150, -50, 50, 150];
        "itsu".split("").forEach((letter, i) => {
            this.letters.push(this.add.bitmapText(this.center_width + positions[i], 80, "pixelFont", letter, 140).setTint(0xf26419).setOrigin(0.5));
        })

        this.tweens.add({
            targets: this.letters,
            duration: 100,
            alpha: {from: 0, to: 1},
            repeat: 5,
            onComplete: () => {
                this.randomRemove([(Phaser.Math.RND.pick(this.letters), Phaser.Math.RND.pick(this.letters))])
            }
          })
    }

    randomRemove (letters) {
        this.tweens.add({
            targets: letters,
            duration: 300,
            alpha: {from: 1, to: 0},
            yoyo: true,
            repeat: 2,
            onComplete: () => {
                this.randomRemove([(Phaser.Math.RND.pick(this.letters), Phaser.Math.RND.pick(this.letters))])
            }
          })
    }

    showPlayer () {
        this.add.sprite(this.center_width, 160, "walt", 0).setScale(2).setOrigin(0.5)
    }

    playMusic (theme="music") {
        this.game.sound.stopAll();
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }


    showInstructions() {
        this.add.bitmapText(this.center_width, 250, "pixelFont", "WASD/geziak: mugitzeko", 50).setOrigin(0.5).setTint(0xf6ae2d);
        this.add.sprite(this.center_width - 215, 300, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width - 120, 300, "pixelFont", " by PELLO", 35).setOrigin(0.5).setTint(0xf6ae2d);
        this.add.bitmapText(this.center_width + 85, 300, "pixelFont", "- Audio: aumeta", 35).setOrigin(0.5).setTint(0xf6ae2d);
        this.space = this.add.bitmapText(this.center_width, 350, "pixelFont", "ENTER Sakatu", 50).setOrigin(0.5).setTint(0xf6ae2d);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    async loadScores () {
        const scores = await readData();
        const ballBreakerScores = scores.filter(score => score.game === "Itsu")
        ballBreakerScores.sort((a, b) => a.score - b.score);

        let amongFirst10 = false;
        this.add.bitmapText(this.center_width, 420, "pixelFont", "AZKARRENAK", 70).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        ballBreakerScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 490 + (i * 60), "pixelFont", `${i+1}`, 50).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 490 + (i * 60), "pixelFont", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 50).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 490 + (i * 60), "pixelFont", `${String(score.score).padStart(10, '0')}`, 50).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);

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
}
