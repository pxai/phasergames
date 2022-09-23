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
        this.add.image(0,0, "background").setOrigin(0);
        this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.playMusic();
        this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playMusic("game")
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0})
    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, -400, "logo").setScale(1.4).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 200
              },
          })
    }

    showPlayer () {
        this.player = this.add.sprite(this.center_width, 350, "indy").setScale(3);
        this.anims.create({
            key: "playeridle",
            frames: this.anims.generateFrameNumbers("indy", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
        this.player.anims.play("playeridle", true)
    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.6,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 425, "pixelFont", "WASD/Arrows: move", 20).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 475, "pixelFont", "SPACE: jump", 20).setOrigin(0.5);

        this.add.sprite(this.center_width - 70, 520, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 520, "pixelFont", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 560, "pixelFont", "Press SPACE to start", 20).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
