import { Debris } from "./particle";
import Lightning from "./lightning";
import Weather from "./weather";

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


        this.cameras.main.setBackgroundColor(0x052c46)
        this.add.tileSprite(0, 300 , 2048, 1543, "background").setScale(0.5).setOrigin(0);
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
        this.setLightning();
        this.showTitle();
        //this.playAudioRandomly("stone")
        new Weather(this, "rain");
    }

    setLightning () {
        this.lightsOut = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0x0).setOrigin(0).setScrollFactor(0)
        this.lightsOut.setAlpha(0);
        this.lightningEffect = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0xffffff).setOrigin(0).setScrollFactor(0)
        this.lightningEffect.setAlpha(0);
        this.lightning = new Lightning(this);
      }

    showTitle () {
        "Like tears".split("").forEach((letter, i) => {
            this.time.delayedCall(200 * (i+1),
                () => {
                    this.playAudioRandomly("type")

                    //if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let text = this.add.bitmapText((60 * (i+1))+ 140, 100, "type", letter.toUpperCase(), 100).setTint(0xeeeeee).setOrigin(0.5).setDropShadow(4, 6, 0x004957, 0.9)
                    Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, text.x , text.y, 0x01605f))
                },
                null,
                this
            );
        })

        "in the rain".split("").forEach((letter, i) => {
            this.time.delayedCall(200 * (i+1) + 1900,
                () => {
                    this.playAudioRandomly("type")
                    //if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let text = this.add.bitmapText(65 * (i+1) + 90, 230, "type", letter.toUpperCase(), 100).setTint(0xeeeeee).setOrigin(0.5).setDropShadow(4, 6, 0x004957, 0.9)
                    Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, text.x , text.y, 0x01605f))
                },
                null,
                this
            );
        })
        this.time.delayedCall(4000, this.lightning.dewIt(), null, this);
    }
    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
      }

    startGame () {
        //if (this.theme) this.theme.stop();
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
        this.add.bitmapText(this.center_width, 450, "type", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "type", "S/DOWN: BUILD WALL", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "type", "SPACE: HAMMER", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 50, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "type", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "type", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
