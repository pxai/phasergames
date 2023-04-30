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
        this.playAudioRandomly("stone")
    }

    showTitle () {
        let text1 = this.add.bitmapText(this.center_width, 1000, "celtic", "Goblin", 140).setTint(0xca6702).setOrigin(0.5).setDropShadow(4, 6, 0xf09937, 0.9)
        let text2 = this.add.bitmapText(this.center_width, 1200, "celtic", "Bakery", 140).setTint(0xca6702).setOrigin(0.5).setDropShadow(4, 6, 0xf09937, 0.9)
        this.tweens.add({
            targets: [text1, text2],
            duration: 2000,
            y: "-=900",
            ease: 'Linear'
        })
    }
    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
      }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playMusic("music0")
        this.scene.start("scoreboard", {name: "STAGE", number: 0})
        //this.scene.start("transition", {next: "game", name: "STAGE", number: 0, time: 30})
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
        this.add.bitmapText(this.center_width, 500, "celtic", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 590, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 20, 590, "celtic", "By PELLO", 25).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "celtic", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
