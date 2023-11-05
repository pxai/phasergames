import { readData, saveData } from "./store";
export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }


    async create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;


        this.cameras.main.setBackgroundColor(0x000000);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        await this.loadScores()
        this.playMusic();
        this.rollDice();
    }

    startGame () {
        this.sound.add("blip").play()
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0, time: 30})
    }

    showLogo() {
        this.gameLogo = this.add.bitmapText(this.center_width, 50, "default", "KEEP ROLLING", 100).setTint(0x618fc0).setOrigin(0.5).setDropShadow(0, 8, 0xffffff, 0.9);
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            y: {
                from: -200,
                to: 130
              },
          })
    }

    rollDice () {
        this.dice = this.add.sprite(Phaser.Math.Between(64, this.width - 64), 0,"die", Phaser.Math.Between(1, 7));
        this.tweens.add({
            targets: this.dice,
            duration: 1000,
            y: {from: 0, to: this.height},
            onUpdate: () => {
                this.dice.setFrame(Phaser.Math.Between(1, 7))
            },
            onComplete: () => {
                this.dice.destroy();
                this.rollDice()
            }
        });
    }

    playMusic (theme="music") {
        this.sound.stopAll();
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


    showInstructions() {
        this.add.bitmapText(this.center_width, 200, "default", "WASD/Arrows: move", 30).setOrigin(0.5).setDropShadow(0, 2, 0x618fc0, 0.9);
        this.add.bitmapText(this.center_width, 250, "default", "SPACE: flip dice", 30).setOrigin(0.5).setDropShadow(0, 2, 0x618fc0, 0.9);

        this.add.sprite(this.center_width - 80, 300, "pello").setOrigin(0.5).setScale(0.4)
        this.add.bitmapText(this.center_width + 40, 300, "default", "By PELLO", 15).setOrigin(0.5)
        this.space = this.add.bitmapText(this.center_width, 350, "default", "Press SPACE to start", 30).setOrigin(0.5).setDropShadow(0, 2, 0x618fc0, 0.9);
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
        const makeWayScores = scores.filter(score => score.game === "KeepRolling").sort((a, b) => b.score - a.score);
        let amongFirst10 = false;
        this.add.bitmapText(this.center_width, 400, "default", "Top 5", 45).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        makeWayScores.splice(0, 5).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 470 + (i * 60), "default", `${i+1}`, 35).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 470 + (i * 60), "default", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 35).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 470 + (i * 60), "default", `${String(score.score).padStart(10, '0')}`, 35).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
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
