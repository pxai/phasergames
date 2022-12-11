export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

    preload () {
    }

    create () {
        const messages = [
            "0:06 am",
            "2:42 am",
            "3:13 am",
        ];

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2; 
        this.add.tileSprite(0, 0, 800, 800, "landscape").setOrigin(0);

        if (this.number === 3) {
            this.scene.start("outro", { number: this.number });
        } else {
            this.sound.stopAll();
        }

        this.text1 = this.add.bitmapText(this.center_width, 20, "dark", messages[this.number], 30).setOrigin(0.5).setAlpha(0)

        this.playBackground();
            this.playCreepy();
        this.tweens.add({
            targets: [this.text1],
            duration: 2000,
            alpha: {from: 0, to: 1},
            onComplete: () => {
                this.playIntro();
            }
        })

        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    }

    playIntro () {
        const texts = [
            '"Dad?"\n'+
            '"Dad??!"\n'+
            '"What is it honey?"\n' +
            '"Where is Bobby?"\n' +
            '"He is next to... Oh my god!"\n' +
            '"Probably we went to pee, I will check!"',
            '"JoBeth?"\n'+
            '"JoBeth, where\'s dad??!"\n'+
            '"He went to look for Bobby"\n' +
            '"How long ago??"\n' +
            '"I don\'t know..."\n' +
            '"I will go to see"\n' +
            '"Stay Inside!!"',
            '"Mom?"\n'+
            '"Mom??!"\n'+
            '"Dad??"\n' +
            '"Where are you??"\n' +
            '"Mom!!"\n' +
            '"Dad??"\n' +
            '"Dad??"\n' +
            '"Hello?..."',
        ]
;

        this.showHistory(texts[this.number])
    }

    showHistory (text) {
        text.split("\n").forEach((line, i) => {
            this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, 60 + (i + 1) * 60), null, this); 
        });

        this.time.delayedCall((text.split("\n").length + 1) * 2000, () => {
            this.add.bitmapText(this.center_width, 700, "dark", "-press space-", 20).setTint(0xffffff).setOrigin(0.5).setAlpha(1);
        }, null, this);
    }

    showLine(text, y) {
        let line = this.add.bitmapText(this.center_width, y, "dark", text, 40).setTint(0xffffff).setOrigin(0.5).setAlpha(0);
        this.tweens.add({
            targets: line,
            duration: 1000,
            alpha: 1
        })
    }

    playBackground () {
        const theme =  "mars_background";
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


      playCreepy() {
        this.creepy = this.sound.add("creepy")
        this.creepy.play({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          })
      }

    update () {
    }

    loadNext () {
        this.sound.add("blip").play();
        
        this.sound.stopAll();
        this.scene.start("game", {  number: this.number });
    }
}
