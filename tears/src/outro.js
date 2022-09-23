import Weather from "./weather";

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
        this.cameras.main.setBackgroundColor(0x052c46)
        this.showText();
        new Weather(this, "snow");

        //this.showPlayer();
        //this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
        this.add.bitmapText(this.center_width, 560, "type", "Total Hunted: " + this.registry.get("score"), 30).setOrigin(0.5)
    }

    showText() {
        const text = `Agent Dickhard\ncompleted his missions.\n 
Without any explanation\nhe  just vanished...\n
Maybe he was also\none of those\nTyrell's products?.
         `;
        this.characters = [];
        let jump = 0;
        let line = 0;
        text.split("").forEach( (character, i) => {                    
            if (character === "\n") { jump++; line = 0 }
            this.characters.push(this.add.bitmapText(this.center_width - 350 + (line++ * 25), 150 + (jump * 30), "type", character, 32).setAlpha(0))
        })
        const timeline = this.tweens.createTimeline();
        this.characters.forEach( (character, i) => {
            timeline.add({
                targets: character,
                alpha: { from: 0, to: 0.5},
                duration: 100,
                onComplete: () => {
                    this.playAudioRandomly("type")
                }
            })
        })

        timeline.play();
        this.space = this.add.bitmapText(this.center_width, 670, "type", "SPACE/ENTER to SKIP", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
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
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "type", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
        // this.theme.stop();
        this.sound.stopAll();
        this.scene.start("splash");
    }
}
