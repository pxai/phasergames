import { Debris } from "./particle";

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

        this.sound.stopAll();
        this.cameras.main.setBackgroundColor(0x000000);
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);
        this.registry.set('time', 0); 
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
        this.showTitle();
        this.playAudioRandomly("muffin")
    }

    showTitle () {
        let text1 = this.add.bitmapText(this.center_width, 200, "celtic", "Goblin", 120).setTint(0x1c6c00).setOrigin(0.5).setDropShadow(4, 6, 0xf09937, 0.9)
        let text2 = this.add.bitmapText(this.center_width, 350, "celtic", "Bakery", 120).setTint(0x1c6c00).setOrigin(0.5).setDropShadow(4, 6, 0xf09937, 0.9)
        this.tweens.add({
            targets: [text1, text2],
            duration: 50,
            alpha: { from: 0.7, to: 1},
            repeat: 10
        })
    }
    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; 
        this.sound.add(key).play({volume, rate});
      }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playMusic("stage")
        this.scene.start("scoreboard", {name: "STAGE", number: 0})
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
        this.add.bitmapText(this.center_width, 500, "celtic", "WASD/Arrows: move", 30).setOrigin(0.5).setTint(0xf09937);
        this.add.sprite(this.center_width - 110, 570, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 20, 590, "celtic", "By PELLO", 25).setOrigin(0.5).setTint(0xf09937);
        this.space = this.add.bitmapText(this.center_width, 670, "celtic", "Press SPACE to start", 30).setOrigin(0.5).setTint(0xf09937);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
