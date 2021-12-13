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


        this.cameras.main.setBackgroundColor(0x000000);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "stage0", name: "Bayes", number: 0})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width, -200, "logo").setScale(0.8).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            y: {
                from: -200,
                to: 300
              },
          })
    }

    showPlayer () {

    }

    playMusic (theme="music5") {
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
        this.add.bitmapText(this.center_width, 730, "wizardFont", "Arrows to move", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.2)
        this.add.bitmapText(this.center_width + 40, 620, "wizardFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 770, "wizardFont", "Press ENTER to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
