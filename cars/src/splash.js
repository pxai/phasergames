import {readData, saveData } from "./store";

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


        this.cameras.main.setBackgroundColor(0x354e61);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        await this.loadScore();
        //this.playMusic();
        //this.showPlayer();
    }

    async startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("game", {})
    }

    async loadScore() {
        await readData()
    }

    showLogo() {
        this.gameLogo = this.add.image(-1000, this.center_height -200, "logo").setScale(1).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: -1000,
              to: this.center_width
            },
          })
    }

    showPlayer () {

    }

    playMusic (theme="splash") {
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
        this.add.bitmapText(this.center_width, 500, "race", "WASD/Arrows: move", 60).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.add.bitmapText(this.center_width, 550, "race", "SPACE: JUMP", 60).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.add.bitmapText(this.center_width, 600, "race", "Z: SHOOT", 60).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.add.sprite(this.center_width - 100, 670, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 670, "race", "By PELLO", 45).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.space = this.add.bitmapText(this.center_width, 720, "race", "Press SPACE to start", 40).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
