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
        this.time.delayedCall(10, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        this.scene.start("transition", { number: 0 })
    }

    showLogo() {
        this.gameLogo2 = this.add.bitmapText(this.center_width, 200, "pusab", "DIGGER", 240).setOrigin(0.5).setTint(0xFF8700);
    }

    showPlayer () {

    }

    playMusic (theme="music") {
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
        this.add.bitmapText(this.center_width, 450, "pusab", "Use Mouse", 80).setOrigin(0.5).setTint(0xFF8700);
        this.add.sprite(this.center_width - 95, 570, "pello").setOrigin(0.5).setScale(0.5);
        this.addPlayer()
        this.add.bitmapText(this.center_width + 60, 570, "pusab", "By PELLO", 40).setOrigin(0.5).setTint(0xFF8700);
        this.startButton  = this.add.bitmapText(this.center_width, 670, "pusab", "Click to start", 60).setOrigin(0.5).setTint(0xFF8700);
        this.tweens.add({
            targets: this.startButton,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
    }

    addPlayer () {
        this.player = this.add.sprite(this.center_width, this.center_height - 80, "player").setScale(3)
        this.anims.create({
            key: "playeridle",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end:6 }),
            frameRate: 10,
            repeat: -1
        });

        this.tweens.add({
            targets: this.player,
            duration: 200,
            y: "+=10",
            repeat: -1,
            yoyo: true
        });

        this.player.anims.play("playeridle", true);
    }
}
