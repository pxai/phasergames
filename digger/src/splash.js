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
        this.startSound.play({volume: 0.2})
        this.showLogo();        ;
        this.time.delayedCall(10, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.startSound.stop();
        this.scene.start("transition")
    }

    showLogo() {
        this.gameLogo2 = this.add.bitmapText(this.center_width, 200, "pusab", "DIGGER", 240).setOrigin(0.5).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7);
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
        this.add.bitmapText(this.center_width, 450, "pusab", "Use Mouse", 80).setOrigin(0.5).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7);;
        this.add.sprite(this.center_width - 95, 570, "pello").setOrigin(0.5).setScale(0.5);

        this.add.bitmapText(this.center_width + 60, 570, "pusab", "By PELLO", 40).setOrigin(0.5).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7);;
        this.startButton  = this.add.bitmapText(this.center_width, 670, "pusab", "Click to start", 60).setOrigin(0.5).setTint(0xFF8700).setDropShadow(3, 4, 0x222222, 0.7);;
        this.tweens.add({
            targets: this.startButton,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
    }
}
