import SpriteButton from "./sprite_button";

export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "You did it!!",
            "Thanks to your building skills",
            "and your moves",
            "you saved the day.",
            "Made in 2 days for a JAM", "by Pello", "Press SPACE"
        ];
        this.showHistory();
        this.showPlayer();
        //this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
        this.addStartButton();
    }

    showPlayer () {

    }

    addStartButton () {
        const x = (this.cameras.main.width / 2);
        const y = (this.cameras.main.height - 50);
        this.startButton = new SpriteButton(this, this.center_width, y, "play", "Start Stage", this.startSplash.bind(this));
      }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 50), null, this); 
        });
        //this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
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

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
        this.sound.stopAll();
        this.scene.start("splash");
    }
}
