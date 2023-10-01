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

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.cameras.main.fade(250, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("game", { number: 0});
        });
    }

    showLogo() {
        let line1 = this.add.bitmapText(this.center_width, 100, "title", "LUCKY", 250).setOrigin(0.5).setAlpha(1);
        let line2 = this.add.bitmapText(this.center_width, 200, "title", "SHOT", 250).setOrigin(0.5).setAlpha(1);
        this.tweens.add({
            targets: this.line1,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 130
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
        this.add.bitmapText(this.center_width, 450, "title", "HIT THE BELL!", 130).setOrigin(0.5);
        this.add.sprite(this.center_width - 160, 560, "pello").setOrigin(0.5).setScale(0.2)
        this.add.bitmapText(this.center_width + 70, 560, "title", "BY PELLO", 115).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "title", "CLICK TO START", 130).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
    }
}
