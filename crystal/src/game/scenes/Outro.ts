import { Scene } from 'phaser';

export default class Outro extends Scene {
        private width: number;
    private height: number;
    private center_width: number;
    private center_height: number;

    constructor () {
        super("Outro");
    }

    preload () {
        this.sound.stopAll();
    }

    create () {
        this.width = Number(this.sys.game.config.width);
        this.height = Number(this.sys.game.config.height);
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x000000) //0xfef1ca
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [
            "You did it!",
            "Tap yourself on the back",
            "Now do something good",
            "CALL YOUR MOM",
            "And be thankful...",
            `score: ${this.registry.get("score")}`,
            "CLICK to start again!"
        ];
        this.showHistory();
        //this.showPlayer();
       // this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
        this.input.on('pointerdown', this.startSplash, this);
        this.addScanlines();
    }

        addScanlines() {
        for (let y = 0; y < this.height; y += 4) {
            let line = this.add.rectangle(this.center_width, y, this.width, 2, 0x000000)
            line.alpha = 1;
            line.depth = 1000;
        }
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this);
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this);
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
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "default", text, 35).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }

    showPlayer () {
        this.add.sprite(this.center_width, 600, "doge").setOrigin(0.5).setScale(3);
    }

    startSplash () {
       // this.theme.stop();
        this.scene.start("Splash");
    }
}
