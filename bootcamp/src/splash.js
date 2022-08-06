import { Debris } from "./particle";

import Platform from "./platform";

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
        this.addPlatforms();

        this.cameras.main.setBackgroundColor(0x000000) //(0x62a2bf);
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
        this.showTitle();
        this.playAudioRandomly("stone")
    }

    addPlatforms () {
        new Platform(this, 100, 500, 2, false, 0)
        new Platform(this, 200, 600, 3, false, 3)
        new Platform(this, 500, 400, 4, false, 3)
        new Platform(this, 700, 700, 2, false, 1)
    }

    showTitle () {
        let text = this.add.bitmapText(this.center_width , 30, "pixelFont", "bootcamp", 50).setTint(0xfba933).setOrigin(0.5).setDropShadow(2, 3, 0xf09937, 0.9)
        "STARTING".split("").forEach((letter, i) => {
            this.time.delayedCall(200 * (i+1),
                () => {
                    this.playAudioRandomly("stone_fail")

                    if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let offset = i < 4 ? 110 : 110;
                    let text = this.add.bitmapText((offset * (i+1)) + 20 , 150, "pixelFont", letter, 110).setTint(0xfba933).setOrigin(0.5).setDropShadow(2, 3, 0xf09937, 0.9)
                    Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, text.x , text.y, 0xca6702))
                },
                null,
                this
            );
        })

        "SOON".split("").forEach((letter, i) => {
            this.time.delayedCall(300 * (i+1),
                () => {
                    this.playAudioRandomly("stone_fail")

                    if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let offset = i < 4 ? 110 : 110;
                    let text = this.add.bitmapText((offset * (i+1)) + 230 , 300, "pixelFont", letter, 110).setTint(0xfba933).setOrigin(0.5).setDropShadow(2, 3, 0xf09937, 0.9)
                    Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, text.x , text.y, 0xca6702))
                },
                null,
                this
            );
        })
        /*const flags = ["js", "html", "python", "css"]
        flags.forEach((flag, i) => {
            this.time.delayedCall(500 * (i+1) + 800,
                () => {
                    this.playAudioRandomly("stone_fail")
                    if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let image = this.add.image(130 * (i+1) + 200, 350, flag).setOrigin(0.5)
                    Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, image.x , image.y, 0xca6702))
                },
                null,
                this
            );
        })*/
    }
    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
      }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0, time: 30})
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
        this.add.bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "S/DOWN: BUILD WALL", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "SPACE: HAMMER", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 60, 620, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 700, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
