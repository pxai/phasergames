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


        this.cameras.main.setBackgroundColor(0x000000);
        this.startSound = this.sound.add("start");
        this.startSound.play({volume: 0.5})
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.startSound.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    showLogo() {
        this.gameLogo2 = this.add.sprite(this.center_width, 200, "logo2").setOrigin(0.5);
        this.gameLogo1 = this.add.sprite(this.center_width, 200, "logo1").setOrigin(0.5);

        this.tweens.add({
            targets: this.gameLogo1,
            duration: 100,
            x: { from: this.gameLogo1.x, to: this.gameLogo1.x + Phaser.Math.Between(-5, 5)},
            y: { from: this.gameLogo1.y, to: this.gameLogo1.y + Phaser.Math.Between(-5, 5)},
            scale: {from: 1, to: 0.9 },
            repeat: -1
          })
          this.tweens.add({
            targets: this.gameLogo2,
            duration: 100,
            x: { from: this.gameLogo2.x, to: this.gameLogo2.x + Phaser.Math.Between(-5, 5)},
            y: { from: this.gameLogo2.y, to: this.gameLogo2.y + Phaser.Math.Between(-5, 5)},
            scale: {from: 1, to: 0.9 },
            repeat: -1
          })
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
        this.add.bitmapText(this.center_width, 450, "wendy", "Arrows: move", 80).setOrigin(0.5).setTint(0xFFB709).setDropShadow(3, 4, 0x222222, 0.7);;
        this.add.sprite(this.center_width - 95, 575, "pello").setOrigin(0.5).setScale(0.3).setTint(0x222222);
        this.add.sprite(this.center_width - 100, 570, "pello").setOrigin(0.5).setScale(0.3)

        this.add.bitmapText(this.center_width + 40, 570, "wendy", "By PELLO", 40).setOrigin(0.5).setTint(0xFFB709).setDropShadow(3, 4, 0x222222, 0.7);;
        this.space = this.add.bitmapText(this.center_width, 670, "wendy", "Press SPACE to start", 60).setOrigin(0.5).setTint(0xFFB709).setDropShadow(3, 4, 0x222222, 0.7);;
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
