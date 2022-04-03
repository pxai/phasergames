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
        this.cameras.main.setBackgroundColor(0x222222);
        this.showTitle();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.addStartButton();
        this.playMusic();
        this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.sound.add("steam").play();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 1, time: 30})
    }

    showTitle() {
        this.gameLogo = this.add.bitmapText(this.center_width + 20, 100, "pico", "MORIARTY", 200).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);
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
          this.sound.add("steam").play();
    }

    showPlayer () {

    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.4,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pico", "Use WAD", 60).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);

        this.add.sprite(this.center_width - 100, 550, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 20, 550, "pico", "By PELLO", 35).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);

    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 670, "pico", "Click HERE to start", 60).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);
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

    showPlayer() {
        this.player = this.add.sprite(this.center_width, this.center_height - 100, "moriarty").setScale(3).setOrigin(0.5);
        this.anims.create({
            key: "moriartyidle",
            frames: this.anims.generateFrameNumbers("moriarty", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
          });
          this.player.anims.play("moriartyidle", true);
    }
}
