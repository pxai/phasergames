import { SingleLetter } from "./letter";
import BlockGenerator from "./block_generator";
import Block from "./block";

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
        this.blockGenerator = new BlockGenerator(this);

        this.addLetters();

        this.cameras.main.setBackgroundColor(0x000000);
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.playMusic();
        //this.showPlayer();
        this.leftColliders = this.add.group();
        this.rightColliders = this.add.group();
        this.blockGenerator.generateSplash();
    }

    addLetters () {
        const points = [1, 1, 1, 1, 1];
        "LETTER".split("").forEach((letter, i) => {
            this.add.existing(new SingleLetter(this, 154 * (i + 1) - 30, 150, { letter, points: points[i]}).setScale(3.2));
        })
        this.add.bitmapText(this.center_width, 300, "pixelFont", "C H A O S", 50).setOrigin(0.5);
    }

    startGame () {
        this.scene.start("transition")
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, -200, "logo").setScale(0.5).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 130
              },
          })
    }

    showPlayer () {

    }

    playMusic (theme="intro") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.7,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pixelFont", "CREATE WORDS", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pixelFont", "DRAG LETTERS", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "pixelFont", "RIGHT CLICK SHUFFLE/RESOLVE", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "CLICK HERE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.space.setInteractive();
        this.space.on('pointerdown', () => {
            this.sound.add("success").play();
            this.startGame()
        })
    }
}
