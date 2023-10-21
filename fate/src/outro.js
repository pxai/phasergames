export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

  /*

  */
    create () {
        this.cameras.main.setBackgroundColor(0x000000);
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [
            "This feels like falling",
            "and collapsing at the same time...",
            "I'm glad that I succeded",
            "By the way...",
            "I see no god inside here."
        ];
        this.showHistory();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

  /*

  */
    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this);
        });
    }

    playMusic (theme="outro") {
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

  /*

  */
    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "computer", text, 35).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
       this.scene.start("bootstrap");
    }
}
