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
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("game", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    showLogo() {
        this.sound.add("cock").play()
        this.gameLogo1 = this.add.bitmapText(this.center_width, 100, "default", "Sons", 100).setTint(0xE67A32).setOrigin(0.5).setDropShadow(1, -5, 0xf0d54a, 0.9);;
        this.gameLogo2 = this.add.bitmapText(this.center_width, 210, "default", "o'Bitches!", 100).setTint(0xE67A32).setOrigin(0.5).setDropShadow(1, -5, 0xf0d54a, 0.9);;



        this.tweens.add({
            targets: this.gameLogo1,
            duration: 500,
            x: {
                from: -200,
                to: this.center_width
              },
              onComplete: () => {
                this.sound.add("shot").play()
              }
          })

          this.tweens.add({
            targets: this.gameLogo2,
            duration: 1100,
            x: {
                from: this.width + 200,
                to: this.center_width
              },
              onComplete: () => {
                this.sound.add("shot").play()
                this.player = this.add.sprite(this.center_width, this.center_height , "player").setOrigin(0.5).setScale(1.6)
                this.anims.create({
                    key: "startidle",
                    frames: this.anims.generateFrameNumbers("willie", { start: 0, end: 1 }),
                    frameRate: 3,
                    repeat: -1
                });
                  this.sound.add("win").play()
                  this.player.anims.play("startidle")
              }
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
        this.add.bitmapText(this.center_width, 390, "default", "WASD/Arrows: move", 30).setTint(0xE67A32).setOrigin(0.5).setDropShadow(1, -2, 0xf0d54a, 0.9)
        this.add.bitmapText(this.center_width, 430, "default", "SPACE: shoot", 30).setTint(0xE67A32).setOrigin(0.5).setDropShadow(1, -2, 0xf0d54a, 0.9)
        this.add.sprite(this.center_width - 40, 500, "pello_ok").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 500, "default", "By PELLO", 15).setTint(0xE67A32).setOrigin(0.5).setDropShadow(1, -2, 0xf0d54a, 0.9)
        this.space = this.add.bitmapText(this.center_width, 570, "default", "Press SPACE to start", 30).setOrigin(0.5).setDropShadow(1, -2, 0xf0d54a, 0.9)
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
