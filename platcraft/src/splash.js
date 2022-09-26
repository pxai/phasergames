import { Debris } from "./particle";
import SpriteButton from "./sprite_button";

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


        this.cameras.main.setBackgroundColor(0x62a2bf)
        this.time.delayedCall(500, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
        this.showTitle();
        this.playAudioRandomly("stone")
        this.addStartButton();
    }

    showTitle () {
        this.titleImage = this.add.sprite(this.center_width, -200, "scenetitle").setOrigin(0.5)
        this.title = this.add.bitmapText(this.center_width, -185, "logo", "PLATCRAFT", 150).setTint(0xca6702).setOrigin(0.5).setDropShadow(4, 6, 0xf09937, 0.9)

        this.tweens.add({
            targets: [this.titleImage, this.title],
            duration: 1000,
            y: "+=450"
        })
    }
    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = 1; // Phaser.Math.Between(0.9, 1);
        this.sound.add(key).play({volume, rate});
      }

      addStartButton () {
        const x = (this.cameras.main.width / 2);
        const y = (this.cameras.main.height - 50);
        this.startButton = new SpriteButton(this, this.center_width, y, "play", "Start Stage", this.startGame.bind(this));
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
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 500, "pixelFont", "Build: Mouse", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "Game: WASD/Arrows", 30).setOrigin(0.5);

        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "SPACE/PLAY to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
