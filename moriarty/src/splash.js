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
        this.cameras.main.setBackgroundColor(0x210707);
        //this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.addStartButton();
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1, time: 30})
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
        this.add.bitmapText(this.center_width, 450, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);

        this.add.sprite(this.center_width - 100, 550, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 20, 550, "pixelFont", "By PELLO", 15).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);

    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 670, "pixelFont", "Click HERE to start", 30).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.startGame();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xffffff)
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
