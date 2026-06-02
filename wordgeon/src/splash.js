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
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        // Start on click too
        this.input.on("pointerup", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("selection")
    }

    showLogo() {
         this.gameLogo =  this.add
            .bitmapText(this.center_width, -200, "pixelFont", "Wordgeon", 230)
            .setOrigin(0.5)
        .setTint(0x88d24c)
        .setDropShadow(2, 3, 0xbf2522, 0.7);
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
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
        const chest  = this.add.image(150, 100, 'elf');
        chest.setScale(2)
        this.add.bitmapText(this.center_width, 550, "pixelFont", "B: shoot coins", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 120, 620, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 620, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "Click to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
