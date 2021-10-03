import Player from "./player";
import StarBurst from "./starburst";
import Pot from "./pot";

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
       // this.playMusic();
        //this.logo = this.add.image(this.center_width, 100, "splash").setOrigin(0.5).setScale(0.8)
        this.pello = this.add.image(this.center_width, this.height - 145, "logopx").setOrigin(0.5).setScale(0.5)
        this.showLogo();
        this.textInstruction1 = this.add.bitmapText(this.center_width, 300, "wizardFont", "Left/Right: move", 30).setTint(0xffffff).setOrigin(0.5)
        this.textInstruction1.setDropShadow(2, 3, 0x420069, 0.7);
        this.textInstruction2 = this.add.bitmapText(this.center_width, 350, "wizardFont", "Up: jump, Down: spell", 30).setTint(0xffffff).setOrigin(0.5)
        this.textInstruction2.setDropShadow(2, 3, 0x420069, 0.7);
        this.textInstruction3 = this.add.bitmapText(this.center_width, 400, "wizardFont", "ENTER to continue", 25).setTint(0xffffff).setOrigin(0.5)
        this.textInstruction3.setDropShadow(2, 3, 0x420069, 0.7);
        this.textInstruction4 = this.add.bitmapText(this.center_width, 550, "wizardFont", "A game by Pello", 15).setTint(0x7500ba).setOrigin(0.5)
        this.textInstruction4.setDropShadow(2, 3, 0x420069, 0.7);
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.appearSound = this.sound.add("appear");
        this.boomSound = this.sound.add("boom");
        this.showText();
        
    }

    update () {
    }

    showLogo () {
        this.logoW = this.add.bitmapText(30, this.height + 200, "wizardFont", "W", 128).setTint(0x7500ba)
        this.logoE1 = this.add.bitmapText(this.width + 200, 140, "wizardFont", "e", 128).setTint(0x7500ba)
        this.logoE2 = this.add.bitmapText(260, - 200, "wizardFont", "e", 128).setTint(0x7500ba)
        this.logoZ = this.add.bitmapText(370, this.height + 200, "wizardFont", "z", 128).setTint(0x7500ba)
        this.logoA = this.add.bitmapText(this.width + 200, 160, "wizardFont", "a", 128).setTint(0x7500ba)
        this.logoR = this.add.bitmapText(590, this.height + 200, "wizardFont", "r", 128).setTint(0x7500ba)
        this.logoD = this.add.bitmapText(690, this.height + 200, "wizardFont", "D", 128).setTint(0x7500ba)
        const timeline = this.tweens.createTimeline();
        timeline.add({
            targets: this.logoW,
            y: { from: this.height + 200, to: 120},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
              this.appearSound.play()
              new StarBurst(this, this.logoW.x, this.logoW.y, "0x7500ba", true);
          }
        });
        timeline.add({
            targets: this.logoE1,
            x: { from: this.width + 200, to: 160},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
                this.appearSound.play()
              new StarBurst(this, this.logoE1.x, this.logoE1.y, "0x7500ba", true);
          }
        });
        timeline.add({
            targets: this.logoE2,
            y: { from: -200, to: 140},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
                this.appearSound.play()
              new StarBurst(this, this.logoE2.x, this.logoE2.y, "0x7500ba", true);
          }
        });
        timeline.add({
            targets: this.logoZ,
            y: { from: this.height + 200, to: 140},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
                this.appearSound.play()
              new StarBurst(this, this.logoZ.x, this.logoZ.y, "0x7500ba", true);
          }
        });
        timeline.add({
            targets: this.logoA,
            x: { from: this.width + 200, to: 480},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
                this.appearSound.play()
              new StarBurst(this, this.logoA.x, this.logoA.y, "0x7500ba", true);
          }
        });
        timeline.add({
            targets: this.logoR,
            y: { from: this.height + 200, to: 140},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
                this.appearSound.play()
              new StarBurst(this, this.logoR.x, this.logoR.y, "0x7500ba", true);
          }
        });
        timeline.add({
            targets: this.logoD,
            y: { from: this.height + 200, to: 130},
            alpha: { from: 0, to: 1},
            duration: 200,
            onComplete: () => {
                this.appearSound.play()
              new StarBurst(this, this.logoD.x, this.logoD.y, "0x7500ba", true);
              this.time.delayedCall(500, () => this.finalEffect())
          }
        });

      timeline.play();
      

    }

    finalEffect() {
        [this.logoW, this.logoE1, this.logoE2, 
            this.logoZ, this.logoA, 
            this.logoR, this.logoD].forEach( logo => {
                logo.setDropShadow(4, 6, 0x420069, 0.7);
                new StarBurst(this, logo.x, logo.y, "0x7500ba", true, true);
            });
            this.boomSound.play()
        this.player = this.add.sprite(this.center_width, 200, "wizard");
        this.anims.create({
            key: "playeridle",
            frames: this.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.player.anims.play("playeridle", true)
        const pots = [0, 1, 2, 3]
        pots.forEach( pot => {
            //this.add.image(200 + (pot*200), 200, `pot${pot}`).setOrigin(0.5)
            new Pot(this, 100 + (pot*200), 200, `pot${pot}`)
        })
    }

    showText() {
        this.tweens.add({
            targets: [this.textInstruction1, this.textInstruction2, this.pello, this.textInstruction3],
            alpha: { from: 0, to: 1},
            duration: 4000,
        })
    }

    loadNext(sceneName) {
        this.scene.start('intro')
    }

    playMusic (theme="muzik2") {
        this.sound.stopAll();
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
}
