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
        this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        this.theme.stop();
        this.playMusic("music", {volume: 0.5})
        this.scene.start("transition", { number: 0})
    }

    showLogo() {
        this.car1 = this.add.sprite(-200, 450, "player2").setOrigin(1, 0).setRotation(Math.PI/2).setScale(3)
        this.car2 = this.add.sprite(1200, 450, "player1").setOrigin(0, 0).setRotation(-Math.PI/2).setScale(3)
        this.titleText1 = this.add.bitmapText(this.center_width, 64, "pixelFont", "IVY", 220).setOrigin(0.5).setTint(0x4A9130)
        // this.tweenThis(this.titleText1)
        // this.tweenThis(this.titleText2)
        this.tweenThis(this.car1, 1200, 200)
        this.tweenThis(this.car2, 1200, -200)
    }

    tweenThis(element, duration = 1000, offset = 0) {
        this.tweens.add({
            targets: element,
            duration,
            x: {
              from: element.x,
              to: this.center_width + offset
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
          volume: .5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }


    showInstructions() {
        this.add.bitmapText(this.center_width, 540, "pixelFont", "WASD/Arrows: move", 30).setOrigin(0.5).setTint(0xA13647)
        this.add.sprite(this.center_width - 60, 610, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 40, 610, "pixelFont", "By PELLO", 15).setOrigin(0.5).setTint(0xA13647)
        this.space = this.add.bitmapText(this.center_width, 680, "pixelFont", "Press SPACE to start", 30).setOrigin(0.5).setTint(0x4A9130)
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
